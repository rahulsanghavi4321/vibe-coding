import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, UserCheck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export const HowItWorksPage = () => {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
            Operational Blueprint
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-2">
            How HomeServe Technologies Works
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-300">
            A frictionless platform uniting customers, enterprise service agencies, certified technicians, and administrative monitors.
          </p>

          <div className="mt-8 inline-flex p-1 rounded-2xl bg-slate-800 border border-slate-700">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'customer'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Homeowners
            </button>
            <button
              onClick={() => setActiveTab('provider')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'provider'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Service Providers
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {activeTab === 'customer' ? (
          <div className="space-y-8">
            {[
              {
                num: '1',
                title: 'Browse & Compare Qualified Trade Agencies',
                desc: 'Explore 8 categories ranging from Electrical to Pest Control. Compare real customer reviews, pricing quotes, and verified licensing.',
              },
              {
                num: '2',
                title: 'Reserve Guaranteed Time Slot',
                desc: 'Select a precise 1-hour appointment window. Our system prevents double-booking and locks provider capacity instantly.',
              },
              {
                num: '3',
                title: 'Track Dispatch & On-Site Execution',
                desc: 'The provider assigns an experienced technician. Receive live status updates when the technician marks arrival and begins work.',
              },
              {
                num: '4',
                title: 'Inspect Photo Proof & Complete Payment',
                desc: 'Review before & after photographs submitted by the technician. Complete payment securely and download your official tax invoice.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-brand-600 font-black text-lg flex items-center justify-center shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}

            <div className="text-center pt-6">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
              >
                <span>Browse Services Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {[
              {
                num: '1',
                title: 'Register & Submit KYC Credentials',
                desc: 'Create your company profile, upload trade certificates and GST/Tax IDs. Our admin team verifies credentials within 24 hours.',
              },
              {
                num: '2',
                title: 'Configure Service Areas & Rates',
                desc: 'Define your operational radius, base pricing, and working schedule. Add and onboard your team of field technicians.',
              },
              {
                num: '3',
                title: 'Receive & Dispatch Booking Requests',
                desc: 'Accept customer bookings matching your capacity. Assign the nearest available technician in one click.',
              },
              {
                num: '4',
                title: 'Transparent Commission & Payouts',
                desc: 'Track gross sales, platform commissions (15%), and net earnings in your real-time financial ledger.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-black text-lg flex items-center justify-center shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}

            <div className="text-center pt-6">
              <Link
                to="/register?role=provider"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
              >
                <span>Register as Service Provider</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;

