import { Briefcase, MapPin, Camera, Star } from 'lucide-react';
import './ProfileStatsCards.css';

export default function ProfileStatsCards({ stats }) {
  const statItems = [
    {
      id: 'trips',
      label: 'Trips Planned',
      value: stats?.tripsPlanned ?? 12,
      icon: Briefcase,
      cardClass: 'stat-card-blue',
    },
    {
      id: 'places',
      label: 'Places Explored',
      value: stats?.placesExplored ?? 18,
      icon: MapPin,
      cardClass: 'stat-card-green',
    },
    {
      id: 'photos',
      label: 'Photos Captured',
      value: stats?.photosCaptured ?? 234,
      icon: Camera,
      cardClass: 'stat-card-purple',
    },
    {
      id: 'countries',
      label: 'Countries Visited',
      value: stats?.countriesVisited ?? 6,
      icon: Star,
      cardClass: 'stat-card-yellow',
    },
  ];

  return (
    <div className="profile-stats-grid">
      {statItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <div key={item.id} className={`profile-stat-card ${item.cardClass}`}>
            <div className="stat-icon-wrapper">
              <IconComponent size={20} className="stat-icon" />
            </div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
