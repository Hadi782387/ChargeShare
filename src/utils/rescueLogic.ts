import { ChargerHost, ConnectorType, ReachabilityStatus, Vehicle } from '../types';

export const EARTH_RADIUS_KM = 6371;

/**
 * Standard Haversine distance in km
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * A2: remainingKm = (battery_pct / 100) * battery_kwh * km_per_kwh * factor
 * factor = 0.8 in city, 0.7 on highway
 */
export function calculateRemainingKm(
  batteryPct: number,
  batteryKwh: number,
  kmPerKwh: number,
  isHighway = false
): number {
  const factor = isHighway ? 0.7 : 0.8;
  return (batteryPct / 100) * batteryKwh * kmPerKwh * factor;
}

/**
 * Server & Client Capped Pricing:
 * Max 10 kWh rescue limit
 * Service fee hard-capped between 0 and 4
 * Platform fee 10%
 */
export function calculateRescueCost(
  kwhNeeded: number,
  energyPrice: number,
  serviceFee: number
) {
  const kwhClamped = Math.min(Math.max(kwhNeeded, 1), 10);
  const feeClamped = Math.min(Math.max(serviceFee, 0), 4);

  const energy = Math.round(kwhClamped * energyPrice * 100) / 100;
  const hostFee = Math.round(kwhClamped * feeClamped * 100) / 100;
  const platformFee = Math.round(0.10 * (energy + hostFee) * 100) / 100;
  const total = Math.round((energy + hostFee + platformFee) * 100) / 100;

  return {
    kwh: kwhClamped,
    energy,
    hostFee,
    platformFee,
    total,
  };
}

/**
 * Exact A2 Rescue Score Ranking Algorithm from Phase 1 Spec:
 */
export function rankAndEnrichHosts(
  hosts: ChargerHost[],
  userLocation: { lat: number; lng: number },
  vehicle: Vehicle,
  batteryPct: number,
  selectedConnector: ConnectorType,
  isHighway = false
): ChargerHost[] {
  const remainingKm = calculateRemainingKm(
    batteryPct,
    vehicle.batteryKwh,
    vehicle.kmPerKwh,
    isHighway
  );

  // Compute prices to find min and max for normalization
  const prices = hosts.map((h) => h.energyPrice + Math.min(h.serviceFee, 4));
  const minPrice = Math.min(...prices, 10);
  const maxPrice = Math.max(...prices, 20);

  const enriched = hosts.map((host) => {
    const directDist = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      host.lat,
      host.lng
    );
    const roadKm = Math.round(directDist * 1.3 * 10) / 10;
    const match = host.connector === selectedConnector;

    // Reachability Status
    let reachabilityStatus: ReachabilityStatus = 'reachable';
    if (!match) {
      reachabilityStatus = 'not_compatible';
    } else if (roadKm > remainingKm) {
      reachabilityStatus = 'too_far';
    } else if (roadKm > 0.7 * remainingKm) {
      reachabilityStatus = 'tight';
    } else {
      reachabilityStatus = 'reachable';
    }

    // ETA estimate: 24 km/h city speed, 50 km/h highway
    const speed = isHighway ? 50 : 24;
    const etaMin = Math.max(3, Math.round((roadKm / speed) * 60));

    // A2 Scoring formula:
    // reach = 1 - roadKm / remainingKm
    const reach = roadKm <= remainingKm ? Math.max(0, 1 - roadKm / Math.max(remainingKm, 0.1)) : 0;
    const powerMatch = Math.min(host.powerKw / Math.max(vehicle.acKw, 3.3), 1);
    const rating = (host.ratingAvg || 4.0) / 5;
    const totalRate = host.energyPrice + Math.min(host.serviceFee, 4);
    const priceScore = maxPrice === minPrice ? 1 : 1 - (totalRate - minPrice) / (maxPrice - minPrice);
    const response = host.responseRate || 0.7;

    const score =
      0.35 * reach +
      0.20 * (match ? powerMatch : 0.1) +
      0.20 * rating +
      0.15 * priceScore +
      0.10 * response;

    return {
      ...host,
      distanceKm: roadKm,
      etaMin,
      reachabilityStatus,
      match,
      score: Math.round(score * 100) / 100,
    };
  });

  // Sort order: Reachable first, then Tight, then Too Far, then Not Compatible
  const rankOrder: Record<ReachabilityStatus, number> = {
    reachable: 0,
    tight: 1,
    too_far: 2,
    not_compatible: 3,
  };

  return enriched.sort((a, b) => {
    const orderDiff =
      (rankOrder[a.reachabilityStatus || 'reachable'] ?? 0) -
      (rankOrder[b.reachabilityStatus || 'reachable'] ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return (b.score || 0) - (a.score || 0);
  });
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function formatDistance(km?: number): string {
  if (km === undefined) return '-- km';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
