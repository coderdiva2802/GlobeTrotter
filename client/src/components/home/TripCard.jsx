import { Calendar, Users, ChevronRight, Trash2, Wallet } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { getDestinationCoverImage } from '../../services/mockData.js';

export const TripCard = ({ trip, onViewDetails, onDeleteTrip }) => {
  const { formatPrice } = useCurrency();
  const coverImage = trip.coverImageUrl || getDestinationCoverImage(trip.locationSummary || trip.name);
  const travelers = Number(trip.travelerCount) || 2;
  const budget = Number(trip.budget) || 0;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
      onDeleteTrip?.(trip.id);
    }
  };

  return (
    <div
      className="trip-card animate-fade-in"
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
      {/* Image Area */}
      <div className="trip-card-image-container">
        <img
          src={coverImage}
          alt={trip.name}
          className="trip-card-image"
          loading="lazy"
        />
      </div>

      {/* Main Content Area */}
      <div className="trip-card-body">
        {/* Status Badge Header & Delete Action */}
        <div className="trip-card-header">
          <Badge status={trip.status} />
          {onDeleteTrip && (
            <button
              type="button"
              className="trip-delete-btn"
              onClick={handleDelete}
              title={`Delete ${trip.name}`}
              aria-label="Delete trip"
            >
              <Trash2 size={15} />
            </button>
          )}
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
            <span>{trip.formattedDates || `${trip.startDate?.split('T')[0]} - ${trip.endDate?.split('T')[0]}`}</span>
          </div>
          <div className="meta-item">
            <Users size={14} className="meta-icon" />
            <span>{travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}</span>
          </div>
          {budget > 0 && (
            <div className="meta-item budget-meta-item">
              <Wallet size={14} className="meta-icon" />
              <span>{formatPrice(budget)}</span>
            </div>
          )}
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
