import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Wrench, Mail, Lock, User, Phone, Briefcase, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [roleType, setRoleType] = useState(searchParams.get('role') === 'provider' ? 'service_provider' : 'customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      full_name: fullName,
      email,
      phone,
      password,
      role: roleType,
      ...(roleType === 'service_provider' && {
        business_name: businessName || `${fullName} Trade Services`,
        tax_id: taxId || 'GSTIN-PENDING',
      })
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      if (roleType === 'service_provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">HomeServe</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Create your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Join thousands of homeowners and verified service providers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200/80 sm:px-10">
          
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setRoleType('customer')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                roleType === 'customer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRoleType('service_provider')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                roleType === 'service_provider'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Service Provider
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Provider specific fields */}
            {roleType === 'service_provider' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business / Trade Name
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Apex Home Maintenance Services"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GST / Trade License Number
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="29AAAAA0000A1Z5"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Creating Account...' : `Register as ${roleType === 'service_provider' ? 'Provider' : 'Customer'}`}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RegisterPage;

