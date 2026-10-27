import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ChargerHost,
  DriverProfile,
  HostProfile,
  RescueRequest,
  ChatMessage,
  NotificationItem,
  RequestStatus,
  UserRole,
  Vehicle,
  ConnectorType,
} from '../types';
import {
  DEFAULT_USER_LOCATION,
  DEMO_DRIVER_CREDENTIALS,
  DEMO_HOST_CREDENTIALS,
  MOCK_CHARGERS,
  MOCK_CHAT_MESSAGES,
  MOCK_NOTIFICATIONS,
  MOCK_REQUESTS,
  MOCK_VEHICLES,
} from '../data/mockData';
import { calculateRescueCost } from '../utils/rescueLogic';

interface AppContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole) => void;
  driverProfile: DriverProfile;
  setDriverProfile: (profile: DriverProfile) => void;
  hostProfile: HostProfile;
  setHostProfile: (profile: HostProfile) => void;
  loginUser: (identifier: string, pass: string, role?: UserRole) => boolean;
  registerUser: (data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    role: UserRole;
  }) => void;
  logout: () => void;

  // Emergency & Vehicle state
  battery: number;
  setBattery: (pct: number) => void;
  selectedVehicle: Vehicle;
  setSelectedVehicle: (vehicle: Vehicle) => void;
  selectedConnector: ConnectorType;
  setSelectedConnector: (connector: ConnectorType) => void;
  userLocation: { lat: number; lng: number; address: string };
  setUserLocation: (loc: { lat: number; lng: number; address: string }) => void;
  isHighwayMode: boolean;
  setIsHighwayMode: (on: boolean) => void;

  // Chargers
  chargers: ChargerHost[];
  selectedChargerForRequest: ChargerHost | null;
  setSelectedChargerForRequest: (charger: ChargerHost | null) => void;
  toggleHostAvailability: () => void;

  // Requests & Status Machine
  requests: RescueRequest[];
  activeRequest: RescueRequest | null;
  createRequest: (data: {
    charger: ChargerHost;
    batteryPct: number;
    connector: ConnectorType;
    kwhNeeded?: number;
    userNote?: string;
  }) => RescueRequest;
  respondRequest: (requestId: string, accept: boolean, reason?: string) => void;
  transitionRequestStatus: (requestId: string, newStatus: RequestStatus) => void;
  advanceActiveStatus: () => void;
  completeSession: (requestId: string, kwhDelivered?: number) => void;
  payRequest: (requestId: string) => void;

  // Chat & Messaging System
  messages: ChatMessage[];
  activeChatHost: ChargerHost | null;
  setActiveChatHost: (host: ChargerHost | null) => void;
  getMessagesForHost: (hostId: string) => ChatMessage[];
  sendChatMessageToHost: (hostId: string, text: string, senderId?: 'driver' | 'host') => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;

  // Reviewer / Demo Controls
  resetDemoData: () => void;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication: default to false for a clean initial entry flow unless explicitly signed in
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cs_auth') === 'true';
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole | null>(() => {
    return (localStorage.getItem('cs_role') as UserRole) || null;
  });

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem('cs_role', role);
  };

  const [driverProfile, setDriverProfileState] = useState<DriverProfile>(() => {
    const saved = localStorage.getItem('cs_driver_profile');
    return saved ? JSON.parse(saved) : DEMO_DRIVER_CREDENTIALS;
  });

  const setDriverProfile = (prof: DriverProfile) => {
    setDriverProfileState(prof);
    localStorage.setItem('cs_driver_profile', JSON.stringify(prof));
  };

  const [hostProfile, setHostProfileState] = useState<HostProfile>(() => {
    const saved = localStorage.getItem('cs_host_profile');
    return saved ? JSON.parse(saved) : DEMO_HOST_CREDENTIALS;
  });

  const setHostProfile = (prof: HostProfile) => {
    setHostProfileState(prof);
    localStorage.setItem('cs_host_profile', JSON.stringify(prof));
  };

  // Battery & Range state
  const [battery, setBatteryState] = useState<number>(() => {
    const saved = localStorage.getItem('cs_battery');
    return saved ? parseInt(saved, 10) : 8;
  });

  const setBattery = (pct: number) => {
    const val = Math.max(1, Math.min(100, Math.round(pct)));
    setBatteryState(val);
    localStorage.setItem('cs_battery', val.toString());
  };

  const [selectedVehicle, setSelectedVehicleState] = useState<Vehicle>(() => {
    return driverProfile.vehicle || MOCK_VEHICLES[0];
  });

  const setSelectedVehicle = (veh: Vehicle) => {
    setSelectedVehicleState(veh);
    setSelectedConnector(veh.connector);
    setDriverProfile({ ...driverProfile, vehicle: veh });
  };

  const [selectedConnector, setSelectedConnector] = useState<ConnectorType>(selectedVehicle.connector || 'Type2');
  const [userLocation, setUserLocation] = useState(DEFAULT_USER_LOCATION);
  const [isHighwayMode, setIsHighwayMode] = useState<boolean>(false);
  const [chargers, setChargers] = useState<ChargerHost[]>(MOCK_CHARGERS);
  const [selectedChargerForRequest, setSelectedChargerForRequest] = useState<ChargerHost | null>(null);

  // Requests state
  const [requests, setRequests] = useState<RescueRequest[]>(() => {
    const saved = localStorage.getItem('cs_requests');
    return saved ? JSON.parse(saved) : MOCK_REQUESTS;
  });

  const activeRequest =
    requests.find((r) => r.driverId === driverProfile.id && !['completed', 'paid', 'declined', 'expired', 'cancelled'].includes(r.status)) ||
    requests[0] ||
    null;

  // Chat messages & currently active conversation host
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('cs_messages');
    return saved ? JSON.parse(saved) : MOCK_CHAT_MESSAGES;
  });
  const [activeChatHost, setActiveChatHost] = useState<ChargerHost | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Responsive device frame simulator
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('cs_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('cs_messages', JSON.stringify(messages));
  }, [messages]);

  // Mock Authentication Login
  const loginUser = (identifier: string, pass: string, role?: UserRole): boolean => {
    // If logging in as host
    if (role === 'host' || identifier.includes('host')) {
      setCurrentRole('host');
      setHostProfile({ ...hostProfile, email: identifier });
    } else {
      setCurrentRole('driver');
      setDriverProfile({ ...driverProfile, email: identifier });
    }
    setIsAuthenticated(true);
    localStorage.setItem('cs_auth', 'true');
    return true;
  };

  // Mock Registration
  const registerUser = (data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    role: UserRole;
  }) => {
    if (data.role === 'host') {
      const newHost: HostProfile = {
        ...hostProfile,
        name: data.name,
        email: data.email,
        phone: data.phone,
        addressText: data.address || hostProfile.addressText,
      };
      setHostProfile(newHost);
      setCurrentRole('host');
    } else {
      const newDriver: DriverProfile = {
        ...driverProfile,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address || driverProfile.address,
      };
      setDriverProfile(newDriver);
      setCurrentRole('driver');
    }
    setIsAuthenticated(true);
    localStorage.setItem('cs_auth', 'true');
  };

  // Mock Logout
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cs_auth');
    localStorage.removeItem('cs_role');
    setCurrentRoleState(null);
  };

  // Toggle Host Availability
  const toggleHostAvailability = () => {
    setHostProfileState((prev) => {
      const updated = { ...prev, availableNow: !prev.availableNow };
      localStorage.setItem('cs_host_profile', JSON.stringify(updated));
      return updated;
    });

    setChargers((prev) =>
      prev.map((c) => (c.hostId === hostProfile.id ? { ...c, status: !hostProfile.availableNow ? 'active' : 'off' } : c))
    );
  };

  // Create Request with capped 10 kWh formula
  const createRequest = ({
    charger,
    batteryPct,
    connector,
    kwhNeeded = 8.5,
    userNote,
  }: {
    charger: ChargerHost;
    batteryPct: number;
    connector: ConnectorType;
    kwhNeeded?: number;
    userNote?: string;
  }): RescueRequest => {
    const cost = calculateRescueCost(kwhNeeded, charger.energyPrice, charger.serviceFee);

    const newReq: RescueRequest = {
      id: `req-${Date.now()}`,
      driverId: driverProfile.id,
      driverName: driverProfile.name,
      driverPhone: driverProfile.phone,
      driverEmail: driverProfile.email,
      driverAddress: driverProfile.address,
      driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      vehicleModel: selectedVehicle.model,
      connector,
      batteryPct,
      driverLat: userLocation.lat,
      driverLng: userLocation.lng,
      kwhNeeded: cost.kwh,
      estEnergy: cost.energy,
      estHostFee: cost.hostFee,
      estPlatformFee: cost.platformFee,
      estTotal: cost.total,
      chargerId: charger.id,
      hostId: charger.hostId,
      hostName: charger.hostName,
      hostPhone: charger.phone,
      hostAvatar: charger.avatar,
      hostAreaLabel: charger.areaLabel,
      hostAddressText: charger.addressText,
      status: 'requested',
      checkinCode: `CS-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresAt: new Date(Date.now() + 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      kwhDelivered: 0,
      userNote: userNote || 'Emergency rescue top-up needed.',
      onHighway: isHighwayMode,
    };

    setRequests((prev) => [newReq, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Rescue Request Dispatched',
        message: `Your SOS request was broadcasted to ${charger.hostName}.`,
        time: 'Just now',
        read: false,
        type: 'request',
        actionUrl: '/status',
      },
      ...prev,
    ]);

    return newReq;
  };

  // Host response
  const respondRequest = (requestId: string, accept: boolean, reason?: string) => {
    const targetStatus: RequestStatus = accept ? 'accepted' : 'declined';
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: targetStatus } : r))
    );

    if (accept) {
      setHostProfileState((prev) => ({
        ...prev,
        acceptedCount: prev.acceptedCount + 1,
      }));
    } else {
      setHostProfileState((prev) => ({
        ...prev,
        declinedCount: prev.declinedCount + 1,
      }));
    }
  };

  // Status transition following exact status machine
  const transitionRequestStatus = (requestId: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const updated = { ...r, status: newStatus };
          if (newStatus === 'charging') {
            updated.kwhDelivered = 4.2;
          } else if (newStatus === 'completed') {
            updated.kwhDelivered = r.kwhNeeded;
            updated.finalTotal = r.estTotal;
          }
          return updated;
        }
        return r;
      })
    );
  };

  // Advance active request step for reviewers
  const advanceActiveStatus = () => {
    if (!activeRequest) return;
    const flow: RequestStatus[] = [
      'requested',
      'accepted',
      'on_the_way',
      'arrived',
      'charging',
      'completed',
      'paid',
    ];
    const currentIndex = flow.indexOf(activeRequest.status);
    const nextStatus = currentIndex < flow.length - 1 ? flow[currentIndex + 1] : 'requested';
    transitionRequestStatus(activeRequest.id, nextStatus);

    if (nextStatus === 'completed') {
      setBattery(38); // boost battery after rescue session
    }
  };

  const completeSession = (requestId: string, kwhDelivered = 9.2) => {
    transitionRequestStatus(requestId, 'completed');
  };

  const payRequest = (requestId: string) => {
    transitionRequestStatus(requestId, 'paid');
    setBattery(45);
  };

  // Chat message management per host
  const getMessagesForHost = (hostId: string): ChatMessage[] => {
    return messages.filter((m) => m.hostId === hostId);
  };

  const sendChatMessageToHost = (
    hostId: string,
    text: string,
    senderId: 'driver' | 'host' = 'driver'
  ) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      hostId,
      senderId,
      senderName: senderId === 'driver' ? driverProfile.name : hostProfile.name,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulated host reply after 1.2s if driver sent the message
    if (senderId === 'driver') {
      setTimeout(() => {
        const matchingHost = chargers.find((c) => c.hostId === hostId || c.id === hostId);
        const hostName = matchingHost ? matchingHost.hostName : hostProfile.name;
        const replies = [
          `Hi ${driverProfile.name}! My bay is available and the cable is ready. How far are you?`,
          `Gate security has been informed. Just mention ChargeShare at the gate!`,
          `Understood! Take your time, driving safely with low battery is top priority.`,
          `I am at the charger right now. Feel free to pull into the driveway.`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const autoMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          hostId,
          senderId: 'host',
          senderName: hostName,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, autoMsg]);
      }, 1200);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetDemoData = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setCurrentRoleState(null);
    setBatteryState(8);
    setDriverProfileState(DEMO_DRIVER_CREDENTIALS);
    setHostProfileState(DEMO_HOST_CREDENTIALS);
    setSelectedVehicleState(MOCK_VEHICLES[0]);
    setSelectedConnector('Type2');
    setRequests(MOCK_REQUESTS);
    setMessages(MOCK_CHAT_MESSAGES);
    setNotifications(MOCK_NOTIFICATIONS);
    setIsHighwayMode(false);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentRole,
        setCurrentRole,
        driverProfile,
        setDriverProfile,
        hostProfile,
        setHostProfile,
        loginUser,
        registerUser,
        logout,
        battery,
        setBattery,
        selectedVehicle,
        setSelectedVehicle,
        selectedConnector,
        setSelectedConnector,
        userLocation,
        setUserLocation,
        isHighwayMode,
        setIsHighwayMode,
        chargers,
        selectedChargerForRequest,
        setSelectedChargerForRequest,
        toggleHostAvailability,
        requests,
        activeRequest,
        createRequest,
        respondRequest,
        transitionRequestStatus,
        advanceActiveStatus,
        completeSession,
        payRequest,
        messages,
        activeChatHost,
        setActiveChatHost,
        getMessagesForHost,
        sendChatMessageToHost,
        notifications,
        markNotificationAsRead,
        resetDemoData,
        isPhoneFrame,
        setIsPhoneFrame,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
