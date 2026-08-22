import { X, MapPin, ArrowRight } from 'lucide-react';

export const RegionDetailsModal = ({ region, isOpen, onClose, onPlanForRegion }) => {
  if (!isOpen || !region) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="modal-container modal-details-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="region-detail-title"
      >
        {/* Cover Image Header */}
        <div className="details-header-image">
          <img src={region.coverImageUrl} alt={region.name} />
          <div className="details-header-overlay" />
          <button
            type="button"
            className="modal-close-btn light-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="details-header-content">
            <span className="region-pill-tag">{region.destinationCountLabel}</span>
            <h2 id="region-detail-title" className="details-title">{region.name}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-content">
          <div className="details-section">
            <h4 className="details-section-title">About this Region</h4>
            <p className="details-description">{region.description}</p>
          </div>

          <div className="details-section">
            <h4 className="details-section-title">Popular Destinations</h4>
            <div className="region-chips-grid">
              {(region.popularCities || ['Paris', 'Rome', 'Barcelona', 'Amsterdam', 'Vienna']).map((city, idx) => (
                <div key={idx} className="region-city-chip">
                  <MapPin size={14} className="chip-icon" />
                  <span>{city}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="details-footer-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onClose();
                onPlanForRegion?.(region);
              }}
            >
              <span>Plan a Trip to {region.name}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionDetailsModal;
