import { Search } from 'lucide-react';
import './ActivitySearchBanner.css';

export default function ActivitySearchBanner() {
  return (
    <div className="activity-search-banner">
      <div className="search-banner-icon-box">
        <Search size={24} className="search-banner-icon" />
      </div>
      <div className="search-banner-text">
        <h1 className="search-banner-title">Activity Search</h1>
        <p className="search-banner-subtitle">
          Find exciting activities and things to do in your favorite destinations.
        </p>
      </div>
    </div>
  );
}
