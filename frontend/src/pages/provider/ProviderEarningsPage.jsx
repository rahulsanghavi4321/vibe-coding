import React, { useState } from 'react';
import { DollarSign, TrendingUp, Download, CheckCircle2, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export const ProviderEarningsPage = () => {
  const [earningsLedger] = useState([
    { id: 1, booking_ref: 'HS-BK-9801', date: '2026-11-04', service_title: 'Ceiling Fan Installation', gross: 299.00, tax: 53.82, commission: 44.85, net: 254.15, status: 'Settled' },
    { id: 2, booking_ref: 'HS-BK-9750', date: '2026-10-28', service_title: 'AC Jet Deep Servicing', gross: 699.00, tax: 125.82, commission: 104.85, net: 594.15, status: 'Settled' },
    { id: 3, booking_ref: 'HS-BK-9721', date: '2026-10-20', service_title: 'Tap Repair & Flush Valve', gross: 249.00, tax: 44.82, commission: 37.35, net: 211.65, status: 'Settled' },
    { id: 4, booking_ref: 'HS-BK-9689', date: '2026-10-14', service_title: 'Full 2BHK Home Deep Sanitization', gross: 2499.00, tax: 449.82, commission: 374.85, net: 2124.15, status: 'Settled' },
  ]);

  const totalGross = earningsLedger.reduce((acc, curr) => acc + curr.gross, 0);
  const totalCommission = earningsLedger.reduce((acc, curr) => acc + curr.commission, 0);
  const totalNet = earningsLedger.reduce((acc, curr) => acc + curr.net, 0);

  const exportLedger = () => {
    let csv = "Booking Ref,Date,Service,Gross (INR),Platform Commission 15% (INR),Net Earning (INR),Payout Status\n";
    earningsLedger.forEach(row => {
      csv += `${row.booking_ref},${row.date},${row.service_title},${row.gross},${row.commission},${row.net},${row.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Provider_Earnings_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout title="Earnings & Settlement Ledger">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Financial Settlements & Payouts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            15% standard commission tier. Direct bank settlement initiated every Monday.
          </p>
        </div>
        <button
          onClick={exportLedger}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download Statement (.CSV)</span>
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Order Value</span>
          <p className="text-2xl font-black text-slate-900 mt-2">₹{totalGross.toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Total job value collected</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Commission (15%)</span>
          <p className="text-2xl font-black text-rose-600 mt-2">-₹{totalCommission.toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Software & escrow fee</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Credited to Bank</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">₹{totalNet.toFixed(2)}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Settled & Reconciled</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3">Booking Ref</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Gross (INR)</th>
              <th className="px-5 py-3">Commission (15%)</th>
              <th className="px-5 py-3 font-bold text-emerald-700">Net Payout</th>
              <th className="px-5 py-3 text-right">Settlement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {earningsLedger.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{row.booking_ref}</td>
                <td className="px-5 py-3.5 text-slate-500">{row.date}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{row.service_title}</td>
                <td className="px-5 py-3.5 font-bold text-slate-900">₹{row.gross.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-rose-600 font-semibold">-₹{row.commission.toFixed(2)}</td>
                <td className="px-5 py-3.5 font-black text-emerald-600">₹{row.net.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Settled</span>
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

export default ProviderEarningsPage;

