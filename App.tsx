import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './lib/store';
import AppShell from './components/AppShell';
import { AppProvider } from './lib/contexts';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading pages
import DashboardPage from './app/dashboard/page';
import LibraryPage from './app/library/page';
import StudioPage from './app/studio/[packId]/page';
// import ProfilePage from './app/profile/page'; // Profile temporarily disabled

// Auth Pages
import LoginPage from './app/auth/login';
import RegisterPage from './app/auth/register';
import ForgotPasswordPage from './app/auth/forgot-password';

const App = () => {
  useEffect(() => {
    store.seedIfEmpty();
  }, []);

  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Root Redirect: Move outside AppShell for instant redirect */}
          <Route path="/" element={
             <ProtectedRoute>
                <Navigate to="/dashboard" replace />
             </ProtectedRoute>
          } />
          
          {/* Protected Routes wrapped in AppShell */}
          <Route path="/dashboard" element={
             <ProtectedRoute>
                <AppShell>
                   <DashboardPage />
                </AppShell>
             </ProtectedRoute>
          } />
          
          <Route path="/library" element={
             <ProtectedRoute>
                <AppShell>
                   <LibraryPage />
                </AppShell>
             </ProtectedRoute>
          } />
          
          <Route path="/studio/:packId" element={
             <ProtectedRoute>
                <AppShell>
                   <StudioPage />
                </AppShell>
             </ProtectedRoute>
          } />

          {/* Profile Route temporarily disabled
          <Route path="/profile" element={
             <ProtectedRoute>
                <AppShell>
                   <ProfilePage />
                </AppShell>
             </ProtectedRoute>
          } />
          */}

           {/* Catch all - Redirect to dashboard */}
           <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;