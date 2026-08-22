import { useCurrency } from '../../context/CurrencyContext.jsx';

export const DayItineraryCard = ({ day }) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="day-itinerary-card animate-fade-in">
      {/* Day Card Header */}
      <div className="day-card-header">
        <h3 className="day-card-title">{day.dayLabel || `Day ${day.dayNumber}`}</h3>
        <span className="day-card-location">{day.locationHeader || `${day.cityName} • ${day.dateFormatted}`}</span>
      </div>

      {/* Schedule Table / List */}
      <div className="day-schedule-table">
        {/* Table Header */}
        <div className="schedule-table-header">
          <span className="col-time">Time</span>
          <span className="col-activity">Activity</span>
          <span className="col-expense">Expense</span>
        </div>

        {/* Schedule Rows */}
        <div className="schedule-table-body">
          {day.items && day.items.map((item) => (
            <div key={item.id} className="schedule-row">
              <span className="col-time schedule-time-val">{item.time}</span>
              <span className="col-activity schedule-act-val">{item.activityName}</span>
              <span className="col-expense schedule-expense-val">
                {item.expense === 0 ? 'Free' : formatPrice(item.expense)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayItineraryCard;
