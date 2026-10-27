export type UserRole = 'driver' | 'host';

export type ConnectorType = 'Type2' | 'CCS2' | 'BharatAC001' | 'Socket15A';

export type ChargerKind =
  | 'home'
  | 'society'
  | 'office'
  | 'shop'
  | 'dhaba'
  | 'hotel'
  | 'pump'
  | 'dealership';

export type ReachabilityStatus = 'reachable' | 'tight' | 'too_far' | 'not_compatible';

export interface Vehicle {
  id: string;
  model: string;
  batteryKwh: number;
  kmPerKwh: number;
  connector: ConnectorType;
  acKw: number;
  plateNumber?: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  role: 'driver';
  vehicle: Vehicle;
  emergencyContact: string; // WhatsApp number
  roadsidePhone: string;
  consentShareLocation: boolean;
  ratingAvg: number;
  ratingCount: number;
}

export interface HostProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  areaLabel: string;
  addressText: string; // Private, revealed only after accept
  role: 'host';
  ratingAvg: number;
  ratingCount: number;
  verified: boolean;
  bisCertified: boolean;
  sitePermission: boolean;
  evMetered: boolean;
  availableNow: boolean;
  chargerModel: string;
  connector: ConnectorType;
  powerKw: number;
  energyPrice: number; // e.g. 10.50
  serviceFee: number; // capped at 4
  earningsToday: number;
  totalRescues: number;
  acceptedCount: number;
  declinedCount: number;
}

export interface ChargerHost {
  id: string;
  hostId: string;
  title: string;
  hostName: string;
  phone: string;
  avatar: string;
  kind: ChargerKind;
  connector: ConnectorType;
  powerKw: number;
  energyPrice: number;
  serviceFee: number; // capped at 4
  lat: number;
  lng: number;
  areaLabel: string;
  addressText: string; // private, revealed after accept
  rules: string;
  photoUrl?: string;
  evMetered: boolean;
  bisCertified: boolean;
  sitePermission: boolean;
  isHighway: boolean;
  status: 'active' | 'off' | 'under_review';
  ratingAvg: number;
  ratingCount: number;
  verified: boolean;
  responseRate: number; // 0.0 to 1.0

  // Computed client-side by rescueScore.ts
  distanceKm?: number;
  etaMin?: number;
  reachabilityStatus?: ReachabilityStatus;
  score?: number;
  match?: boolean;
}

export type RequestStatus =
  | 'requested'
  | 'accepted'
  | 'on_the_way'
  | 'arrived'
  | 'charging'
  | 'completed'
  | 'paid'
  | 'declined'
  | 'expired'
  | 'cancelled';

export interface RescueRequest {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverEmail: string;
  driverAddress: string;
  driverAvatar: string;
  vehicleModel: string;
  connector: ConnectorType;
  batteryPct: number;
  driverLat: number;
  driverLng: number;
  kwhNeeded: number; // Max 10 kWh
  estEnergy: number;
  estHostFee: number;
  estPlatformFee: number;
  estTotal: number;
  chargerId: string;
  hostId: string;
  hostName: string;
  hostPhone: string;
  hostAvatar: string;
  hostAreaLabel: string;
  hostAddressText: string;
  status: RequestStatus;
  checkinCode: string; // 6-character PIN code
  createdAt: string;
  expiresAt: string;
  kwhDelivered: number;
  finalTotal?: number;
  userNote?: string;
  onHighway?: boolean;
}

export interface ChatMessage {
  id: string;
  hostId: string;
  senderId: 'driver' | 'host' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ConversationSummary {
  hostId: string;
  hostName: string;
  hostAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  chargerTitle: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'request' | 'status' | 'emergency' | 'payment';
  actionUrl?: string;
}
