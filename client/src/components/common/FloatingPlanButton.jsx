import { Plus } from 'lucide-react';

export const FloatingPlanButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className="floating-plan-btn"
      onClick={onClick}
      aria-label="Plan a new trip"
    >
      <Plus size={18} className="plus-icon" strokeWidth={2.5} />
      <span className="btn-text">Plan a trip</span>
    </button>
  );
};

export default FloatingPlanButton;
