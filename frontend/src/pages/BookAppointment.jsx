import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  CalendarPlus, 
  Stethoscope, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  UserCheck
} from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM',
  '05:00 PM'
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    location.state?.preselectedDoctorId ? String(location.state.preselectedDoctorId) : ''
  );
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const [doctorSearch, setDoctorSearch] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await doctorService.getActiveDoctors();
        if (response?.data) {
          setDoctors(response.data);
          if (!selectedDoctorId && response.data.length > 0) {
            setSelectedDoctorId(String(response.data[0].id));
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve active clinicians.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

    const today = new Date().toISOString().split('T')[0];
    setAppointmentDate(today);
  }, []);

  const selectedDoctor = doctors.find((d) => String(d.id) === String(selectedDoctorId));

  const filteredDoctors = doctors.filter((doc) => {
    const q = doctorSearch.toLowerCase();
    return (
      doc.name?.toLowerCase().includes(q) ||
      doc.specialization?.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !appointmentDate || !appointmentTime || !reason.trim()) {
      setError('Please fill in all mandatory booking fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        doctorId: Number(selectedDoctorId),
        appointmentDate,
        appointmentTime,
        reason: reason.trim(),
        notes: notes.trim() || null,
      };

      await appointmentService.bookAppointment(payload);
      navigate('/patient/appointments', {
        state: { message: 'Appointment booked successfully! Your doctor will review and confirm your slot.' }
      });
    } catch (err) {
      setError(err.message || 'Failed to book appointment. Please choose a different slot.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing clinical booking portal..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
          <CalendarPlus className="w-4 h-4" />
          <span>Patient Appointment Booking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Schedule Clinical Consultation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select a specialist physician, choose an open date and time slot, and reserve your visit.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Doctor Selection */}
        <div className="warm-card p-6 border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-700 uppercase tracking-wider">
              <UserCheck className="w-4 h-4" />
              <span>Step 1: Choose Specialist Doctor</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {doctors.length} Doctors Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredDoctors.map((doc) => {
              const isSelected = String(doc.id) === String(selectedDoctorId);
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctorId(String(doc.id))}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-warm'
                      : 'bg-slate-50/60 border-slate-200 hover:border-amber-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{doc.name}</h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-amber-600 font-bold">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500 truncate">{doc.qualification}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{doc.availableDays}</span>
                    <span className="font-mono font-extrabold text-slate-900">${Number(doc.consultationFee).toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Date & Time Slot Selection */}
        <div className="warm-card p-6 border border-slate-200 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-teal-700 uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Step 2: Select Date & Time Slot</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Consultation Date *
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                className="clean-input w-full text-sm"
              />
              <p className="mt-1.5 text-[11px] text-slate-500">
                Doctor availability: {selectedDoctor ? selectedDoctor.availableDays : 'Check schedule'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Select Open Time Slot *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = appointmentTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setAppointmentTime(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Reason & Notes */}
        <div className="warm-card p-6 border border-slate-200 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-purple-700 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Step 3: Consultation Reason & Symptoms</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Primary Reason for Visit *
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Chronic migraine evaluation, routine cardiac follow-up"
                required
                className="clean-input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Additional Notes / Medical History (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="List any ongoing medications or specific symptoms you would like the doctor to know..."
                className="clean-input w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Summary & Submit */}
        {selectedDoctor && (
          <div className="warm-card p-6 border border-amber-300 bg-amber-50/50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-warm">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Booking Review</span>
              <p className="text-sm font-bold text-slate-900">
                {selectedDoctor.name} ({selectedDoctor.specialization})
              </p>
              <p className="text-xs text-slate-700 font-mono">
                {appointmentDate || 'Date not selected'} @ {appointmentTime || 'Time not selected'}
              </p>
              <p className="text-xs text-slate-600">
                Estimated Consultation Fee: <span className="text-slate-900 font-mono font-bold">${Number(selectedDoctor.consultationFee).toFixed(2)}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-warm-secondary w-full sm:w-auto text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-warm-primary w-full sm:w-auto text-sm !py-3 !px-6 whitespace-nowrap shadow-warm"
              >
                {submitting ? 'Confirming with MySQL...' : 'Confirm Appointment'}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookAppointment;
