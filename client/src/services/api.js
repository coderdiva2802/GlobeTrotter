import axios from 'axios';
import { mockUser, mockRegions, mockTrips, mockPreplannedTrips, mockPreviousTrips } from './mockData.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from gt_access_token or token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gt_access_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response && error.code === 'ERR_NETWORK') {
      console.warn('Backend server is offline. Simulating local success for frontend demo.');
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  /**
   * Get current authenticated user profile
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data?.data?.user || response.data?.data || mockUser;
    } catch {
      return mockUser;
    }
  },

  /**
   * Get user profile along with travel statistics and categorized trips
   */
  async getUserProfileWithStats() {
    try {
      const response = await api.get('/users/profile');
      return response.data?.data || {
        user: mockUser,
        preplannedTrips: mockPreplannedTrips,
        previousTrips: mockPreviousTrips,
      };
    } catch {
      return {
        user: mockUser,
        preplannedTrips: mockPreplannedTrips,
        previousTrips: mockPreviousTrips,
      };
    }
  },

  /**
   * Update user profile information
   */
  async updateUserProfile(profileData) {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data?.data?.user || response.data?.data;
    } catch {
      // Mock update fallback
      return {
        ...mockUser,
        ...profileData,
        name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || mockUser.name,
      };
    }
  },

  /**
   * Get top regional selections
   */
  async getRegions() {
    try {
      const response = await api.get('/destinations/regions');
      return response.data?.data || mockRegions;
    } catch {
      return mockRegions;
    }
  },

  /**
   * Get trips for current user with optional status filter
   */
  async getUserTrips(status = 'all') {
    try {
      const response = await api.get('/trips/user', {
        params: { status },
      });
      return response.data?.data || mockTrips;
    } catch {
      if (status === 'all') return mockTrips;
      return mockTrips.filter((trip) => trip.status.toLowerCase() === status.toLowerCase());
    }
  },

  /**
   * Get upcoming / preplanned trips
   */
  async getPreplannedTrips() {
    try {
      const response = await api.get('/trips/user', { params: { status: 'upcoming' } });
      return response.data?.data || mockPreplannedTrips;
    } catch {
      return mockPreplannedTrips;
    }
  },

  /**
   * Get past / completed trips
   */
  async getPreviousTrips() {
    try {
      const response = await api.get('/trips/user', { params: { status: 'completed' } });
      return response.data?.data || mockPreviousTrips;
    } catch {
      return mockPreviousTrips;
    }
  },

  /**
   * Search destinations, trips, and experiences
   */
  async search(query, filters = {}) {
    try {
      const response = await api.get('/search', {
        params: { q: query, ...filters },
      });
      return response.data?.data;
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
      const response = await api.post('/trips', tripData);
      return response.data?.data;
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
