import { useState, useEffect } from 'react';
import { X, Search, Clock, Star, Plus, Check, MapPin, Tag } from 'lucide-react';
import { apiService } from '../../services/api.js';
import { useCurrency } from '../../context/CurrencyContext.jsx';

const categories = [
  'All',
  'Heritage & Culture',
  'Sightseeing',
  'Adventure & Nature',
  'Food & Nightlife',
];

export const ActivitySearchModal = ({
  isOpen,
  onClose,
  cityName,
  onSelectActivity,
  selectedActivities = [],
}) => {
  const { formatPrice } = useCurrency();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchActivities() {
      setLoading(true);
      const results = await apiService.searchActivities(cityName, query);

      // Filter by category if not 'All'
      const filtered = selectedCategory === 'All'
        ? results
        : results.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

      setActivities(filtered);
      setLoading(false);
    }
    fetchActivities();
  }, [isOpen, cityName, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="activity-search-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div>
              <div className="modal-location-tag">
                <MapPin size={13} />
                <span>{cityName || 'Selected Destination'}</span>
              </div>
              <h2 className="modal-title">Search Activities in {cityName || 'Destination'}</h2>
              <p className="modal-subtitle">Pick curated sights, tours, and culinary experiences tailored for this location</p>
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
            placeholder={`Search forts, temples, tours, safaris in ${cityName || 'destination'}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery('')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="activity-category-filter-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`act-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Activity List */}
        <div className="activity-modal-list">
          {loading ? (
            <div className="activity-loading-state">Finding top attractions & experiences...</div>
          ) : activities.length > 0 ? (
            activities.map((act) => {
              const isSelected = selectedActivities.some((a) => a.id === act.id || a.name === act.name);
              return (
                <div key={act.id} className="activity-item-card">
                  <div className="activity-item-info">
                    <div className="activity-category-pill">
                      <Tag size={11} style={{ marginRight: '4px' }} />
                      {act.category}
                    </div>
                    <h4 className="activity-item-title">{act.name}</h4>
                    <div className="activity-item-meta">
                      <span className="act-meta">
                        <Clock size={13} /> {act.durationMinutes} mins
                      </span>
                      <span className="act-meta">
                        <Star size={13} className="star-icon" /> {act.rating}
                      </span>
                      <span className="act-meta cost-meta">
                        {formatPrice(act.estimatedCost)}
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
            <div className="activity-empty-state">
              <p>No activities found in <strong>{cityName}</strong> matching your search.</p>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Tip: Try clearing your search keyword or switching category filters.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="activity-modal-footer">
          <div className="activity-footer-count">
            <span>{selectedActivities.length} {selectedActivities.length === 1 ? 'activity' : 'activities'} selected</span>
          </div>
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
