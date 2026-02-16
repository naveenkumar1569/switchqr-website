import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

// Eager load auth pages (needed immediately)
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy load all other pages for better initial load performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Campaigns = React.lazy(() => import('./pages/Campaigns'));
const CampaignDetails = React.lazy(() => import('./pages/CampaignDetails'));
const Layout = React.lazy(() => import('./components/Layout'));
const CreateQR = React.lazy(() => import('./pages/CreateQR'));
const GlobalAnalytics = React.lazy(() => import('./pages/GlobalAnalytics'));
const QRDetails = React.lazy(() => import('./pages/QRDetails'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Billing = React.lazy(() => import('./pages/Billing'));
const ScanLimitReached = React.lazy(() => import('./pages/ScanLimitReached'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      <p className="text-sm text-text-subtle">Loading...</p>
    </div>
  </div>
);

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

  return token ? (
    <Suspense fallback={<PageLoader />}>
      <Layout />
    </Suspense>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/scan-limit-reached" element={<ScanLimitReached />} />

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
            </Suspense>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

