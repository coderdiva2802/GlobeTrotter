export const BudgetSummaryBar = ({ budgetSummary = {} }) => {
  const total = budgetSummary.totalBudgetFormatted || '₹1,20,000';
  const planned = budgetSummary.plannedExpensesFormatted || '₹96,500';
  const remaining = budgetSummary.remainingBudgetFormatted || '₹23,500';

  return (
    <div className="budget-summary-bar animate-fade-in">
      <div className="budget-summary-col">
        <span className="budget-summary-label">Total estimated budget</span>
        <span className="budget-summary-val">{total}</span>
      </div>

      <div className="budget-summary-col">
        <span className="budget-summary-label">Planned expenses</span>
        <span className="budget-summary-val">{planned}</span>
      </div>

      <div className="budget-summary-col">
        <span className="budget-summary-label">Remaining</span>
        <span className="budget-summary-val remaining-positive">{remaining}</span>
      </div>
    </div>
  );
};

export default BudgetSummaryBar;
