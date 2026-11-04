import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Grid,
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  FileText,
  Clock,
  MapPin,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Wrench,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const { user, role, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Role navigation definitions
  const adminNav = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Provider KYC', path: '/admin/providers', icon: ShieldCheck },
    { label: 'Categories & Services', path: '/admin/categories', icon: Grid },
    { label: 'All Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Disputes & Complaints', path: '/admin/complaints', icon: AlertTriangle },
    { label: 'Revenue Reports', path: '/admin/reports', icon: FileText },
  ];

  const customerNav = [
    { label: 'My Overview', path: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'Book a Service', path: '/services', icon: Search },
    { label: 'My Bookings', path: '/customer/bookings', icon: CalendarCheck },
    { label: 'Saved Addresses', path: '/customer/addresses', icon: MapPin },
    { label: 'Profile & Security', path: '/customer/profile', icon: Settings },
  ];

  const providerNav = [
    { label: 'Provider Console', path: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'Job Requests', path: '/provider/bookings', icon: CalendarCheck },
    { label: 'Manage Technicians', path: '/provider/technicians', icon: UserCheck },
    { label: 'Earnings & Ledgers', path: '/provider/earnings', icon: CreditCard },
    { label: 'Availability & Areas', path: '/provider/availability', icon: Clock },
  ];

  const techNav = [
    { label: 'Assigned Jobs', path: '/technician/dashboard', icon: Briefcase },
    { label: 'Job History', path: '/technician/history', icon: CheckCircle2 },
    { label: 'My Profile', path: '/technician/profile', icon: Settings },
  ];

  const getNavItems = () => {
    switch (role) {
      case 'super_admin': return adminNav;
      case 'service_provider': return providerNav;
      case 'technician': return techNav;
      case 'customer':
      default: return customerNav;
    }
  };

  const navItems = getNavItems();

  const roleMeta = {
    super_admin: { label: 'Super Admin', bg: 'bg-purple-100 text-purple-800' },
    service_provider: { label: 'Service Provider', bg: 'bg-emerald-100 text-emerald-800' },
    technician: { label: 'Field Technician', bg: 'bg-amber-100 text-amber-800' },
    customer: { label: 'Customer', bg: 'bg-blue-100 text-blue-800' },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-slate-900 text-slate-300 z-50 flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">HomeServe</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="px-4 py-4 border-b border-slate-800/60">
          <div className="p-3 bg-slate-800/80 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-sm border border-brand-500/30">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${roleMeta[role]?.bg || 'bg-slate-700 text-slate-300'}`}>
                {roleMeta[role]?.label || role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 md:hidden hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
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

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
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

            {/* Quick Public Link */}
            <Link
              to="/"
              className="text-xs font-semibold text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hidden sm:block"
            >
              Back to Storefront
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;

