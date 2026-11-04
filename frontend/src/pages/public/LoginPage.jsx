import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Wrench, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Briefcase, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      redirectByRole(res.user.role);
    } else {
      setError(res.error);
    }
  };

  const handleDemoLogin = async (roleKey) => {
    setError('');
    setLoading(true);
    const res = await switchDemoRole(roleKey);
    setLoading(false);
    if (res.success) {
      redirectByRole(res.user.role);
    } else {
      setError(res.error);
    }
  };

  const redirectByRole = (role) => {
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    switch (role) {
      case 'super_admin': navigate('/admin/dashboard'); break;
      case 'service_provider': navigate('/provider/dashboard'); break;
      case 'technician': navigate('/technician/dashboard'); break;
      case 'customer':
      default: navigate('/customer/dashboard'); break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">HomeServe</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Access your personalized dashboard and service management tools.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200/80 sm:px-10">
          
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-semibold text-brand-600 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick 1-Click Role Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick 1-Click Demo Evaluation
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('super_admin')}
                className="p-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-800 text-left text-xs font-bold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <div className="truncate">
                  <p className="leading-tight">Super Admin</p>
                  <p className="text-[9px] font-normal text-purple-600">Full System</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="p-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-800 text-left text-xs font-bold flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <p className="leading-tight">Customer</p>
                  <p className="text-[9px] font-normal text-blue-600">Bookings</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('service_provider')}
                className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 text-left text-xs font-bold flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <p className="leading-tight">Provider</p>
                  <p className="text-[9px] font-normal text-emerald-600">Operations</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('technician')}
                className="p-2 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-800 text-left text-xs font-bold flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="truncate">
                  <p className="leading-tight">Technician</p>
                  <p className="text-[9px] font-normal text-amber-600">Field App</p>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Signature */}
      <footer className="mt-auto py-6 text-center text-xs text-slate-500">
        <p className="font-bold text-brand-600 bg-white inline-block px-4 py-1 rounded-full border border-slate-200 shadow-sm">
          Developed By Rahul Sanghavi
        </p>
        <p className="text-[11px] text-slate-400 mt-1">HomeServe Technologies SaaS Platform</p>
      </footer>

    </div>
  );
};

export default LoginPage;

