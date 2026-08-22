import { Lightbulb } from 'lucide-react';
import './CalendarTipBanner.css';

export default function CalendarTipBanner() {
  return (
    <div className="calendar-tip-card">
      <div className="calendar-tip-icon-box">
        <Lightbulb size={19} className="calendar-tip-icon" />
      </div>
      <p className="calendar-tip-text">
        <strong className="calendar-tip-lead">Tip:</strong> Click on any event to view trip details and manage your itinerary.
      </p>
    </div>
  );
}
