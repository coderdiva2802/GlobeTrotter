import axios from 'axios';
import { mockUser, mockRegions, mockTrips, mockCities, mockActivities } from './mockData.js';

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
   * Get city / destination suggestions for autocomplete
   */
  async getDestinationSuggestions(query = '') {
    try {
      const response = await apiClient.get('/destinations/autocomplete', {
        params: { q: query },
      });
      return response.data.data;
    } catch {
      if (!query.trim()) return mockCities;
      const q = query.toLowerCase();
      return mockCities.filter(
        (c) =>
          c.cityName.toLowerCase().includes(q) ||
          c.countryName.toLowerCase().includes(q) ||
          c.displayName.toLowerCase().includes(q)
      );
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

  /**
   * Search activities for a specific city or keyword
   */
  async searchActivities(cityName = '', query = '') {
    try {
      const response = await apiClient.get('/activities/search', {
        params: { city: cityName, q: query },
      });
      return response.data.data;
    } catch {
      let filtered = [...mockActivities];
      if (cityName) {
        filtered = filtered.filter(
          (a) => a.cityName.toLowerCase() === cityName.toLowerCase()
        );
      }
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q)
        );
      }
      return filtered.length > 0 ? filtered : mockActivities;
    }
  },

  /**
   * Batch save trip stops
   */
  async saveTripStops(tripId, stops) {
    try {
      const response = await apiClient.put(`/trips/${tripId}/stops`, { stops });
      return response.data.data;
    } catch {
      return {
        tripId,
        stops,
        totalBudget: stops.reduce((acc, s) => acc + (Number(s.budget) || 0), 0),
        currency: 'INR',
      };
    }
  },
};
