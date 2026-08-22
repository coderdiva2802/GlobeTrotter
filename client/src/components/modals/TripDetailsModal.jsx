import { X, Calendar, Users, MapPin, DollarSign, Share2 } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';

export const TripDetailsModal = ({ trip, isOpen, onClose }) => {
  if (!isOpen || !trip) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="modal-container modal-details-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trip-detail-title"
      >
        {/* Cover Image Header */}
        <div className="details-header-image">
          <img src={trip.coverImageUrl} alt={trip.name} />
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
            <Badge status={trip.status} />
            <h2 id="trip-detail-title" className="details-title">{trip.name}</h2>
            <div className="details-location">
              <MapPin size={16} />
              <span>{trip.locationSummary}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-content">
          {/* Key Metrics Grid */}
          <div className="details-metrics-grid">
            <div className="metric-box">
              <Calendar size={18} className="metric-icon" />
              <div className="metric-info">
                <span className="metric-label">Dates</span>
                <span className="metric-val">{trip.formattedDates}</span>
              </div>
            </div>

            <div className="metric-box">
              <Users size={18} className="metric-icon" />
              <div className="metric-info">
                <span className="metric-label">Travelers</span>
                <span className="metric-val">{trip.travelerLabel}</span>
              </div>
            </div>

            <div className="metric-box">
              <DollarSign size={18} className="metric-icon" />
              <div className="metric-info">
                <span className="metric-label">Estimated Budget</span>
                <span className="metric-val">${trip.budget || 2500} USD</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {trip.description && (
            <div className="details-section">
              <h4 className="details-section-title">Trip Overview</h4>
              <p className="details-description">{trip.description}</p>
            </div>
          )}

          {/* Stops Timeline */}
          {trip.stops && trip.stops.length > 0 && (
            <div className="details-section">
              <h4 className="details-section-title">Itinerary Stops</h4>
              <div className="stops-timeline">
                {trip.stops.map((stop, idx) => (
                  <div key={stop.id || idx} className="stop-timeline-item">
                    <div className="stop-bullet">{idx + 1}</div>
                    <div className="stop-details">
                      <span className="stop-name">{stop.cityName}</span>
                      <span className="stop-country">{stop.countryName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="details-footer-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Trip link copied to clipboard!');
              }}
            >
              <Share2 size={16} />
              <span>Share Trip</span>
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;
