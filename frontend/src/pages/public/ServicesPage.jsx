import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Star, 
  Zap, 
  Droplets, 
  Wind, 
  Sparkles, 
  Paintbrush, 
  Hammer, 
  Tv, 
  Bug,
  Wrench
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import RatingStars from '../../components/common/RatingStars';
import BookingWizardModal from '../../components/booking/BookingWizardModal';
import api from '../../api/client';

export const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(searchParams.get('cat') || 'all');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedService, setSelectedService] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [catRes, srvRes] = await Promise.all([
        api.get('/categories'),
        api.get('/services')
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (srvRes.data) setServices(srvRes.data);
    } catch (err) {
      console.warn('Fallback catalog used:', err.message);
      // Fallback baseline services
      setCategories([
        { id: 1, name: 'Electrical', slug: 'electrical-services' },
        { id: 2, name: 'Plumbing', slug: 'plumbing-services' },
        { id: 3, name: 'AC Repair', slug: 'ac-repair-maintenance' },
        { id: 4, name: 'Home Cleaning', slug: 'home-cleaning' },
        { id: 5, name: 'Painting', slug: 'painting-services' },
        { id: 6, name: 'Carpentry', slug: 'carpentry-services' },
        { id: 7, name: 'Appliance Repair', slug: 'appliance-repair' },
        { id: 8, name: 'Pest Control', slug: 'pest-control' },
      ]);

      setServices([
        { id: 1, title: 'Ceiling Fan Installation & Repair', category_slug: 'electrical-services', base_price: 299, duration_minutes: 45, rating: 4.9, bookings_count: 512, description: 'Inspection, capacitor replacement, mounting & balancing.' },
        { id: 2, title: 'Switchboard Repair & Socket Replacement', category_slug: 'electrical-services', base_price: 199, duration_minutes: 30, rating: 4.8, bookings_count: 320, description: 'Fix sparkling switches, burnt wiring, and modular sockets.' },
        { id: 3, title: 'Tap Repair & Leakage Fixing', category_slug: 'plumbing-services', base_price: 249, duration_minutes: 30, rating: 4.7, bookings_count: 610, description: 'Washer replacement, cartridge fixing & pipe joint sealing.' },
        { id: 4, title: 'Bathroom Drain Unclogging', category_slug: 'plumbing-services', base_price: 399, duration_minutes: 60, rating: 4.9, bookings_count: 420, description: 'High-pressure unclogging and chemical disinfection.' },
        { id: 5, title: 'AC Jet Deep Servicing & Filter Wash', category_slug: 'ac-repair-maintenance', base_price: 699, duration_minutes: 60, rating: 4.9, bookings_count: 890, description: 'Complete indoor jet cleaning, outdoor wash, and cooling check.' },
        { id: 6, title: 'AC Gas Refill & Leak Detection', category_slug: 'ac-repair-maintenance', base_price: 1899, duration_minutes: 90, rating: 4.8, bookings_count: 340, description: 'R32 / R410A gas filling with nitrogen pressure leak check.' },
        { id: 7, title: 'Full 2BHK Home Deep Sanitization', category_slug: 'home-cleaning', base_price: 2499, duration_minutes: 240, rating: 4.9, bookings_count: 280, description: 'Scrubbing, floor buffing, kitchen degreasing & bathroom sanitization.' },
        { id: 8, title: 'Sofa Shampooing & Vacuum Cleaning (5-Seater)', category_slug: 'home-cleaning', base_price: 899, duration_minutes: 90, rating: 4.8, bookings_count: 410, description: 'Extraction shampooing and fabric dust mite removal.' },
        { id: 9, title: 'Door Lock Installation & Hinge Fixing', category_slug: 'carpentry-services', base_price: 349, duration_minutes: 45, rating: 4.7, bookings_count: 210, description: 'Precision lock mortising and smooth door alignment.' },
        { id: 10, title: 'General Pest & Cockroach Gel Treatment', category_slug: 'pest-control', base_price: 799, duration_minutes: 45, rating: 4.9, bookings_count: 530, description: 'Odorless herbal gel baiting with 90-day warranty.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((srv) => {
    const matchesCategory =
      selectedCategorySlug === 'all' ||
      srv.category_slug === selectedCategorySlug ||
      srv.subcategory?.category?.slug === selectedCategorySlug;

    const matchesSearch =
      !searchTerm ||
      srv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (slug) => {
    setSelectedCategorySlug(slug);
    setSearchParams(slug === 'all' ? {} : { cat: slug });
  };

  const openBooking = (srv) => {
    setSelectedService(srv);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black tracking-tight">Home Services Catalog</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl">
            Select a verified service package below. Upfront transparent pricing with instant booking confirmation.
          </p>

          {/* Search Box */}
          <div className="mt-6 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Catalog Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategorySlug === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            All Services ({services.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategorySlug === cat.slug
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-500">
              Loading service catalog...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Services Found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try selecting a different category or clearing your search term.
              </p>
              <button
                onClick={() => { setSelectedCategorySlug('all'); setSearchTerm(''); }}
                className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-brand-700 border border-blue-100 px-2.5 py-0.5 rounded-full">
                        {srv.category_slug?.replace('-', ' ') || 'Verified'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-800">{srv.rating || 4.9}</span>
                        <span className="text-[10px] text-slate-400">({srv.bookings_count || 120})</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-3">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {srv.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Duration: {srv.duration_minutes || 60} mins</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Starting from</span>
                      <span className="text-base font-black text-slate-900">
                        ₹{srv.base_price}
                      </span>
                    </div>
                    <button
                      onClick={() => openBooking(srv)}
                      className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <Footer />

      {/* Booking Wizard Modal */}
      {isBookingOpen && (
        <BookingWizardModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialService={selectedService}
          onBookingSuccess={() => {
            window.location.href = '/customer/bookings';
          }}
        />
      )}
    </div>
  );
};

export default ServicesPage;
