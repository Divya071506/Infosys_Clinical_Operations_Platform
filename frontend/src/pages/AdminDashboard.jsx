import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  CheckCheck, 
  XCircle, 
  Plus, 
  ArrowUpRight,
  Activity,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { appointmentService } from '../services/appointmentService';
import DashboardCard from '../components/DashboardCard';
import AppointmentTable from '../components/AppointmentTable';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminService.getDashboardStats();
      if (response?.data) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (appointmentId, status, notes) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, status, notes);
      fetchStats();
    } catch (err) {
      alert(err.message || 'Failed to update appointment status');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await appointmentService.deleteAppointment(appointmentId);
      fetchStats();
    } catch (err) {
      alert(err.message || 'Failed to delete appointment');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching clinical operational telemetry..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Clinical Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time MySQL synchronized telemetry across patients, clinicians, and scheduling queues.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStats}
            className="btn-warm-secondary text-xs !py-2 !px-3"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <Link to="/admin/doctors" className="btn-warm-primary text-xs !py-2 !px-3.5 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            Add Doctor
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          subtitle="Registered in MySQL database"
          icon={Users}
          color="cyan"
        />
        <DashboardCard
          title="Total Doctors"
          value={stats?.totalDoctors || 0}
          subtitle="Specialists & Clinical Staff"
          icon={UserCheck}
          color="blue"
        />
        <DashboardCard
          title="Total Appointments"
          value={stats?.totalAppointments || 0}
          subtitle="Cumulative bookings"
          icon={Calendar}
          color="purple"
        />
        <DashboardCard
          title="Pending Review"
          value={stats?.pendingAppointments || 0}
          subtitle="Awaiting administrative triage"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Appointment Status Breakdown Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard
          title="Confirmed"
          value={stats?.confirmedAppointments || 0}
          subtitle="Ready for clinical consultation"
          icon={CheckCircle2}
          color="emerald"
        />
        <DashboardCard
          title="Completed"
          value={stats?.completedAppointments || 0}
          subtitle="Successfully executed sessions"
          icon={CheckCheck}
          color="cyan"
        />
        <DashboardCard
          title="Cancelled"
          value={stats?.cancelledAppointments || 0}
          subtitle="Withdrawn or rescheduled"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Recent Appointments Table */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-slate-900">
              Recent Clinical Bookings
            </h3>
            <p className="text-xs text-slate-500">
              Latest appointment requests needing status review or confirmation
            </p>
          </div>
          <Link
            to="/admin/appointments"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            View All ({stats?.totalAppointments || 0})
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AppointmentTable
          appointments={stats?.recentAppointments || []}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteAppointment}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
