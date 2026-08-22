import { useState, useRef, useEffect } from 'react';
import { Search, Layers, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';

export const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  activeGroupBy,
  onGroupByChange,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null); // 'group' | 'filter' | 'sort' | null
  const containerRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
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
            placeholder="Search destinations, trips, experiences..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
    </div>
  );
};

export default SearchFilterBar;
