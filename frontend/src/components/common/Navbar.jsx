import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  Menu, 
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Navbar = () => {
  const { user, isAuthenticated, role, logout, switchDemoRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    switch (role) {
      case 'super_admin': return '/admin/dashboard';
      case 'service_provider': return '/provider/dashboard';
      case 'technician': return '/technician/dashboard';
      case 'customer':
      default: return '/customer/dashboard';
    }
  };

  const roleLabels = {
    super_admin: 'Super Admin',
    service_provider: 'Service Provider',
    technician: 'Technician',
    customer: 'Customer',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                HomeServe <span className="text-brand-600 font-extrabold text-xs px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200">SaaS</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">Technologies</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
              Services
            </Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
              How It Works
            </Link>
            <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
              About Us
            </Link>
            <Link to="/register?role=provider" className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Become a Provider
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Quick Demo Role Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setShowDemoModal(!showDemoModal)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors"
                title="Switch role for evaluation"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showDemoModal && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Select Demo Role
                  </p>
                  <button
                    onClick={() => { switchDemoRole('super_admin'); setShowDemoModal(false); navigate('/admin/dashboard'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center justify-between"
                  >
                    <span>Super Admin</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Full Access</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('customer'); setShowDemoModal(false); navigate('/customer/dashboard'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center justify-between"
                  >
                    <span>Customer</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">Booking</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('service_provider'); setShowDemoModal(false); navigate('/provider/dashboard'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center justify-between"
                  >
                    <span>Service Provider</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Operations</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('technician'); setShowDemoModal(false); navigate('/technician/dashboard'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center justify-between"
                  >
                    <span>Technician</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Field App</span>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifMenu(!showNotifMenu)}
                    className="relative p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[11px] font-semibold text-brand-600 hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                                !n.is_read ? 'bg-blue-50/40' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-800">{n.title}</span>
                                {!n.is_read && <span className="w-1.5 h-1.5 bg-brand-600 rounded-full" />}
                              </div>
                              <p className="text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Shortcut */}
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all shadow-brand-500/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{roleLabels[role] || 'Dashboard'}</span>
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                      {user?.full_name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800 truncate">{user?.full_name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => { setShowUserMenu(false); logout(); }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all shadow-brand-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Services
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            How It Works
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            About Us
          </Link>
          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-xl font-bold text-xs"
              >
                Go to {roleLabels[role]}
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="w-full text-center py-2 text-xs font-bold text-rose-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

