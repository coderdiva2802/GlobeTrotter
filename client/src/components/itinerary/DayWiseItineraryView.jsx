import { useState, useEffect } from 'react';
import { ItineraryHeaderHero } from './ItineraryHeaderHero.jsx';
import { BudgetSummaryBar } from './BudgetSummaryBar.jsx';
import { DayItineraryCard } from './DayItineraryCard.jsx';
import { ShareTripModal } from './ShareTripModal.jsx';
import { apiService } from '../../services/api.js';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { ArrowLeft, AlertTriangle, Sparkles } from 'lucide-react';

export const DayWiseItineraryView = ({
  trip,
  onEditItinerary,
  onBackToDashboard,
}) => {
  const { formatPrice } = useCurrency();
  const [itineraryData, setItineraryData] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    async function loadItinerary() {
      const data = await apiService.getTripItinerary(trip?.id || 105, trip);
      setItineraryData(data);
    }
    loadItinerary();
  }, [trip]);

  const handleShare = async () => {
    const result = await apiService.shareTrip(trip?.id || 105);
    setShareUrl(result.shareUrl);
    setIsShareModalOpen(true);
  };

  const handleEdit = () => {
    const tripToEdit = itineraryData?.trip || trip;
    onEditItinerary?.(tripToEdit);
  };

  if (!itineraryData) {
    return (
      <div className="itinerary-loading-wrapper">
        <p>Generating personalized itinerary schedule and budget breakdown...</p>
      </div>
    );
  }

  const isOverBudget = itineraryData.budgetSummary?.remainingBudget < 0;
  const overBudgetAmount = Math.abs(itineraryData.budgetSummary?.remainingBudget || 0);

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
        onEditItinerary={handleEdit}
        onShareTrip={handleShare}
      />

      {/* 2. Budget Summary Bar with Utilization Progress */}
      <BudgetSummaryBar budgetSummary={itineraryData.budgetSummary} />

      {/* 2b. Over-Budget Alert Callout Card (Visible when Remaining < 0) */}
      {isOverBudget && (
        <div className="budget-alert-card animate-fade-in">
          <div className="budget-alert-icon-wrap">
            <AlertTriangle size={22} className="budget-alert-icon" />
          </div>
          <div className="budget-alert-content">
            <h4 className="budget-alert-title">
              Budget Exceeded by {formatPrice(overBudgetAmount)}
            </h4>
            <p className="budget-alert-desc">
              Your planned activity expenses (
              <strong>{formatPrice(itineraryData.budgetSummary.plannedExpenses)}</strong>) exceed your total estimated
              trip budget (<strong>{formatPrice(itineraryData.budgetSummary.totalBudget)}</strong>). Consider swapping
              premium experiences or adjusting stop allocations to balance your budget.
            </p>
          </div>
          <button
            type="button"
            className="budget-alert-action-btn"
            onClick={handleEdit}
          >
            <Sparkles size={14} />
            <span>Optimize Budget</span>
          </button>
        </div>
      )}

      {/* 3. Section Title */}
      <div className="day-wise-section-header">
        <div>
          <h2 className="day-wise-main-title">Your Day-Wise Interactive Itinerary</h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.2rem' }}>
            Curated daily schedules, landmark timings, and planned expenses for{' '}
            <strong>{itineraryData.trip.locationSummary}</strong>
          </p>
        </div>
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
