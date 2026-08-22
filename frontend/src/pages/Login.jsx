import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  Stethoscope,
  HeartPulse,
  User,
  ShieldCheck
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(
    location.state?.message || ''
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFillDemoCredentials = (role) => {
    if (role === 'ADMIN') {
      setFormData({ email: 'admin@icop.com', password: 'Admin@123' });
    } else if (role === 'DOCTOR') {
      setFormData({ email: 'dr.sarah@icop.com', password: 'Doctor@123' });
    } else if (role === 'PATIENT') {
      setFormData({ email: 'john.doe@example.com', password: 'Patient@123' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await login(formData);
      const user = response?.data;
      if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user?.role === 'DOCTOR') {
        navigate('/doctor/dashboard', { replace: true });
      } else {
        navigate('/patient/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FBF9F5]">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-amber-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Presentation Pane */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#FFF6E9] via-[#FDFBF7] to-[#E6F8F6] border-r border-amber-100/80 relative">
          
          {/* Top Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center shadow-md text-white font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-xl text-slate-900">ICOP</span>
              <p className="text-[10px] text-slate-500 font-medium">Infosys Clinical Operations Platform</p>
            </div>
          </Link>

          {/* Center Graphic & Tagline */}
          <div className="my-8 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-warm">
              <HeartPulse className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Our Healthcare Solutions <br />
              <span className="text-amber-600">Meet Every Need.</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              Secure clinician, patient, and operational access to real-time clinical schedules, digital prescriptions, and MySQL synchronized telemetry.
            </p>
          </div>

          {/* Demo Credentials Quick Switcher */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200/80 text-xs space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-amber-800 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Quick Login Switcher
              </span>
              <span className="text-[10px] text-slate-400">Click to autofill</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemoCredentials('DOCTOR')}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-colors"
              >
                <span className="font-bold text-amber-900 block flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" /> Doctor
                </span>
                <span className="text-[10px] text-slate-500 truncate block">dr.sarah@icop.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemoCredentials('PATIENT')}
                className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-left transition-colors"
              >
                <span className="font-bold text-teal-900 block flex items-center gap-1">
                  <User className="w-3 h-3" /> Patient
                </span>
                <span className="text-[10px] text-slate-500 truncate block">john.doe@example.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemoCredentials('ADMIN')}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-colors"
              >
                <span className="font-bold text-purple-900 block flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
                <span className="text-[10px] text-slate-500 truncate block">admin@icop.com</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Welcome Back</h3>
              <p className="mt-1 text-sm text-slate-500">
                Access your clinical operations & healthcare dashboard
              </p>
            </div>

            {/* Notifications */}
            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="clean-input w-full pl-10 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="clean-input w-full pl-10 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-warm-primary w-full text-sm !py-3.5 font-bold mt-2 shadow-warm"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Are you a new patient?{' '}
                <Link to="/register" className="font-bold text-amber-600 hover:text-amber-700 underline underline-offset-4">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
