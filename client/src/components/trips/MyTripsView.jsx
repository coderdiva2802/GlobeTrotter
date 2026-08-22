import { useState, useMemo } from 'react';
import { TripStatusSection } from './TripStatusSection.jsx';
import { SearchFilterBar } from '../home/SearchFilterBar.jsx';
import { Plus, Compass } from 'lucide-react';

export const MyTripsView = ({
  trips = [],
  onViewTripDetails,
  onPlanTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'ongoing' | 'upcoming' | 'completed'
  const [activeSort, setActiveSort] = useState('default'); // 'default' | 'title' | 'date'
  const [activeGroupBy, setActiveGroupBy] = useState('status'); // 'status' | 'none'

  // Filter & sort trips
  const filteredTrips = useMemo(() => {
    let result = [...trips];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.locationSummary.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort
    if (activeSort === 'title') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'date') {
      result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    return result;
  }, [trips, searchQuery, activeSort]);

  // Group into Ongoing, Upcoming, Completed
  const ongoingTrips = useMemo(() => {
    if (activeFilter !== 'all' && activeFilter !== 'ongoing') return [];
    return filteredTrips.filter((t) => (t.status || '').toUpperCase() === 'ONGOING');
  }, [filteredTrips, activeFilter]);

  const upcomingTrips = useMemo(() => {
    if (activeFilter !== 'all' && activeFilter !== 'upcoming') return [];
    return filteredTrips.filter((t) => (t.status || '').toUpperCase() === 'UPCOMING');
  }, [filteredTrips, activeFilter]);

  const completedTrips = useMemo(() => {
    if (activeFilter !== 'all' && activeFilter !== 'completed') return [];
    return filteredTrips.filter((t) => (t.status || '').toUpperCase() === 'COMPLETED');
  }, [filteredTrips, activeFilter]);

  const totalVisibleCount = ongoingTrips.length + upcomingTrips.length + completedTrips.length;

  return (
    <div className="my-trips-page-container animate-fade-in">
      {/* 1. Header Area */}
      <div className="my-trips-header-bar">
        <div className="my-trips-title-group">
          <span className="my-trips-tracking-label">YOUR JOURNEYS</span>
          <h1 className="my-trips-main-heading">My trips</h1>
          <p className="my-trips-sub-heading">
            Manage ongoing, upcoming and completed adventures.
          </p>
        </div>

        <button
          type="button"
          className="my-trips-plan-cta-btn"
          onClick={onPlanTrip}
        >
          <Plus size={16} />
          <span>Plan a trip</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        activeGroupBy={activeGroupBy}
        onGroupByChange={setActiveGroupBy}
      />

      {/* 3. Categorized Sections */}
      {totalVisibleCount > 0 ? (
        <div className="my-trips-sections-stack">
          {/* Ongoing Section */}
          <TripStatusSection
            title="Ongoing"
            trips={ongoingTrips}
            onViewTripDetails={onViewTripDetails}
          />

          {/* Upcoming Section */}
          <TripStatusSection
            title="Upcoming"
            trips={upcomingTrips}
            onViewTripDetails={onViewTripDetails}
          />

          {/* Completed Section */}
          <TripStatusSection
            title="Completed"
            trips={completedTrips}
            onViewTripDetails={onViewTripDetails}
          />
        </div>
      ) : (
        <div className="empty-trips-state">
          <div className="empty-icon-wrapper">
            <Compass size={32} />
          </div>
          <p className="empty-title">No trips found</p>
          <p className="empty-subtitle">
            {searchQuery
              ? `No journeys match your search "${searchQuery}"`
              : 'You have no trips in this category yet.'}
          </p>
          <button
            type="button"
            className="empty-cta-btn"
            onClick={onPlanTrip}
          >
            + Plan a trip now
          </button>
        </div>
      )}
    </div>
  );
};

export default MyTripsView;
