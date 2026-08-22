import React, { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import PatientTable from '../components/PatientTable';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    address: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await patientService.getAllPatients();
      if (response?.data) {
        setPatients(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load patients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPatient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: 'Male',
      dateOfBirth: '',
      address: '',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth,
      address: patient.address,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError('');

    try {
      if (editingPatient) {
        await patientService.updatePatient(editingPatient.id, formData);
        setSuccess('Patient record updated successfully.');
      } else {
        await patientService.createPatient(formData);
        setSuccess('New patient registered successfully.');
      }
      setModalOpen(false);
      fetchPatients();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Operation failed.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      await patientService.deletePatient(id);
      setSuccess('Patient record deleted successfully.');
      fetchPatients();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete patient.');
    }
  };

  if (loading && patients.length === 0) {
    return <LoadingSpinner text="Retrieving patient registry from MySQL..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Clinical Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Patient Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, search, register, update, and manage all patient clinical profiles.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn-warm-primary text-xs !py-2.5 !px-4 shadow-sm">
          <Plus className="w-4 h-4" />
          Add New Patient
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

      {/* Patients Table Component */}
      <PatientTable
        patients={patients}
        onEdit={handleOpenEditModal}
        onDelete={handleDeletePatient}
        onAddNew={handleOpenAddModal}
        isAdmin={true}
      />

      {/* Add / Edit Patient Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPatient ? `Edit Patient #${editingPatient.id}` : 'Register New Patient'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-sm text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="e.g. Eleanor Vance"
              required
              className="clean-input w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="patient@example.com"
                required
                className="clean-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="+1 (555) 123-4567"
                required
                className="clean-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleFormChange}
                className="clean-input w-full"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleFormChange}
                required
                className="clean-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Residential Address *
            </label>
            <textarea
              rows={2}
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              placeholder="Street, City, State, ZIP Code"
              required
              className="clean-input w-full"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-warm-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="btn-warm-primary text-xs"
            >
              {formSubmitting ? 'Saving...' : editingPatient ? 'Save Changes' : 'Create Patient'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Patients;
