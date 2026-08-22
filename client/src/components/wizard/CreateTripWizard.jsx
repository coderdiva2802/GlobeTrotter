import { useState } from 'react';
import { Step1TripBasics } from './Step1TripBasics.jsx';
import { Step2ItineraryBuilder } from './Step2ItineraryBuilder.jsx';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export const CreateTripWizard = ({ onComplete, onCancel, onSaveDraft }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    name: 'Europe Summer Adventure',
    destination: 'Paris, France',
    cityId: 1,
    startDate: '2025-06-10',
    endDate: '2025-06-20',
    description: 'Scenic road trip and cultural tour across Europe',
    stops: [
      {
        id: 1,
        cityName: 'Paris',
        dateRange: '10 Jun - 13 Jun',
        budget: 40000,
        notes: 'Museums, cafés and city highlights',
      },
      {
        id: 2,
        cityName: 'Amsterdam',
        dateRange: '13 Jun - 16 Jun',
        budget: 35000,
        notes: 'Canals, culture and local food',
      },
      {
        id: 3,
        cityName: 'Berlin',
        dateRange: '16 Jun - 20 Jun',
        budget: 45000,
        notes: 'History, architecture and nightlife',
      },
    ],
    travelerCount: 2,
    budget: 120000,
  });

  const handleStep1Continue = (step1Data) => {
    setTripData((prev) => ({
      ...prev,
      ...step1Data,
    }));
    setCurrentStep(2);
  };

  const handleStep2SaveAndContinue = (updatedStops) => {
    const totalBudget = updatedStops.reduce((acc, s) => acc + (Number(s.budget) || 0), 0);
    const stopsSummary = updatedStops.map((s) => s.cityName).filter(Boolean).join(', ');

    const completePayload = {
      name: tripData.name || 'Europe Summer Adventure',
      locationSummary: stopsSummary || tripData.destination || 'Paris, Amsterdam, Berlin',
      startDate: tripData.startDate || '2025-06-10',
      endDate: tripData.endDate || '2025-06-20',
      description: tripData.description,
      travelerCount: tripData.travelerCount || 2,
      budget: totalBudget || 120000,
      currency: 'INR',
      stops: updatedStops.map((s, idx) => ({
        id: s.id || idx + 1,
        cityName: s.cityName,
        countryName: '',
        order: idx + 1,
        dateRange: s.dateRange,
        budget: s.budget,
        notes: s.notes,
      })),
      coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    };

    onComplete(completePayload);
  };

  return (
    <div className="wizard-outer-wrapper">
      {currentStep === 1 && (
        <Step1TripBasics
          initialData={tripData}
          onContinue={handleStep1Continue}
          onSaveForLater={(draftData) => {
            onSaveDraft?.({
              ...tripData,
              ...draftData,
              locationSummary: draftData.destination || 'Draft Trip',
            });
          }}
          onCancel={onCancel}
        />
      )}

      {currentStep === 2 && (
        <Step2ItineraryBuilder
          initialStops={tripData.stops}
          tripBasics={tripData}
          onBack={() => setCurrentStep(1)}
          onSaveAndContinue={handleStep2SaveAndContinue}
          onSearchPlaces={() => {
            alert('Search places enabled! You can also click "Search & add activities" on each stop.');
          }}
        />
      )}

      {currentStep === 3 && (
        <div className="wizard-page-container animate-fade-in">
          <div className="wizard-top-header">
            <div className="wizard-title-group">
              <span className="wizard-step-label">STEP 3 OF 3</span>
              <h1 className="wizard-main-heading">Confirm & Launch Trip</h1>
              <p className="wizard-sub-heading">
                Review your journey summary and generate your live interactive itinerary.
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

          <div className="wizard-card-surface">
            <div className="wizard-step3-content">
              <div className="review-summary-card">
                <h3 className="review-trip-name">{tripData.name}</h3>
                <div className="review-row">
                  <span className="review-label">Stops:</span>
                  <span className="review-val">
                    {tripData.stops?.map((s) => s.cityName).join(' → ')}
                  </span>
                </div>
                <div className="review-row">
                  <span className="review-label">Travel Window:</span>
                  <span className="review-val">{tripData.startDate} to {tripData.endDate}</span>
                </div>
              </div>

              <div className="wizard-actions-bar">
                <button
                  type="button"
                  className="wizard-btn-secondary"
                  onClick={() => setCurrentStep(2)}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  className="wizard-btn-primary"
                  onClick={() => handleStep2SaveAndContinue(tripData.stops)}
                >
                  <CheckCircle size={16} />
                  <span>Generate Trip Itinerary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTripWizard;
