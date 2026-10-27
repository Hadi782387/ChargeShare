import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  SlidersHorizontal,
  Navigation,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Star,
  Shield,
  Layers,
  X,
  Phone,
  ChevronUp,
  ChevronDown,
  Info,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { ChargerCard } from '../components/common/ChargerCard';
import { Modal } from '../components/common/Modal';
import { ChargerHost, ConnectorType } from '../types';
import {
  calculateRemainingKm,
  rankAndEnrichHosts,
  formatCurrency,
  formatDistance,
  calculateRescueCost,
} from '../utils/rescueLogic';
import * as L from 'leaflet';

export const MapScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    battery,
    selectedVehicle,
    selectedConnector,
    setSelectedConnector,
    chargers,
    userLocation,
    isHighwayMode,
    setSelectedChargerForRequest,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'match' | 'fastest' | 'cheapest' | 'top_rated' | 'highway'>('match');
  const [selectedCharger, setSelectedCharger] = useState<ChargerHost | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showHowWeRankModal, setShowHowWeRankModal] = useState<boolean>(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const remainingKm = calculateRemainingKm(
    battery,
    selectedVehicle.batteryKwh,
    selectedVehicle.kmPerKwh,
    isHighwayMode
  );

  // Rank hosts using Phase 1 Rescue Score
  const rankedHosts = useMemo(() => {
    return rankAndEnrichHosts(
      chargers,
      userLocation,
      selectedVehicle,
      battery,
      selectedConnector,
      isHighwayMode
    );
  }, [chargers, userLocation, selectedVehicle, battery, selectedConnector, isHighwayMode]);

  // Apply filters
  const filteredHosts = useMemo(() => {
    let list = [...rankedHosts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.hostName.toLowerCase().includes(q) ||
          h.areaLabel.toLowerCase().includes(q) ||
          h.connector.toLowerCase().includes(q)
      );
    }

    if (filterMode === 'match') {
      list = list.filter((h) => h.match);
    } else if (filterMode === 'fastest') {
      list.sort((a, b) => (a.etaMin || 0) - (b.etaMin || 0));
    } else if (filterMode === 'cheapest') {
      list.sort((a, b) => (a.energyPrice + a.serviceFee) - (b.energyPrice + b.serviceFee));
    } else if (filterMode === 'top_rated') {
      list.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
    } else if (filterMode === 'highway') {
      list = list.filter((h) => h.isHighway);
    }

    return list;
  }, [rankedHosts, searchQuery, filterMode]);

  const reachableCount = rankedHosts.filter((h) => h.reachabilityStatus === 'reachable').length;

  // Leaflet map setup
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Reachable Range Circle
      L.circle([userLocation.lat, userLocation.lng], {
        radius: Math.min(remainingKm * 1000, 50000),
        color: '#22E58B',
        fillColor: '#22E58B',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);

      // User location pulse pin
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(34, 229, 139, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 16px; height: 16px; border-radius: 50%; background: #22E58B; border: 3px solid #0B1220; box-shadow: 0 0 10px rgba(34, 229, 139, 0.6);"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip('Your EV SOS Location', { permanent: false, direction: 'top' });

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }
  }, [userLocation, remainingKm]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    markersGroupRef.current.clearLayers();

    filteredHosts.forEach((host) => {
      let pinColor = '#22E58B'; // Reachable
      if (host.reachabilityStatus === 'tight') pinColor = '#FFB020';
      if (host.reachabilityStatus === 'too_far' || host.reachabilityStatus === 'not_compatible') pinColor = '#8FA3BF';

      const isSelected = selectedCharger?.id === host.id;
      const hostIcon = L.divIcon({
        className: 'custom-host-marker',
        html: `
          <div style="transform: scale(${isSelected ? 1.25 : 1}); transition: all 0.2s; cursor: pointer;">
            <div style="
              width: 32px; height: 32px; border-radius: 12px;
              background: #121C2F; border: 2.5px solid ${pinColor};
              display: flex; align-items: center; justify-content: center;
              color: ${pinColor}; font-weight: bold; font-size: 13px;
              box-shadow: 0 4px 14px rgba(0,0,0,0.5);
            ">
              ⚡
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([host.lat, host.lng], { icon: hostIcon }).addTo(
        markersGroupRef.current!
      );

      marker.on('click', () => {
        setSelectedCharger(host);
        setShowDetailModal(true);
      });
    });
  }, [filteredHosts, selectedCharger]);

  const handleRecenter = () => {
    mapInstanceRef.current?.setView([userLocation.lat, userLocation.lng], 12, { animate: true });
  };

  const handleRequestClick = (host: ChargerHost) => {
    setSelectedChargerForRequest(host);
    navigate('/request');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row relative h-screen max-h-screen overflow-hidden bg-bg text-ink">
      {/* Top Floating Controls on Mobile / Top Header */}
      <div className="absolute top-3 inset-x-3 z-30 space-y-2 pointer-events-auto lg:max-w-md">
        {/* Search Bar */}
        <div className="bg-surface/95 backdrop-blur-md rounded-xl border border-surface-border p-2 flex items-center gap-2 shadow-card">
          <div className="w-7 h-7 rounded-lg bg-surface-card border border-surface-border text-primary flex items-center justify-center shrink-0">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search host, area or port (e.g. Powai, Type2)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs font-semibold text-ink placeholder:text-ink-subtle focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-ink-muted">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setShowHowWeRankModal(true)}
            className="px-2 py-1 bg-primary-subtle text-primary border border-primary/30 rounded-lg text-[10px] font-bold"
            title="Rescue Score Formula"
          >
            How We Rank
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'match', label: `Compatible (${selectedConnector})` },
            { id: 'all', label: 'All Hosts' },
            { id: 'fastest', label: 'Fastest ETA' },
            { id: 'cheapest', label: 'Lowest Cost' },
            { id: 'top_rated', label: 'Top Rated' },
            { id: 'highway', label: 'Highway Hosts' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id as any)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition border shadow-sm ${
                filterMode === f.id
                  ? 'bg-primary text-bg border-primary font-black'
                  : 'bg-surface text-ink-muted border-surface-border hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recenter & Map Controls */}
      <div className="absolute top-28 right-3 z-30 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleRecenter}
          className="w-9 h-9 rounded-xl bg-surface border border-surface-border flex items-center justify-center text-primary shadow-card hover:bg-surface-card transition"
          title="Recenter"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Leaflet Map Pane */}
      <div className="flex-1 w-full h-[55vh] lg:h-full relative z-10">
        <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />
      </div>

      {/* Side / Bottom Drawer of Ranked Hosts */}
      <div
        className={`bg-surface border-t lg:border-t-0 lg:border-l border-surface-border z-30 transition-all duration-300 flex flex-col shadow-card lg:w-[420px] ${
          isPanelExpanded ? 'h-[75vh]' : 'h-[310px] lg:h-full'
        }`}
      >
        {/* Header Summary */}
        <div
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
          className="px-4 py-2.5 cursor-pointer select-none bg-surface-card border-b border-surface-border flex items-center justify-between"
        >
          <div>
            <h3 className="font-extrabold text-ink text-xs flex items-center gap-1.5">
              <span>Nearby Emergency Chargers</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </h3>
            <p className="text-[10px] text-ink-muted font-medium">
              {reachableCount} reachable with {battery}% battery ({remainingKm.toFixed(0)} km safe range)
            </p>
          </div>
          <button className="text-ink-muted lg:hidden">
            {isPanelExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Host Cards List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 pb-20">
          {filteredHosts.length === 0 ? (
            <div className="py-8 text-center text-xs text-ink-muted">
              No chargers match current filter criteria.
            </div>
          ) : (
            filteredHosts.map((h) => (
              <ChargerCard
                key={h.id}
                charger={h}
                selected={selectedCharger?.id === h.id}
                onSelect={(host) => {
                  setSelectedCharger(host);
                  setShowDetailModal(true);
                }}
                onRequest={handleRequestClick}
              />
            ))
          )}
        </div>
      </div>

      {/* B4 Host Detail Modal */}
      {selectedCharger && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={selectedCharger.title}
        >
          <div className="space-y-3.5 text-xs">
            {/* Host Header */}
            <div className="flex items-center gap-3 p-3 bg-surface-card rounded-xl border border-surface-border">
              <img
                src={selectedCharger.avatar}
                alt={selectedCharger.hostName}
                className="w-12 h-12 rounded-xl object-cover border border-surface-border"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-ink text-sm">{selectedCharger.hostName}</h4>
                  {selectedCharger.verified && (
                    <span className="w-3.5 h-3.5 bg-primary text-bg rounded-full flex items-center justify-center font-bold text-[8px]">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-ink-muted">{selectedCharger.areaLabel}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-warning font-bold flex items-center gap-0.5">
                    ★ {selectedCharger.ratingAvg} ({selectedCharger.ratingCount} reviews)
                  </span>
                  <span>·</span>
                  <span className="text-primary font-bold">
                    {Math.round(selectedCharger.responseRate * 100)}% response
                  </span>
                </div>
              </div>
            </div>

            {/* Price Breakdown per Phase 1 rules */}
            <div className="p-3 bg-surface-card rounded-xl border border-surface-border space-y-1.5">
              <span className="font-bold text-ink block text-[11px] uppercase tracking-wider">
                Cost Breakdown (Transparent Capped Rate)
              </span>
              <div className="flex justify-between text-ink-muted">
                <span>Energy Base Tariff:</span>
                <span className="font-bold text-ink">{formatCurrency(selectedCharger.energyPrice)}/kWh</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Host Service Fee (Capped $\le$ ₹4):</span>
                <span className="font-bold text-primary">+{formatCurrency(selectedCharger.serviceFee)}/kWh</span>
              </div>
              <div className="flex justify-between text-ink pt-1 border-t border-surface-border font-bold">
                <span>Total Rate per kWh:</span>
                <span className="text-primary">{formatCurrency(selectedCharger.energyPrice + selectedCharger.serviceFee)}/kWh</span>
              </div>
              <p className="text-[10px] text-ink-subtle">
                Emergency rescue top-up capped at 10 kWh maximum.
              </p>
            </div>

            {/* House Rules */}
            <div>
              <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">
                House & Visitor Rules
              </span>
              <p className="p-2.5 bg-surface-card rounded-xl border border-surface-border text-ink-muted leading-relaxed">
                {selectedCharger.rules}
              </p>
            </div>

            {/* Private Address Warning Note */}
            <div className="p-2.5 rounded-xl bg-surface-card border border-surface-border text-[11px] text-ink-muted flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <span>
                Exact building & flat address revealed immediately upon Host acceptance to protect community privacy.
              </span>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                setShowDetailModal(false);
                handleRequestClick(selectedCharger);
              }}
              disabled={selectedCharger.reachabilityStatus === 'too_far' || selectedCharger.reachabilityStatus === 'not_compatible'}
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${
                selectedCharger.reachabilityStatus === 'reachable' || selectedCharger.reachabilityStatus === 'tight'
                  ? 'bg-primary text-bg hover:bg-primary-hover shadow-glow-primary'
                  : 'bg-surface-card text-ink-subtle border border-surface-border cursor-not-allowed'
              }`}
            >
              {selectedCharger.reachabilityStatus === 'reachable' || selectedCharger.reachabilityStatus === 'tight'
                ? 'Request Emergency Rescue'
                : !selectedCharger.match
                ? 'Incompatible Connector Port'
                : 'Beyond Battery Reach'}
            </button>
          </div>
        </Modal>
      )}

      {/* "How We Rank" A2 Algorithm Modal */}
      <Modal
        isOpen={showHowWeRankModal}
        onClose={() => setShowHowWeRankModal(false)}
        title="Phase 1: A2 Rescue Score Formula"
      >
        <div className="space-y-3 text-xs text-ink-muted leading-relaxed">
          <p>
            ChargeShare ranks charging hosts strictly by your vehicle's survival math, avoiding towing emergencies:
          </p>

          <div className="p-3 bg-surface-card rounded-xl border border-surface-border font-mono text-[11px] text-primary space-y-1">
            <p>remainingKm = (battery% / 100) * batteryKwh * kmPerKwh * factor</p>
            <p>factor = 0.8 (city) / 0.7 (highway)</p>
            <p>roadKm = haversineKm * 1.3</p>
          </div>

          <div className="space-y-1">
            <strong className="text-ink block">Status Categories:</strong>
            <p>• <span className="text-primary font-bold">Reachable:</span> roadKm $\le$ 0.7 × remainingKm</p>
            <p>• <span className="text-warning font-bold">Tight Range:</span> 0.7 × remainingKm &lt; roadKm $\le$ remainingKm</p>
            <p>• <span className="text-ink-subtle font-bold">Too Far:</span> roadKm &gt; remainingKm</p>
            <p>• <span className="text-ink-subtle font-bold">Not Compatible:</span> Connector mismatch (greyed, never hidden)</p>
          </div>

          <div className="p-3 bg-surface-card rounded-xl border border-surface-border text-[11px]">
            <strong className="text-ink block mb-0.5">Weighted Score:</strong>
            <p>0.35 × Reach + 0.20 × PowerMatch + 0.20 × Rating + 0.15 × Price + 0.10 × Response</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
