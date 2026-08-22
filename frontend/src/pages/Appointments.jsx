import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import AppointmentTable from '../components/AppointmentTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Filter, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (doctorFilter) filters.doctorId = doctorFilter;
      if (dateFilter) filters.date = dateFilter;

      const [aptRes, docRes] = await Promise.all([
        appointmentService.getAllAppointments(filters),
        doctorService.getAllDoctors()
      ]);

      if (aptRes?.data) setAppointments(aptRes.data);
      if (docRes?.data) setDoctors(docRes.data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve appointments from MySQL.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, doctorFilter, dateFilter]);

  const handleUpdateStatus = async (id, status, notes) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status, notes);
      setSuccess('Appointment status updated successfully in MySQL database.');
      fetchAppointments();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await appointmentService.deleteAppointment(id);
      setSuccess('Appointment record deleted.');
      fetchAppointments();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete appointment.');
    }
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setDoctorFilter('');
    setDateFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Master Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Clinical Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor schedules, confirm pending slots, record consultation notes, and resolve booking conflicts.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          className="btn-warm-secondary text-xs !py-2.5 !px-3.5 self-start sm:self-auto"
        >
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

      {/* Filter Controls Bar */}
      <div className="warm-card p-4 border border-slate-200 flex flex-wrap items-center gap-3 bg-white">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Filter className="w-3.5 h-3.5 text-amber-600" />
          <span>Filters:</span>
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="clean-input text-xs !py-1.5 !px-3"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        {/* Doctor Dropdown */}
        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="clean-input text-xs !py-1.5 !px-3 max-w-xs"
        >
          <option value="">All Specialists</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} ({doc.specialization})
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="clean-input text-xs !py-1.5 !px-3"
        />

        {(statusFilter || doctorFilter || dateFilter) && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Appointments Table */}
      {loading ? (
        <LoadingSpinner text="Querying appointment schedules..." />
      ) : (
        <AppointmentTable
          appointments={appointments}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteAppointment}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default Appointments;
