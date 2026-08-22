import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';

// Doctor Pages
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorPrescriptions from './pages/DoctorPrescriptions';

// Patient Pages
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import PatientProfile from './pages/PatientProfile';

const AppLayout = () => {
  const { isAuthenticated, user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();

  // These pages already handle their own layout/navbar
  const isPublicPage = ['/', '/login', '/register'].includes(
    location.pathname
  );

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">

      {/* =====================================================
          DASHBOARD NAVBAR
          Do NOT show this on Landing/Login/Register
         ===================================================== */}

      {!isPublicPage && (
        <Navbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      )}

      <div className="flex-1 flex">

        {/* =====================================================
            SIDEBAR
            Only authenticated dashboard users
           ===================================================== */}

        {isAuthenticated && !isPublicPage && (
          <Sidebar
            isOpen={isSidebarOpen}
            closeSidebar={closeSidebar}
          />
        )}

        {/* =====================================================
            MAIN CONTENT
           ===================================================== */}

        <main
          className={`flex-1 transition-all duration-300 ${
            isAuthenticated && !isPublicPage
              ? 'lg:ml-64 p-4 sm:p-6 lg:p-8'
              : ''
          }`}
        >

          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}

            <Route
              path="/"
              element={<LandingPage />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* ================= ADMIN ROUTES ================= */}

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/patients"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Patients />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Doctors />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Appointments />
                </ProtectedRoute>
              }
            />


            {/* ================= DOCTOR ROUTES ================= */}

            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <DoctorPrescriptions />
                </ProtectedRoute>
              }
            />


            {/* ================= PATIENT ROUTES ================= */}

            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patient/book-appointment"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patient/profile"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />


            {/* ================= FALLBACK ================= */}

            <Route
              path="*"
              element={
                isAuthenticated ? (
                  user?.role === 'ADMIN' ? (
                    <Navigate
                      to="/admin/dashboard"
                      replace
                    />
                  ) : user?.role === 'DOCTOR' ? (
                    <Navigate
                      to="/doctor/dashboard"
                      replace
                    />
                  ) : (
                    <Navigate
                      to="/patient/dashboard"
                      replace
                    />
                  )
                ) : (
                  <Navigate
                    to="/"
                    replace
                  />
                )
              }
            />

          </Routes>

        </main>
      </div>

      {/* ================= GLOBAL CHATBOT ================= */}

      <Chatbot />

    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
};

export default App;