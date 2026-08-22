import { ChevronRight } from 'lucide-react';

export const RegionCard = ({ region, onSelectRegion }) => {
  return (
    <div
      className="region-card"
      onClick={() => onSelectRegion?.(region)}
      tabIndex={0}
      role="button"
      aria-label={`Explore ${region.name} with ${region.destinationCountLabel}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectRegion?.(region);
        }
      }}
    >
      {/* Background Image Container */}
      <div className="region-card-image-wrapper">
        <img
          src={region.coverImageUrl}
          alt={region.name}
          className="region-card-image"
          loading="lazy"
        />
        <div className="region-card-overlay" />
      </div>

      {/* Card Content Overlay */}
      <div className="region-card-content">
        <div className="region-card-info">
          <h3 className="region-card-name">{region.name}</h3>
          <span className="region-card-count">{region.destinationCountLabel}</span>
        </div>

        {/* Circular Action Button */}
        <div className="region-card-action-btn" aria-hidden="true">
          <ChevronRight size={16} className="arrow-icon" />
        </div>
      </div>
    </div>
  );
};

export default RegionCard;
