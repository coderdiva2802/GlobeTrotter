import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarHeader.css';

export default function CalendarHeader({ currentMonthYear, onPrevMonth, onNextMonth }) {
  return (
    <div className="calendar-month-header">
      <button
        type="button"
        className="calendar-nav-chevron-btn"
        onClick={onPrevMonth}
        aria-label="Previous Month"
      >
        <ChevronLeft size={20} />
      </button>

      <h2 className="calendar-month-title">{currentMonthYear}</h2>

      <button
        type="button"
        className="calendar-nav-chevron-btn"
        onClick={onNextMonth}
        aria-label="Next Month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
