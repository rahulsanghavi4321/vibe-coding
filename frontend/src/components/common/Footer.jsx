import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Verified Providers</h4>
              <p className="text-slate-400 text-xs mt-0.5">Strict KYC, police verification & trade licenses</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Punctual & Guaranteed</h4>
              <p className="text-slate-400 text-xs mt-0.5">Real-time technician tracking & on-time arrival</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Transparent Pricing</h4>
              <p className="text-slate-400 text-xs mt-0.5">No hidden charges, upfront quotes & instant invoices</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">HomeServe</span>
            </div>
            <p className="text-slate-400 text-xs mt-3 max-w-sm leading-relaxed">
              HomeServe Technologies is an enterprise multi-vendor SaaS platform connecting millions of households with certified electrical, plumbing, AC, cleaning, carpentry, and repair professionals.
            </p>
            <div className="mt-4 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@homeservetech.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+91 1800-420-SERV (24x7)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>Tech Park, Bangalore & Hyderabad</span>
              </div>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Services</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/services?cat=electrical-services" className="hover:text-white transition-colors">Electrical Services</Link></li>
              <li><Link to="/services?cat=plumbing-services" className="hover:text-white transition-colors">Plumbing Solutions</Link></li>
              <li><Link to="/services?cat=ac-repair-maintenance" className="hover:text-white transition-colors">AC Repair & Maintenance</Link></li>
              <li><Link to="/services?cat=home-cleaning" className="hover:text-white transition-colors">Deep Home Cleaning</Link></li>
              <li><Link to="/services?cat=painting-services" className="hover:text-white transition-colors">Painting & Waterproofing</Link></li>
              <li><Link to="/services?cat=carpentry-services" className="hover:text-white transition-colors">Carpentry Work</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/register?role=provider" className="hover:text-white transition-colors">Partner With Us</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Provider Portal</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Find Professionals</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Security & Legal</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#guarantee" className="hover:text-white transition-colors">30-Day Service Guarantee</a></li>
              <li><a href="#refund" className="hover:text-white transition-colors">Refund & Cancellation</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security & Trust</a></li>
            </ul>
          </div>

        </div>

        {/* Copyright & Developer Credit */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HomeServe Technologies Inc. All rights reserved.</p>
          <p className="font-bold text-sm text-brand-400 bg-brand-950/60 border border-brand-500/30 px-4 py-1.5 rounded-full shadow-inner">
            Developed By Rahul Sanghavi
          </p>
          <p className="flex items-center gap-1 text-[11px] text-slate-500">
            Enterprise SaaS Platform · PCI-DSS Compliant Payment Flow
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

