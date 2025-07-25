import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/pages/LoginPage';
import Index from '@/pages/Index';
import FunnelPage from '@/pages/FunnelPage';
import NotFound from '@/pages/NotFound';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LeadsProvider } from '@/context/LeadsContext';
import { leadApiService } from '@/services/leadApiService';
import { stagesService } from '@/services/stagesService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Set the base API URL from environment variable
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090';
// For Railway deployment, set VITE_API_BASE_URL to your Railway backend URL in the Railway dashboard

if (apiBaseUrl) {
  leadApiService.setBaseApiUrl(apiBaseUrl);
  stagesService.setBaseApiUrl(apiBaseUrl);
  console.log('[App] API Base URL set to:', apiBaseUrl);
} else {
  console.warn('[App] No API Base URL configured');
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#16161d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0f7969] dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0f7969] dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { isLoggedIn, loading, logout } = useAuth();
  const { toast } = useToast();

  // Debug log to confirm LeadsProvider is only mounted once
  useEffect(() => {
    console.log('[DEBUG] LeadsProvider mounted');
  }, []);

  // Periodic session logout for safety (every 30 minutes)
  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(() => {
      logout();
      toast({
        title: 'Session expired',
        description: 'For your security, please log in again.',
        style: { background: '#2563eb', color: '#fff', border: '2px solid #2563eb' },
      });
    }, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, [isLoggedIn, logout, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#16161d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0f7969] dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0f7969] dark:text-white">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LeadsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/leadstream" replace />} />
            <Route path="/leadstream" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/funnel" element={<ProtectedRoute><FunnelPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </LeadsProvider>
    </ThemeProvider>
  );
}

export default App;
