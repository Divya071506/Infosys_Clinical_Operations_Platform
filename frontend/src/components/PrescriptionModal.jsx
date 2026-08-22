import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  Stethoscope, 
  User, 
  Calendar, 
  Pill,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import Modal from './Modal';
import { prescriptionService } from '../services/prescriptionService';

const PrescriptionModal = ({
  isOpen,
  onClose,
  appointment,
  existingPrescription = null,
  isDoctor = false,
  onSuccess = null
}) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [medicines, setMedicines] = useState([
    { medicineName: '', dosage: '', frequency: '1-0-1 (Twice daily)', duration: '5 Days', instructions: 'After meals' }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const prescription = existingPrescription;

  const handleAddMedicineRow = () => {
    setMedicines([
      ...medicines,
      { medicineName: '', dosage: '', frequency: '1-0-1 (Twice daily)', duration: '5 Days', instructions: 'After meals' }
    ]);
  };

  const handleRemoveMedicineRow = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setError('Please provide a medical diagnosis.');
      return;
    }

    const validMeds = medicines.filter((m) => m.medicineName.trim() !== '');
    if (validMeds.length === 0) {
      setError('Please add at least one medication to the prescription.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        appointmentId: appointment.id,
        diagnosis: diagnosis.trim(),
        medicineList: validMeds,
        advice: advice.trim() || null
      };

      await prescriptionService.createPrescription(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to issue prescription.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={prescription ? "Official Digital Prescription" : "Issue Digital Prescription"}
      maxWidth="max-w-3xl"
    >
      {/* If viewing existing prescription */}
      {prescription ? (
        <div id="printable-prescription" className="space-y-6 text-slate-800">
          {/* Prescription Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-xl shadow-sm">
                Rx
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-slate-900">Infosys Clinical Operations Platform</h4>
                <p className="text-xs text-slate-500">Official Clinical Consultation Record</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-semibold text-slate-800">Date: {prescription.prescribedDate}</p>
              <p className="font-mono text-amber-600">Rx ID: #{prescription.id}</p>
            </div>
          </div>

          {/* Doctor & Patient Information Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider block">Prescribing Physician</span>
              <p className="font-bold text-sm text-slate-900">{prescription.doctorName}</p>
              <p className="text-amber-700 font-medium">{prescription.doctorSpecialization}</p>
              <p className="text-slate-500">{prescription.doctorQualification}</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider block">Patient Details</span>
              <p className="font-bold text-sm text-slate-900">{prescription.patientName}</p>
              <p className="text-slate-600">Gender: {prescription.patientGender} | DOB: {prescription.patientDob}</p>
              <p className="text-slate-500">Phone: {prescription.patientPhone}</p>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Clinical Diagnosis</span>
            <p className="font-semibold text-slate-900 text-sm">{prescription.diagnosis}</p>
          </div>

          {/* Medication List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Prescribed Medications</span>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Medicine Name</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescription.medicineList && prescription.medicineList.length > 0 ? (
                    prescription.medicineList.map((med, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{med.medicineName}</td>
                        <td className="p-3 font-mono text-slate-700">{med.dosage}</td>
                        <td className="p-3 text-slate-700">{med.frequency}</td>
                        <td className="p-3 text-slate-700">{med.duration}</td>
                        <td className="p-3 text-amber-700 font-medium">{med.instructions}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-3 text-slate-400 text-center">
                        {prescription.rawMedicines || "No structured medicines recorded."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advice / Doctor Notes */}
          {prescription.advice && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Physician Advice & Lifestyle Notes</span>
              <p className="text-slate-700 leading-relaxed">{prescription.advice}</p>
            </div>
          )}

          {/* Doctor Signature Block */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-400 italic">
              Electronically verified digital prescription via ICOP Clinical Operations.
            </div>
            <div className="text-right">
              <div className="font-serif italic text-base text-slate-900 font-bold">{prescription.doctorName}</div>
              <p className="text-[10px] text-slate-500 font-mono">Digital Signature Verified</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={handlePrint} className="btn-warm-secondary text-xs !py-2 !px-4 flex items-center gap-1.5">
              <Printer className="w-4 h-4" />
              Print Prescription
            </button>
            <button onClick={onClose} className="btn-warm-primary text-xs !py-2 !px-5">
              Close
            </button>
          </div>
        </div>
      ) : (
        /* Form for Doctor to issue prescription */
        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Patient Overview */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 text-xs flex items-center justify-between">
            <div>
              <span className="text-amber-900 font-bold">Patient:</span> <span className="font-semibold text-slate-900">{appointment?.patientName}</span>
              <span className="text-slate-500 ml-2">({appointment?.patientPhone})</span>
            </div>
            <div>
              <span className="text-amber-900 font-bold">Appointment:</span> <span className="font-mono text-slate-700">#{appointment?.id}</span>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Medical Diagnosis *
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Bronchitis / Stage 1 Hypertension"
              required
              className="clean-input w-full text-sm"
            />
          </div>

          {/* Medications Form Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Prescribed Medications
              </label>
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medicine
              </button>
            </div>

            <div className="space-y-2.5">
              {medicines.map((med, index) => (
                <div key={index} className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={med.medicineName}
                    onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                    required
                    className="clean-input sm:col-span-2 text-xs !py-1.5 !px-2.5"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 500mg)"
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    className="clean-input text-xs !py-1.5 !px-2.5"
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g. 1-0-1)"
                    value={med.frequency}
                    onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                    className="clean-input text-xs !py-1.5 !px-2.5"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      className="clean-input flex-1 text-xs !py-1.5 !px-2.5"
                    />
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(index)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Remove Medicine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice / Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Doctor Advice & Dietary/Lifestyle Recommendations
            </label>
            <textarea
              rows={3}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="e.g. Drink plenty of water, avoid spicy food, follow up in 1 week..."
              className="clean-input w-full text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="btn-warm-secondary text-sm">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-warm-primary text-sm !py-2.5 !px-6">
              {submitting ? 'Saving Prescription...' : 'Issue Prescription'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default PrescriptionModal;
