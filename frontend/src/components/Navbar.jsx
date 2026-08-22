import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  LogOut, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Stethoscope,
  Calendar,
  ChevronDown,
  FileText
} from 'lucide-react';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout, isAdmin, isPatient, isDoctor } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-100/80 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Brand */}
          <div className="flex items-center gap-4">
            {isAuthenticated && toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Toggle Navigation"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-extrabold shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-wider text-xl text-slate-900 group-hover:text-amber-600 transition-colors">
                    MediCare
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    ICOP
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 hidden sm:inline font-medium">
                  Infosys Clinical Operations Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links for Public Pages (Matching Reference Image Header) */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
              <Link to="/" className="hover:text-amber-600 transition-colors">
                Home
              </Link>
              <a href="#services" className="hover:text-amber-600 transition-colors">
                Services
              </a>
              <a href="#about" className="hover:text-amber-600 transition-colors">
                About us
              </a>
              <a href="#contact" className="hover:text-amber-600 transition-colors">
                Contact
              </a>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 p-1.5 pl-3 rounded-full bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all focus:outline-none shadow-sm"
                >
                  <div className="flex flex-col text-right hidden sm:block">
                    <span className="text-xs font-bold text-slate-900">{user?.fullName}</span>
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">{user?.role}</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{user?.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-500" />
                          Admin Console
                        </Link>
                      )}

                      {isDoctor && (
                        <>
                          <Link
                            to="/doctor/dashboard"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            <Stethoscope className="w-4 h-4 text-amber-500" />
                            Doctor Console
                          </Link>
                          <Link
                            to="/doctor/appointments"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            <Calendar className="w-4 h-4 text-teal-600" />
                            Consultation Queue
                          </Link>
                          <Link
                            to="/doctor/prescriptions"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            <FileText className="w-4 h-4 text-purple-600" />
                            Digital Prescriptions
                          </Link>
                        </>
                      )}

                      {isPatient && (
                        <>
                          <Link
                            to="/patient/dashboard"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            <Activity className="w-4 h-4 text-amber-500" />
                            Patient Dashboard
                          </Link>
                          <Link
                            to="/patient/appointments"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            <Calendar className="w-4 h-4 text-teal-600" />
                            My Appointments
                          </Link>
                          <Link
                            to="/patient/profile"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            <User className="w-4 h-4 text-purple-600" />
                            My Profile
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Reference Image "Sign In" rounded pill button */}
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-full font-bold text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-xs"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
