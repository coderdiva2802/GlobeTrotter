import { Calendar } from 'lucide-react';
import './CalendarBanner.css';

export default function CalendarBanner() {
  return (
    <div className="calendar-view-banner">
      <div className="calendar-banner-icon-box">
        <Calendar size={24} className="calendar-banner-icon" />
      </div>
      <div className="calendar-banner-text">
        <h1 className="calendar-banner-title">Calendar View</h1>
        <p className="calendar-banner-subtitle">
          View and manage your upcoming trips and plans.
        </p>
      </div>
    </div>
  );
}
