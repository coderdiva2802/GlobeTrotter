import axios from 'axios';
import {
  mockUser,
  mockRegions,
  mockTrips,
  mockCities,
  mockActivities,
  mockHolidayPackages,
  mockDayWiseItinerary,
  getDestinationCoverImage,
  mockPreplannedTrips,
  mockPreviousTrips,
  mockCalendarTrips,
} from './mockData.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if present
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
      console.warn('Backend server is offline. Falling back to local data.');
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
      return {
        ...mockUser,
        ...profileData,
        name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || mockUser.name,
      };
    }
  },

  /**
   * Get calendar trips mapping for a given month
   */
  async getCalendarTrips(monthYear = '2024-01', category = 'all') {
    try {
      const response = await api.get('/trips/calendar', {
        params: { month: monthYear, category },
      });
      return response.data?.data;
    } catch {
      let events = [...mockCalendarTrips];
      if (category && category !== 'all') {
        events = events.filter((e) => e.category === category);
      }
      return {
        month: monthYear,
        monthLabel: 'January 2024',
        totalEvents: events.length,
        events,
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
   * Get city / destination suggestions for autocomplete
   */
  async getDestinationSuggestions(query = '') {
    try {
      const response = await api.get('/destinations/autocomplete', {
        params: { q: query },
      });
      return response.data?.data || mockCities;
    } catch {
      if (!query || !query.trim()) return mockCities;
      const q = query.trim().toLowerCase();
      const filtered = mockCities.filter(
        (c) =>
          c.cityName.toLowerCase().includes(q) ||
          c.countryName.toLowerCase().includes(q) ||
          c.displayName.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q)
      );
      return filtered.length > 0 ? filtered : mockCities;
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
   * Get pre-built curated holiday packages
   */
  async getHolidayPackages(category = 'all') {
    try {
      const response = await api.get('/packages', {
        params: { category },
      });
      return response.data?.data || mockHolidayPackages;
    } catch {
      if (!category || category === 'all') return mockHolidayPackages;
      return mockHolidayPackages.filter(
        (pkg) => pkg.category.toLowerCase() === category.toLowerCase()
      );
    }
  },

  /**
   * Get single holiday package by ID
   */
  async getHolidayPackageById(packageId) {
    try {
      const response = await api.get(`/packages/${packageId}`);
      return response.data?.data;
    } catch {
      return mockHolidayPackages.find((p) => p.id === packageId) || mockHolidayPackages[0];
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
          (t.description && t.description.toLowerCase().includes(q))
      );
      return {
        regions: filteredRegions,
        trips: filteredTrips,
      };
    }
  },

  /**
   * Create or update a trip
   */
  async createTrip(tripData) {
    try {
      const response = await api.post('/trips', tripData);
      return response.data?.data;
    } catch {
      const travelerCount = Number(tripData.travelerCount || 1);
      const totalBudget = Number(tripData.budget || 50000);
      const coverImage = tripData.coverImageUrl || getDestinationCoverImage(tripData.locationSummary || tripData.destination);

      const newTrip = {
        id: tripData.id || Date.now(),
        name: tripData.name || 'Custom Crafted Journey',
        description: tripData.description || 'Custom crafted journey across top destinations',
        startDate: tripData.startDate || new Date().toISOString().split('T')[0],
        endDate: tripData.endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        formattedDates: `${new Date(tripData.startDate || Date.now()).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })} - ${new Date(tripData.endDate || Date.now() + 5 * 86400000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}`,
        travelerCount,
        travelerLabel: `${travelerCount} ${travelerCount === 1 ? 'Traveler' : 'Travelers'}`,
        status: tripData.status || 'UPCOMING',
        statusLabel: tripData.statusLabel || 'Upcoming',
        coverImageUrl: coverImage,
        locationSummary: tripData.locationSummary || tripData.destination || 'Custom Destination',
        stops: (tripData.stops || []).map((s, idx) => ({
          id: s.id || idx + 1,
          cityName: s.cityName,
          countryName: s.countryName || '',
          order: idx + 1,
          dateRange: s.dateRange,
          budgetPerPerson: Number(s.budgetPerPerson) || (Number(s.budget) ? Math.round(Number(s.budget) / travelerCount) : 0),
          budget: Number(s.budget) || 0,
          notes: s.notes,
          selectedActivities: (s.selectedActivities || []).map((a) => ({ ...a })),
        })),
        budget: totalBudget,
        currency: 'INR',
      };
      return newTrip;
    }
  },

  /**
   * Delete a trip by ID
   */
  async deleteTrip(tripId) {
    try {
      const response = await api.delete(`/trips/${tripId}`);
      return response.data;
    } catch {
      return { success: true, deletedId: tripId };
    }
  },

  /**
   * Search activities for a specific city, country, or keyword
   */
  async searchActivities(param1 = '', param2 = '') {
    let destinationName = '';
    let query = '';
    let filter = 'all';
    let sortBy = 'default';
    let groupBy = 'none';

    if (typeof param1 === 'object' && param1 !== null) {
      destinationName = param1.destination || param1.destinationName || '';
      query = param1.query || param1.q || '';
      filter = param1.filter || 'all';
      sortBy = param1.sortBy || 'default';
      groupBy = param1.groupBy || 'none';
    } else {
      destinationName = param1 || '';
      query = param2 || '';
    }

    try {
      const response = await api.get('/activities/search', {
        params: { destination: destinationName, q: query, filter, sortBy, groupBy },
      });
      const data = response.data?.data;
      if (Array.isArray(data)) {
        return { total: data.length, activities: data };
      }
      if (data && Array.isArray(data.activities)) {
        return data;
      }
      return { total: mockActivities.length, activities: mockActivities };
    } catch {
      const destStr = typeof destinationName === 'string' ? destinationName.trim().toLowerCase() : '';
      const queryStr = typeof query === 'string' ? query.trim().toLowerCase() : '';

      let matched = [...mockActivities];

      if (destStr) {
        matched = matched.filter((act) => {
          const actCity = (act.cityName || act.city || '').toLowerCase();
          const actCountry = (act.countryName || act.country || '').toLowerCase();

          return (
            destStr.includes(actCity) ||
            actCity.includes(destStr) ||
            destStr.includes(actCountry) ||
            actCountry.includes(destStr)
          );
        });

        if (matched.length === 0) {
          if (destStr.includes('india')) {
            matched = mockActivities.filter((a) => (a.countryName || a.country || '').toLowerCase() === 'india');
          } else if (destStr.includes('japan')) {
            matched = mockActivities.filter((a) => (a.countryName || a.country || '').toLowerCase() === 'japan');
          } else if (destStr.includes('france') || destStr.includes('paris')) {
            matched = mockActivities.filter((a) => (a.countryName || a.country || '').toLowerCase() === 'france');
          } else if (destStr.includes('dubai') || destStr.includes('uae')) {
            matched = mockActivities.filter((a) => (a.cityName || a.city || '').toLowerCase() === 'dubai');
          } else if (destStr.includes('bali') || destStr.includes('indonesia')) {
            matched = mockActivities.filter((a) => (a.cityName || a.city || '').toLowerCase() === 'bali');
          } else if (destStr.includes('italy') || destStr.includes('rome')) {
            matched = mockActivities.filter((a) => (a.countryName || a.country || '').toLowerCase() === 'italy');
          }
        }
      }

      if (queryStr) {
        matched = matched.filter(
          (act) =>
            act.name?.toLowerCase().includes(queryStr) ||
            (act.category && act.category.toLowerCase().includes(queryStr)) ||
            (act.cityName && act.cityName.toLowerCase().includes(queryStr)) ||
            (act.description && act.description.toLowerCase().includes(queryStr))
        );
      }

      if (filter && filter !== 'all') {
        const f = filter.toLowerCase();
        matched = matched.filter(
          (a) =>
            (a.category && a.category.toLowerCase().includes(f)) ||
            (a.badge && a.badge.toLowerCase().replace(/\s+/g, '-') === f) ||
            (a.difficulty && a.difficulty.toLowerCase() === f)
        );
      }

      if (sortBy === 'rating') {
        matched.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === 'price-low') {
        matched.sort((a, b) => (a.estimatedCost || a.price || 0) - (b.estimatedCost || b.price || 0));
      } else if (sortBy === 'price-high') {
        matched.sort((a, b) => (b.estimatedCost || b.price || 0) - (a.estimatedCost || a.price || 0));
      }

      return {
        total: matched.length,
        activities: matched,
      };
    }
  },

  /**
   * Get full day-wise itinerary and dynamic budget calculations factoring in traveler count
   */
  async getTripItinerary(tripId, tripOverride = null) {
    try {
      const response = await api.get(`/trips/${tripId}/itinerary`);
      return response.data?.data;
    } catch {
      if (tripOverride && tripOverride.stops && tripOverride.stops.length > 0) {
        const stops = tripOverride.stops;
        const travelers = Number(tripOverride.travelerCount) || 2;
        const totalBudget = Number(tripOverride.budget || 50000);
        let totalPlannedExpenses = 0;
        let dayCounter = 1;
        const days = [];

        stops.forEach((stop, stopIdx) => {
          const stopCity = stop.cityName || `Stop ${stopIdx + 1}`;
          const acts = stop.selectedActivities && stop.selectedActivities.length > 0
            ? stop.selectedActivities
            : [];

          if (acts.length > 0) {
            const timeSlots = ['09:00 AM', '01:30 PM', '05:30 PM', '08:00 PM'];
            const items = acts.map((act, actIdx) => {
              const unitCost = Number(act.estimatedCost || 1500);
              const groupCost = unitCost * travelers;
              totalPlannedExpenses += groupCost;

              return {
                id: act.id || `${stopIdx}-${actIdx}`,
                time: timeSlots[actIdx % timeSlots.length],
                activityName: act.name,
                category: act.category,
                durationMinutes: act.durationMinutes,
                rating: act.rating,
                unitCost,
                expense: groupCost,
                expenseFormatted: `₹${groupCost.toLocaleString('en-IN')}`,
                perPersonFormatted: travelers > 1 ? `(₹${unitCost.toLocaleString('en-IN')} × ${travelers})` : null,
              };
            });

            days.push({
              id: dayCounter,
              dayNumber: dayCounter,
              dayLabel: `Day ${dayCounter}`,
              dateFormatted: stop.dateRange || `Day ${dayCounter}`,
              cityName: stopCity,
              locationHeader: `${stopCity} • ${stop.dateRange || `Day ${dayCounter}`}`,
              notes: stop.notes,
              items,
            });
            dayCounter += 1;
          } else {
            const sampleUnit = Number(stop.budget ? Math.round(stop.budget / travelers * 0.85) : 2500);
            const sampleGroup = sampleUnit * travelers;
            totalPlannedExpenses += sampleGroup;

            days.push({
              id: dayCounter,
              dayNumber: dayCounter,
              dayLabel: `Day ${dayCounter}`,
              dateFormatted: stop.dateRange || `Day ${dayCounter}`,
              cityName: stopCity,
              locationHeader: `${stopCity} • ${stop.dateRange || `Day ${dayCounter}`}`,
              notes: stop.notes || 'Sightseeing, local cuisine, and highlights',
              items: [
                {
                  id: `${stopIdx}-1`,
                  time: '10:00 AM',
                  activityName: `${stopCity} City Highlights & Walking Tour`,
                  expense: Math.round(sampleGroup * 0.5),
                  expenseFormatted: `₹${Math.round(sampleGroup * 0.5).toLocaleString('en-IN')}`,
                  perPersonFormatted: travelers > 1 ? `(₹${Math.round(sampleUnit * 0.5).toLocaleString('en-IN')}/person)` : null,
                },
                {
                  id: `${stopIdx}-2`,
                  time: '04:00 PM',
                  activityName: `${stopCity} Sunset Landmark Experience`,
                  expense: Math.round(sampleGroup * 0.5),
                  expenseFormatted: `₹${Math.round(sampleGroup * 0.5).toLocaleString('en-IN')}`,
                  perPersonFormatted: travelers > 1 ? `(₹${Math.round(sampleUnit * 0.5).toLocaleString('en-IN')}/person)` : null,
                },
              ],
            });
            dayCounter += 1;
          }
        });

        const remaining = totalBudget - totalPlannedExpenses;
        const budgetPerPerson = Math.round(totalBudget / travelers);
        const plannedPerPerson = Math.round(totalPlannedExpenses / travelers);
        const remainingPerPerson = Math.round(remaining / travelers);

        const coverImage = tripOverride.coverImageUrl || getDestinationCoverImage(tripOverride.locationSummary || tripOverride.destination);

        return {
          trip: {
            id: tripOverride.id || 105,
            name: tripOverride.name || 'Personalized Travel Itinerary',
            status: tripOverride.status || 'UPCOMING',
            locationSummary: tripOverride.locationSummary || stops.map((s) => s.cityName).join(' → '),
            destination: tripOverride.destination || tripOverride.locationSummary,
            startDate: tripOverride.startDate,
            endDate: tripOverride.endDate,
            description: tripOverride.description || '',
            travelerCount: travelers,
            formattedDates: tripOverride.formattedDates || `${tripOverride.startDate} - ${tripOverride.endDate}`,
            budget: totalBudget,
            budgetPerPerson,
            currency: 'INR',
            stops: stops.map((s) => ({
              ...s,
              selectedActivities: (s.selectedActivities || []).map((a) => ({ ...a })),
            })),
            coverImageUrl: coverImage,
          },
          budgetSummary: {
            travelerCount: travelers,
            totalBudget,
            totalBudgetFormatted: `₹${totalBudget.toLocaleString('en-IN')}`,
            costPerPerson: budgetPerPerson,
            costPerPersonFormatted: `₹${budgetPerPerson.toLocaleString('en-IN')} / person`,
            plannedExpenses: totalPlannedExpenses,
            plannedExpensesFormatted: `₹${totalPlannedExpenses.toLocaleString('en-IN')}`,
            plannedPerPerson: plannedPerPerson,
            plannedPerPersonFormatted: `₹${plannedPerPerson.toLocaleString('en-IN')} / person`,
            remainingBudget: remaining,
            remainingBudgetFormatted: remaining < 0
              ? `-₹${Math.abs(remaining).toLocaleString('en-IN')}`
              : `₹${remaining.toLocaleString('en-IN')}`,
            remainingPerPerson: remainingPerPerson,
            remainingPerPersonFormatted: remainingPerPerson < 0
              ? `-₹${Math.abs(remainingPerPerson).toLocaleString('en-IN')} / person`
              : `₹${remainingPerPerson.toLocaleString('en-IN')} / person`,
            currency: 'INR',
          },
          days,
        };
      }

      return mockDayWiseItinerary;
    }
  },

  /**
   * Generate public shareable link
   */
  async shareTrip(tripId) {
    try {
      const response = await api.post(`/trips/${tripId}/share`);
      return response.data?.data;
    } catch {
      const token = `gt_share_${Math.random().toString(36).substring(2, 10)}`;
      return {
        shareToken: token,
        shareUrl: `${window.location.origin}/share/${token}`,
        isActive: true,
        viewCount: 1,
      };
    }
  },
};
