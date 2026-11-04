import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  Star, 
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import RatingStars from '../../components/common/RatingStars';
import api from '../../api/client';

export const ProviderDashboard = () => {
  const [metrics, setMetrics] = useState({
    total_bookings: 84,
    today_bookings: 3,
    pending_requests: 2,
    accepted_bookings: 6,
    completed_services: 72,
    gross_earnings: 74200,
    platform_commission: 11130,
    net_earnings: 63070,
    rating_avg: 4.88,
    rating_count: 65,
    technicians_count: 6,
  });

  const [recentRequests, setRecentRequests] = useState([]);

  const weeklyJobData = [
    { day: 'Mon', jobs: 8, earnings: 6200 },
    { day: 'Tue', jobs: 12, earnings: 9400 },
    { day: 'Wed', jobs: 10, earnings: 7800 },
    { day: 'Thu', jobs: 14, earnings: 11200 },
    { day: 'Fri', jobs: 15, earnings: 12400 },
    { day: 'Sat', jobs: 18, earnings: 14800 },
    { day: 'Sun', jobs: 7, earnings: 5600 },
  ];

  useEffect(() => {
    fetchProviderStats();
  }, []);

  const fetchProviderStats = async () => {
    try {
      const res = await api.get('/providers/me/overview');
      if (res.data) setMetrics(res.data);
    } catch (err) {
      // Fallback sample
      setRecentRequests([
        {
          id: 1,
          booking_ref: 'HS-BK-9804',
          service_title: 'Switchboard Repair & Socket Replacement',
          customer_name: 'Karan Malhotra',
          booking_date: '2026-11-05',
          time_slot: '04:00 PM - 05:00 PM',
          total_amount: 234.82,
          status: 'Pending',
        },
        {
          id: 2,
          booking_ref: 'HS-BK-9803',
          service_title: 'Complete Bathroom Deep Sanitization',
          customer_name: 'Sneha Patel',
          booking_date: '2026-11-05',
          time_slot: '11:00 AM - 12:00 PM',
          total_amount: 588.82,
          status: 'Confirmed',
        }
      ]);
    }
  };

  return (
    <DashboardLayout title="Service Provider Workspace">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Apex Home & Electrical Solutions</h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Partner
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational center for booking fulfillment, technician dispatch, and gross revenue ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/provider/bookings"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20"
          >
            Review Job Requests ({metrics.pending_requests})
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Net Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Earnings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            ₹{Number(metrics.net_earnings || 63070).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            After 15% platform fee (₹{Number(metrics.platform_commission).toLocaleString()})
          </p>
        </div>

        {/* Pending Requests */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Requests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">
            {metrics.pending_requests || 2}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Action required within 2 hours</p>
        </div>

        {/* Completed Jobs */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {metrics.completed_services || 72}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Fulfilled with photo proof</p>
        </div>

        {/* Rating Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quality Score</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl font-black text-slate-900">{metrics.rating_avg || 4.88}</p>
            <RatingStars rating={Math.round(metrics.rating_avg || 5)} size="sm" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Based on {metrics.rating_count || 65} verified reviews</p>
        </div>

      </div>

      {/* Weekly Earnings Chart & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Revenue & Volume</h3>
              <p className="text-xs text-slate-400">Total job revenue collected across technicians</p>
            </div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
              This Week
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyJobData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Earnings']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="earnings" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Field Team Quick View */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Field Technicians</h3>
              <Link to="/provider/technicians" className="text-xs font-bold text-brand-600 hover:underline">
                Manage ({metrics.technicians_count || 6})
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time technician availability for incoming bookings.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Ramesh Kumar', spec: 'Senior Electrician', status: 'On Job', statusColor: 'bg-cyan-50 text-cyan-700' },
                { name: 'Sunil Verma', spec: 'AC Technician', status: 'Available', statusColor: 'bg-emerald-50 text-emerald-700' },
                { name: 'Vijay Anand', spec: 'Plumbing Lead', status: 'Available', statusColor: 'bg-emerald-50 text-emerald-700' },
              ].map((tech) => (
                <div key={tech.name} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{tech.name}</p>
                    <p className="text-[10px] text-slate-400">{tech.spec}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${tech.statusColor}`}>
                    {tech.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/provider/technicians"
              className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Assign & Dispatch Team</span>
            </Link>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default ProviderDashboard;
