import { useState, useEffect, useMemo } from 'react';
import CalendarBanner from './CalendarBanner.jsx';
import CalendarHeader from './CalendarHeader.jsx';
import CalendarGrid from './CalendarGrid.jsx';
import CalendarLegend from './CalendarLegend.jsx';
import CalendarTipBanner from './CalendarTipBanner.jsx';
import { apiService } from '../../services/api.js';
import { mockTrips } from '../../services/mockData.js';
import './TripsCalendarView.css';

/**
 * Maps user created trips into calendar event items
 */
function mapTripsToCalendarEvents(tripsList = []) {
  if (!Array.isArray(tripsList) || tripsList.length === 0) return [];

  return tripsList.map((t) => {
    const sDate = t.startDate ? String(t.startDate).split('T')[0] : '';
    const eDate = t.endDate ? String(t.endDate).split('T')[0] : sDate;

    const statusKey = String(t.status || 'UPCOMING').toUpperCase();
    let pillClass = 'calendar-pill-upcoming';
    let category = 'upcoming';
    let categoryLabel = 'Upcoming Trips';
    let prefixIcon = '✈️';
    let suffixIcon = '✈️';

    if (statusKey === 'COMPLETED') {
      pillClass = 'calendar-pill-planned';
      category = 'completed';
      categoryLabel = 'Completed';
      prefixIcon = '✅';
      suffixIcon = '🏁';
    } else if (statusKey === 'ONGOING' || statusKey === 'IN_PROGRESS') {
      pillClass = 'calendar-pill-in-progress';
      category = 'in-progress';
      categoryLabel = 'In Progress';
      prefixIcon = '⏳';
      suffixIcon = '📅';
    }

    return {
      id: t.id || `trip-${Math.random()}`,
      tripId: t.id,
      name: t.name,
      title: t.name,
      startDate: sDate,
      endDate: eDate,
      date: sDate,
      category,
      categoryLabel,
      pillClass,
      prefixIcon,
      suffixIcon,
      locationSummary: t.locationSummary || t.destination || 'Travel Journey',
      description: t.description || '',
      budget: t.budget,
      currency: t.currency || 'INR',
      travelerCount: t.travelerCount || 1,
      coverImageUrl: t.coverImageUrl,
      stops: t.stops || [],
      originalTrip: t,
    };
  });
}

export default function TripsCalendarView({ userTrips = [], onSelectTrip }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [fetchedTrips, setFetchedTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Combine props userTrips with fetchedTrips or mockTrips fallback
  const effectiveTrips = useMemo(() => {
    if (Array.isArray(userTrips) && userTrips.length > 0) {
      return userTrips;
    }
    if (Array.isArray(fetchedTrips) && fetchedTrips.length > 0) {
      return fetchedTrips;
    }
    return mockTrips;
  }, [userTrips, fetchedTrips]);

  // Map trips to calendar events
  const allEvents = useMemo(() => {
    return mapTripsToCalendarEvents(effectiveTrips);
  }, [effectiveTrips]);

  // Determine initial date: focus on the earliest/upcoming trip date, or default to current month
  const initialDate = useMemo(() => {
    if (allEvents.length > 0 && allEvents[0].startDate) {
      const parts = allEvents[0].startDate.split('-');
      if (parts.length === 3) {
        const y = Number(parts[0]);
        const m = Number(parts[1]) - 1; // 0-indexed month
        if (!isNaN(y) && !isNaN(m)) {
          return new Date(y, m, 1);
        }
      }
    }
    return new Date();
  }, [allEvents]);

  const [currentDate, setCurrentDate] = useState(initialDate);

  // Update currentDate if initialDate changes (e.g. initial load)
  useEffect(() => {
    setCurrentDate(initialDate);
  }, [initialDate]);

  // Load user trips if userTrips prop was not passed
  useEffect(() => {
    if (!userTrips || userTrips.length === 0) {
      async function loadTrips() {
        setIsLoading(true);
        try {
          const tripsData = await apiService.getUserTrips();
          setFetchedTrips(tripsData || []);
        } catch {
          setFetchedTrips(mockTrips);
        } finally {
          setIsLoading(false);
        }
      }
      loadTrips();
    }
  }, [userTrips]);

  // Filter events by active category
  const filteredEvents = useMemo(() => {
    if (!activeCategory || activeCategory === 'all') return allEvents;
    return allEvents.filter((e) => e.category === activeCategory);
  }, [allEvents, activeCategory]);

  const monthYearLabel = currentDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleSelectEvent = (event) => {
    if (onSelectTrip) {
      onSelectTrip(event.originalTrip || event);
    }
  };

  return (
    <div className="trips-calendar-view-container animate-fade-in">
      {/* 1. Header Banner */}
      <CalendarBanner />

      {/* 2. Main Calendar White Card */}
      <div className="calendar-main-card">
        <CalendarHeader
          currentMonthYear={monthYearLabel}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {isLoading ? (
          <div className="calendar-loading-box">
            <p>Loading month itinerary...</p>
          </div>
        ) : (
          <CalendarGrid
            currentDate={currentDate}
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
          />
        )}

        <CalendarLegend
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      {/* 3. Bottom Tip Banner */}
      <CalendarTipBanner />
    </div>
  );
}
