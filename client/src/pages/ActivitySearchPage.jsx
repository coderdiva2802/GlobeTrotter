import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import ActivitySearchBanner from '../components/search/ActivitySearchBanner.jsx';
import ActivitySearchBar from '../components/search/ActivitySearchBar.jsx';
import ActivityCard from '../components/search/ActivityCard.jsx';
import ActivityDetailsModal from '../components/search/ActivityDetailsModal.jsx';
import { useAuth } from '../context/useAuth.js';
import { apiService } from '../services/api.js';
import { mockActivities } from '../services/mockData.js';
import './ActivitySearchPage.css';

export default function ActivitySearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: authUser } = useAuth();

  const [fetchedUser, setFetchedUser] = useState(null);
  const [activitiesList, setActivitiesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Unified user identity for Navbar
  const displayUser = useMemo(() => {
    const u = authUser || fetchedUser;
    if (!u) return null;
    const name = u.firstName
      ? `${u.firstName}${u.lastName ? ' ' + u.lastName : ''}`
      : u.name || u.fullName || 'User Profile';
    return { ...u, name, fullName: name };
  }, [authUser, fetchedUser]);

  // Search, Group, Filter, and Sort states
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeGroupBy, setActiveGroupBy] = useState('none');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSortBy, setActiveSortBy] = useState('default');

  // Modal State
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [user, searchResult] = await Promise.all([
          apiService.getCurrentUser(),
          apiService.searchActivities({
            query: searchQuery,
            filter: activeFilter,
            sortBy: activeSortBy,
            groupBy: activeGroupBy,
          }),
        ]);
        setFetchedUser(user);
        const list = Array.isArray(searchResult)
          ? searchResult
          : (searchResult?.activities || []);
        if (list.length === 0 && !searchQuery.trim()) {
          setActivitiesList(mockActivities);
        } else {
          setActivitiesList(list);
        }
      } catch (err) {
        console.error('Error searching activities:', err);
        setActivitiesList(mockActivities);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [searchQuery, activeFilter, activeSortBy, activeGroupBy]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddToTrip = (activity) => {
    showToast(`✅ "${activity.name || 'Activity'}" added to your trip itinerary!`);
  };

  const handleTabChange = (tab) => {
    if (tab === 'home') {
      navigate('/dashboard');
    } else if (tab === 'trips') {
      navigate('/dashboard?tab=trips');
    } else if (tab === 'calendar') {
      navigate('/dashboard?tab=calendar');
    } else if (tab === 'community') {
      navigate('/dashboard?tab=community');
    } else if (tab === 'profile') {
      navigate('/profile');
    } else if (tab === 'search' || tab === 'activities') {
      // Already on activities search page
      setSearchQuery('');
      setSearchParams({});
    }
  };

  // Optional Grouping Logic
  const groupedActivities = useMemo(() => {
    if (!Array.isArray(activitiesList) || activitiesList.length === 0) {
      return [{ groupName: null, items: [] }];
    }
    if (activeGroupBy === 'none') {
      return [{ groupName: null, items: activitiesList }];
    }
    const map = {};
    activitiesList.forEach((act) => {
      let key = 'Other';
      if (activeGroupBy === 'location') key = act.destination || act.cityName || 'Popular Destination';
      else if (activeGroupBy === 'difficulty') key = act.difficulty || 'General';
      else if (activeGroupBy === 'price') {
        const p = Number(act.price || act.estimatedCost || 0);
        key = p < 5000 ? 'Budget Friendly (< ₹5,000)' : 'Premium Tours (≥ ₹5,000)';
      }
      if (!map[key]) map[key] = [];
      map[key].push(act);
    });
    return Object.keys(map).map((k) => ({ groupName: k, items: map[k] }));
  }, [activitiesList, activeGroupBy]);

  return (
    <div className="activity-search-page-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="activity-floating-toast">
          {toastMessage}
        </div>
      )}

      {/* Unified Top Navbar */}
      <Navbar
        activeTab="activities"
        onTabChange={handleTabChange}
        user={displayUser}
        onSearchOpen={() => {
          const el = document.querySelector('.activity-search-input-box input');
          if (el) el.focus();
        }}
      />

      {/* Main Container */}
      <main className="activity-search-container">
        <div className="activity-search-content animate-fade-in">
          {/* 1. Header Banner */}
          <ActivitySearchBanner />

          {/* 2. Search & Controls Bar */}
          <ActivitySearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            activeGroupBy={activeGroupBy}
            onGroupByChange={setActiveGroupBy}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            activeSortBy={activeSortBy}
            onSortByChange={setActiveSortBy}
          />

          {/* 3. Results Summary Header */}
          <div className="activity-results-summary-header">
            <div className="summary-text-block">
              <h2 className="summary-title">
                {searchQuery
                  ? `Best matches for "${searchQuery}"`
                  : 'All Available Activities & Treks'}
              </h2>
              <p className="summary-subtitle">
                Sorted around rating, value and price.
              </p>
            </div>

            <div className="summary-count-badge">
              <span>{activitiesList.length} results</span>
            </div>
          </div>

          {/* 4. Results List */}
          {isLoading ? (
            <div className="activity-search-loading">
              <p>Searching best activities & adventures...</p>
            </div>
          ) : activitiesList.length > 0 ? (
            <div className="activity-cards-list">
              {groupedActivities.map((group, idx) => (
                <div key={idx} className="activity-group-block">
                  {group.groupName && (
                    <h3 className="activity-group-heading">{group.groupName}</h3>
                  )}
                  {group.items.map((act) => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      onViewDetails={(a) => setSelectedActivity(a)}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="activity-no-results">
              <h3>No matching activities found</h3>
              <p>Try searching for &quot;Manali&quot;, &quot;Paris&quot;, &quot;Trek&quot;, or clearing filters.</p>
              <button
                type="button"
                className="clear-all-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                  setActiveFilter('all');
                  setActiveSortBy('default');
                  setActiveGroupBy('none');
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Activity Details Modal */}
      <ActivityDetailsModal
        activity={selectedActivity}
        isOpen={Boolean(selectedActivity)}
        onClose={() => setSelectedActivity(null)}
        onAddToTrip={handleAddToTrip}
      />
    </div>
  );
}
