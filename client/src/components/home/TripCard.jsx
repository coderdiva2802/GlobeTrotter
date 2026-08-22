import { Calendar, Users, ChevronRight } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';

export const TripCard = ({ trip, onViewDetails }) => {
  return (
    <div
      className="trip-card"
      onClick={() => onViewDetails?.(trip)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${trip.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails?.(trip);
        }
      }}
    >
      {/* Left / Top Image Area */}
      <div className="trip-card-image-container">
        <img
          src={trip.coverImageUrl}
          alt={trip.name}
          className="trip-card-image"
          loading="lazy"
        />
      </div>

      {/* Right / Main Content Area */}
      <div className="trip-card-body">
        {/* Status Badge Header */}
        <div className="trip-card-header">
          <Badge status={trip.status} />
        </div>

        {/* Title and Location */}
        <div className="trip-card-title-group">
          <h3 className="trip-card-title">{trip.name}</h3>
          <div className="trip-card-location">
            <span className="location-dot">•</span>
            <span>{trip.locationSummary}</span>
          </div>
        </div>

        {/* Trip Meta Information */}
        <div className="trip-card-meta">
          <div className="meta-item">
            <Calendar size={14} className="meta-icon" />
            <span>{trip.formattedDates}</span>
          </div>
          <div className="meta-item">
            <Users size={14} className="meta-icon" />
            <span>{trip.travelerLabel}</span>
          </div>
        </div>

        {/* View Trip Details Link */}
        <div className="trip-card-footer">
          <span className="view-details-link">
            <span>View Trip Details</span>
            <ChevronRight size={15} className="details-chevron" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
