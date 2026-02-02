import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import TermsOfService from './pages/TermsOfService';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';

import Layout from './components/Layout';

import CreateQR from './pages/CreateQR';
import GlobalAnalytics from './pages/GlobalAnalytics';
import QRDetails from './pages/QRDetails';
import Settings from './pages/Settings';
import Billing from './pages/Billing';

const PrivateRoute = () => {
  const { token, loading, bootState, planLoadError, BOOT_STATE } = useAuth();

  // Show loading screen during initialization
  if (loading || bootState === BOOT_STATE?.INITIALIZING) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="text-sm text-text-subtle">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Degraded mode warning (optional - shows banner but allows access)
  if (bootState === BOOT_STATE?.DEGRADED && planLoadError) {
    // Still allow access, Layout can show warning banner
  }

  return token ? <Layout /> : <Navigate to="/login" />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<TermsOfService />} />

              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaigns/:id" element={<CampaignDetails />} />
                <Route path="/analytics" element={<GlobalAnalytics />} />
                <Route path="/analytics/:id" element={<Analytics />} />
                <Route path="/qrs/create" element={<CreateQR />} />
                <Route path="/qrs/:id" element={<QRDetails />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/billing" element={<Billing />} />
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
