import { useState } from 'react';
import { Step1TripBasics } from './Step1TripBasics.jsx';
import { MapPin, CheckCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export const CreateTripWizard = ({ onComplete, onCancel, onSaveDraft }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    name: '',
    destination: '',
    cityId: null,
    startDate: '',
    endDate: '',
    description: '',
    stops: [],
    travelerCount: 2,
    budget: 2500,
  });

  const handleStep1Continue = (step1Data) => {
    setTripData((prev) => ({
      ...prev,
      ...step1Data,
      stops: [
        {
          id: 1,
          cityName: step1Data.destination.split(',')[0].trim(),
          countryName: step1Data.destination.split(',')[1]?.trim() || '',
          order: 1,
        },
      ],
    }));
    setCurrentStep(2);
  };

  const handleFinishWizard = () => {
    onComplete({
      name: tripData.name,
      locationSummary: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      description: tripData.description,
      travelerCount: tripData.travelerCount,
      budget: tripData.budget,
      stops: tripData.stops,
      coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    });
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
        <div className="wizard-page-container animate-fade-in">
          <div className="wizard-top-header">
            <div className="wizard-title-group">
              <span className="wizard-step-label">STEP 2 OF 3</span>
              <h1 className="wizard-main-heading">Build Your Itinerary</h1>
              <p className="wizard-sub-heading">
                Add stops, transit methods, and customize days in {tripData.destination || 'your destination'}.
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
            <div className="wizard-step2-content">
              <div className="stop-card-preview">
                <div className="stop-badge">Stop 1 (Starting Point)</div>
                <div className="stop-title-row">
                  <MapPin size={20} className="stop-icon" />
                  <div>
                    <h3 className="stop-title">{tripData.destination}</h3>
                    <span className="stop-dates">
                      {tripData.startDate} — {tripData.endDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="step2-info-banner">
                <Sparkles size={18} className="sparkle-icon" />
                <p>
                  AI Travel Assistant has prepared recommended attractions, transit links, and dining spots for <strong>{tripData.name}</strong>.
                </p>
              </div>

              <div className="wizard-actions-bar">
                <button
                  type="button"
                  className="wizard-btn-secondary"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Basics</span>
                </button>

                <button
                  type="button"
                  className="wizard-btn-primary"
                  onClick={() => setCurrentStep(3)}
                >
                  <span>Continue to Review</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
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
                  <span className="review-label">First Destination:</span>
                  <span className="review-val">{tripData.destination}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Travel Window:</span>
                  <span className="review-val">{tripData.startDate} to {tripData.endDate}</span>
                </div>
                {tripData.description && (
                  <div className="review-row">
                    <span className="review-label">Notes:</span>
                    <span className="review-val">{tripData.description}</span>
                  </div>
                )}
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
                  onClick={handleFinishWizard}
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
