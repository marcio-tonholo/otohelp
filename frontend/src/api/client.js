import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar token ao header de cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Mentor endpoints
export const mentorAPI = {
  getAllMentors: (params) => api.get('/mentors', { params }),
  getMentorById: (id) => api.get(`/mentors/${id}`),
  updateMentorProfile: (data) => api.put('/mentors/profile', data),
  getMentorDashboard: () => api.get('/mentors/dashboard'),
  getMentorProcedures: (id) => api.get(`/mentors/${id}/procedures`),
};

// Student endpoints
export const studentAPI = {
  getStudentProfile: () => api.get('/students/profile'),
  updateStudentProfile: (data) => api.put('/students/profile', data),
  getStudentDashboard: () => api.get('/students/dashboard'),
  getStudentBookingHistory: (params) =>
    api.get('/students/booking-history', { params }),
};

// Experience endpoints
export const experienceAPI = {
  getAllExperiences: (params) => api.get('/experiences', { params }),
  getExperienceById: (id) => api.get(`/experiences/${id}`),
  createExperience: (data) => api.post('/experiences', data),
  updateExperience: (id, data) => api.put(`/experiences/${id}`, data),
  deleteExperience: (id) => api.delete(`/experiences/${id}`),
  searchByProcedure: (procedure) =>
    api.get('/experiences/search/procedure', { params: { procedure } }),
  searchByMentor: (mentorId) =>
    api.get('/experiences/search/mentor', { params: { mentorId } }),
};

// Booking endpoints
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getBookings: (params) => api.get('/bookings', { params }),
  approveBooking: (id) => api.put(`/bookings/${id}/approve`),
  rejectBooking: (id) => api.put(`/bookings/${id}/reject`),
  completeBooking: (id, data) => api.put(`/bookings/${id}/complete`, data),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  addStudentReview: (id, data) => api.post(`/bookings/${id}/review`, data),
  getMessages: (bookingId) => api.get(`/bookings/${bookingId}/messages`),
  addMessage: (bookingId, data) =>
    api.post(`/bookings/${bookingId}/messages`, data),
};

// Notification endpoints
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all/as-read'),
};

export default api;
