import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Sparkles, ArrowRight, MapPin, Check, Package, Compass, Users, Plus, Minus } from 'lucide-react';
import { apiService } from '../../services/api.js';
import { getDestinationCoverImage } from '../../services/mockData.js';
import { HolidayPackageCard } from './HolidayPackageCard.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';

const popularTripNames = [
  'Golden Triangle Heritage Odyssey',
  'Kerala Backwaters & Hill Serenity',
  'Goa Beach & Watersports Weekend',
  'Dubai Skyline & Desert Safari',
  'Japan Cherry Blossom & Tech Tour',
  'Bali Tropical Paradise & Islands',
  'Paris & French Romance Tour',
  'Rome Ancient History & Culinary Walk',
  'Kashmir Heaven on Earth Tour',
  'Royal Rajasthan Forts & Desert Safari',
];

const quickDestinations = [
  { label: '🏰 Jaipur, India', value: 'Jaipur, Rajasthan, India', cityId: 101, defaultDesc: 'Royal palace tours, grand hill forts, vibrant bazaars, and traditional Rajasthani dining.' },
  { label: '🏖️ Goa, India', value: 'Goa, India', cityId: 102, defaultDesc: 'Sun-drenched beaches, thrilling watersports, scuba diving, and romantic sunset catamaran cruises.' },
  { label: '🌴 Kerala, India', value: 'Kerala, India', cityId: 103, defaultDesc: 'Serene backwater houseboat cruises, mist-clad Munnar tea gardens, and lush spice plantations.' },
  { label: '🕌 Delhi, India', value: 'Delhi, India', cityId: 104, defaultDesc: 'Mughal architectural monuments, historic heritage walks, and bustling Old Delhi street food tours.' },
  { label: '🏝️ Bali, Indonesia', value: 'Bali, Indonesia', cityId: 5, defaultDesc: 'Tropical beaches, scenic terraced rice fields, sacred monkey temples, and island day tours.' },
  { label: '🏜️ Dubai, UAE', value: 'Dubai, UAE', cityId: 4, defaultDesc: 'Futuristic skyscrapers, world-class desert safaris, luxury yacht cruises, and vibrant nightlife.' },
  { label: '⛩️ Tokyo, Japan', value: 'Tokyo, Japan', cityId: 2, defaultDesc: 'Neon city skylines, ancient sacred temples, Mount Fuji excursions, and authentic culinary experiences.' },
  { label: '🗼 Paris, France', value: 'Paris, France', cityId: 1, defaultDesc: 'World-renowned art museums, iconic Eiffel Tower views, charming bohemian alleys, and Seine cruises.' },
];

