import { useState, useEffect } from 'react';
import { ArrowRight, Trash2, MapPin, Tag } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext.jsx';

export const StopCard = ({
  stop,
  index,
  totalStops,
  onChange,
  onRemove,
  onOpenActivitySearch,
}) => {
  const { formatPrice, convertPrice, activeCurrency } = useCurrency();
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInputVal, setBudgetInputVal] = useState('');

  const stopBudgetINR = Number(stop.budget) || 0;

  // Sync converted display value when currency or stop budget changes
  useEffect(() => {
    if (!isEditingBudget) {
      const converted = convertPrice(stopBudgetINR);
      setBudgetInputVal(stopBudgetINR ? String(converted) : '');
    }
  }, [stopBudgetINR, activeCurrency, isEditingBudget]);

  const handleFieldChange = (field, value) => {
    onChange(stop.id, field, value);
  };

  // Convert entered amount from active currency back to INR base
  const handleBudgetChange = (e) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setBudgetInputVal(rawVal);
    if (!rawVal) {
      handleFieldChange('budget', 0);
      return;
    }
    const enteredNum = Number(rawVal);
    const inrVal = activeCurrency.rateFromINR !== 1
      ? Math.round(enteredNum / activeCurrency.rateFromINR)
      : enteredNum;
    handleFieldChange('budget', inrVal);
  };

  const selectedActs = stop.selectedActivities || [];

  return (
    <div className="itinerary-stop-card animate-fade-in">
      {/* Stop Card Header */}
      <div className="stop-card-header-bar">
        <div className="stop-title-wrap">
          <span className="stop-number-badge">{index + 1}</span>
          <h3 className="stop-card-index-title">Stop {index + 1}: {stop.cityName || 'Destination'}</h3>
        </div>
        {totalStops > 1 && (
          <button
            type="button"
            className="stop-delete-icon-btn"
            onClick={() => onRemove(stop.id)}
            title="Remove stop"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* 3-Column Inputs Row */}
      <div className="stop-card-three-cols">
        {/* 1. City / Destination */}
        <div className="stop-field-col">
          <label className="stop-field-label">City / Destination</label>
          <div className="stop-input-with-icon">
            <MapPin size={15} className="stop-input-pin" />
            <input
              type="text"
              className="stop-input stop-input-padded"
              placeholder="e.g. Jaipur, Goa, Delhi, Tokyo..."
              value={stop.cityName || ''}
              onChange={(e) => handleFieldChange('cityName', e.target.value)}
            />
          </div>
        </div>

        {/* 2. Date Range */}
        <div className="stop-field-col">
          <label className="stop-field-label">Date range</label>
          <input
            type="text"
            className="stop-input"
            placeholder="e.g. 15 Oct - 17 Oct"
            value={stop.dateRange || ''}
            onChange={(e) => handleFieldChange('dateRange', e.target.value)}
          />
        </div>

        {/* 3. Budget in Active Currency */}
        <div className="stop-field-col">
          <label className="stop-field-label">
            Allocated Budget ({activeCurrency.code})
          </label>
          <div className="stop-input-with-icon">
            <span className="stop-input-currency-prefix">
              {activeCurrency.symbol}
            </span>
            <input
              type="text"
              className="stop-input stop-input-currency"
              placeholder={String(convertPrice(15000))}
              value={isEditingBudget ? budgetInputVal : (stopBudgetINR ? Number(budgetInputVal || convertPrice(stopBudgetINR)).toLocaleString(activeCurrency.formatLocale || 'en-IN') : '')}
              onFocus={() => {
                setIsEditingBudget(true);
                setBudgetInputVal(stopBudgetINR ? String(convertPrice(stopBudgetINR)) : '');
              }}
              onBlur={() => setIsEditingBudget(false)}
              onChange={handleBudgetChange}
            />
          </div>
        </div>
      </div>

      {/* Selected Activities Chips */}
      {selectedActs.length > 0 && (
        <div className="stop-selected-activities-chips">
          <span className="chips-label">Selected Experiences ({selectedActs.length}):</span>
          <div className="chips-list">
            {selectedActs.map((act) => (
              <span key={act.id} className="act-chip">
                <Tag size={11} />
                <span>{act.name} ({formatPrice(act.estimatedCost)})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Activities / Notes Textarea */}
      <div className="stop-card-notes-row">
        <label className="stop-field-label">Activities & itinerary notes</label>
        <textarea
          rows={2}
          className="stop-textarea"
          placeholder="e.g. Forts, heritage monuments, street food walks..."
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
          <span>Search & add activities for {stop.cityName || 'this stop'}</span>
          <ArrowRight size={14} />
        </button>

        <span className="stop-act-counter">
          {selectedActs.length} {selectedActs.length === 1 ? 'activity' : 'activities'} attached
        </span>
      </div>
    </div>
  );
};

export default StopCard;
