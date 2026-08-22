import { MapPin, Clock, Users, Star, ChevronRight } from 'lucide-react';
import './ActivityCard.css';

export default function ActivityCard({ activity, onViewDetails }) {
  if (!activity) return null;

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

  const difficultyStr = activity.difficulty || 'Easy';
  const isModerate = difficultyStr.toLowerCase() === 'moderate';

  const priceVal = activity.price ?? activity.estimatedCost;
  const formattedPriceDisplay =
    activity.formattedPrice ||
    (priceVal != null && !isNaN(Number(priceVal))
      ? `₹${Number(priceVal).toLocaleString('en-IN')}`
      : '₹2,499');

  const ratingVal = activity.rating || 4.8;
  const reviewCountVal = activity.reviewCount || 42;

  const destinationText =
    activity.destination ||
    (activity.cityName ? `${activity.cityName}${activity.countryName ? ', ' + activity.countryName : ''}` : 'Popular Destination');

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
            activity.imageUrl ||
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
          }
          alt={activity.name || 'Activity'}
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
          <h3 className="activity-card-title">{activity.name || 'Curated Activity'}</h3>

          <div className="activity-card-location">
            <MapPin size={14} className="activity-location-icon" />
            <span>{destinationText}</span>
          </div>

          <p className="activity-card-desc">{activity.description || 'Enjoy a memorable curated activity guided by local experts.'}</p>
        </div>

        {/* Metadata Chips (Duration, Difficulty, Group Size) */}
        <div className="activity-chips-row">
          <div className="meta-chip duration-chip">
            <Clock size={13} className="chip-icon" />
            <span>{activity.durationLabel || (activity.durationDays ? `${activity.durationDays} Days` : 'Half Day')}</span>
          </div>

          {difficultyStr && (
            <div className={`meta-chip difficulty-chip ${isModerate ? 'difficulty-moderate' : 'difficulty-easy'}`}>
              <span>{difficultyStr}</span>
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
          <span className="rating-score">{ratingVal}</span>
          <span className="reviews-count">({reviewCountVal} reviews)</span>
        </div>

        {/* Price display */}
        <div className="activity-price-display">
          <span className="price-prefix">From</span>
          <span className="price-amount">{formattedPriceDisplay}</span>
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
