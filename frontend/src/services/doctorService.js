import api from './api';

export const doctorService = {
  getAllDoctors: async (search = '', specialization = '') => {
    const params = {};
    if (search) params.search = search;
    if (specialization) params.specialization = specialization;
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  getActiveDoctors: async () => {
    const response = await api.get('/doctors/active');
    return response.data;
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  createDoctor: async (doctorData) => {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  },

  updateDoctor: async (id, doctorData) => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  },

  deleteDoctor: async (id) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  }
};
