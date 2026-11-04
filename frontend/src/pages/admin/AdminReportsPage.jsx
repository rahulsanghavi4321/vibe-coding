import React, { useState } from 'react';
import { FileText, Download, TrendingUp, DollarSign, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';

export const AdminReportsPage = () => {
  const [reportType, setReportType] = useState('monthly_revenue');

  const monthlyReportData = [
    { period: '2026-05', gross_sales: 310000, commission: 46500, provider_payout: 263500, total_bookings: 410 },
    { period: '2026-06', gross_sales: 345000, commission: 51750, provider_payout: 293250, total_bookings: 460 },
    { period: '2026-07', gross_sales: 390000, commission: 58500, provider_payout: 331500, total_bookings: 520 },
    { period: '2026-08', gross_sales: 420000, commission: 63000, provider_payout: 357000, total_bookings: 560 },
    { period: '2026-09', gross_sales: 460000, commission: 69000, provider_payout: 391000, total_bookings: 610 },
    { period: '2026-10', gross_sales: 510000, commission: 76500, provider_payout: 433500, total_bookings: 680 },
  ];

  const handleExport = () => {
    let csv = "Period,Gross Sales (INR),Platform Commission (INR),Provider Payout (INR),Total Bookings\n";
    monthlyReportData.forEach(row => {
      csv += `${row.period},${row.gross_sales},${row.commission},${row.provider_payout},${row.total_bookings}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HomeServe_Financial_Audit_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="Financial & Operational Analytics Reports">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Platform Financial Audit & Revenue Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified monthly financial figures, commission deductions, and tax audit records.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Ledger (.CSV)</span>
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-8">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Gross Sales vs. Commission Split</h3>
        <p className="text-xs text-slate-400 mb-6">Visual monthly breakdown in Indian Rupees</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyReportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(val) => [`₹${Number(val).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="gross_sales" name="Gross GMV" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="commission" name="Commission" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Historical Settlement Records</h4>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            All Settlements Balanced
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3">Accounting Period</th>
              <th className="px-5 py-3">Completed Bookings</th>
              <th className="px-5 py-3">Gross Sales (INR)</th>
              <th className="px-5 py-3">Platform Commission (15%)</th>
              <th className="px-5 py-3">Provider Net Payouts</th>
              <th className="px-5 py-3 text-right">Audit Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {monthlyReportData.map((row) => (
              <tr key={row.period} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5 font-bold text-slate-900 font-mono">{row.period}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{row.total_bookings} Jobs</td>
                <td className="px-5 py-3.5 font-bold text-slate-900">₹{row.gross_sales.toLocaleString()}</td>
                <td className="px-5 py-3.5 font-bold text-brand-600">₹{row.commission.toLocaleString()}</td>
                <td className="px-5 py-3.5 font-bold text-emerald-600">₹{row.provider_payout.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Audited</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </DashboardLayout>
  );
};

export default AdminReportsPage;
