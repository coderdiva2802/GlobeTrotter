import { useMemo } from 'react';
import './CalendarGrid.css';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function CalendarGrid({
  currentDate = new Date(2024, 0, 1),
  events = [],
  onSelectEvent,
}) {
  const { daysGrid } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0 = Jan

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];

    // 1. Leading empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ type: 'empty', id: `empty-pre-${i}` });
    }

    // 2. Day cells for current month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;

      // Find events assigned to this date
      const dayEvents = events.filter((e) => {
        if (e.date === dateStr) return true;
        if (e.startDate && e.endDate) {
          return dateStr >= e.startDate && dateStr <= e.endDate;
        }
        return false;
      });

      cells.push({
        type: 'day',
        dayNumber: day,
        dateStr,
        events: dayEvents,
        id: `day-${dateStr}`,
      });
    }

    // 3. Trailing empty cells to complete the 7-column grid
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 0; i < remaining; i++) {
      cells.push({ type: 'empty', id: `empty-post-${i}` });
    }

    return { daysGrid: cells };
  }, [currentDate, events]);

  return (
    <div className="calendar-grid-container">
      {/* Days of Week Header */}
      <div className="calendar-weekdays-row">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="calendar-weekday-cell">
            {day}
          </div>
        ))}
      </div>

      {/* Days Matrix */}
      <div className="calendar-days-grid">
        {daysGrid.map((cell) => {
          if (cell.type === 'empty') {
            return <div key={cell.id} className="calendar-day-cell empty-cell" />;
          }

          return (
            <div key={cell.id} className="calendar-day-cell">
              <span className="calendar-day-number">{cell.dayNumber}</span>

              {cell.events && cell.events.length > 0 && (
                <div className="calendar-events-container">
                  {cell.events.map((evt) => (
                    <button
                      key={evt.id}
                      type="button"
                      className={`calendar-event-pill ${evt.pillClass || 'calendar-pill-upcoming'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectEvent) onSelectEvent(evt);
                      }}
                      title={`${evt.title} - ${evt.categoryLabel || evt.category} (${evt.locationSummary || ''})`}
                    >
                      {evt.prefixIcon && (
                        <span className="event-pill-icon">{evt.prefixIcon}</span>
                      )}
                      <span className="event-pill-title">{evt.title}</span>
                      {evt.suffixIcon && (
                        <span className="event-pill-icon">{evt.suffixIcon}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