const getTailoredDescription = (dest) => {
  const d = (dest || '').toLowerCase();
  const matched = quickDestinations.find((q) => d.includes(q.label.split(' ')[1]?.toLowerCase()) || d.includes(q.value.toLowerCase()));
  if (matched) return matched.defaultDesc;

  if (d.includes('jaipur') || d.includes('rajasthan')) return 'Royal palace tours, grand hill forts, vibrant bazaars, and traditional Rajasthani dining.';
  if (d.includes('goa')) return 'Sun-drenched beaches, thrilling watersports, scuba diving, and romantic sunset catamaran cruises.';
  if (d.includes('kerala') || d.includes('munnar') || d.includes('alleppey')) return 'Serene backwater houseboat cruises, mist-clad Munnar tea gardens, and lush spice plantations.';
  if (d.includes('delhi')) return 'Mughal architectural monuments, historic heritage walks, and bustling Old Delhi street food tours.';
  if (d.includes('agra')) return 'Sunrise visits to the Taj Mahal, Mughal history at Agra Fort, and sunset views from Mehtab Bagh.';
  if (d.includes('mumbai')) return 'Gateway of India, Elephanta Caves speedboat, South Bombay street food, and vibrant Marine Drive.';
  if (d.includes('varanasi')) return 'Sacred Ganga Aarti boat rides, ancient spiritual ghats, and historic Sarnath monasteries.';
  if (d.includes('udaipur')) return 'Lake Pichola sunset boat cruises, City Palace museums, and heritage royal architecture.';
  if (d.includes('manali') || d.includes('himachal')) return 'Snow-clad mountain passes, Solang valley adventures, and tranquil pine forest trails.';
  if (d.includes('ladakh') || d.includes('leh')) return 'Pangong Tso lake expeditions, high mountain passes, and double-humped camel safaris.';
  if (d.includes('dubai') || d.includes('uae')) return 'Futuristic skyscrapers, world-class desert safaris, luxury yacht cruises, and vibrant nightlife.';
  if (d.includes('bali') || d.includes('indonesia')) return 'Tropical beaches, scenic terraced rice fields, sacred monkey temples, and island day tours.';
  if (d.includes('tokyo') || d.includes('japan') || d.includes('kyoto')) return 'Neon city skylines, ancient sacred temples, Mount Fuji excursions, and authentic culinary experiences.';
  if (d.includes('paris') || d.includes('france')) return 'World-renowned art museums, iconic Eiffel Tower views, charming bohemian alleys, and Seine cruises.';
  if (d.includes('rome') || d.includes('italy')) return 'Ancient Roman monuments, Vatican wonders, cobblestone alley walks, and authentic Italian gastronomy.';
  if (d.includes('amsterdam')) return 'Canal boat cruises, world-class art museums, historic architecture, and vibrant city culture.';
  if (d.includes('india')) return 'Rich cultural heritage, iconic historic landmarks, scenic landscapes, and authentic regional cuisine.';
  return '';
};

