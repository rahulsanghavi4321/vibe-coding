import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Zap,
  Droplets,
  Wind,
  Sparkles,
  Paintbrush,
  Hammer,
  Tv,
  Bug,
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  Clock,
  Award,
  CheckCircle2,
  Users
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import RatingStars from '../../components/common/RatingStars';
import BookingWizardModal from '../../components/booking/BookingWizardModal';
import api from '../../api/client';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const navigate = useNavigate();

  // Category Icon Resolver
  const categoryIconMap = {
    'electrical-services': Zap,
    'plumbing-services': Droplets,
    'ac-repair-maintenance': Wind,
    'home-cleaning': Sparkles,
    'painting-services': Paintbrush,
    'carpentry-services': Hammer,
    'appliance-repair': Tv,
    'pest-control': Bug,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/categories');
        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        } else {
          setFallbackCategories();
        }

        const srvRes = await api.get('/services/popular');
        if (srvRes.data && srvRes.data.length > 0) {
          setPopularServices(srvRes.data);
        } else {
          setFallbackServices();
        }
      } catch (err) {
        setFallbackCategories();
        setFallbackServices();
      }
    };

    fetchData();
  }, []);

  const setFallbackCategories = () => {
    setCategories([
      { id: 1, name: 'Electrical Services', slug: 'electrical-services', description: 'Fan, lights, switchboard & wiring fixes' },
      { id: 2, name: 'Plumbing Services', slug: 'plumbing-services', description: 'Taps, leakages, piping & tank cleaning' },
      { id: 3, name: 'AC Repair & Service', slug: 'ac-repair-maintenance', description: 'Installation, servicing, gas charging & repairs' },
      { id: 4, name: 'Home Cleaning', slug: 'home-cleaning', description: 'Deep home, kitchen, bathroom & sofa sanitization' },
      { id: 5, name: 'Painting Services', slug: 'painting-services', description: 'Interior, exterior, texture & waterproofing' },
      { id: 6, name: 'Carpentry Services', slug: 'carpentry-services', description: 'Furniture repair, doors, wardrobes & fittings' },
      { id: 7, name: 'Appliance Repair', slug: 'appliance-repair', description: 'Washing machines, fridges, microwaves & TVs' },
      { id: 8, name: 'Pest Control', slug: 'pest-control', description: 'Cockroach, termite, bed bug & mosquito control' },
    ]);
  };

  const setFallbackServices = () => {
    setPopularServices([
      { id: 101, title: 'Ceiling Fan Installation & Repair', category_name: 'Electrical', base_price: 299, duration_minutes: 45, rating: 4.9, bookings_count: 840 },
      { id: 102, title: 'AC Jet Deep Servicing & Filter Cleaning', category_name: 'AC Maintenance', base_price: 699, duration_minutes: 60, rating: 4.8, bookings_count: 1420 },
      { id: 103, title: 'Complete Bathroom Deep Sanitization', category_name: 'Home Cleaning', base_price: 499, duration_minutes: 90, rating: 4.9, bookings_count: 980 },
      { id: 104, title: 'Tap & Flush Valve Leakage Repair', category_name: 'Plumbing', base_price: 249, duration_minutes: 30, rating: 4.7, bookings_count: 650 },
    ]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/services');
    }
  };

  const openBooking = (service) => {
    setSelectedServiceForBooking(service);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-brand-900 via-slate-900 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>India's Most Trusted Multi-Vendor Home Services SaaS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Certified Home Services, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-300 to-emerald-400">
              Booked in 60 Seconds.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect with verified electricians, plumbers, AC technicians, and cleaners. Guaranteed on-time arrival, upfront pricing, and 30-day service warranty.
          </p>

          {/* Interactive Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200"
          >
            <div className="flex items-center gap-3 px-3 py-2 w-full sm:w-auto flex-1">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search services: 'AC Servicing', 'Fan Repair', 'Plumber'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-md shadow-brand-600/30 shrink-0 flex items-center justify-center gap-2"
            >
              <span>Find Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Key Metrics */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center border-t border-slate-800 pt-8">
            <div>
              <p className="text-2xl font-black text-white">45,000+</p>
              <p className="text-xs text-slate-400 mt-0.5">Bookings Fulfilled</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">1,200+</p>
              <p className="text-xs text-slate-400 mt-0.5">Verified Pros</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">4.89 / 5</p>
              <p className="text-xs text-slate-400 mt-0.5">Customer Rating</p>
            </div>
            <div>
              <p className="text-2xl font-black text-cyan-400">30 Days</p>
              <p className="text-xs text-slate-400 mt-0.5">Service Warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Core Service Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full -mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Explore Categories
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Professional Home Care Categories
              </h2>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>View all subcategories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const IconComp = categoryIconMap[cat.slug] || Wrench;
              return (
                <Link
                  key={cat.id}
                  to={`/services?cat=${cat.slug}`}
                  className="group p-5 rounded-2xl border border-slate-200/80 hover:border-brand-500 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all text-left flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-brand-600 text-brand-600 group-hover:text-white border border-slate-200 group-hover:border-brand-600 flex items-center justify-center transition-colors shadow-sm">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Services Highlights */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Most Booked
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Popular Home Services
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between p-5"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {srv.category_name || 'Home Care'}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">
                  {srv.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <RatingStars rating={Math.round(srv.rating || 5)} size="sm" />
                  <span className="text-xs font-bold text-slate-700">
                    {srv.rating || 4.9}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({srv.bookings_count || 120}+)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Est. {srv.duration_minutes || 60} mins</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">From</span>
                  <span className="text-base font-black text-slate-900">
                    ₹{srv.base_price}
                  </span>
                </div>
                <button
                  onClick={() => openBooking(srv)}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-100/60 border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            How HomeServe Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2">
            No endless phone calls or unverified handymen. Everything is tracked digitally from slot booking to invoice generation.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {[
              {
                step: '01',
                title: 'Select Service & Slot',
                desc: 'Pick your category, choose a verified provider, and select your preferred time slot.',
              },
              {
                step: '02',
                title: 'Instant Confirmation',
                desc: 'Provider confirms the appointment and assigns a dedicated background-checked technician.',
              },
              {
                step: '03',
                title: 'Service & Photo Proof',
                desc: 'Technician arrives on time, executes the job, and uploads before & after proof of work.',
              },
              {
                step: '04',
                title: 'Pay & Review',
                desc: 'Complete payment securely via UPI or Card, download your tax invoice, and rate your experience.',
              },
            ].map((st) => (
              <div
                key={st.step}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"
              >
                <span className="text-4xl font-black text-brand-100 absolute -top-1 right-2">
                  {st.step}
                </span>
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center mb-4">
                  {st.step}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">{st.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-tr from-brand-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              The HomeServe 30-Day Happiness Guarantee
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
              If the repair fails within 30 days, we'll re-dispatch a technician at zero extra labor cost or issue a complete refund. No questions asked.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/services"
                className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md"
              >
                Book a Verified Pro
              </Link>
              <Link
                to="/register?role=provider"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all"
              >
                Join as Service Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Wizard Modal */}
      {isBookingOpen && (
        <BookingWizardModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialService={selectedServiceForBooking}
          onBookingSuccess={(booking) => {
            navigate('/customer/bookings');
          }}
        />
      )}
    </div>
  );
};

export default HomePage;

