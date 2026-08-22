import React, { useState } from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  Mail,
  Search,
  Plus
} from 'lucide-react';
import Modal from './Modal';

const PatientTable = ({
  patients = [],
  onEdit,
  onDelete,
  onAddNew,
  isAdmin = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredPatients = patients.filter((patient) => {
    const query = searchTerm.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query) ||
      patient.phone?.includes(query) ||
      patient.address?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Table Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patients by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="clean-input w-full pl-10 text-xs"
          />
        </div>

        {isAdmin && onAddNew && (
          <button onClick={onAddNew} className="btn-warm-primary text-xs whitespace-nowrap !py-2.5 !px-4">
            <Plus className="w-4 h-4" />
            Add New Patient
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200 uppercase text-[11px]">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Patient Details</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Gender / DOB</th>
              <th className="p-4">Address</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No patients match your search criteria.
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-600">
                    #{patient.id}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                        {patient.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {patient.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {patient.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      {patient.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {patient.gender}
                    </span>
                    <div className="text-slate-500 mt-1 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {patient.dateOfBirth}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs truncate">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="truncate">{patient.address}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                        title="View Patient Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(patient)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
                            title="Edit Patient"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(patient.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete Patient"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title="Patient Record Details"
      >
        {selectedPatient && (
          <div className="space-y-6 text-slate-800 text-sm">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white font-bold text-xl flex items-center justify-center shadow-sm">
                {selectedPatient.name?.charAt(0) || 'P'}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h4>
                <p className="text-xs font-mono text-amber-700 font-bold">Patient ID: #{selectedPatient.id}</p>
                <p className="text-xs text-slate-500">{selectedPatient.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Phone Number</span>
                <p className="font-mono text-slate-900 mt-1">{selectedPatient.phone}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Gender</span>
                <p className="text-slate-900 mt-1 font-semibold">{selectedPatient.gender}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Date of Birth</span>
                <p className="text-slate-900 mt-1">{selectedPatient.dateOfBirth}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Registered Date</span>
                <p className="text-slate-900 mt-1">
                  {selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Residential Address</span>
              <p className="text-slate-900 mt-1">{selectedPatient.address}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPatient(null)}
                className="btn-warm-secondary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Patient Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-slate-800 text-sm">
          <p className="text-slate-600">
            Are you sure you want to delete patient record <span className="font-mono font-bold text-amber-600">#{deleteConfirmId}</span>? 
            This will permanently delete their account and history from MySQL.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={() => setDeleteConfirmId(null)} className="btn-warm-secondary text-xs">
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              className="btn-danger text-xs"
            >
              Delete Record
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PatientTable;
