import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import AboutPage from './pages/public/AboutPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Super Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminProvidersPage from './pages/admin/AdminProvidersPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerBookingsPage from './pages/customer/CustomerBookingsPage';
import CustomerAddressesPage from './pages/customer/CustomerAddressesPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';

// Service Provider Pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderBookingsPage from './pages/provider/ProviderBookingsPage';
import ProviderTechniciansPage from './pages/provider/ProviderTechniciansPage';
import ProviderEarningsPage from './pages/provider/ProviderEarningsPage';
import ProviderAvailabilityPage from './pages/provider/ProviderAvailabilityPage';

// Technician Pages
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianJobDetailPage from './pages/technician/TechnicianJobDetailPage';
import TechnicianHistoryPage from './pages/technician/TechnicianHistoryPage';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs font-bold text-slate-500">
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public Storefront */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Super Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AdminCategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/providers"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AdminProvidersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AdminBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AdminComplaintsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AdminReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Customer Routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/bookings"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/addresses"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerAddressesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/profile"
              element={
                <ProtectedRoute allowedRoles={['customer', 'technician']}>
                  <CustomerProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Service Provider Routes */}
            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/bookings"
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  <ProviderBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/technicians"
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  <ProviderTechniciansPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/earnings"
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  <ProviderEarningsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/availability"
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  <ProviderAvailabilityPage />
                </ProtectedRoute>
              }
            />

            {/* Technician Routes */}
            <Route
              path="/technician/dashboard"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <TechnicianDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/technician/job/:id"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <TechnicianJobDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/technician/history"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <TechnicianHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/technician/profile"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <CustomerProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
