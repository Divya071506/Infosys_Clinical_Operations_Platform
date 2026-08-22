import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import DoctorCard from '../components/DoctorCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: 5,
    availableDays: 'Monday - Friday',
    consultationFee: 150.00,
    active: true,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await doctorService.getAllDoctors();
      if (response?.data) {
        setDoctors(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load doctor directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const specialties = ['All', ...new Set(doctors.map((d) => d.specialization).filter(Boolean))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialization === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const handleOpenAddModal = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      qualification: '',
      experience: 5,
      availableDays: 'Mon, Tue, Wed, Thu, Fri',
      consultationFee: 150.00,
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      availableDays: doctor.availableDays,
      consultationFee: doctor.consultationFee,
      active: doctor.active,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError('');

    try {
      if (editingDoctor) {
        await doctorService.updateDoctor(editingDoctor.id, formData);
        setSuccess('Doctor credentials and schedule updated.');
      } else {
        await doctorService.createDoctor(formData);
        setSuccess('New specialist doctor registered.');
      }
      setModalOpen(false);
      fetchDoctors();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Operation failed.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor from the registry?')) return;
    try {
      await doctorService.deleteDoctor(id);
      setSuccess('Doctor removed successfully.');
      fetchDoctors();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete doctor.');
    }
  };

  if (loading && doctors.length === 0) {
    return <LoadingSpinner text="Loading clinicians from MySQL database..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Clinical Specialists</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Doctor Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Maintain specialist rosters, available consultation windows, and consultation fees.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn-warm-primary text-xs !py-2.5 !px-4 shadow-sm">
          <Plus className="w-4 h-4" />
          Add New Doctor
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="clean-input w-full pl-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteDoctor}
            isAdmin={true}
          />
        ))}
      </div>

      {/* Add / Edit Doctor Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDoctor ? `Edit Doctor: ${editingDoctor.name}` : 'Add New Clinical Specialist'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-sm text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Doctor Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="e.g. Dr. Sarah Jenkins"
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
                placeholder="doctor@icop.com"
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
                placeholder="+1 (555) 000-0000"
                required
                className="clean-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Specialization *
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleFormChange}
                placeholder="e.g. Cardiology, Neurology"
                required
                className="clean-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Experience (Years) *
              </label>
              <input
                type="number"
                name="experience"
                min="0"
                value={formData.experience}
                onChange={handleFormChange}
                required
                className="clean-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Medical Qualification *
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleFormChange}
              placeholder="e.g. MD, FACC - Harvard Medical"
              required
              className="clean-input w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Available Days *
              </label>
              <input
                type="text"
                name="availableDays"
                value={formData.availableDays}
                onChange={handleFormChange}
                placeholder="e.g. Mon, Wed, Fri"
                required
                className="clean-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Consultation Fee ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleFormChange}
                required
                className="clean-input w-full font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleFormChange}
              className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="active" className="text-xs text-slate-700 font-semibold">
              Active for Booking (clinician currently taking appointments)
            </label>
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
              {formSubmitting ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Create Doctor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Doctors;
