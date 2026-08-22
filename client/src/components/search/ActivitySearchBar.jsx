import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import './ActivitySearchBar.css';

export default function ActivitySearchBar({
  searchQuery,
  onSearchChange,
  activeGroupBy = 'none',
  onGroupByChange,
  activeFilter = 'all',
  onFilterChange,
  activeSortBy = 'default',
  onSortByChange,
}) {
  const [openDropdown, setOpenDropdown] = useState(null); // 'group' | 'filter' | 'sort' | null
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groupByOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'location', label: 'Location' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'price', label: 'Price Range' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'best-price', label: 'Best Price' },
    { value: 'top-rated', label: 'Top Rated' },
    { value: 'lowest-price', label: 'Lowest Price' },
    { value: 'best-seller', label: 'Best Seller' },
    { value: 'new', label: 'New Releases' },
    { value: 'easy', label: 'Easy Treks' },
    { value: 'moderate', label: 'Moderate Treks' },
  ];

  const sortOptions = [
    { value: 'default', label: 'Default Ranking' },
    { value: 'rating', label: 'Highest Rating' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'duration', label: 'Duration: Short to Long' },
  ];

  return (
    <div className="activity-search-bar-row" ref={containerRef}>
      {/* Search Input */}
      <div className="activity-search-input-wrapper">
        <Search size={18} className="search-input-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search activities, destinations or treks..."
          className="activity-search-input"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-query-btn"
            onClick={() => onSearchChange('')}
          >
            ×
          </button>
        )}
      </div>

      {/* Action Buttons: Group by, Filter, Sort by */}
      <div className="search-action-controls">
        {/* 1. Group By Dropdown */}
        <div className="dropdown-control-wrapper">
          <button
            type="button"
            className={`search-control-btn ${activeGroupBy !== 'none' ? 'is-active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'group' ? null : 'group')}
          >
            <span>Group by</span>
            <ChevronDown size={14} className="control-chevron" />
          </button>

          {openDropdown === 'group' && (
            <div className="control-popover-menu animate-fade-in">
              <div className="popover-title">Group Activities By</div>
              {groupByOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`popover-item ${activeGroupBy === opt.value ? 'selected' : ''}`}
                  onClick={() => {
                    onGroupByChange(opt.value);
                    setOpenDropdown(null);
                  }}
                >
                  <span>{opt.label}</span>
                  {activeGroupBy === opt.value && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Filter Dropdown */}
        <div className="dropdown-control-wrapper">
          <button
            type="button"
            className={`search-control-btn ${activeFilter !== 'all' ? 'is-active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'filter' ? null : 'filter')}
          >
            <span>Filter</span>
            <ChevronDown size={14} className="control-chevron" />
          </button>

          {openDropdown === 'filter' && (
            <div className="control-popover-menu animate-fade-in">
              <div className="popover-title">Filter by Category</div>
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`popover-item ${activeFilter === opt.value ? 'selected' : ''}`}
                  onClick={() => {
                    onFilterChange(opt.value);
                    setOpenDropdown(null);
                  }}
                >
                  <span>{opt.label}</span>
                  {activeFilter === opt.value && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Sort By Dropdown */}
        <div className="dropdown-control-wrapper">
          <button
            type="button"
            className={`search-control-btn ${activeSortBy !== 'default' ? 'is-active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
          >
            <span>Sort by</span>
            <ChevronDown size={14} className="control-chevron" />
          </button>

          {openDropdown === 'sort' && (
            <div className="control-popover-menu dropdown-right animate-fade-in">
              <div className="popover-title">Sort Activities By</div>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`popover-item ${activeSortBy === opt.value ? 'selected' : ''}`}
                  onClick={() => {
                    onSortByChange(opt.value);
                    setOpenDropdown(null);
                  }}
                >
                  <span>{opt.label}</span>
                  {activeSortBy === opt.value && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
