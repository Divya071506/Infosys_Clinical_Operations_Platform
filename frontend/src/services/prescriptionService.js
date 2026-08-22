import api from './api';

export const prescriptionService = {
  createPrescription: async (prescriptionData) => {
    const response = await api.post('/prescriptions', prescriptionData);
    return response.data;
  },

  getPrescriptionByAppointment: async (appointmentId) => {
    const response = await api.get(`/prescriptions/appointment/${appointmentId}`);
    return response.data;
  },

  getMyPatientPrescriptions: async () => {
    const response = await api.get('/prescriptions/patient/my');
    return response.data;
  },

  getMyDoctorPrescriptions: async () => {
    const response = await api.get('/prescriptions/doctor/my');
    return response.data;
  },

  getPrescriptionsByPatientId: async (patientId) => {
    const response = await api.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  }
};
