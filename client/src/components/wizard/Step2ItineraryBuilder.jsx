import { useState } from 'react';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { StopCard } from './StopCard.jsx';
import { ActivitySearchModal } from './ActivitySearchModal.jsx';

export const Step2ItineraryBuilder = ({
  initialStops = [],
  tripBasics = {},
  onBack,
  onSaveAndContinue,
  onSearchPlaces,
}) => {
  // Initialize with stops or 3 default stops matching the design mockup
  const [stops, setStops] = useState(() => {
    if (initialStops && initialStops.length > 0) {
      return initialStops.map((s, idx) => ({
        id: s.id || Date.now() + idx,
        cityName: s.cityName || tripBasics.destination?.split(',')[0] || 'Paris',
        dateRange: s.dateRange || '10 Jun - 13 Jun',
        budget: s.budget || 40000,
        notes: s.notes || 'Museums, cafés and city highlights',
        selectedActivities: s.selectedActivities || [],
      }));
    }
    return [
      {
        id: 1,
        cityName: 'Paris',
        dateRange: '10 Jun - 13 Jun',
        budget: 40000,
        notes: 'Museums, cafés and city highlights',
        selectedActivities: [],
      },
      {
        id: 2,
        cityName: 'Amsterdam',
        dateRange: '13 Jun - 16 Jun',
        budget: 35000,
        notes: 'Canals, culture and local food',
        selectedActivities: [],
      },
      {
        id: 3,
        cityName: 'Berlin',
        dateRange: '16 Jun - 20 Jun',
        budget: 45000,
        notes: 'History, architecture and nightlife',
        selectedActivities: [],
      },
    ];
  });

  const [activeStopForActivity, setActiveStopForActivity] = useState(null);

  // Update a field inside a specific stop
  const handleStopChange = (stopId, field, value) => {
    setStops((prev) =>
      prev.map((s) => (s.id === stopId ? { ...s, [field]: value } : s))
    );
  };

  // Remove a stop
  const handleRemoveStop = (stopId) => {
    if (stops.length <= 1) return;
    setStops((prev) => prev.filter((s) => s.id !== stopId));
  };

  // Add another stop
  const handleAddStop = () => {
    const newStop = {
      id: Date.now(),
      cityName: '',
      dateRange: '',
      budget: 30000,
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
          const alreadyAdded = s.selectedActivities?.some((a) => a.id === act.id);
          const updatedActs = alreadyAdded
            ? s.selectedActivities.filter((a) => a.id !== act.id)
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
          <h1 className="wizard-main-heading">Build your itinerary</h1>
          <p className="wizard-sub-heading">
            Add destinations, dates and a budget for every stop.
          </p>
        </div>

        <button
          type="button"
          className="wizard-search-places-btn"
          onClick={onSearchPlaces}
        >
          <Plus size={16} />
          <span>Search places</span>
        </button>
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
          onClick={handleAddStop}
        >
          <Plus size={16} />
          <span>Add another stop</span>
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
          <span>Back</span>
        </button>

        <button
          type="button"
          className="wizard-btn-primary"
          onClick={handleSubmit}
        >
          <span>Save & view itinerary</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Activity Search Modal */}
      <ActivitySearchModal
        isOpen={Boolean(activeStopForActivity)}
        onClose={() => setActiveStopForActivity(null)}
        cityName={activeStopForActivity?.cityName || ''}
        onSelectActivity={handleSelectActivity}
        selectedActivities={activeStopForActivity?.selectedActivities || []}
      />
    </div>
  );
};

export default Step2ItineraryBuilder;
