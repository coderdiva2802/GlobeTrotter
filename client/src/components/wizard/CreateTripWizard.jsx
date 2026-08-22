import { useState, useEffect } from 'react';
import { Step1TripBasics } from './Step1TripBasics.jsx';
import { Step2ItineraryBuilder } from './Step2ItineraryBuilder.jsx';

export const CreateTripWizard = ({
  initialTripData = null,
  initialStep = 1,
  onComplete,
  onCancel,
  onSaveDraft,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep || 1);

  const [tripData, setTripData] = useState(() => {
    if (initialTripData) {
      const travelers = Number(initialTripData.travelerCount) || 2;
      const totalBudget = Number(initialTripData.budget) || 50000;
      return {
        id: initialTripData.id || null,
        name: initialTripData.name || 'Personalized Travel Journey',
        destination: initialTripData.locationSummary || initialTripData.destination || 'Jaipur, India',
        cityId: initialTripData.cityId || null,
        startDate: initialTripData.startDate ? initialTripData.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: initialTripData.endDate ? initialTripData.endDate.split('T')[0] : new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        description: initialTripData.description || '',
        stops: initialTripData.stops ? initialTripData.stops.map((s) => ({ ...s })) : [],
        presetStops: initialTripData.stops ? initialTripData.stops.map((s) => ({ ...s })) : null,
        travelerCount: travelers,
        budgetPerPerson: Math.round(totalBudget / travelers),
        budget: totalBudget,
        coverImageUrl: initialTripData.coverImageUrl || '',
      };
    }

    return {
      name: 'Golden Triangle Heritage Odyssey',
      destination: 'Delhi • Agra • Jaipur, India',
      cityId: 104,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
      description: 'Explore the royal soul of India spanning Delhi monuments, Taj Mahal sunrise, and Pink City forts.',
      stops: [],
      travelerCount: 2,
      budgetPerPerson: 24999,
      budget: 49998,
      coverImageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    };
  });

  // Sync state if initialTripData changes
  useEffect(() => {
    if (initialTripData) {
      const travelers = Number(initialTripData.travelerCount) || 2;
      const totalBudget = Number(initialTripData.budget) || 50000;
      setTripData({
        id: initialTripData.id || null,
        name: initialTripData.name || 'Personalized Travel Journey',
        destination: initialTripData.locationSummary || initialTripData.destination || 'Jaipur, India',
        cityId: initialTripData.cityId || null,
        startDate: initialTripData.startDate ? initialTripData.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: initialTripData.endDate ? initialTripData.endDate.split('T')[0] : new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        description: initialTripData.description || '',
        stops: initialTripData.stops ? initialTripData.stops.map((s) => ({ ...s })) : [],
        presetStops: initialTripData.stops ? initialTripData.stops.map((s) => ({ ...s })) : null,
        travelerCount: travelers,
        budgetPerPerson: Math.round(totalBudget / travelers),
        budget: totalBudget,
        coverImageUrl: initialTripData.coverImageUrl || '',
      });
      setCurrentStep(initialStep || 2);
    }
  }, [initialTripData, initialStep]);

  const handleStep1Continue = (step1Data) => {
    setTripData((prev) => ({
      ...prev,
      ...step1Data,
    }));
    setCurrentStep(2);
  };

  const handleStep2SaveAndContinue = (updatedStops) => {
    const totalBudget = updatedStops.reduce((acc, s) => acc + (Number(s.budget) || 0), 0);
    const stopsSummary = updatedStops.map((s) => s.cityName).filter(Boolean).join(' → ');

    const completePayload = {
      id: tripData.id || Date.now(),
      name: tripData.name || 'Personalized Travel Journey',
      locationSummary: stopsSummary || tripData.destination || 'India',
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      description: tripData.description,
      travelerCount: Number(tripData.travelerCount) || 2,
      budget: totalBudget || tripData.budget || 50000,
      currency: 'INR',
      stops: updatedStops.map((s, idx) => ({
        id: s.id || idx + 1,
        cityName: s.cityName,
        countryName: s.countryName || '',
        order: idx + 1,
        dateRange: s.dateRange,
        budgetPerPerson: Number(s.budgetPerPerson) || (Number(s.budget) ? Math.round(Number(s.budget) / (Number(tripData.travelerCount) || 2)) : 0),
        budget: Number(s.budget) || 0,
        notes: s.notes,
        selectedActivities: (s.selectedActivities || []).map((a) => ({ ...a })),
      })),
      coverImageUrl:
        tripData.coverImageUrl ||
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
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
          initialStops={tripData.stops && tripData.stops.length > 0 ? tripData.stops : tripData.presetStops}
          tripBasics={tripData}
          onBack={() => setCurrentStep(1)}
          onSaveAndContinue={handleStep2SaveAndContinue}
        />
      )}
    </div>
  );
};

export default CreateTripWizard;
