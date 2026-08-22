import { ArrowRight } from 'lucide-react';

export const StopCard = ({
  stop,
  index,
  totalStops,
  onChange,
  onRemove,
  onOpenActivitySearch,
}) => {
  const handleFieldChange = (field, value) => {
    onChange(stop.id, field, value);
  };

  // Format budget input with ₹ symbol
  const handleBudgetChange = (e) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    handleFieldChange('budget', rawVal ? Number(rawVal) : '');
  };

  const displayBudget = stop.budget
    ? `₹${Number(stop.budget).toLocaleString('en-IN')}`
    : '';

  return (
    <div className="itinerary-stop-card animate-fade-in">
      {/* Stop Card Header */}
      <div className="stop-card-header-bar">
        <h3 className="stop-card-index-title">Stop {index + 1}</h3>
      </div>

      {/* 3-Column Inputs Row */}
      <div className="stop-card-three-cols">
        {/* 1. City / Destination */}
        <div className="stop-field-col">
          <label className="stop-field-label">City / Destination</label>
          <input
            type="text"
            className="stop-input"
            placeholder="e.g. Paris"
            value={stop.cityName || ''}
            onChange={(e) => handleFieldChange('cityName', e.target.value)}
          />
        </div>

        {/* 2. Date Range */}
        <div className="stop-field-col">
          <label className="stop-field-label">Date range</label>
          <input
            type="text"
            className="stop-input"
            placeholder="e.g. 10 Jun - 13 Jun"
            value={stop.dateRange || ''}
            onChange={(e) => handleFieldChange('dateRange', e.target.value)}
          />
        </div>

        {/* 3. Budget */}
        <div className="stop-field-col">
          <label className="stop-field-label">Budget</label>
          <input
            type="text"
            className="stop-input"
            placeholder="₹40,000"
            value={displayBudget}
            onChange={handleBudgetChange}
          />
        </div>
      </div>

      {/* Activities / Notes Textarea */}
      <div className="stop-card-notes-row">
        <label className="stop-field-label">Activities / notes</label>
        <textarea
          rows={2}
          className="stop-textarea"
          placeholder="e.g. Museums, cafés and city highlights"
          value={stop.notes || ''}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
        />
      </div>

      {/* Stop Card Actions Footer */}
      <div className="stop-card-footer-bar">
        <button
          type="button"
          className="stop-search-act-link"
          onClick={() => onOpenActivitySearch(stop)}
        >
          <span>Search & add activities</span>
          <ArrowRight size={14} />
        </button>

        {totalStops > 1 && (
          <button
            type="button"
            className="stop-remove-btn"
            onClick={() => onRemove(stop.id)}
          >
            Remove stop
          </button>
        )}
      </div>
    </div>
  );
};

export default StopCard;
