import { useState, useEffect } from 'react';
import { ItineraryHeaderHero } from './ItineraryHeaderHero.jsx';
import { BudgetSummaryBar } from './BudgetSummaryBar.jsx';
import { DayItineraryCard } from './DayItineraryCard.jsx';
import { ShareTripModal } from './ShareTripModal.jsx';
import { apiService } from '../../services/api.js';
import { ArrowLeft } from 'lucide-react';

export const DayWiseItineraryView = ({
  trip,
  onEditItinerary,
  onBackToDashboard,
}) => {
  const [itineraryData, setItineraryData] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    async function loadItinerary() {
      const data = await apiService.getTripItinerary(trip?.id || 105);
      // Merge with custom trip attributes if passed
      if (trip) {
        data.trip = {
          ...data.trip,
          name: trip.name || data.trip.name,
          locationSummary: trip.locationSummary || data.trip.locationSummary,
          formattedDates: trip.formattedDates || data.trip.formattedDates,
          coverImageUrl: trip.coverImageUrl || data.trip.coverImageUrl,
        };
        if (trip.budget) {
          data.budgetSummary.totalBudget = trip.budget;
          data.budgetSummary.totalBudgetFormatted = `₹${Number(trip.budget).toLocaleString('en-IN')}`;
          const planned = data.budgetSummary.plannedExpenses || 96500;
          data.budgetSummary.remainingBudget = trip.budget - planned;
          data.budgetSummary.remainingBudgetFormatted = `₹${Number(trip.budget - planned).toLocaleString('en-IN')}`;
        }
      }
      setItineraryData(data);
    }
    loadItinerary();
  }, [trip]);

  const handleShare = async () => {
    const result = await apiService.shareTrip(trip?.id || 105);
    setShareUrl(result.shareUrl);
    setIsShareModalOpen(true);
  };

  if (!itineraryData) {
    return (
      <div className="itinerary-loading-wrapper">
        <p>Loading itinerary schedule and expenses...</p>
      </div>
    );
  }

  return (
    <div className="itinerary-page-layout animate-fade-in">
      {/* Back button link */}
      <div className="itinerary-nav-back-row">
        <button
          type="button"
          className="itinerary-back-btn"
          onClick={onBackToDashboard}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* 1. Hero Cover Header Card */}
      <ItineraryHeaderHero
        trip={itineraryData.trip}
        onEditItinerary={onEditItinerary}
        onShareTrip={handleShare}
      />

      {/* 2. Budget Summary Bar */}
      <BudgetSummaryBar budgetSummary={itineraryData.budgetSummary} />

      {/* 3. Section Title */}
      <div className="day-wise-section-header">
        <h2 className="day-wise-main-title">Your day-wise itinerary</h2>
      </div>

      {/* 4. Day-wise Cards List */}
      <div className="day-itinerary-cards-list">
        {itineraryData.days.map((day) => (
          <DayItineraryCard key={day.id || day.dayNumber} day={day} />
        ))}
      </div>

      {/* Share Trip Modal */}
      <ShareTripModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tripName={itineraryData.trip.name}
        shareUrl={shareUrl}
      />
    </div>
  );
};

export default DayWiseItineraryView;
