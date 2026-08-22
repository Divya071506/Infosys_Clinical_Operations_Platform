import api from './api';

export const patientService = {
  getAllPatients: async (search = '') => {
    const params = search ? { search } : {};
    const response = await api.get('/patients', { params });
    return response.data;
  },

  getPatientById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get('/patients/me');
    return response.data;
  },

  createPatient: async (patientData) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  updatePatient: async (id, patientData) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  deletePatient: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  }
};
