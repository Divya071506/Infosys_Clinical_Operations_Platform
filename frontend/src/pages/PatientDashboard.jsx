import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import DashboardCard from '../components/DashboardCard';
import DoctorCard from '../components/DoctorCard';
import AppointmentTable from '../components/AppointmentTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Activity, 
  CalendarPlus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  Sparkles
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [aptRes, docRes] = await Promise.all([
        appointmentService.getMyAppointments(),
        doctorService.getActiveDoctors()
      ]);
      if (aptRes?.data) setAppointments(aptRes.data);
      if (docRes?.data) setDoctors(docRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load patient dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.cancelAppointment(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  const handleBookDoctor = (doctor) => {
    navigate('/patient/book-appointment', { state: { preselectedDoctorId: doctor.id } });
  };

  const totalAppointments = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length;

  const upcomingAppointment = appointments.find(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  );

  if (loading) {
    return <LoadingSpinner text="Retrieving your healthcare portal records..." />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="warm-card p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-teal-500/10 border border-amber-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Patient Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-amber-600">{user?.fullName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
              Manage your clinical consultations, view doctor schedules, and track appointment status & digital prescriptions in real-time.
            </p>
          </div>

          <Link
            to="/patient/book-appointment"
            className="btn-warm-primary text-sm !py-3.5 !px-6 shadow-warm flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardCard
          title="Upcoming Visit"
          value={upcomingAppointment ? upcomingAppointment.appointmentDate : 'None'}
          subtitle={upcomingAppointment ? `${upcomingAppointment.doctorName} (${upcomingAppointment.appointmentTime})` : 'No upcoming bookings'}
          icon={Calendar}
          color="cyan"
        />
        <DashboardCard
          title="Total Bookings"
          value={totalAppointments}
          subtitle="All-time appointment history"
          icon={Activity}
          color="blue"
        />
        <DashboardCard
          title="Confirmed"
          value={confirmedCount}
          subtitle="Approved clinical visits"
          icon={CheckCircle2}
          color="emerald"
        />
        <DashboardCard
          title="Pending Review"
          value={pendingCount}
          subtitle="Awaiting doctor/admin confirmation"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Upcoming Spotlight Card */}
      {upcomingAppointment && (
        <div className="warm-card p-6 border border-amber-300 bg-white shadow-warm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Upcoming Consultation Spotlight
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {upcomingAppointment.doctorName} — {upcomingAppointment.doctorSpecialization}
                </h3>
                <p className="text-xs text-slate-600">
                  Scheduled for <span className="font-mono text-slate-900 font-bold">{upcomingAppointment.appointmentDate}</span> at <span className="font-mono text-slate-900 font-bold">{upcomingAppointment.appointmentTime}</span>
                </p>
                <p className="text-xs text-slate-500 italic">
                  Reason: "{upcomingAppointment.reason}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCancelAppointment(upcomingAppointment.id)}
                className="btn-danger text-xs !py-2 !px-4"
              >
                Cancel Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Doctors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Available Specialist Clinicians
            </h3>
            <p className="text-xs text-slate-500">
              Browse top doctors across clinical specialties and schedule a direct consultation
            </p>
          </div>
          <Link
            to="/patient/book-appointment"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            Explore All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 3).map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={handleBookDoctor}
              isAdmin={false}
            />
          ))}
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              My Recent Appointments
            </h3>
            <p className="text-xs text-slate-500">
              Your latest consultation requests and status updates
            </p>
          </div>
          <Link
            to="/patient/appointments"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            View All ({totalAppointments})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AppointmentTable
          appointments={appointments.slice(0, 5)}
          onCancel={handleCancelAppointment}
          isAdmin={false}
        />
      </div>
    </div>
  );
};

export default PatientDashboard;
