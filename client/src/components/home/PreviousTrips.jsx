import { TripCard } from './TripCard.jsx';
import { Compass } from 'lucide-react';

export const PreviousTrips = ({ trips, onViewDetails, onViewAll, onPlanTrip }) => {
  return (
    <section className="previous-trips-section">
      {/* Section Header */}
      <div className="section-header">
        <h2 className="section-title">Previous Trips</h2>
        <button
          type="button"
          className="section-view-all-btn"
          onClick={onViewAll}
        >
          View all
        </button>
      </div>

      {/* Trips Grid */}
      {trips && trips.length > 0 ? (
        <div className="previous-trips-grid">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="empty-trips-state">
          <div className="empty-icon-wrapper">
            <Compass size={32} />
          </div>
          <p className="empty-title">No trips found matching your criteria</p>
          <p className="empty-subtitle">Ready to embark on a new adventure?</p>
          <button
            type="button"
            className="empty-cta-btn"
            onClick={onPlanTrip}
          >
            + Plan a trip now
          </button>
        </div>
      )}
    </section>
  );
};

export default PreviousTrips;