export const Step1TripBasics = ({
  initialData = {},
  onContinue,
  onSaveForLater,
  onCancel,
}) => {
  const { activeCurrency } = useCurrency();
  // If destination is already provided or we're editing an existing trip, stay in 'custom' mode
  const [plannerMode, setPlannerMode] = useState(() => (initialData.destination ? 'custom' : 'packages'));
  const [packages, setPackages] = useState([]);
  const [selectedPkgCategory, setSelectedPkgCategory] = useState('all');

  const initialTravelers = Number(initialData.travelerCount) || 2;
  const initialPerPerson = initialData.budgetPerPerson || (initialData.budget ? Math.round(initialData.budget / initialTravelers) : 25000);
  const initialDest = initialData.destination || initialData.locationSummary || '';

  const [formData, setFormData] = useState({
    id: initialData.id || null,
    name: initialData.name || '',
    destination: initialDest,
    cityId: initialData.cityId || null,
    startDate: initialData.startDate ? initialData.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: initialData.endDate ? initialData.endDate.split('T')[0] : new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    description: initialData.description || (initialDest ? getTailoredDescription(initialDest) : ''),
    travelerCount: initialTravelers,
    budgetPerPerson: initialPerPerson,
    budget: initialData.budget || initialTravelers * initialPerPerson,
    presetStops: initialData.stops || initialData.presetStops || null,
    stops: initialData.stops || initialData.presetStops || null,
    coverImageUrl: initialData.coverImageUrl || (initialDest ? getDestinationCoverImage(initialDest) : ''),
  });

  const [tripNameDropdownOpen, setTripNameDropdownOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [errors, setErrors] = useState({});

  const tripNameRef = useRef(null);
  const destRef = useRef(null);

  // Load packages
  useEffect(() => {
    async function loadPackages() {
      const data = await apiService.getHolidayPackages(selectedPkgCategory);
      setPackages(data);
    }
    loadPackages();
  }, [selectedPkgCategory]);

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
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Update total budget when travelers or per-person budget changes
      if (field === 'travelerCount' || field === 'budgetPerPerson') {
        const count = field === 'travelerCount' ? Number(value) : prev.travelerCount;
        const perPerson = field === 'budgetPerPerson' ? Number(value) : prev.budgetPerPerson;
        updated.budget = count * perPerson;

        // If preset stops exist, scale stop budgets proportionally
        if (updated.stops && updated.stops.length > 0) {
          updated.stops = updated.stops.map((stop) => {
            const stopPerPerson = Number(stop.budgetPerPerson || Math.round(stop.budget / prev.travelerCount) || 10000);
            return {
              ...stop,
              budgetPerPerson: stopPerPerson,
              budget: stopPerPerson * count,
            };
          });
          updated.presetStops = updated.stops;
        }
      }

      // Automatically sync tailored description & matching destination cover image
      if (field === 'destination') {
        const tailoredDesc = getTailoredDescription(value);
        if (tailoredDesc) {
          updated.description = tailoredDesc;
        }
        updated.coverImageUrl = getDestinationCoverImage(value);
      }

      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleTravelerCountChange = (delta) => {
    const newCount = Math.max(1, Math.min(20, formData.travelerCount + delta));
    handleChange('travelerCount', newCount);
  };

  // Handle selecting a pre-built package with accurate per-person and total pricing
  const handleSelectPackage = (pkg) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + (pkg.durationDays || 5) * 86400000);
    const count = formData.travelerCount || 2;
    const perPersonPrice = Number(pkg.discountedPrice);
    const totalBudget = perPersonPrice * count;

    // Scale each preset stop budget proportionally to match traveler count & exact per-person package rate
    const scaledStops = (pkg.presetStops || []).map((stop, idx) => {
      const stopPerPerson = Number(stop.budgetPerPerson || stop.budget || Math.round(perPersonPrice / pkg.presetStops.length));
      return {
        id: Date.now() + idx + 1,
        cityName: stop.cityName,
        countryName: stop.countryName || '',
        dateRange: stop.dateRange,
        budgetPerPerson: stopPerPerson,
        budget: stopPerPerson * count,
        notes: stop.notes || '',
        selectedActivities: (stop.selectedActivities || []).map((a) => ({ ...a })),
      };
    });

    const updatedFormData = {
      name: pkg.title,
      destination: pkg.destination,
      cityId: null,
      startDate: today.toISOString().split('T')[0],
      endDate: futureDate.toISOString().split('T')[0],
      description: pkg.description,
      travelerCount: count,
      budgetPerPerson: perPersonPrice,
      budget: totalBudget,
      presetStops: scaledStops,
      stops: scaledStops,
      coverImageUrl: pkg.coverImageUrl || getDestinationCoverImage(pkg.destination),
    };

    setFormData(updatedFormData);
    onContinue(updatedFormData);
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
          <h1 className="wizard-main-heading">Plan your journey</h1>
          <p className="wizard-sub-heading">
            Choose a curated travel package or build your custom destination itinerary.
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

      {/* Mode Switcher Tabs */}
      <div className="wizard-mode-toggle-bar">
        <button
          type="button"
          className={`wizard-mode-tab ${plannerMode === 'packages' ? 'active' : ''}`}
          onClick={() => setPlannerMode('packages')}
        >
          <Package size={17} />
          <span>🌟 Explore Curated Packages</span>
          <span className="mode-tab-badge">Instant Setup</span>
        </button>

        <button
          type="button"
          className={`wizard-mode-tab ${plannerMode === 'custom' ? 'active' : ''}`}
          onClick={() => setPlannerMode('custom')}
        >
          <Compass size={17} />
          <span>✨ Custom Trip Builder</span>
        </button>
      </div>

      {/* VIEW A: Pre-built Holiday Packages */}
      {plannerMode === 'packages' && (
        <div className="curated-packages-section animate-fade-in">
          {/* Category Filter Pills */}
          <div className="package-category-filters">
            {[
              { id: 'all', label: 'All Packages' },
              { id: 'India Heritage & Hills', label: '🏰 India Heritage & Hills' },
              { id: 'Beach & Island', label: '🏖️ Beach & Islands' },
              { id: 'International Escapes', label: '✈️ International Escapes' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`pkg-cat-pill ${selectedPkgCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedPkgCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Package Cards Grid */}
          <div className="package-cards-grid">
            {packages.map((pkg) => (
              <HolidayPackageCard
                key={pkg.id}
                packageData={pkg}
                onSelectPackage={handleSelectPackage}
              />
            ))}
          </div>
        </div>
      )}

      {/* VIEW B: Custom Trip Builder Form */}
      {plannerMode === 'custom' && (
        <div className="wizard-card-surface animate-fade-in">
          <form onSubmit={handleContinue} className="wizard-form-layout">
            {/* Quick Destination Pills */}
            <div className="quick-dest-section">
              <span className="quick-dest-title">Popular Destinations Quick Pick:</span>
              <div className="quick-dest-pills">
                {quickDestinations.map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    className={`quick-pill ${formData.destination === q.value ? 'selected' : ''}`}
                    onClick={() => {
                      handleChange('destination', q.value);
                      handleChange('cityId', q.cityId);
                      handleChange('description', q.defaultDesc);
                      handleChange('coverImageUrl', getDestinationCoverImage(q.value));
                      if (!formData.name) {
                        handleChange('name', `${q.label.split(' ')[1]} Adventure`);
                      }
                    }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 1. Trip Name Field with Suggestions Dropdown */}
            <div className="wizard-field-group" ref={tripNameRef}>
              <label className="wizard-field-label">Trip name</label>
              <div className="wizard-input-wrapper">
                <input
                  type="text"
                  className={`wizard-text-input ${errors.name ? 'has-error' : ''}`}
                  placeholder="e.g. Golden Triangle Heritage Odyssey"
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
                  placeholder="Type city or country (e.g. Jaipur, Goa, Kerala, Delhi, Bali, Paris...)"
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
                    <div className="wizard-dropdown-header">Matching Destinations ({destinations.length})</div>
                    {destinations.map((city) => (
                      <button
                        key={city.cityId}
                        type="button"
                        className={`wizard-dropdown-item ${formData.destination === city.displayName ? 'is-selected' : ''}`}
                        onClick={() => {
                          handleChange('destination', city.displayName);
                          handleChange('cityId', city.cityId);
                          handleChange('description', getTailoredDescription(city.displayName));
                          handleChange('coverImageUrl', getDestinationCoverImage(city.displayName));
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

            {/* 3. Number of Travelers Counter & Group Size Presets */}
            <div className="wizard-field-group">
              <label className="wizard-field-label">
                Number of Travelers (Costs multiply per traveler)
              </label>
              <div className="traveler-selector-container">
                <div className="traveler-counter-box">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => handleTravelerCountChange(-1)}
                    disabled={formData.travelerCount <= 1}
                    aria-label="Decrease traveler count"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="counter-display">
                    <Users size={16} className="counter-icon" />
                    <span className="counter-number">{formData.travelerCount}</span>
                    <span className="counter-unit">
                      {formData.travelerCount === 1 ? 'Traveler' : 'Travelers'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => handleTravelerCountChange(1)}
                    disabled={formData.travelerCount >= 20}
                    aria-label="Increase traveler count"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="traveler-preset-pills">
                  {[
                    { count: 1, label: '1 Solo' },
                    { count: 2, label: '2 Pair / Couple' },
                    { count: 4, label: '4 Small Group' },
                    { count: 6, label: '6+ Family / Group' },
                  ].map((preset) => (
                    <button
                      key={preset.count}
                      type="button"
                      className={`traveler-preset-pill ${formData.travelerCount === preset.count ? 'active' : ''}`}
                      onClick={() => handleChange('travelerCount', preset.count)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Start Date & End Date in Two Columns */}
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

            {/* 5. Trip Description */}
            <div className="wizard-field-group">
              <label className="wizard-field-label">Trip description & highlights</label>
              <textarea
                rows={3}
                className="wizard-textarea"
                placeholder="What sights, experiences, or travel vibes are you planning?"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            {/* 6. Bottom Action Buttons */}
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
                <span>Continue to build itinerary</span>
                <ArrowRight size={16} className="btn-arrow-icon" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Step1TripBasics;
