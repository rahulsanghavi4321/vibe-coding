import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Clock, MapPin, Star } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export const TechnicianHistoryPage = () => {
  const [history] = useState([
    {
      id: 1,
      booking_ref: 'HS-BK-9750',
      service_title: 'AC Jet Deep Servicing & Filter Cleaning',
      customer_name: 'Vikram Mehta',
      date: '2026-10-28',
      remarks: 'Full jet wash executed. Cleaned blower wheel and checked evaporator coils. Customer satisfied.',
      rating: 5,
    },
    {
      id: 2,
      booking_ref: 'HS-BK-9721',
      service_title: 'Tap Repair & Flush Valve Replacement',
      customer_name: 'Siddharth Roy',
      date: '2026-10-20',
      remarks: 'Replaced brass internal valve washer. Zero leaks verified under pressure.',
      rating: 5,
    },
    {
      id: 3,
      booking_ref: 'HS-BK-9689',
      service_title: 'Switchboard Overhaul',
      customer_name: 'Aditi Rao',
      date: '2026-10-14',
      remarks: 'Rewired sparking fuse and replaced main 32A MCB.',
      rating: 4,
    }
  ]);

  return (
    <DashboardLayout title="Technician Job History & Track Record">
      
      <div className="max-w-4xl space-y-4">
        <div className="pb-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Completed Service Orders</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical portfolio of closed tickets with logged completion remarks and ratings.
          </p>
        </div>

        <div className="space-y-3">
          {history.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {job.booking_ref}
                </span>
                <span className="text-slate-400 font-semibold">{job.date}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{job.service_title}</h4>
              <p className="text-slate-500">Customer: <strong className="text-slate-700">{job.customer_name}</strong></p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 mt-2">
                <strong className="text-slate-800">Technician Remarks:</strong> {job.remarks}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Work Verified & Closed</span>
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < job.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
};

export default TechnicianHistoryPage;
