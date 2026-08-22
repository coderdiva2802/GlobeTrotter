import { MapPin, Clock, Users, Star, ChevronRight } from 'lucide-react';
import './ActivityCard.css';

export default function ActivityCard({ activity, onViewDetails }) {
  const getBadgeClass = (variant) => {
    switch (variant?.toLowerCase()) {
      case 'blue':
      case 'best-price':
        return 'badge-blue';
      case 'coral':
      case 'red':
      case 'top-rated':
        return 'badge-coral';
      case 'teal':
      case 'lowest-price':
        return 'badge-teal';
      case 'green':
      case 'best-seller':
        return 'badge-green';
      case 'purple':
      case 'new':
        return 'badge-purple';
      default:
        return 'badge-blue';
    }
  };

  const isModerate = activity.difficulty?.toLowerCase() === 'moderate';

  return (
    <div
      className="activity-card-row"
      onClick={() => onViewDetails && onViewDetails(activity)}
    >
      {/* Left Column: Image with floating badge */}
      <div className="activity-card-media-box">
        <img
          src={
            activity.coverImageUrl ||
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
          }
          alt={activity.name}
          className="activity-card-thumbnail"
          loading="lazy"
        />
        {activity.badge && (
          <span className={`activity-promo-badge ${getBadgeClass(activity.badgeVariant || activity.badge)}`}>
            {activity.badge}
          </span>
        )}
      </div>

      {/* Center Column: Details & Chips */}
      <div className="activity-card-info-box">
        <div className="activity-card-info-top">
          <h3 className="activity-card-title">{activity.name}</h3>

          <div className="activity-card-location">
            <MapPin size={14} className="activity-location-icon" />
            <span>{activity.destination}</span>
          </div>

          <p className="activity-card-desc">{activity.description}</p>
        </div>

        {/* Metadata Chips (Duration, Difficulty, Group Size) */}
        <div className="activity-chips-row">
          <div className="meta-chip duration-chip">
            <Clock size={13} className="chip-icon" />
            <span>{activity.durationLabel || `${activity.durationDays} Days`}</span>
          </div>

          {activity.difficulty && (
            <div className={`meta-chip difficulty-chip ${isModerate ? 'difficulty-moderate' : 'difficulty-easy'}`}>
              <span>{activity.difficulty}</span>
            </div>
          )}

          {activity.groupSizeLabel && (
            <div className="meta-chip capacity-chip">
              <Users size={13} className="chip-icon" />
              <span>{activity.groupSizeLabel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Rating, Pricing & CTA Button */}
      <div className="activity-card-pricing-box">
        {/* Rating */}
        <div className="activity-rating-line">
          <Star size={15} className="activity-star-icon" fill="#eab308" color="#eab308" />
          <span className="rating-score">{activity.rating}</span>
          <span className="reviews-count">({activity.reviewCount} reviews)</span>
        </div>

        {/* Price display */}
        <div className="activity-price-display">
          <span className="price-prefix">From</span>
          <span className="price-amount">{activity.formattedPrice || `₹${activity.price.toLocaleString('en-IN')}`}</span>
          <span className="price-unit">per person</span>
        </div>

        {/* View Details Button */}
        <button
          type="button"
          className="view-details-cta-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (onViewDetails) onViewDetails(activity);
          }}
        >
          <span>View Details</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
