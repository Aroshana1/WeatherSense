// Root component with WeatherSense Auth0 Protection
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LoginButton from './components/LoginButton.jsx';
import LogoPlaceholder from './components/LogoPlaceholder.jsx';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F5F9FD] dark:bg-[#07111E] flex items-center justify-center station-bg-light dark:station-bg-dark">
      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#0D1C30] border border-[#D9E5F2] dark:border-[#1E3A5F] shadow-lg">
        <div
          className="w-10 h-10 border-3 border-[#0EA5E9] dark:border-[#38BDF8] border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
        <p className="text-sm font-semibold text-[#102A43] dark:text-[#FFFFFF]">
          Loading…
        </p>
      </div>
    </div>
  );
}

function LoginScreen() {
  return (
    <div className="min-h-screen bg-[#F5F9FD] dark:bg-[#07111E] flex items-center justify-center p-4 station-bg-light dark:station-bg-dark">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#FFFFFF] dark:bg-[#0D1C30] border border-[#D9E5F2] dark:border-[#1E3A5F] rounded-3xl p-8 sm:p-10 shadow-xl text-center">
          
          {/* Logo & Brand Header */}
          <div className="flex justify-center mb-6">
            <LogoPlaceholder size="lg" />
          </div>

          <p className="text-sm text-[#64748B] dark:text-[#CBD5E1] mb-8 leading-relaxed">
            Real-time weather comfort index for cities worldwide. Sign in to access your dashboard.
          </p>

          {/* Sign In Button */}
          <LoginButton />

          <p className="mt-6 text-xs text-[#64748B] dark:text-[#94A3B8]">
            Secured with Auth0 · MFA Enabled
          </p>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { isLoading, isAuthenticated, user } = useAuth0();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <LoginScreen />;

  return <Dashboard user={user} />;
}

function App() {
  return (
    <Auth0ProviderWithHistory>
      <AppContent />
    </Auth0ProviderWithHistory>
  );
}

export default App;
