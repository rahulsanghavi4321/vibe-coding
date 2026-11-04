import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  FileText
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_bookings: 5,
    upcoming_appointments: 1,
    pending_bookings: 1,
    completed_bookings: 3,
    total_spent: 2450.46,
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  useEffect(() => {
    fetchCustomerOverview();
  }, []);

  const fetchCustomerOverview = async () => {
    try {
      const res = await api.get('/bookings/customer/my-bookings');
      if (res.data) {
        setUpcomingBookings(res.data.slice(0, 3));
      }
    } catch (err) {
      // Default sample for demo
      setUpcomingBookings([
        {
          id: 1,
          booking_ref: 'HS-BK-9801',
          service_title: 'Ceiling Fan Installation & Repair',
          provider_name: 'Apex Home & Electrical Solutions',
          booking_date: '2026-11-04',
          time_slot: '10:00 AM - 11:00 AM',
          total_amount: 352.82,
          status: 'Confirmed',
          technician_name: 'Ramesh Kumar',
        },
        {
          id: 2,
          booking_ref: 'HS-BK-9750',
          service_title: 'AC Jet Deep Servicing',
          provider_name: 'CoolAir Maintenance Services',
          booking_date: '2026-10-28',
          time_slot: '02:00 PM - 03:00 PM',
          total_amount: 824.82,
          status: 'Completed',
          technician_name: 'Sunil Verma',
        }
      ]);
    }
  };

  return (
    <DashboardLayout title="Customer Dashboard">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs font-bold text-brand-200 uppercase tracking-wider">
            Verified Homeowner Account
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Homeowner'}!
          </h2>
          <p className="text-brand-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Need an electrician, plumber, cleaner, or AC maintenance technician today? Our background-checked trade partners are ready for instant dispatch.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/services"
              className="bg-white hover:bg-slate-50 text-brand-700 text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Service</span>
            </Link>
            <Link
              to="/customer/bookings"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              Manage My Bookings
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.total_bookings}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Lifetime orders placed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{stats.upcoming_appointments}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Scheduled appointments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{stats.completed_bookings}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Verified & closed jobs</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">₹{stats.total_spent.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Includes taxes & invoices</p>
        </div>
      </div>

      {/* Upcoming Appointments & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bookings List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Service Appointments</h3>
              <p className="text-xs text-slate-400">Track technician dispatch and status in real-time</p>
            </div>
            <Link
              to="/customer/bookings"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-500">{b.booking_ref}</span>
                    <Badge status={b.status} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{b.service_title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">By {b.provider_name}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.booking_date} ({b.time_slot})
                    </span>
                  </div>
                </div>

                <div className="sm:text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col items-center sm:items-end justify-between">
                  <span className="text-sm font-black text-slate-900">₹{Number(b.total_amount).toFixed(2)}</span>
                  <Link
                    to="/customer/bookings"
                    className="text-xs font-bold text-brand-600 hover:underline mt-1"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protection & Support Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">30-Day Guarantee Active</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              All repairs and maintenance tasks completed on HomeServe Technologies include an automatic 30-day rework warranty.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Need help with a job?</span>
              <Link to="/customer/bookings" className="text-rose-600 font-bold hover:underline">
                File a Dispute
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h4 className="text-sm font-bold text-slate-900 mb-2">My Saved Addresses</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ensure your technician reaches the exact doorstep with apartment details and landmark notes.
            </p>
            <Link
              to="/customer/addresses"
              className="mt-4 inline-block text-xs font-bold text-brand-600 hover:underline"
            >
              Manage Address Book →
            </Link>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default CustomerDashboard;
