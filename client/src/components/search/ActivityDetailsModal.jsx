import { X, MapPin, Clock, Users, Star, CheckCircle, ShieldCheck } from 'lucide-react';
import './ActivityDetailsModal.css';

export default function ActivityDetailsModal({ activity, isOpen, onClose, onAddToTrip }) {
  if (!isOpen || !activity) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-content-card activity-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Header */}
        <div className="activity-modal-hero">
          <img
            src={
              activity.coverImageUrl ||
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
            }
            alt={activity.name}
            className="activity-modal-hero-img"
          />
          <button
            type="button"
            className="activity-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
          {activity.badge && (
            <span className="activity-modal-badge">{activity.badge}</span>
          )}
        </div>

        {/* Modal Body */}
        <div className="activity-modal-body">
          <div className="activity-modal-top-row">
            <div>
              <h2 className="activity-modal-title">{activity.name}</h2>
              <div className="activity-modal-location">
                <MapPin size={15} />
                <span>{activity.destination}</span>
              </div>
            </div>

            <div className="activity-modal-rating-badge">
              <Star size={16} fill="#eab308" color="#eab308" />
              <span className="modal-rating-val">{activity.rating}</span>
              <span className="modal-review-val">({activity.reviewCount})</span>
            </div>
          </div>

          <div className="activity-modal-chips-bar">
            <div className="modal-chip">
              <Clock size={14} />
              <span>{activity.durationLabel || `${activity.durationDays} Days`}</span>
            </div>
            {activity.difficulty && (
              <div className="modal-chip">
                <span>Difficulty: <strong>{activity.difficulty}</strong></span>
              </div>
            )}
            {activity.groupSizeLabel && (
              <div className="modal-chip">
                <Users size={14} />
                <span>{activity.groupSizeLabel}</span>
              </div>
            )}
          </div>

          <p className="activity-modal-desc">{activity.description}</p>

          {/* Highlights */}
          {activity.highlights && activity.highlights.length > 0 && (
            <div className="modal-section-block">
              <h4 className="modal-section-heading">Experience Highlights</h4>
              <ul className="modal-highlights-list">
                {activity.highlights.map((h, i) => (
                  <li key={i} className="highlight-item">
                    <CheckCircle size={15} className="highlight-check-icon" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inclusions */}
          {activity.inclusions && activity.inclusions.length > 0 && (
            <div className="modal-section-block">
              <h4 className="modal-section-heading">Package Inclusions</h4>
              <div className="inclusions-pills-row">
                {activity.inclusions.map((inc, i) => (
                  <span key={i} className="inclusion-pill">
                    <ShieldCheck size={14} />
                    {inc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Pricing & CTA */}
          <div className="activity-modal-footer">
            <div className="modal-pricing-left">
              <span className="modal-from-label">Total Price</span>
              <span className="modal-price-big">
                {activity.formattedPrice || `₹${activity.price.toLocaleString('en-IN')}`}
              </span>
              <span className="modal-unit-label">per person / all taxes included</span>
            </div>

            <div className="modal-actions-right">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (onAddToTrip) onAddToTrip(activity);
                  onClose();
                }}
              >
                + Add to Itinerary
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  alert(`🎉 Booking confirmed for "${activity.name}"!`);
                  onClose();
                }}
              >
                Book Experience
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
