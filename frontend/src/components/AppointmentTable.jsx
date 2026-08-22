import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  CheckCheck, 
  Eye, 
  SlidersHorizontal, 
  Trash2,
  FileText
} from 'lucide-react';
import Modal from './Modal';
import PrescriptionModal from './PrescriptionModal';
import { prescriptionService } from '../services/prescriptionService';

const AppointmentTable = ({
  appointments = [],
  onUpdateStatus,
  onCancel,
  onDelete,
  isAdmin = false
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusModalAppointment, setStatusModalAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState('CONFIRMED');
  const [statusNotes, setStatusNotes] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [viewPrescription, setViewPrescription] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="badge-pending">
            <AlertCircle className="w-3.5 h-3.5" /> PENDING
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="badge-confirmed">
            <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="badge-completed">
            <CheckCheck className="w-3.5 h-3.5" /> COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge-cancelled">
            <XCircle className="w-3.5 h-3.5" /> CANCELLED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (statusModalAppointment && onUpdateStatus) {
      onUpdateStatus(statusModalAppointment.id, newStatus, statusNotes);
      setStatusModalAppointment(null);
      setStatusNotes('');
    }
  };

  const handleFetchPrescription = async (appointmentId) => {
    try {
      const response = await prescriptionService.getPrescriptionByAppointment(appointmentId);
      if (response?.data) {
        setViewPrescription(response.data);
      }
    } catch {
      alert("No digital prescription has been issued yet for this appointment.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200 uppercase text-[11px]">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Schedule</th>
              {isAdmin && <th className="p-4">Patient</th>}
              <th className="p-4">Doctor & Specialty</th>
              <th className="p-4">Consultation Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="p-8 text-center text-slate-400">
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="p-4 font-mono font-bold text-amber-600">
                    #{apt.id}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      {apt.appointmentDate}
                    </div>
                    <div className="text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {apt.appointmentTime}
                    </div>
                  </td>

                  {isAdmin && (
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-slate-500">{apt.patientPhone}</div>
                    </td>
                  )}

                  <td className="p-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      {apt.doctorName}
                    </div>
                    <span className="text-[11px] text-amber-600 font-medium">
                      {apt.doctorSpecialization}
                    </span>
                  </td>

                  <td className="p-4 max-w-xs truncate font-medium text-slate-800">
                    <span className="truncate block" title={apt.reason}>{apt.reason}</span>
                  </td>

                  <td className="p-4">
                    {getStatusBadge(apt.status)}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Details */}
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* View Prescription Button if Completed */}
                      {apt.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleFetchPrescription(apt.id)}
                          className="btn-warm-outline text-[11px] !py-1 !px-2.5 flex items-center gap-1"
                          title="View Digital Prescription"
                        >
                          <FileText className="w-3 h-3" />
                          Prescription
                        </button>
                      )}

                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => {
                              setStatusModalAppointment(apt);
                              setNewStatus(apt.status);
                              setStatusNotes(apt.notes || '');
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
                            title="Update Status"
                          >
                            <SlidersHorizontal className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(apt.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete Appointment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => onCancel(apt.id)}
                            className="btn-danger text-[11px] !py-1 !px-2.5"
                            title="Cancel Appointment"
                          >
                            Cancel
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Consultation Details"
      >
        {selectedAppointment && (
          <div className="space-y-6 text-sm text-slate-800">
            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <div>
                <span className="text-xs font-mono text-amber-700 font-bold block">Appointment ID: #{selectedAppointment.id}</span>
                <span className="text-xs text-slate-500">
                  Date: {selectedAppointment.appointmentDate} @ {selectedAppointment.appointmentTime}
                </span>
              </div>
              <div>{getStatusBadge(selectedAppointment.status)}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Physician</span>
                <p className="font-bold text-slate-900 mt-1">{selectedAppointment.doctorName}</p>
                <p className="text-xs text-amber-600 font-medium">{selectedAppointment.doctorSpecialization}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Patient</span>
                <p className="font-bold text-slate-900 mt-1">{selectedAppointment.patientName}</p>
                <p className="text-xs text-slate-500">{selectedAppointment.patientPhone}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Reason for Consultation</span>
              <p className="text-slate-800 mt-1">{selectedAppointment.reason}</p>
            </div>

            {selectedAppointment.notes && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Clinical Notes</span>
                <p className="text-slate-700 mt-1 text-xs">{selectedAppointment.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {selectedAppointment.status === 'COMPLETED' && (
                <button
                  onClick={() => {
                    handleFetchPrescription(selectedAppointment.id);
                    setSelectedAppointment(null);
                  }}
                  className="btn-warm-primary text-xs !py-2 !px-4 flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  View Digital Prescription
                </button>
              )}
              <button
                onClick={() => setSelectedAppointment(null)}
                className="btn-warm-secondary text-xs !py-2 !px-4"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Admin Update Status Modal */}
      <Modal
        isOpen={!!statusModalAppointment}
        onClose={() => setStatusModalAppointment(null)}
        title="Update Clinical Status"
        maxWidth="max-w-md"
      >
        {statusModalAppointment && (
          <form onSubmit={handleStatusSubmit} className="space-y-4 text-slate-800">
            <p className="text-xs text-slate-500">
              Updating status for appointment <span className="font-mono font-bold text-amber-600">#{statusModalAppointment.id}</span>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="clean-input w-full text-sm"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Clinical Operational Notes
              </label>
              <textarea
                rows={3}
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Enter updates or consultation instructions..."
                className="clean-input w-full text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStatusModalAppointment(null)}
                className="btn-warm-secondary text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-warm-primary text-xs">
                Save Status
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* View Digital Prescription Modal */}
      {viewPrescription && (
        <PrescriptionModal
          isOpen={!!viewPrescription}
          onClose={() => setViewPrescription(null)}
          appointment={null}
          existingPrescription={viewPrescription}
          isDoctor={false}
        />
      )}
    </div>
  );
};

export default AppointmentTable;
