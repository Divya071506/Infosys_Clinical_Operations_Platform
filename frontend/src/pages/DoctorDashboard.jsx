import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { prescriptionService } from '../services/prescriptionService';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PrescriptionModal from '../components/PrescriptionModal';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Users, 
  RefreshCw, 
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState(null);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      setError('');
      const [aptRes, rxRes] = await Promise.all([
        appointmentService.getMyDoctorAppointments(),
        prescriptionService.getMyDoctorPrescriptions()
      ]);
      if (aptRes?.data) setAppointments(aptRes.data);
      if (rxRes?.data) setPrescriptions(rxRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load clinician dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, status);
      fetchDoctorData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const pendingAppointments = appointments.filter((a) => a.status === 'PENDING');
  const confirmedAppointments = appointments.filter((a) => a.status === 'CONFIRMED');
  const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED');

  if (loading) {
    return <LoadingSpinner text="Retrieving clinical appointment queue..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="warm-card p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-teal-500/10 border border-amber-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-sm">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Consultation Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good day, <span className="text-amber-600">{user?.fullName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
              Manage patient consultation queues, approve booking requests, and issue verifiable digital prescriptions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDoctorData}
              className="btn-warm-secondary text-xs !py-2.5 !px-4 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <Link
              to="/doctor/appointments"
              className="btn-warm-primary text-xs !py-2.5 !px-5 shadow-warm flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              Manage All Appointments
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardCard
          title="Total Assigned"
          value={appointments.length}
          subtitle="All-time patient consultations"
          icon={Calendar}
          color="blue"
        />
        <DashboardCard
          title="Pending Triage"
          value={pendingAppointments.length}
          subtitle="Requests awaiting your review"
          icon={Clock}
          color="amber"
        />
        <DashboardCard
          title="Confirmed Queue"
          value={confirmedAppointments.length}
          subtitle="Ready for clinical session"
          icon={CheckCircle2}
          color="emerald"
        />
        <DashboardCard
          title="Prescriptions Issued"
          value={prescriptions.length}
          subtitle="Digital prescriptions generated"
          icon={FileText}
          color="purple"
        />
      </div>

      {/* Pending Triage Requests */}
      {pendingAppointments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              Pending Patient Booking Requests ({pendingAppointments.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingAppointments.map((apt) => (
              <div key={apt.id} className="warm-card p-5 border-amber-200 bg-white space-y-4 shadow-sm hover:shadow-warm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                      {apt.patientName?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{apt.patientName}</h4>
                      <span className="text-xs text-slate-500">{apt.patientPhone}</span>
                    </div>
                  </div>
                  <span className="badge-pending">PENDING</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 text-xs space-y-1">
                  <p className="font-semibold text-slate-800">
                    📅 {apt.appointmentDate} @ {apt.appointmentTime}
                  </p>
                  <p className="text-slate-600 italic">"{apt.reason}"</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                    className="btn-danger text-xs !py-1.5 !px-3"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                    className="btn-warm-primary text-xs !py-1.5 !px-4"
                  >
                    Accept & Confirm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's / Active Consultation Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Active Consultation Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Upcoming confirmed sessions & digital prescription generation
            </p>
          </div>
          <Link
            to="/doctor/appointments"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            View Full Queue
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-4">Schedule</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Consultation Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No appointments assigned to your clinical schedule.
                  </td>
                </tr>
              ) : (
                appointments.slice(0, 6).map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{apt.appointmentDate}</div>
                      <div className="text-slate-500 font-mono">{apt.appointmentTime}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-slate-500">{apt.patientPhone}</div>
                    </td>
                    <td className="p-4 max-w-xs truncate">{apt.reason}</td>
                    <td className="p-4">
                      <span className={
                        apt.status === 'CONFIRMED' ? 'badge-confirmed' :
                        apt.status === 'COMPLETED' ? 'badge-completed' :
                        apt.status === 'PENDING' ? 'badge-pending' : 'badge-cancelled'
                      }>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {apt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => setSelectedAppointmentForRx(apt)}
                            className="btn-warm-primary text-xs !py-1.5 !px-3 shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Issue Prescription
                          </button>
                        )}
                        {apt.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                            className="btn-warm-primary text-xs !py-1.5 !px-3"
                          >
                            Confirm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Modal */}
      {selectedAppointmentForRx && (
        <PrescriptionModal
          isOpen={!!selectedAppointmentForRx}
          onClose={() => setSelectedAppointmentForRx(null)}
          appointment={selectedAppointmentForRx}
          isDoctor={true}
          onSuccess={fetchDoctorData}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
