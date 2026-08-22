import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  CalendarPlus, 
  User, 
  LogOut, 
  Activity,
  ChevronRight,
  Stethoscope,
  FileText
} from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, isAdmin, isPatient, isDoctor, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/patients', label: 'Patients', icon: Users },
    { to: '/admin/doctors', label: 'Doctors', icon: UserCheck },
    { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctor/appointments', label: 'Schedule & Queue', icon: Calendar },
    { to: '/doctor/prescriptions', label: 'Digital Prescriptions', icon: FileText },
  ];

  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patient/book-appointment', label: 'Book Appointment', icon: CalendarPlus },
    { to: '/patient/appointments', label: 'My Appointments', icon: Calendar },
    { to: '/patient/profile', label: 'My Profile', icon: User },
  ];

  const links = isAdmin ? adminLinks : isDoctor ? doctorLinks : patientLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-20 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation items */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Workspace label */}
          <div className="p-3.5 rounded-2xl bg-[#FFF6E9] border border-amber-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
              {isDoctor ? <Stethoscope className="w-3.5 h-3.5 text-amber-600" /> : <Activity className="w-3.5 h-3.5 text-amber-600" />}
              <span>{isAdmin ? 'Admin Workspace' : isDoctor ? 'Doctor Workspace' : 'Patient Portal'}</span>
            </div>
            <p className="mt-1 text-xs font-bold text-slate-900 truncate">
              {user?.fullName}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </p>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) closeSidebar();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
