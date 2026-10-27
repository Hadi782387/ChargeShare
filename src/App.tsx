import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { SplashScreen } from './screens/SplashScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MapScreen } from './screens/MapScreen';
import { RequestScreen } from './screens/RequestScreen';
import { HostDashboardScreen } from './screens/HostDashboardScreen';
import { RequestStatusScreen } from './screens/RequestStatusScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/splash" replace />} />
            <Route path="splash" element={<SplashScreen />} />
            <Route path="auth" element={<AuthScreen />} />
            <Route path="home" element={<HomeScreen />} />
            <Route path="map" element={<MapScreen />} />
            <Route path="request" element={<RequestScreen />} />
            <Route path="host" element={<HostDashboardScreen />} />
            <Route path="status" element={<RequestStatusScreen />} />
            <Route path="chat" element={<ChatScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
