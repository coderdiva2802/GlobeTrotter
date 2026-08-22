import { TripCard } from '../home/TripCard.jsx';

export const TripStatusSection = ({ title, trips = [], onViewTripDetails }) => {
  if (!trips || trips.length === 0) return null;

  return (
    <section className="trip-status-category-section animate-fade-in">
      <h2 className="trip-status-category-title">{title}</h2>
      <div className="trip-status-category-grid">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onViewDetails={onViewTripDetails}
          />
        ))}
      </div>
    </section>
  );
};

export default TripStatusSection;
