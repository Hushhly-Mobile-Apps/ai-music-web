
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

// Pages
import EnhancedHomePage from '@/pages/EnhancedHomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AuthSuccessPage from '@/pages/AuthSuccessPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import StudioPage from '@/pages/StudioPage';
import TextToRemixPage from '@/pages/TextToRemixPage';
import DashboardPage from '@/pages/DashboardPage';
import EnhancedStudioPage from '@/pages/EnhancedStudioPage';
import NotFound from '@/pages/NotFound';

// Components
import SubscriptionManager from '@/components/SubscriptionManager';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<EnhancedHomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onauthsuccess" element={<AuthSuccessPage />} />
              <Route path="/resetpassword" element={<ResetPasswordPage />} />
              
              {/* Main App Routes */}
              <Route path="/studio" element={<EnhancedStudioPage />} />
              <Route path="/studio-basic" element={<StudioPage />} />
              <Route path="/text-to-remix" element={<TextToRemixPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/subscription" element={<SubscriptionManager />} />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
