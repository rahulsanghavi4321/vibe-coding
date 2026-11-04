import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  DollarSign
} from 'lucide-react';
import Modal from '../common/Modal';
import RatingStars from '../common/RatingStars';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const BookingWizardModal = ({ isOpen, onClose, initialService, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [providers, setProviders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Booking Form State
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const availableSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM'
  ];

  // Fetch Providers offering this service & Customer Addresses
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError('');
      fetchInitialData();
    }
  }, [isOpen, initialService]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch verified providers
      const provRes = await api.get('/providers');
      if (provRes.data) {
        setProviders(provRes.data.filter(p => p.verification_status === 'verified') || provRes.data);
        if (provRes.data.length > 0) {
          setSelectedProvider(provRes.data[0]);
        }
      }

      // Fetch user addresses if authenticated
      if (isAuthenticated) {
        const addrRes = await api.get('/users/addresses');
        if (addrRes.data && addrRes.data.length > 0) {
          setAddresses(addrRes.data);
          const def = addrRes.data.find(a => a.is_default) || addrRes.data[0];
          setSelectedAddressId(def.id);
        }
      }
    } catch (err) {
      console.warn('Using fallback data for booking setup:', err.message);
      // Fallback sample providers if backend seeding in progress
      setProviders([
        {
          id: 1,
          business_name: 'Apex Home & Electrical Solutions',
          rating_avg: 4.9,
          rating_count: 128,
          commission_rate: 15.0,
          logo_url: null,
        },
        {
          id: 2,
          business_name: 'UrbanCare Professional Maintenance',
          rating_avg: 4.8,
          rating_count: 94,
          commission_rate: 15.0,
          logo_url: null,
        }
      ]);
      setSelectedProvider({
        id: 1,
        business_name: 'Apex Home & Electrical Solutions',
        rating_avg: 4.9,
        rating_count: 128
      });
      setAddresses([
        {
          id: 1,
          title: 'Home',
          address_line1: 'Flat 402, Royal Palms Residency',
          city: 'Bangalore',
          state: 'Karnataka',
          postal_code: '560100',
          is_default: true,
        }
      ]);
      setSelectedAddressId(1);
    } finally {
      setLoading(false);
    }
  };

  // Pricing calculations
  const basePrice = initialService?.base_price || 499;
  const taxAmount = Number((basePrice * 0.18).toFixed(2));
  const totalAmount = Number((basePrice + taxAmount - discountAmount).toFixed(2));

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME100') {
      setDiscountAmount(100);
      setError('');
    } else if (couponCode.toUpperCase() === 'HOMESERVE50') {
      setDiscountAmount(50);
      setError('');
    } else {
      setError('Invalid coupon code. Try WELCOME100 or HOMESERVE50');
    }
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        provider_id: selectedProvider?.id || 1,
        service_id: initialService?.id || 1,
        address_id: selectedAddressId ? Number(selectedAddressId) : null,
        booking_date: bookingDate,
        time_slot: timeSlot,
        problem_description: problemDescription || `Request for ${initialService?.title || 'Home Service'}`,
        base_price: basePrice,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
      };

      const res = await api.post('/bookings', payload);
      setLoading(false);
      if (onBookingSuccess) {
        onBookingSuccess(res.data);
      }
      onClose();
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.detail || 'Failed to submit booking. The slot might be full or provider unavailable.';
      setError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Book Service – ${initialService?.title || 'Appointment'}`}
      maxWidth="max-w-2xl"
    >
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        {[
          { num: 1, label: 'Provider' },
          { num: 2, label: 'Date & Time' },
          { num: 3, label: 'Address & Notes' },
          { num: 4, label: 'Review & Pay' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                step === s.num
                  ? 'bg-brand-600 text-white'
                  : step > s.num
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? 'text-slate-900 font-bold' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Select Verified Service Provider */}
      {step === 1 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800">Choose Verified Service Provider</h4>
          <p className="text-xs text-slate-500">
            Compare licensed providers offering {initialService?.title} in your area.
          </p>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {providers.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProvider(p)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedProvider?.id === p.id
                    ? 'border-brand-600 bg-blue-50/40 ring-1 ring-brand-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-brand-600">
                    {p.business_name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {p.business_name}
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <RatingStars rating={Math.round(p.rating_avg || 5)} size="sm" />
                      <span className="text-[11px] text-slate-500">
                        {p.rating_avg?.toFixed(1) || '5.0'} ({p.rating_count || 12} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-brand-600">
                    ₹{basePrice}
                  </span>
                  <p className="text-[10px] text-slate-400">Fixed Base Quote</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
            >
              <span>Select Date & Slot</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Available Slot */}
      {step === 2 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800">Select Date & Preferred Time Slot</h4>
          <p className="text-xs text-slate-500">
            Appointments must be during provider working hours. Anti-collision locks apply.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Service Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Available Appointment Window
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-left flex items-center gap-2 transition-all ${
                    timeSlot === slot
                      ? 'border-brand-600 bg-blue-50 text-brand-700 font-bold ring-1 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{slot}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
            >
              <span>Add Address & Notes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Address & Problem Description */}
      {step === 3 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800">Service Location & Problem Notes</h4>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Delivery Address
            </label>
            {addresses.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                Default location: Flat 402, Royal Palms Residency, Bangalore 560100
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`block p-3 rounded-xl border text-xs cursor-pointer ${
                      selectedAddressId === a.id
                        ? 'border-brand-600 bg-blue-50/50 ring-1 ring-brand-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === a.id}
                        onChange={() => setSelectedAddressId(a.id)}
                        className="text-brand-600"
                      />
                      <span className="font-bold text-slate-800">{a.title || 'Address'}</span>
                    </div>
                    <p className="text-slate-600 mt-1 pl-5">
                      {a.address_line1}, {a.city}, {a.state} - {a.postal_code}
                    </p>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Specific Problem Notes / Instructions (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="E.g., Switchboard making buzzing sound in bedroom; please bring 16A spare switch."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
            >
              <span>Review Quotation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review, Coupon & Confirmation */}
      {step === 4 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800">Review Quotation & Confirm</h4>
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-800">{initialService?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Provider:</span>
              <span className="font-bold text-slate-800">{selectedProvider?.business_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Appointment:</span>
              <span className="font-bold text-slate-800">{bookingDate} ({timeSlot})</span>
            </div>
          </div>

          {/* Coupon Input */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Have a promotional coupon?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter WELCOME100"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 uppercase"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="text-xs font-bold bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-900"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Base Service Fee</span>
              <span>₹{basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST / Applicable Tax (18%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="text-brand-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={loading}
              onClick={handleConfirmBooking}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              {loading ? (
                <span>Locking Slot...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookingWizardModal;
