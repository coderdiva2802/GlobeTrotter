import { MapPin, Calendar } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';

export const ItineraryHeaderHero = ({
  trip,
  onEditItinerary,
  onShareTrip,
}) => {
  return (
    <section className="itinerary-hero-section">
      <div className="itinerary-hero-container">
        {/* Cover Background */}
        <div
          className="itinerary-hero-bg"
          style={{
            backgroundImage: `url(${
              trip.coverImageUrl ||
              'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80'
            })`,
          }}
        />
        <div className="itinerary-hero-overlay" />

        {/* Content Overlay */}
        <div className="itinerary-hero-content">
          <div className="itinerary-hero-left">
            <div className="itinerary-status-wrapper">
              <Badge status={trip.status || 'UPCOMING'} />
            </div>

            <h1 className="itinerary-hero-title">{trip.name || 'abc'}</h1>

            <div className="itinerary-hero-meta-row">
              <div className="hero-meta-item">
                <MapPin size={15} className="hero-meta-icon" />
                <span>{trip.locationSummary || 'xyz'}</span>
              </div>
              <div className="hero-meta-item">
                <Calendar size={15} className="hero-meta-icon" />
                <span>{trip.formattedDates || '2026-08-31 - 2026-09-05'}</span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="itinerary-hero-actions">
            <button
              type="button"
              className="itinerary-edit-btn"
              onClick={onEditItinerary}
            >
              Edit itinerary
            </button>

            <button
              type="button"
              className="itinerary-share-btn"
              onClick={onShareTrip}
            >
              Share trip
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryHeaderHero;
