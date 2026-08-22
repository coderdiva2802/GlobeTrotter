import { useState, useEffect } from 'react';
import CalendarBanner from './CalendarBanner';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarLegend from './CalendarLegend';
import CalendarTipBanner from './CalendarTipBanner';
import { apiService } from '../../services/api';
import './TripsCalendarView.css';

export default function TripsCalendarView({ onSelectTrip }) {
  // Start on January 2024 to match design, with dynamic navigation
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [activeCategory, setActiveCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const monthYearLabel = currentDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const monthYearStr = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, '0')}`;

  useEffect(() => {
    async function loadCalendarEvents() {
      setIsLoading(true);
      try {
        const data = await apiService.getCalendarTrips(monthYearStr, activeCategory);
        setEvents(data?.events || []);
      } finally {
        setIsLoading(false);
      }
    }
    loadCalendarEvents();
  }, [monthYearStr, activeCategory]);

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
      onSelectTrip(event);
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
            events={events}
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
