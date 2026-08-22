import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import AppointmentTable from '../components/AppointmentTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, CalendarPlus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

const MyAppointments = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await appointmentService.getMyAppointments();
      if (response?.data) {
        setAppointments(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.cancelAppointment(id);
      setSuccess('Appointment cancelled successfully.');
      fetchMyAppointments();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Consultation History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Appointments & Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track real-time status of your consultations and view digital prescriptions issued by your doctor.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchMyAppointments}
            className="btn-warm-secondary text-xs !py-2 !px-3"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <Link to="/patient/book-appointment" className="btn-warm-primary text-xs !py-2 !px-3.5 shadow-sm">
            <CalendarPlus className="w-4 h-4" />
            Book Visit
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving your consultation history..." />
      ) : (
        <AppointmentTable
          appointments={appointments}
          onCancel={handleCancelAppointment}
          isAdmin={false}
        />
      )}
    </div>
  );
};

export default MyAppointments;
