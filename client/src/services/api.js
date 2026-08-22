import axios from 'axios';
import { mockUser, mockRegions, mockTrips } from './mockData.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if present in localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  /**
   * Get current authenticated user profile
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/users/me');
      return response.data.data;
    } catch {
      // Graceful fallback to mock data for front-end standalone mode
      return mockUser;
    }
  },

  /**
   * Get top regional selections
   */
  async getRegions() {
    try {
      const response = await apiClient.get('/destinations/regions');
      return response.data.data;
    } catch {
      return mockRegions;
    }
  },

  /**
   * Get trips for current user with optional status filter
   */
  async getUserTrips(status = 'all') {
    try {
      const response = await apiClient.get('/trips/user', {
        params: { status },
      });
      return response.data.data;
    } catch {
      if (status === 'all') return mockTrips;
      return mockTrips.filter((trip) => trip.status.toLowerCase() === status.toLowerCase());
    }
  },

  /**
   * Search destinations, trips, and experiences
   */
  async search(query, filters = {}) {
    try {
      const response = await apiClient.get('/search', {
        params: { q: query, ...filters },
      });
      return response.data.data;
    } catch {
      const q = (query || '').toLowerCase();
      const filteredRegions = mockRegions.filter(
        (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
      const filteredTrips = mockTrips.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.locationSummary.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
      return {
        regions: filteredRegions,
        trips: filteredTrips,
      };
    }
  },

  /**
   * Create a new trip
   */
  async createTrip(tripData) {
    try {
      const response = await apiClient.post('/trips', tripData);
      return response.data.data;
    } catch {
      const newTrip = {
        id: Date.now(),
        name: tripData.name,
        description: tripData.description || 'Custom crafted journey',
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        formattedDates: `${new Date(tripData.startDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })} - ${new Date(tripData.endDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}`,
        travelerCount: Number(tripData.travelerCount || 1),
        travelerLabel: `${tripData.travelerCount || 1} ${
          Number(tripData.travelerCount) === 1 ? 'Traveler' : 'Travelers'
        }`,
        status: 'UPCOMING',
        statusLabel: 'Upcoming',
        coverImageUrl:
          tripData.coverImageUrl ||
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        locationSummary: tripData.locationSummary || 'Custom Destination',
        stops: tripData.stops || [],
        budget: tripData.budget || 1500,
        currency: 'USD',
      };
      return newTrip;
    }
  },
};
