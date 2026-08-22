import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import './ProfileTripCard.css';

export default function ProfileTripCard({ trip, onViewTrip }) {
  const isWarningBadge = trip.badge?.toLowerCase().includes('day');
  const isCompleted = trip.badge?.toLowerCase() === 'completed';

  const getBadgeClass = () => {
    if (isWarningBadge) return 'badge-warning';
    if (isCompleted) return 'badge-completed';
    return 'badge-upcoming';
  };

  return (
    <div className="profile-trip-card" onClick={() => onViewTrip && onViewTrip(trip)}>
      {/* Top Image & Badge */}
      <div className="trip-card-media">
        <img
          src={
            trip.coverImageUrl ||
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
          }
          alt={trip.name}
          className="trip-card-img"
          loading="lazy"
        />
        {trip.badge && (
          <span className={`trip-card-badge ${getBadgeClass()}`}>
            {trip.badge}
          </span>
        )}
      </div>

      {/* Card Content Body */}
      <div className="trip-card-content">
        <h3 className="trip-card-title">{trip.name}</h3>

        <div className="trip-card-meta">
          <div className="meta-item location-item">
            <MapPin size={14} className="meta-icon" />
            <span className="meta-text">{trip.destination || trip.locationSummary || 'Destination'}</span>
          </div>

          <div className="meta-item date-item">
            <Calendar size={14} className="meta-icon" />
            <span className="meta-text">{trip.formattedDates}</span>
          </div>
        </div>

        <button
          type="button"
          className="view-trip-link"
          onClick={(e) => {
            e.stopPropagation();
            if (onViewTrip) onViewTrip(trip);
          }}
        >
          <span>View Trip</span>
          <ChevronRight size={15} className="chevron-icon" />
        </button>
      </div>
    </div>
  );
}
