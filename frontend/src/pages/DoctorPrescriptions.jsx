import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../services/prescriptionService';
import LoadingSpinner from '../components/LoadingSpinner';
import PrescriptionModal from '../components/PrescriptionModal';
import { 
  FileText, 
  Calendar, 
  User, 
  Eye, 
  Printer, 
  RefreshCw,
  Search,
  Pill
} from 'lucide-react';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await prescriptionService.getMyDoctorPrescriptions();
      if (response?.data) {
        setPrescriptions(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve digital prescription archive.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const filtered = prescriptions.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.patientName?.toLowerCase().includes(q) ||
      p.diagnosis?.toLowerCase().includes(q) ||
      p.patientPhone?.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Digital Pharmacy & Rx</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Issued Digital Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Historical repository of clinical diagnoses, medication regimens, and patient instructions.
          </p>
        </div>

        <button onClick={fetchPrescriptions} className="btn-warm-secondary text-xs !py-2 !px-3.5 self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by patient name, diagnosis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="clean-input w-full pl-10 text-sm"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading digital prescription records..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="p-4">Rx ID</th>
                <th className="p-4">Date Issued</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Diagnosis</th>
                <th className="p-4">Medications Count</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No digital prescriptions found.
                  </td>
                </tr>
              ) : (
                filtered.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-600">
                      #{rx.id}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{rx.prescribedDate}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Apt #{rx.appointmentId}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{rx.patientName}</div>
                      <div className="text-slate-500">{rx.patientPhone}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      {rx.diagnosis}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                        <Pill className="w-3 h-3" />
                        {rx.medicineList ? rx.medicineList.length : 0} Medicines
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedPrescription(rx)}
                        className="btn-warm-primary text-xs !py-1.5 !px-3 shadow-sm flex items-center gap-1 inline-flex"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View / Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedPrescription && (
        <PrescriptionModal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          appointment={null}
          existingPrescription={selectedPrescription}
          isDoctor={true}
        />
      )}
    </div>
  );
};

export default DoctorPrescriptions;
