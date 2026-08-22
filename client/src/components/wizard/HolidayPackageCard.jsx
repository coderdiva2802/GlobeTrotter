import { Star, Clock, MapPin, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext.jsx';

export const HolidayPackageCard = ({ packageData, onSelectPackage }) => {
  const { formatPrice } = useCurrency();

  const {
    title,
    tag,
    badgeColor,
    rating,
    reviewsCount,
    formattedDuration,
    basePricePerPerson,
    discountedPrice,
    coverImageUrl,
    inclusions = [],
    routeSummary,
    description,
  } = packageData;

  const discountPercent = basePricePerPerson && discountedPrice
    ? Math.round(((basePricePerPerson - discountedPrice) / basePricePerPerson) * 100)
    : 0;

  return (
    <div className="package-card animate-fade-in">
      {/* Cover Image & Overlay Badges */}
      <div className="package-card-media">
        <img src={coverImageUrl} alt={title} className="package-card-img" />
        <div className="package-media-gradient" />

        {tag && (
          <span
            className="package-badge"
            style={{ backgroundColor: badgeColor || '#f59e0b' }}
          >
            {tag}
          </span>
        )}

        <div className="package-duration-pill">
          <Clock size={13} />
          <span>{formattedDuration}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="package-card-body">
        {/* Rating & Route */}
        <div className="package-header-meta">
          <div className="package-rating-badge">
            <Star size={13} className="star-icon" />
            <span>{rating}</span>
            <span className="review-count">({reviewsCount})</span>
          </div>
          <div className="package-route-pill">
            <MapPin size={12} />
            <span>{routeSummary}</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="package-card-title">{title}</h3>
        <p className="package-card-desc">{description}</p>

        {/* Key Inclusions */}
        <div className="package-inclusions-list">
          {inclusions.slice(0, 3).map((item, idx) => (
            <span key={idx} className="package-inclusion-tag">
              <Check size={12} className="inclusion-check" />
              <span>{item}</span>
            </span>
          ))}
          {inclusions.length > 3 && (
            <span className="package-inclusion-more">+{inclusions.length - 3} more</span>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="package-card-footer">
          <div className="package-pricing-col">
            <div className="package-price-row">
              <span className="package-current-price">
                {formatPrice(discountedPrice)}
              </span>
              {basePricePerPerson > discountedPrice && (
                <span className="package-base-price">
                  {formatPrice(basePricePerPerson)}
                </span>
              )}
            </div>
            <div className="package-price-subtext">
              per person {discountPercent > 0 && <span className="discount-tag">({discountPercent}% OFF)</span>}
            </div>
          </div>

          <button
            type="button"
            className="package-select-btn"
            onClick={() => onSelectPackage(packageData)}
          >
            <Sparkles size={14} />
            <span>Select Package</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HolidayPackageCard;
