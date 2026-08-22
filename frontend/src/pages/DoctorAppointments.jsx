import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { prescriptionService } from '../services/prescriptionService';
import LoadingSpinner from '../components/LoadingSpinner';
import PrescriptionModal from '../components/PrescriptionModal';
import { 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  CheckCheck, 
  RefreshCw, 
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Prescription modal state
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState(null);
  const [viewPrescription, setViewPrescription] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await appointmentService.getMyDoctorAppointments();
      if (response?.data) {
        setAppointments(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve doctor appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status, notes = '') => {
    try {
      await appointmentService.updateAppointmentStatus(id, status, notes);
      setSuccess(`Appointment status changed to ${status}.`);
      fetchAppointments();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    }
  };

  const handleViewPrescription = async (appointmentId) => {
    try {
      const response = await prescriptionService.getPrescriptionByAppointment(appointmentId);
      if (response?.data) {
        setViewPrescription(response.data);
      }
    } catch (err) {
      alert(err.message || 'No prescription found for this appointment.');
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter === 'ALL') return true;
    return apt.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Consultation Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Doctor Appointments & Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Accept pending booking requests, conduct consultations, and issue digital prescriptions.
          </p>
        </div>

        <button onClick={fetchAppointments} className="btn-warm-secondary text-xs !py-2 !px-3.5 self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
        <span className="font-bold text-slate-500 uppercase mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
              statusFilter === tab
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <LoadingSpinner text="Retrieving consultation schedules..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Patient Details</th>
                <th className="p-4">Reason / Notes</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No appointments match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-600">
                      #{apt.id}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{apt.appointmentDate}</div>
                      <div className="text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {apt.appointmentTime}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-slate-500">{apt.patientPhone}</div>
                      <div className="text-[11px] text-slate-400">{apt.patientEmail}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-medium text-slate-800">{apt.reason}</div>
                      {apt.notes && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5">{apt.notes}</div>
                      )}
                    </td>
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
                        {apt.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                              className="btn-warm-primary text-xs !py-1.5 !px-3 shadow-sm"
                            >
                              Accept & Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                              className="btn-danger text-xs !py-1.5 !px-2.5"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {apt.status === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => setSelectedAppointmentForRx(apt)}
                              className="btn-warm-primary text-xs !py-1.5 !px-3 shadow-sm flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Issue Prescription
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                              className="btn-warm-secondary text-xs !py-1.5 !px-3"
                            >
                              Complete Visit
                            </button>
                          </>
                        )}

                        {apt.status === 'COMPLETED' && (
                          <button
                            onClick={() => handleViewPrescription(apt.id)}
                            className="btn-warm-outline text-xs !py-1.5 !px-3 flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Prescription
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
      )}

      {/* Write Prescription Modal */}
      {selectedAppointmentForRx && (
        <PrescriptionModal
          isOpen={!!selectedAppointmentForRx}
          onClose={() => setSelectedAppointmentForRx(null)}
          appointment={selectedAppointmentForRx}
          isDoctor={true}
          onSuccess={fetchAppointments}
        />
      )}

      {/* View Prescription Modal */}
      {viewPrescription && (
        <PrescriptionModal
          isOpen={!!viewPrescription}
          onClose={() => setViewPrescription(null)}
          appointment={null}
          existingPrescription={viewPrescription}
          isDoctor={true}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;
