import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Sparkles, ArrowRight, MapPin, Check } from 'lucide-react';
import { apiService } from '../../services/api.js';

const popularTripNames = [
  'Europe Summer Adventure',
  'Japan Autumn Discovery',
  'Mediterranean Coastal Escape',
  'Southeast Asia Backpacking',
  'Nordic Northern Lights Tour',
  'California Highway Roadtrip',
];

export const Step1TripBasics = ({
  initialData = {},
  onContinue,
  onSaveForLater,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    destination: initialData.destination || '',
    cityId: initialData.cityId || null,
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    description: initialData.description || '',
  });

  const [tripNameDropdownOpen, setTripNameDropdownOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [errors, setErrors] = useState({});

  const tripNameRef = useRef(null);
  const destRef = useRef(null);

  // Load destination suggestions
  useEffect(() => {
    async function loadCities() {
      const results = await apiService.getDestinationSuggestions(formData.destination);
      setDestinations(results);
    }
    loadCities();
  }, [formData.destination]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tripNameRef.current && !tripNameRef.current.contains(e.target)) {
        setTripNameDropdownOpen(false);
      }
      if (destRef.current && !destRef.current.contains(e.target)) {
        setDestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Trip name is required';
    if (!formData.destination.trim()) errs.destination = 'Destination is required';
    if (!formData.startDate) errs.startDate = 'Start date is required';
    if (!formData.endDate) errs.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errs.endDate = 'End date must be after start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validate()) {
      onContinue(formData);
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: 'Please provide at least a trip name to save as draft' });
      return;
    }
    onSaveForLater({
      ...formData,
      isDraft: true,
    });
  };

  return (
    <div className="wizard-page-container animate-fade-in">
      {/* Wizard Header Bar */}
      <div className="wizard-top-header">
        <div className="wizard-title-group">
          <span className="wizard-step-label">STEP 1 OF 3</span>
          <h1 className="wizard-main-heading">Create a new trip</h1>
          <p className="wizard-sub-heading">
            Start with the basics. You can build your detailed itinerary next.
          </p>
        </div>
        <button
          type="button"
          className="wizard-cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

      {/* Main Wizard Form Card */}
      <div className="wizard-card-surface">
        <form onSubmit={handleContinue} className="wizard-form-layout">
          {/* 1. Trip Name Field with Suggestions Dropdown */}
          <div className="wizard-field-group" ref={tripNameRef}>
            <label className="wizard-field-label">Trip name</label>
            <div className="wizard-input-wrapper">
              <input
                type="text"
                className={`wizard-text-input ${errors.name ? 'has-error' : ''}`}
                placeholder="e.g. Europe Summer Adventure"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onFocus={() => setTripNameDropdownOpen(true)}
              />
              <button
                type="button"
                className="wizard-input-trailing-icon"
                onClick={() => setTripNameDropdownOpen((prev) => !prev)}
                aria-label="Toggle trip name ideas"
              >
                <ChevronDown size={18} />
              </button>

              {tripNameDropdownOpen && (
                <div className="wizard-dropdown-menu animate-fade-in">
                  <div className="wizard-dropdown-header">Trip Name Ideas</div>
                  {popularTripNames.map((name, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`wizard-dropdown-item ${formData.name === name ? 'is-selected' : ''}`}
                      onClick={() => {
                        handleChange('name', name);
                        setTripNameDropdownOpen(false);
                      }}
                    >
                      <span>{name}</span>
                      {formData.name === name && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.name && <span className="wizard-error-text">{errors.name}</span>}
          </div>

          {/* 2. Destination / First Stop */}
          <div className="wizard-field-group" ref={destRef}>
            <label className="wizard-field-label">Destination / first stop</label>
            <div className="wizard-input-wrapper">
              <input
                type="text"
                className={`wizard-text-input ${errors.destination ? 'has-error' : ''}`}
                placeholder="e.g. Paris, France"
                value={formData.destination}
                onChange={(e) => {
                  handleChange('destination', e.target.value);
                  setDestDropdownOpen(true);
                }}
                onFocus={() => setDestDropdownOpen(true)}
              />
              <button
                type="button"
                className="wizard-input-trailing-icon"
                onClick={() => setDestDropdownOpen((prev) => !prev)}
                aria-label="Toggle destination suggestions"
              >
                <ChevronDown size={18} />
              </button>

              {destDropdownOpen && (
                <div className="wizard-dropdown-menu animate-fade-in">
                  <div className="wizard-dropdown-header">Popular Destinations</div>
                  {destinations.map((city) => (
                    <button
                      key={city.cityId}
                      type="button"
                      className={`wizard-dropdown-item ${formData.destination === city.displayName ? 'is-selected' : ''}`}
                      onClick={() => {
                        handleChange('destination', city.displayName);
                        handleChange('cityId', city.cityId);
                        setDestDropdownOpen(false);
                      }}
                    >
                      <div className="dest-item-row">
                        <MapPin size={14} className="dest-pin-icon" />
                        <span>{city.displayName}</span>
                      </div>
                      {formData.destination === city.displayName && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.destination && <span className="wizard-error-text">{errors.destination}</span>}
          </div>

          {/* 3. Start Date & End Date in Two Columns */}
          <div className="wizard-dates-row">
            <div className="wizard-field-group">
              <label className="wizard-field-label">Start date</label>
              <div className="wizard-input-wrapper">
                <input
                  type="date"
                  className={`wizard-text-input wizard-date-input ${errors.startDate ? 'has-error' : ''}`}
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
                <Calendar size={18} className="wizard-date-trailing-icon" />
              </div>
              {errors.startDate && <span className="wizard-error-text">{errors.startDate}</span>}
            </div>

            <div className="wizard-field-group">
              <label className="wizard-field-label">End date</label>
              <div className="wizard-input-wrapper">
                <input
                  type="date"
                  className={`wizard-text-input wizard-date-input ${errors.endDate ? 'has-error' : ''}`}
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
                <Calendar size={18} className="wizard-date-trailing-icon" />
              </div>
              {errors.endDate && <span className="wizard-error-text">{errors.endDate}</span>}
            </div>
          </div>

          {/* 4. Trip Description */}
          <div className="wizard-field-group">
            <label className="wizard-field-label">Trip description</label>
            <textarea
              rows={4}
              className="wizard-textarea"
              placeholder="What kind of trip are you planning?"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          {/* 5. Bottom Action Buttons */}
          <div className="wizard-actions-bar">
            <button
              type="button"
              className="wizard-btn-secondary"
              onClick={handleSaveDraft}
            >
              Save for later
            </button>

            <button
              type="submit"
              className="wizard-btn-primary"
            >
              <Sparkles size={16} className="btn-sparkle-icon" />
              <span>Continue to itinerary</span>
              <ArrowRight size={16} className="btn-arrow-icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step1TripBasics;
