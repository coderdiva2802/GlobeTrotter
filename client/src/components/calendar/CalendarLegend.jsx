import './CalendarLegend.css';

export default function CalendarLegend({ activeCategory, onSelectCategory }) {
  const legendItems = [
    { id: 'upcoming', label: 'Upcoming Trips', color: '#3b82f6' },
    { id: 'planned', label: 'Planned', color: '#22c55e' },
    { id: 'in-progress', label: 'In Progress', color: '#eab308' },
    { id: 'getaways', label: 'Getaways', color: '#a855f7' },
    { id: 'adventures', label: 'Adventures', color: '#f97316' },
  ];

  return (
    <div className="calendar-legend-bar">
      {legendItems.map((item) => {
        const isSelected = activeCategory === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`legend-item-btn ${isSelected ? 'is-selected' : ''}`}
            onClick={() => onSelectCategory && onSelectCategory(isSelected ? 'all' : item.id)}
          >
            <span
              className="legend-dot"
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
