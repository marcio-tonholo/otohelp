import { create } from 'zustand';
import { experienceAPI, bookingAPI } from '../api/client';

export const useExperienceStore = create((set) => ({
  experiences: [],
  selectedExperience: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 12,
    pages: 1,
  },
  filters: {
    procedure: '',
    type: '',
    minComplexity: '',
    maxPrice: '',
    city: '',
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  fetchExperiences: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await experienceAPI.getAllExperiences(params);
      set({
        experiences: response.data.data,
        pagination: response.data.pagination || {
          total: 0,
          page: params.page || 1,
          limit: params.limit || 12,
          pages: 1,
        },
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erro ao carregar experiências',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchExperienceById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await experienceAPI.getExperienceById(id);
      set({
        selectedExperience: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  searchByProcedure: async (procedure, params) => {
    set({ isLoading: true });
    try {
      const response = await experienceAPI.searchByProcedure(procedure, params);
      set({
        experiences: response.data.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  searchByMentor: async (mentorId, params) => {
    set({ isLoading: true });
    try {
      const response = await experienceAPI.searchByMentor(mentorId, params);
      set({
        experiences: response.data.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createExperience: async (data) => {
    set({ isLoading: true });
    try {
      const response = await experienceAPI.createExperience(data);
      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

export const useBookingStore = create((set) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingAPI.getBookings(params);
      set({
        bookings: response.data.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erro ao carregar reservas',
        isLoading: false,
      });
      throw error;
    }
  },

  createBooking: async (experienceId) => {
    set({ isLoading: true });
    try {
      const response = await bookingAPI.createBooking({ experienceId });
      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  approveBooking: async (id) => {
    try {
      const response = await bookingAPI.approveBooking(id);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  rejectBooking: async (id) => {
    try {
      const response = await bookingAPI.rejectBooking(id);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  addReview: async (bookingId, data) => {
    try {
      const response = await bookingAPI.addStudentReview(bookingId, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
}));
