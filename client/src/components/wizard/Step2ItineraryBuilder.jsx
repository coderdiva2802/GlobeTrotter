import { useState } from 'react';
import { Plus, ArrowLeft, ArrowRight, Wallet, MapPin, Users } from 'lucide-react';
import { StopCard } from './StopCard.jsx';
import { ActivitySearchModal } from './ActivitySearchModal.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';

export const Step2ItineraryBuilder = ({
  initialStops = [],
  tripBasics = {},
  onBack,
  onSaveAndContinue,
}) => {
  const { formatPrice } = useCurrency();
  const travelerCount = Number(tripBasics.travelerCount) || 2;

  // Initialize with stops from existing trip/package, or parse from destination
  const [stops, setStops] = useState(() => {
    // 1. If presetStops or initialStops with items are provided, use them directly
    if (initialStops && initialStops.length > 0) {
      return initialStops.map((s, idx) => ({
        id: s.id || Date.now() + idx + 1,
        cityName: s.cityName || `Stop ${idx + 1}`,
        countryName: s.countryName || '',
        dateRange: s.dateRange || `Day ${idx * 2 + 1} - Day ${idx * 2 + 2}`,
        budgetPerPerson: s.budgetPerPerson || (s.budget ? Math.round(s.budget / travelerCount) : 10000),
        budget: s.budget || (s.budgetPerPerson ? s.budgetPerPerson * travelerCount : 20000),
        notes: s.notes || '',
        selectedActivities: (s.selectedActivities || []).map((a) => ({ ...a })),
      }));
    }

    if (tripBasics.presetStops && tripBasics.presetStops.length > 0) {
      return tripBasics.presetStops.map((s, idx) => ({
        id: s.id || Date.now() + idx + 1,
        cityName: s.cityName || `Stop ${idx + 1}`,
        countryName: s.countryName || '',
        dateRange: s.dateRange || `Day ${idx * 2 + 1} - Day ${idx * 2 + 2}`,
        budgetPerPerson: s.budgetPerPerson || (s.budget ? Math.round(s.budget / travelerCount) : 10000),
        budget: s.budget || (s.budgetPerPerson ? s.budgetPerPerson * travelerCount : 20000),
        notes: s.notes || '',
        selectedActivities: (s.selectedActivities || []).map((a) => ({ ...a })),
      }));
    }

    // 2. Parse multi-city destination string (e.g. "Delhi • Agra • Jaipur, India")
    const dest = tripBasics.destination || 'Jaipur, India';
    const cleanDest = dest.split(',')[0];
    if (cleanDest.includes('•')) {
      const cityNames = cleanDest.split('•').map((c) => c.trim()).filter(Boolean);
      const perStopBudget = Math.round((tripBasics.budget || 50000) / (cityNames.length || 1));
      return cityNames.map((city, idx) => ({
        id: Date.now() + idx + 1,
        cityName: city,
        countryName: '',
        dateRange: `Day ${idx * 2 + 1} - Day ${idx * 2 + 2}`,
        budgetPerPerson: Math.round(perStopBudget / travelerCount),
        budget: perStopBudget,
        notes: `Explore top landmarks, heritage, and attractions in ${city}`,
        selectedActivities: [],
      }));
    }

    // 3. Fallback for single custom destination
    const firstCity = cleanDest || 'Jaipur';
    const totalBudget = Number(tripBasics.budget) || 50000;
    const stop1Budget = Math.round(totalBudget * 0.6);
    const stop2Budget = totalBudget - stop1Budget;

    return [
      {
        id: 1,
        cityName: firstCity,
        countryName: '',
        dateRange: 'Day 1 - Day 3',
        budgetPerPerson: Math.round(stop1Budget / travelerCount),
        budget: stop1Budget,
        notes: `Landmarks, cultural sights, and local heritage in ${firstCity}`,
        selectedActivities: [],
      },
      {
        id: 2,
        cityName: firstCity.includes('Delhi') ? 'Agra' : firstCity.includes('Jaipur') ? 'Udaipur' : 'Goa',
        countryName: '',
        dateRange: 'Day 4 - Day 5',
        budgetPerPerson: Math.round(stop2Budget / travelerCount),
        budget: stop2Budget,
        notes: 'Exploration, cuisine, and evening tours',
        selectedActivities: [],
      },
    ];
  });

  const [activeStopForActivity, setActiveStopForActivity] = useState(null);

  // Update a field inside a specific stop
  const handleStopChange = (stopId, field, value) => {
    setStops((prev) =>
      prev.map((s) => {
        if (s.id === stopId) {
          const updated = { ...s, [field]: value };
          if (field === 'budget') {
            updated.budgetPerPerson = travelerCount > 0 ? Math.round(Number(value) / travelerCount) : Number(value);
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Remove a stop
  const handleRemoveStop = (stopId) => {
    if (stops.length <= 1) return;
    setStops((prev) => prev.filter((s) => s.id !== stopId));
  };

  // Add another stop
  const handleAddStop = (defaultCity = '') => {
    const defaultPerStop = 15000;
    const newStop = {
      id: Date.now(),
      cityName: defaultCity || '',
      countryName: '',
      dateRange: `Day ${stops.length * 2 + 1} - Day ${stops.length * 2 + 2}`,
      budgetPerPerson: Math.round(defaultPerStop / travelerCount),
      budget: defaultPerStop,
      notes: '',
      selectedActivities: [],
    };
    setStops((prev) => [...prev, newStop]);
  };

  // Activity selection handler
  const handleSelectActivity = (act) => {
    if (!activeStopForActivity) return;
    setStops((prev) =>
      prev.map((s) => {
        if (s.id === activeStopForActivity.id) {
          const currentNotes = s.notes ? s.notes.trim() : '';
          const alreadyAdded = s.selectedActivities?.some((a) => a.id === act.id || a.name === act.name);
          const updatedActs = alreadyAdded
            ? s.selectedActivities.filter((a) => a.id !== act.id && a.name !== act.name)
            : [...(s.selectedActivities || []), act];

          const newNote = currentNotes
            ? `${currentNotes}, ${act.name}`
            : act.name;

          return {
            ...s,
            selectedActivities: updatedActs,
            notes: alreadyAdded ? s.notes : newNote,
          };
        }
        return s;
      })
    );
  };

  // Calculate live cumulative budget and per-person cost
  const totalAllocatedBudget = stops.reduce((acc, s) => acc + (Number(s.budget) || 0), 0);
  const costPerPerson = travelerCount > 0 ? Math.round(totalAllocatedBudget / travelerCount) : totalAllocatedBudget;
  const totalActivitiesCount = stops.reduce((acc, s) => acc + ((s.selectedActivities || []).length), 0);

  // Handle Save & View Itinerary
  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveAndContinue(stops);
  };

  return (
    <div className="wizard-page-container animate-fade-in">
      {/* Step 2 Top Header */}
      <div className="wizard-top-header">
        <div className="wizard-title-group">
          <span className="wizard-step-label">STEP 2 OF 3</span>
          <h1 className="wizard-main-heading">Build your multi-stop itinerary</h1>
          <p className="wizard-sub-heading">
            Customize destination stops, schedule windows, budgets, and curated activities for each place.
          </p>
        </div>

        {/* Live Trip Summary Pills */}
        <div className="step2-header-stats">
          <div className="step2-stat-item">
            <Users size={14} />
            <span>{travelerCount} {travelerCount === 1 ? 'Traveler' : 'Travelers'}</span>
          </div>
          <div className="step2-stat-item">
            <MapPin size={14} />
            <span>{stops.length} {stops.length === 1 ? 'Stop' : 'Stops'}</span>
          </div>
          <div className="step2-stat-item budget-stat">
            <Wallet size={14} />
            <span>
              Total: {formatPrice(totalAllocatedBudget)} ({formatPrice(costPerPerson)}/person)
            </span>
          </div>
        </div>
      </div>

      {/* Stop Cards List */}
      <div className="itinerary-stops-list">
        {stops.map((stop, idx) => (
          <StopCard
            key={stop.id}
            stop={stop}
            index={idx}
            totalStops={stops.length}
            onChange={handleStopChange}
            onRemove={handleRemoveStop}
            onOpenActivitySearch={(s) => setActiveStopForActivity(s)}
          />
        ))}
      </div>

      {/* + Add Another Stop Button */}
      <div className="add-stop-center-wrapper">
        <button
          type="button"
          className="add-another-stop-dashed-btn"
          onClick={() => handleAddStop()}
        >
          <Plus size={16} />
          <span>Add another destination stop</span>
        </button>
      </div>

      {/* Bottom Actions Bar */}
      <div className="wizard-actions-bar step2-actions-bar">
        <button
          type="button"
          className="wizard-btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Step 1 (Basics)</span>
        </button>

        <button
          type="button"
          className="wizard-btn-primary"
          onClick={handleSubmit}
        >
          <span>Save & view interactive itinerary ({totalActivitiesCount} activities)</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Activity Search Modal */}
      <ActivitySearchModal
        isOpen={Boolean(activeStopForActivity)}
        onClose={() => setActiveStopForActivity(null)}
        cityName={activeStopForActivity?.cityName || tripBasics.destination || ''}
        onSelectActivity={handleSelectActivity}
        selectedActivities={activeStopForActivity?.selectedActivities || []}
      />
    </div>
  );
};

export default Step2ItineraryBuilder;
