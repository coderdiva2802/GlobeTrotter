import { ChevronRight } from 'lucide-react';
import ProfileTripCard from './ProfileTripCard';
import './TripGridSection.css';

export default function TripGridSection({
  title,
  icon: IconComponent,
  iconClass = '',
  trips = [],
  onViewAll,
  onViewTrip,
}) {
  return (
    <section className="trip-grid-section">
      {/* Section Header */}
      <div className="trip-section-header">
        <div className="trip-section-title-wrapper">
          {IconComponent && (
            <div className={`trip-section-icon ${iconClass}`}>
              <IconComponent size={20} />
            </div>
          )}
          <h2 className="trip-section-title">{title}</h2>
        </div>

        {onViewAll && (
          <button
            type="button"
            className="view-all-trips-btn"
            onClick={onViewAll}
          >
            <span>View all trips</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Grid of Trip Cards */}
      <div className="trip-cards-grid">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <ProfileTripCard
              key={trip.id}
              trip={trip}
              onViewTrip={onViewTrip}
            />
          ))
        ) : (
          <div className="empty-trips-state">
            <p>No trips found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
