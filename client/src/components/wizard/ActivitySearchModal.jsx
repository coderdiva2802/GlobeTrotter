import { useState, useEffect } from 'react';
import { X, Search, Clock, Star, Plus, Check } from 'lucide-react';
import { apiService } from '../../services/api.js';

export const ActivitySearchModal = ({
  isOpen,
  onClose,
  cityName,
  onSelectActivity,
  selectedActivities = [],
}) => {
  const [query, setQuery] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchActivities() {
      setLoading(true);
      const results = await apiService.searchActivities(cityName, query);
      setActivities(results);
      setLoading(false);
    }
    fetchActivities();
  }, [isOpen, cityName, query]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="modal-container activity-search-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div>
              <h2 className="modal-title">Search Activities in {cityName || 'Destination'}</h2>
              <p className="modal-subtitle">Pick curated sights, tours, and culinary experiences</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="activity-modal-search-box">
          <Search size={17} className="activity-search-icon" />
          <input
            type="text"
            className="activity-search-input"
            placeholder="Search museums, tours, food, landmarks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Activity List */}
        <div className="activity-modal-list">
          {loading ? (
            <div className="activity-loading-state">Finding top recommendations...</div>
          ) : activities.length > 0 ? (
            activities.map((act) => {
              const isSelected = selectedActivities.some((a) => a.id === act.id || a.name === act.name);
              return (
                <div key={act.id} className="activity-item-card">
                  <div className="activity-item-info">
                    <div className="activity-category-pill">{act.category}</div>
                    <h4 className="activity-item-title">{act.name}</h4>
                    <div className="activity-item-meta">
                      <span className="act-meta">
                        <Clock size={13} /> {act.durationMinutes} mins
                      </span>
                      <span className="act-meta">
                        <Star size={13} className="star-icon" /> {act.rating}
                      </span>
                      <span className="act-meta cost-meta">
                        ₹{Number(act.estimatedCost).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`activity-add-btn ${isSelected ? 'added' : ''}`}
                    onClick={() => onSelectActivity(act)}
                  >
                    {isSelected ? (
                      <>
                        <Check size={14} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="activity-empty-state">No activities found matching "{query}"</div>
          )}
        </div>

        {/* Footer */}
        <div className="activity-modal-footer">
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySearchModal;
