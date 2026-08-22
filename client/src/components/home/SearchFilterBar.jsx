import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Layers,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Check,
  Compass,
  MapPin,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { mockActivities, mockRegions, mockTrips } from '../../services/mockData';

export const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  activeGroupBy,
  onGroupByChange,
  onSelectActivity,
}) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null); // 'group' | 'filter' | 'sort' | null
  const [isInputFocused, setIsInputFocused] = useState(false);
  const containerRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setIsInputFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
    setIsInputFocused(false);
  };

  // Compute live suggestions matching searchQuery
  const suggestions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const matchingActivities = mockActivities.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.destination.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchingRegions = mockRegions.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    ).slice(0, 2);

    const matchingTrips = mockTrips.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.locationSummary.toLowerCase().includes(q)
    ).slice(0, 2);

    const totalCount =
      matchingActivities.length + matchingRegions.length + matchingTrips.length;

    return {
      activities: matchingActivities,
      regions: matchingRegions,
      trips: matchingTrips,
      totalCount,
    };
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsInputFocused(false);
      }
    }
  };

  const handleActivityClick = (act) => {
    setIsInputFocused(false);
    if (onSelectActivity) {
      onSelectActivity(act);
    } else {
      navigate(`/search?q=${encodeURIComponent(act.name)}`);
    }
  };

  return (
    <div className="search-filter-wrapper" ref={containerRef}>
      <div className="search-filter-bar">
        {/* Search Input Box */}
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search destinations, trips, activities (e.g. Manali, Trek)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Action Buttons Group */}
        <div className="filter-actions-group">
          {/* Group by Button */}
          <div className="dropdown-wrapper">
            <button
              type="button"
              className={`filter-pill-btn ${activeGroupBy !== 'none' ? 'is-active' : ''} ${
                openDropdown === 'group' ? 'is-open' : ''
              }`}
              onClick={() => toggleDropdown('group')}
            >
              <Layers size={16} />
              <span>Group by</span>
            </button>

            {openDropdown === 'group' && (
              <div className="dropdown-menu animate-fade-in">
                <div className="dropdown-header">Group destinations</div>
                <button
                  type="button"
                  className={`dropdown-item ${activeGroupBy === 'none' ? 'selected' : ''}`}
                  onClick={() => {
                    onGroupByChange('none');
                    setOpenDropdown(null);
                  }}
                >
                  <span>None</span>
                  {activeGroupBy === 'none' && <Check size={14} />}
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${activeGroupBy === 'region' ? 'selected' : ''}`}
                  onClick={() => {
                    onGroupByChange('region');
                    setOpenDropdown(null);
                  }}
                >
                  <span>By Region</span>
                  {activeGroupBy === 'region' && <Check size={14} />}
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${activeGroupBy === 'status' ? 'selected' : ''}`}
                  onClick={() => {
                    onGroupByChange('status');
                    setOpenDropdown(null);
                  }}
                >
                  <span>By Trip Status</span>
                  {activeGroupBy === 'status' && <Check size={14} />}
                </button>
              </div>
            )}
          </div>

          {/* Filter Button */}
          <div className="dropdown-wrapper">
            <button
              type="button"
              className={`filter-pill-btn ${activeFilter !== 'all' ? 'is-active' : ''} ${
                openDropdown === 'filter' ? 'is-open' : ''
              }`}
              onClick={() => toggleDropdown('filter')}
            >
              <SlidersHorizontal size={16} />
              <span>Filter</span>
            </button>

            {openDropdown === 'filter' && (
              <div className="dropdown-menu animate-fade-in">
                <div className="dropdown-header">Filter by Status</div>
                <button
                  type="button"
                  className={`dropdown-item ${activeFilter === 'all' ? 'selected' : ''}`}
                  onClick={() => {
                    onFilterChange('all');
                    setOpenDropdown(null);
                  }}
                >
                  <span>All Trips</span>
                  {activeFilter === 'all' && <Check size={14} />}
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${activeFilter === 'completed' ? 'selected' : ''}`}
                  onClick={() => {
                    onFilterChange('completed');
                    setOpenDropdown(null);
                  }}
                >
                  <span>Completed Trips</span>
                  {activeFilter === 'completed' && <Check size={14} />}
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${activeFilter === 'upcoming' ? 'selected' : ''}`}
                  onClick={() => {
                    onFilterChange('upcoming');
                    setOpenDropdown(null);
                  }}
                >
                  <span>Upcoming Trips</span>
                  {activeFilter === 'upcoming' && <Check size={14} />}
                </button>
              </div>
            )}
          </div>

          {/* Sort by Button */}
          <div className="dropdown-wrapper">
            <button
              type="button"
              className={`filter-pill-btn ${activeSort !== 'default' ? 'is-active' : ''} ${
                openDropdown === 'sort' ? 'is-open' : ''
              }`}
              onClick={() => toggleDropdown('sort')}
            >
              <ArrowUpDown size={16} />
              <span>Sort by</span>
            </button>

            {openDropdown === 'sort' && (
              <div className="dropdown-menu dropdown-align-right animate-fade-in">
                <div className="dropdown-header">Sort Order</div>
                <button
                  type="button"
                  className={`dropdown-item ${activeSort === 'default' ? 'selected' : ''}`}
                  onClick={() => {
                    onSortChange('default');
                    setOpenDropdown(null);
                  }}
                >
                  <span>Default (Newest)</span>
                  {activeSort === 'default' && <Check size={14} />}
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${activeSort === 'title' ? 'selected' : ''}`}
                  onClick={() => {
                    onSortChange('title');
                    setOpenDropdown(null);
                  }}
                >
                  <span>Trip Name (A-Z)</span>
                  {activeSort === 'title' && <Check size={14} />}
                </button>
                <button
                  type="button"
                  className={`dropdown-item ${activeSort === 'date' ? 'selected' : ''}`}
                  onClick={() => {
                    onSortChange('date');
                    setOpenDropdown(null);
                  }}
                >
                  <span>Date (Earliest first)</span>
                  {activeSort === 'date' && <Check size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Suggestions Dropdown (Option 2) */}
      {isInputFocused && suggestions && (
        <div className="live-search-suggestions-panel animate-fade-in">
          {/* 1. Activities Matches */}
          {suggestions.activities.length > 0 && (
            <div className="suggestions-category-block">
              <div className="suggestions-category-title">
                <Compass size={14} />
                <span>Activities & Treks</span>
              </div>
              {suggestions.activities.map((act) => (
                <div
                  key={act.id}
                  className="suggestion-item-row"
                  onMouseDown={() => handleActivityClick(act)}
                >
                  <img
                    src={act.coverImageUrl}
                    alt={act.name}
                    className="suggestion-thumb"
                  />
                  <div className="suggestion-item-info">
                    <div className="suggestion-item-name">{act.name}</div>
                    <div className="suggestion-item-sub">
                      📍 {act.destination} • {act.durationLabel || `${act.durationDays} Days`}
                    </div>
                  </div>
                  <div className="suggestion-item-price">
                    {act.formattedPrice || `₹${act.price.toLocaleString('en-IN')}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Regions / Destinations */}
          {suggestions.regions.length > 0 && (
            <div className="suggestions-category-block">
              <div className="suggestions-category-title">
                <MapPin size={14} />
                <span>Continents & Regions</span>
              </div>
              {suggestions.regions.map((reg) => (
                <div
                  key={reg.id}
                  className="suggestion-item-row"
                  onMouseDown={() => {
                    setIsInputFocused(false);
                    navigate(`/search?q=${encodeURIComponent(reg.name)}`);
                  }}
                >
                  <div className="suggestion-item-name">🌍 {reg.name}</div>
                  <div className="suggestion-item-sub">{reg.destinationCountLabel}</div>
                </div>
              ))}
            </div>
          )}

          {/* 3. Personal Trips */}
          {suggestions.trips.length > 0 && (
            <div className="suggestions-category-block">
              <div className="suggestions-category-title">
                <Calendar size={14} />
                <span>My Saved Trips</span>
              </div>
              {suggestions.trips.map((trip) => (
                <div
                  key={trip.id}
                  className="suggestion-item-row"
                  onMouseDown={() => {
                    setIsInputFocused(false);
                  }}
                >
                  <div className="suggestion-item-name">🧳 {trip.name}</div>
                  <div className="suggestion-item-sub">{trip.locationSummary} • {trip.statusLabel}</div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Prompt: Press Enter or Click */}
          <div
            className="suggestions-footer-cta"
            onMouseDown={() => {
              navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              setIsInputFocused(false);
            }}
          >
            <span>Press <strong>Enter</strong> to search all activities for &ldquo;{searchQuery}&rdquo;</span>
            <ArrowRight size={14} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
