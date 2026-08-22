import React from 'react';
import { 
  Stethoscope, 
  Award, 
  Calendar, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  CalendarPlus,
  CheckCircle,
  XCircle
} from 'lucide-react';

const DoctorCard = ({
  doctor,
  onEdit,
  onDelete,
  onBook,
  isAdmin = false
}) => {
  return (
    <div className="warm-card p-5 flex flex-col justify-between border border-slate-200/80 hover:border-amber-300 transition-all duration-300 group hover:shadow-warm bg-white">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {doctor.name}
              </h4>
              <span className="inline-block text-xs font-bold px-2.5 py-0.5 mt-0.5 rounded-full bg-amber-100 text-amber-800">
                {doctor.specialization}
              </span>
            </div>
          </div>

          <div>
            {doctor.active ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                <CheckCircle className="w-3 h-3" /> Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                <XCircle className="w-3 h-3" /> Off Duty
              </span>
            )}
          </div>
        </div>

        {/* Qualification & Experience */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-bold text-slate-800 truncate">{doctor.qualification}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Experience:</span>
            <span className="font-bold text-slate-900">{doctor.experience} Years</span>
          </div>
        </div>

        {/* Available Days & Contacts */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate font-medium">{doctor.availableDays}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{doctor.phone}</span>
          </div>
        </div>
      </div>

      {/* Footer with Fee and Action */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fee</span>
          <span className="text-lg font-extrabold font-mono text-slate-900">
            ${Number(doctor.consultationFee).toFixed(2)}
          </span>
        </div>

        <div>
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit(doctor)}
                className="p-2 rounded-xl text-slate-500 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 transition-all"
                title="Edit Doctor Profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(doctor.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all"
                title="Delete Doctor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onBook(doctor)}
              disabled={!doctor.active}
              className="btn-warm-primary text-xs !py-2 !px-4 flex items-center gap-1.5 shadow-sm"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              Book Visit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
