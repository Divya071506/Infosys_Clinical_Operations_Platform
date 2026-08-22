import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const PatientProfile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getCurrentUser();
        if (response?.data) {
          setProfile(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve patient profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Retrieving patient profile details..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>Patient Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Patient Profile Details
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Your registered personal demographic information and contact records.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="warm-card p-6 sm:p-8 border border-slate-200 bg-white space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-warm">
            {profile?.fullName?.charAt(0) || 'P'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{profile?.fullName}</h3>
            <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold mt-1">
              Patient ID: #{profile?.patientId || profile?.userId}
            </span>
            <p className="text-xs text-slate-500 mt-1">{profile?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" /> Email Address
            </span>
            <p className="font-semibold text-slate-900 text-sm">{profile?.email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <Phone className="w-3 h-3 text-teal-600" /> Phone Number
            </span>
            <p className="font-mono font-semibold text-slate-900 text-sm">{profile?.phone || 'Not specified'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-600" /> Date of Birth
            </span>
            <p className="font-semibold text-slate-900 text-sm">{profile?.dateOfBirth || 'Not specified'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <User className="w-3 h-3 text-purple-600" /> Gender
            </span>
            <p className="font-semibold text-slate-900 text-sm">{profile?.gender || 'Not specified'}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-500" /> Residential Address
          </span>
          <p className="font-semibold text-slate-900 text-sm leading-relaxed">
            {profile?.address || 'Not specified'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
