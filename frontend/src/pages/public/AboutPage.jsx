import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Users, CheckCircle2, Building, Wrench } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
            About HomeServe Technologies
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-2 tracking-tight">
            Transforming Everyday Home Maintenance into a Reliable Digital Utility
          </h1>
          <p className="mt-4 text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            HomeServe Technologies was founded to bridge the gap between discerning homeowners and skilled trade professionals. We combine strict KYC verification, transparent software-driven pricing, and real-time technician dispatching.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Our Mission</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To empower homeowners with instant, dependable, guaranteed trade services while elevating skilled technicians with fair earnings and structured tools.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Quality Standards</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every service provider undergoes multi-stage background checks, document validation, and safety audits before they can accept appointments on the platform.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Community First</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Over 1,200 micro-entrepreneurs and technicians rely on HomeServe Technologies for consistent, dignified livelihoods with transparent commission structures.
            </p>
          </div>
        </div>

        {/* Operating Pillars */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-200 p-8 sm:p-12">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">
            The HomeServe Operational Guarantee
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Fixed Upfront Pricing:</strong> No unexpected on-site bargaining. Pricing includes labor and standard diagnostics.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Digital Invoicing:</strong> GST-compliant invoices generated automatically for every completed order.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Before & After Photo Proof:</strong> Technicians record visual verification of repairs directly in the field app.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Direct Dispute Arbitration:</strong> Dedicated Super Admin support console for swift dispute resolution and refunds.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
