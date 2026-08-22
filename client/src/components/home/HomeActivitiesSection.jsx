import { Compass, ArrowRight } from 'lucide-react';
import ActivityCard from '../search/ActivityCard';
import './HomeActivitiesSection.css';

export default function HomeActivitiesSection({
  activities = [],
  searchQuery = '',
  onViewAll,
  onViewActivity,
}) {
  // Only display when user has typed an active search query
  if (!searchQuery || !searchQuery.trim()) return null;

  return (
    <section className="home-activities-section animate-fade-in">
      <div className="section-header">
        <div className="home-activities-title-group">
          <div className="section-title-with-icon">
            <Compass size={20} className="section-compass-icon" />
            <h2 className="section-title">
              Activities matching &ldquo;{searchQuery}&rdquo;
            </h2>
          </div>
          <p className="home-activities-subtitle">
            Found {activities.length} exciting tours & treks matching your search.
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            className="home-view-all-activities-btn"
            onClick={onViewAll}
          >
            <span>Explore all in Search</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>

      {activities.length > 0 ? (
        <div className="home-activities-cards-list">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onViewDetails={onViewActivity}
            />
          ))}
        </div>
      ) : (
        <div className="home-no-activities-box">
          <p>No activities found matching &ldquo;{searchQuery}&rdquo;.</p>
        </div>
      )}
    </section>
  );
}
