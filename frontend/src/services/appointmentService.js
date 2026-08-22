import api from './api';

export const appointmentService = {
  getAllAppointments: async (filters = {}) => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.doctorId) params.doctorId = filters.doctorId;
    if (filters.date) params.date = filters.date;
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  getMyAppointments: async () => {
    const response = await api.get('/appointments/my');
    return response.data;
  },

  getMyDoctorAppointments: async () => {
    const response = await api.get('/appointments/doctor/my');
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  updateAppointmentStatus: async (id, status, notes = '') => {
    const response = await api.put(`/appointments/${id}/status`, { status, notes });
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};
