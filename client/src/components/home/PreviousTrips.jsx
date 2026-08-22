import { TripCard } from './TripCard.jsx';
import { Compass, Calendar, MapPin, CheckCircle } from 'lucide-react';

export const PreviousTrips = ({
  trips = [],
  onViewDetails,
  onViewAll,
  onPlanTrip,
  onDeleteTrip,
  activeGroupBy = 'none',
  sectionTitle = 'Previous Trips',
  hideHeader = false,
}) => {
  if (!trips || trips.length === 0) {
    return (
      <section className="previous-trips-section">
        {!hideHeader && (
          <div className="section-header">
            <h2 className="section-title">{sectionTitle}</h2>
          </div>
        )}
        <div className="empty-trips-state animate-fade-in">
          <div className="empty-icon-wrapper">
            <Compass size={32} />
          </div>
          <p className="empty-title">No trips found matching your search or filters</p>
          <p className="empty-subtitle">Ready to embark on a new customized journey?</p>
          <button
            type="button"
            className="empty-cta-btn"
            onClick={onPlanTrip}
          >
            + Plan a trip now
          </button>
        </div>
      </section>
    );
  }

  // 1. Group by Status
  if (activeGroupBy === 'status') {
    const upcoming = trips.filter((t) => (t.status || '').toLowerCase() === 'upcoming');
    const completed = trips.filter((t) => (t.status || '').toLowerCase() === 'completed');
    const ongoing = trips.filter((t) => (t.status || '').toLowerCase() === 'ongoing');
    const other = trips.filter(
      (t) => !['upcoming', 'completed', 'ongoing'].includes((t.status || '').toLowerCase())
    );

    const groups = [
      { id: 'upcoming', title: 'Upcoming Adventures', icon: <Compass size={18} />, list: upcoming },
      { id: 'ongoing', title: 'Currently Ongoing', icon: <Compass size={18} />, list: ongoing },
      { id: 'completed', title: 'Completed Journeys', icon: <CheckCircle size={18} />, list: completed },
      { id: 'other', title: 'Other Trips', icon: <Compass size={18} />, list: other },
    ].filter((g) => g.list.length > 0);

    return (
      <section className="previous-trips-section">
        {!hideHeader && (
          <div className="section-header">
            <h2 className="section-title">{sectionTitle}</h2>
            {onViewAll && (
              <button type="button" className="section-view-all-btn" onClick={onViewAll}>
                View all
              </button>
            )}
          </div>
        )}

        <div className="grouped-trips-container">
          {groups.map((group) => (
            <div key={group.id} className="trip-group-block animate-fade-in">
              <div className="trip-group-header">
                <span className="trip-group-icon">{group.icon}</span>
                <h3 className="trip-group-title">{group.title}</h3>
                <span className="trip-group-count-pill">{group.list.length}</span>
              </div>
              <div className="previous-trips-grid">
                {group.list.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onViewDetails={onViewDetails}
                    onDeleteTrip={onDeleteTrip}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 2. Group by Destination
  if (activeGroupBy === 'destination' || activeGroupBy === 'region') {
    const destMap = {};
    trips.forEach((t) => {
      const dest = (t.locationSummary || t.name || 'Other Destinations').split(',')[0].trim();
      if (!destMap[dest]) destMap[dest] = [];
      destMap[dest].push(t);
    });

    return (
      <section className="previous-trips-section">
        {!hideHeader && (
          <div className="section-header">
            <h2 className="section-title">{sectionTitle}</h2>
            {onViewAll && (
              <button type="button" className="section-view-all-btn" onClick={onViewAll}>
                View all
              </button>
            )}
          </div>
        )}

        <div className="grouped-trips-container">
          {Object.entries(destMap).map(([destName, destTrips]) => (
            <div key={destName} className="trip-group-block animate-fade-in">
              <div className="trip-group-header">
                <span className="trip-group-icon"><MapPin size={18} /></span>
                <h3 className="trip-group-title">{destName}</h3>
                <span className="trip-group-count-pill">{destTrips.length}</span>
              </div>
              <div className="previous-trips-grid">
                {destTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onViewDetails={onViewDetails}
                    onDeleteTrip={onDeleteTrip}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 3. Group by Year
  if (activeGroupBy === 'year') {
    const yearMap = {};
    trips.forEach((t) => {
      const year = t.startDate ? new Date(t.startDate).getFullYear() : '2026';
      const label = `${year} Trips`;
      if (!yearMap[label]) yearMap[label] = [];
      yearMap[label].push(t);
    });

    return (
      <section className="previous-trips-section">
        {!hideHeader && (
          <div className="section-header">
            <h2 className="section-title">{sectionTitle}</h2>
            {onViewAll && (
              <button type="button" className="section-view-all-btn" onClick={onViewAll}>
                View all
              </button>
            )}
          </div>
        )}

        <div className="grouped-trips-container">
          {Object.entries(yearMap).map(([yearLabel, yearTrips]) => (
            <div key={yearLabel} className="trip-group-block animate-fade-in">
              <div className="trip-group-header">
                <span className="trip-group-icon"><Calendar size={18} /></span>
                <h3 className="trip-group-title">{yearLabel}</h3>
                <span className="trip-group-count-pill">{yearTrips.length}</span>
              </div>
              <div className="previous-trips-grid">
                {yearTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onViewDetails={onViewDetails}
                    onDeleteTrip={onDeleteTrip}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 4. Default Flat Grid (None)
  return (
    <section className="previous-trips-section">
      {!hideHeader && (
        <div className="section-header">
          <h2 className="section-title">{sectionTitle}</h2>
          {onViewAll && (
            <button
              type="button"
              className="section-view-all-btn"
              onClick={onViewAll}
            >
              View all
            </button>
          )}
        </div>
      )}

      <div className="previous-trips-grid">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onViewDetails={onViewDetails}
            onDeleteTrip={onDeleteTrip}
          />
        ))}
      </div>
    </section>
  );
};

export default PreviousTrips;
