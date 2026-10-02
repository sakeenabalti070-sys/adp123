import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User as UserIcon, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  initialMode?: 'login' | 'register';
  adminIntent?: boolean;
  onNavigate: (page: string, params?: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialMode = 'login',
  adminIntent = false,
  onNavigate,
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form
  const [email, setEmail] = useState(adminIntent ? 'admin@comfort.pk' : '');
  const [password, setPassword] = useState(adminIntent ? 'ComfortAdmin2026!' : '');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const res = await login(email, password);
    setLoginLoading(false);
    if (res.success) {
      if (email.toLowerCase().includes('admin')) {
        onNavigate('admin');
      } else {
        onNavigate('account');
      }
    } else {
      setLoginError(res.message || 'Invalid credentials');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');
    const res = await register({
      name,
      email: regEmail,
      phone,
      password: regPassword,
      street,
      city,
      province,
    });
    setRegLoading(false);
    if (res.success) {
      onNavigate('account');
    } else {
      setRegError(res.message || 'Registration failed');
    }
  };

  const handleQuickAdmin = () => {
    setEmail('admin@comfort.pk');
    setPassword('ComfortAdmin2026!');
  };

  const handleQuickCustomer = () => {
    setEmail('ayesha.malik@gmail.com');
    setPassword('password123');
  };

  return (
    <div className="bg-[#FAF7F5] min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EDE4DE] p-8 shadow-xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <img
            src="/comfort_logo.png"
            alt="Comfort Ladies Garments"
            className="h-16 sm:h-20 w-auto object-contain mx-auto"
          />
          <p className="text-[11px] tracking-widest uppercase text-[#A98DA6] font-semibold">
            Ladies Garments Atelier
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex border-b border-[#F0E6DF]">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              mode === 'login'
                ? 'border-[#4A1D4B] text-[#4A1D4B]'
                : 'border-transparent text-[#806B7D] hover:text-[#4A1D4B]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              mode === 'register'
                ? 'border-[#4A1D4B] text-[#4A1D4B]'
                : 'border-transparent text-[#806B7D] hover:text-[#4A1D4B]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {loginError}
              </div>
            )}

            <div>
              <label className="font-semibold text-[#1F171E] block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@comfort.pk"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                />
                <Mail className="w-4 h-4 text-[#A98DA6] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#1F171E] block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                />
                <Lock className="w-4 h-4 text-[#A98DA6] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#4A1D4B] hover:bg-[#361437] text-white font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{loginLoading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Testing Credentials */}
            <div className="pt-4 border-t border-[#F0E6DF] space-y-2">
              <span className="text-[11px] text-[#A98DA6] block font-medium">Quick Credentials for Testing:</span>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={handleQuickAdmin}
                  className="w-full py-2 px-3 bg-[#FFF6F1] border border-[#E8DED8] rounded-lg text-left text-[11px] text-[#4A1D4B] hover:bg-[#F8D7E3]/30 transition-colors flex items-center justify-between"
                >
                  <span>🔑 Super Admin: <strong>admin@comfort.pk</strong></span>
                  <span className="text-[10px] uppercase font-bold text-[#D681A7]">Fill</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickCustomer}
                  className="w-full py-2 px-3 bg-[#FAF7F5] border border-[#E8DED8] rounded-lg text-left text-[11px] text-[#5C4D58] hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span>👤 Customer: <strong>ayesha.malik@gmail.com</strong></span>
                  <span className="text-[10px] uppercase font-bold text-[#A98DA6]">Fill</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            {regError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {regError}
              </div>
            )}

            <div>
              <label className="font-semibold text-[#1F171E] block mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Mahira Khan"
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                />
                <UserIcon className="w-3.5 h-3.5 text-[#A98DA6] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#1F171E] block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="mahira@example.com"
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1F171E] block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#1F171E] block mb-1">Password *</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#1F171E] block mb-1">Shipping Street Address</label>
              <input
                type="text"
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="House / Apartment / Street"
                className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#1F171E] block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Lahore"
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#1F171E] block mb-1">Province</label>
                <select
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital">Islamabad</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={regLoading}
              className="w-full py-3 bg-[#4A1D4B] hover:bg-[#361437] text-white font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md mt-2"
            >
              {regLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
