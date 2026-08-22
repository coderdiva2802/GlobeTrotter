import { AlertTriangle, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext.jsx';

export const BudgetSummaryBar = ({ budgetSummary = {} }) => {
  const { formatPrice } = useCurrency();
  const travelers = Number(budgetSummary.travelerCount) || 1;
  const totalNum = Number(budgetSummary.totalBudget) || 120000;
  const plannedNum = Number(budgetSummary.plannedExpenses) || 96500;
  const remainingNum = totalNum - plannedNum;

  const costPerPersonNum = Math.round(totalNum / travelers);
  const plannedPerPersonNum = Math.round(plannedNum / travelers);
  const remainingPerPersonNum = Math.round(remainingNum / travelers);

  const isOverBudget = remainingNum < 0;
  const absRemaining = Math.abs(remainingNum);
  const absRemainingPerPerson = Math.abs(remainingPerPersonNum);

  const percentUsed = totalNum > 0 ? Math.min(Math.round((plannedNum / totalNum) * 100), 160) : 100;
  const displayPercent = totalNum > 0 ? Math.round((plannedNum / totalNum) * 100) : 100;

  return (
    <div className="budget-summary-card animate-fade-in">
      {/* 3 Main Stat Columns */}
      <div className="budget-summary-grid">
        {/* 1. Total Budget */}
        <div className="budget-summary-col">
          <span className="budget-summary-label">Total Estimated Budget</span>
          <span className="budget-summary-val">{formatPrice(totalNum)}</span>
          <span className="budget-per-person-subtext">
            {formatPrice(costPerPersonNum)} / person
            {travelers > 1 && ` (${travelers} travelers)`}
          </span>
        </div>

        {/* 2. Planned Expenses */}
        <div className="budget-summary-col">
          <span className="budget-summary-label">Planned Expenses</span>
          <span className="budget-summary-val">{formatPrice(plannedNum)}</span>
          <span className="budget-per-person-subtext">
            {formatPrice(plannedPerPersonNum)} / person
          </span>
        </div>

        {/* 3. Remaining Balance */}
        <div className="budget-summary-col">
          <div className="budget-label-row">
            <span className="budget-summary-label">Remaining Balance</span>
            {isOverBudget ? (
              <span className="budget-status-pill over-budget">
                <AlertTriangle size={11} />
                <span>Over Budget</span>
              </span>
            ) : (
              <span className="budget-status-pill on-track">
                <CheckCircle size={11} />
                <span>Within Budget</span>
              </span>
            )}
          </div>
          <span
            className={`budget-summary-val ${
              isOverBudget ? 'remaining-negative' : 'remaining-positive'
            }`}
          >
            {isOverBudget ? `-${formatPrice(absRemaining)}` : formatPrice(remainingNum)}
          </span>
          <span className={`budget-per-person-subtext ${isOverBudget ? 'text-danger-subtext' : ''}`}>
            {isOverBudget
              ? `-${formatPrice(absRemainingPerPerson)} / person (Over Budget)`
              : `${formatPrice(remainingPerPersonNum)} / person remaining`}
          </span>
        </div>
      </div>

      {/* Progress Bar with Utilization Status */}
      <div className="budget-progress-section">
        <div className="budget-progress-header">
          <span className="progress-info-text">
            <TrendingUp size={13} style={{ marginRight: '5px' }} />
            Budget Utilization: <strong>{displayPercent}%</strong>
            <span className="travelers-chip-pill" style={{ marginLeft: '10px' }}>
              <Users size={12} style={{ marginRight: '4px' }} />
              {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
            </span>
          </span>
          <span className={`progress-status-text ${isOverBudget ? 'text-danger' : 'text-success'}`}>
            {isOverBudget
              ? `⚠️ Exceeds total budget by ${formatPrice(absRemaining)} (${formatPrice(absRemainingPerPerson)}/person)`
              : `${formatPrice(absRemaining)} available for dining & leisure`}
          </span>
        </div>

        <div className="budget-progress-track">
          <div
            className={`budget-progress-fill ${isOverBudget ? 'is-overflow' : ''}`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryBar;
