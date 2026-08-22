import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './context/useAuth.js';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ActivitySearchPage from './pages/ActivitySearchPage.jsx';
import Navbar from './components/layout/Navbar.jsx';
import HeroBanner from './components/home/HeroBanner.jsx';
import SearchFilterBar from './components/home/SearchFilterBar.jsx';
import RegionalSelections from './components/home/RegionalSelections.jsx';
import PreviousTrips from './components/home/PreviousTrips.jsx';
import HomeActivitiesSection from './components/home/HomeActivitiesSection.jsx';
import TripsCalendarView from './components/calendar/TripsCalendarView.jsx';
import FloatingPlanButton from './components/common/FloatingPlanButton.jsx';
import PlanTripModal from './components/modals/PlanTripModal.jsx';
import TripDetailsModal from './components/modals/TripDetailsModal.jsx';
import RegionDetailsModal from './components/modals/RegionDetailsModal.jsx';
import ActivityDetailsModal from './components/search/ActivityDetailsModal.jsx';
import { apiService } from './services/api.js';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading GlobeTrotter...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Dashboard() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [tripsViewMode, setTripsViewMode] = useState('cards'); // 'cards' | 'calendar'
  const [userData, setUserData] = useState(null);
  const [regions, setRegions] = useState([]);
  const [trips, setTrips] = useState([]);
  const [activities, setActivities] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'completed' | 'upcoming'
  const [activeSort, setActiveSort] = useState('default'); // 'default' | 'title' | 'date'
  const [activeGroupBy, setActiveGroupBy] = useState('none'); // 'none' | 'region' | 'status'

  // Modal States
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const [fetchedUser, regionsData, tripsData, activitiesData] = await Promise.all([
        apiService.getCurrentUser(),
        apiService.getRegions(),
        apiService.getUserTrips(),
        apiService.searchActivities({ query: searchQuery }),
      ]);
      setUserData(fetchedUser);
      setRegions(regionsData);
      setTrips(tripsData);
      setActivities(activitiesData?.activities || []);
    }
    loadData();
  }, [searchQuery]);

  // Format active user profile display
  const displayUser = useMemo(() => {
    const u = authUser || userData;
    if (!u) return null;
    const name = u.firstName
      ? `${u.firstName}${u.lastName ? ' ' + u.lastName : ''}`
      : u.fullName || u.name || 'Traveler';

    return {
      ...u,
      name,
      fullName: name,
      email: u.email || '',
      profileImageUrl:
        u.profileImageUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    };
  }, [authUser, userData]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle trip creation
  const handleCreateTrip = async (tripFormData) => {
    const createdTrip = await apiService.createTrip(tripFormData);
    setTrips((prev) => [createdTrip, ...prev]);
    showToast(`🎉 "${createdTrip.name}" has been created successfully!`);
  };

  // Filter and sort trips
  const processedTrips = useMemo(() => {
    let result = [...trips];

    // Filter by status
    if (activeFilter !== 'all') {
      result = result.filter(
        (t) => t.status.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.locationSummary.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort
    if (activeSort === 'title') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'date') {
      result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    return result;
  }, [trips, activeFilter, searchQuery, activeSort]);

  // Filter regions by search query
  const processedRegions = useMemo(() => {
    if (!searchQuery.trim()) return regions;
    const q = searchQuery.toLowerCase();
    return regions.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
  }, [regions, searchQuery]);

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 999,
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            fontSize: '0.88rem',
            fontWeight: 600,
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* 1. Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'profile') {
            navigate('/profile');
          } else if (tab === 'search' || tab === 'activities') {
            navigate('/search');
          } else {
            setActiveTab(tab);
            if (tab === 'trips') {
              setActiveFilter('all');
            }
          }
        }}
        user={displayUser}
      />

      {/* Main Page Layout */}
      <main className="main-content">
        {activeTab === 'home' && (
          <>
            {/* 2. Canyon Hero Banner */}
            <HeroBanner onExploreClick={() => setIsPlanModalOpen(true)} />

            {/* 3. Search & Filter Bar with Live Suggestions Dropdown (Option 2) */}
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              activeSort={activeSort}
              onSortChange={setActiveSort}
              activeGroupBy={activeGroupBy}
              onGroupByChange={setActiveGroupBy}
              onSelectActivity={(act) => setSelectedActivity(act)}
            />

            {/* 4. Top Regional Selections */}
            <RegionalSelections
              regions={processedRegions}
              onSelectRegion={(region) => setSelectedRegion(region)}
              onViewAll={() => {
                showToast(`Viewing all destinations in ${regions.length} continents`);
              }}
            />

            {/* 5. Matching Activities & Treks Section on Home (Option 1) */}
            <HomeActivitiesSection
              activities={activities}
              searchQuery={searchQuery}
              onViewAll={() => navigate(searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search')}
              onViewActivity={(act) => setSelectedActivity(act)}
            />

            {/* 6. Previous Trips Section */}
            <PreviousTrips
              trips={processedTrips}
              onViewDetails={(trip) => setSelectedTrip(trip)}
              onViewAll={() => setActiveTab('trips')}
              onPlanTrip={() => setIsPlanModalOpen(true)}
            />
          </>
        )}

        {activeTab === 'trips' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <div>
                <h2 className="section-title">My Travel Journeys</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  All your planned, ongoing, and completed adventures in one place.
                </p>
              </div>

              {/* View Switcher Toggle: Cards View vs Calendar View */}
              <div className="trips-view-mode-toggle">
                <button
                  type="button"
                  className={`trips-toggle-btn ${tripsViewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setTripsViewMode('cards')}
                >
                  <LayoutGrid size={15} />
                  <span>Cards View</span>
                </button>
                <button
                  type="button"
                  className={`trips-toggle-btn ${tripsViewMode === 'calendar' ? 'active' : ''}`}
                  onClick={() => setTripsViewMode('calendar')}
                >
                  <CalendarIcon size={15} />
                  <span>Calendar View</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              activeSort={activeSort}
              onSortChange={setActiveSort}
              activeGroupBy={activeGroupBy}
              onGroupByChange={setActiveGroupBy}
              onSelectActivity={(act) => setSelectedActivity(act)}
            />

            {tripsViewMode === 'calendar' ? (
              /* Calendar View */
              <TripsCalendarView
                onSelectTrip={(calTrip) => {
                  // If trip exists in full trips, open full details modal; otherwise open with calTrip data
                  const matchingTrip = trips.find((t) => t.id === calTrip.tripId || t.name === calTrip.name) || {
                    id: calTrip.id,
                    name: calTrip.name || calTrip.title,
                    description: calTrip.description || 'Custom planned itinerary on calendar.',
                    startDate: calTrip.startDate,
                    endDate: calTrip.endDate,
                    formattedDates: `${calTrip.startDate} - ${calTrip.endDate}`,
                    travelerCount: calTrip.travelerCount || 2,
                    travelerLabel: `${calTrip.travelerCount || 2} Travelers`,
                    status: (calTrip.category || 'UPCOMING').toUpperCase(),
                    statusLabel: calTrip.categoryLabel || 'Upcoming',
                    coverImageUrl: calTrip.coverImageUrl,
                    locationSummary: calTrip.locationSummary,
                    stops: calTrip.stops || [{ id: 1, cityName: calTrip.locationSummary || 'Destination', countryName: '', order: 1 }],
                    budget: calTrip.budget || 25000,
                    currency: calTrip.currency || 'INR',
                  };
                  setSelectedTrip(matchingTrip);
                }}
              />
            ) : (
              /* Cards View */
              <>
                <PreviousTrips
                  trips={processedTrips}
                  onViewDetails={(trip) => setSelectedTrip(trip)}
                  onViewAll={() => {}}
                  onPlanTrip={() => setIsPlanModalOpen(true)}
                />

                {/* If no trips found but query is typed, offer activity discovery */}
                {processedTrips.length === 0 && searchQuery && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: 'var(--radius-lg)',
                      padding: '16px 20px',
                      marginTop: '12px',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '2px' }}>
                        Looking for activities in &ldquo;{searchQuery}&rdquo;?
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#3b82f6' }}>
                        Discover top tours, scenic treks, and day trips in {searchQuery}.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
                    >
                      Search Activities in &ldquo;{searchQuery}&rdquo; ➔
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'community' && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              Travelers Community
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
              Discover public trip plans, curated guides, and real travel recommendations shared by globetrotters worldwide.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => showToast('Community trip sharing is enabled for all public itineraries!')}
              >
                Explore Public Itineraries
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button: + Plan a trip */}
      <FloatingPlanButton onClick={() => setIsPlanModalOpen(true)} />

      {/* Modals */}
      <PlanTripModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSubmitTrip={handleCreateTrip}
      />

      <TripDetailsModal
        trip={selectedTrip}
        isOpen={Boolean(selectedTrip)}
        onClose={() => setSelectedTrip(null)}
      />

      <RegionDetailsModal
        region={selectedRegion}
        isOpen={Boolean(selectedRegion)}
        onClose={() => setSelectedRegion(null)}
        onPlanForRegion={() => {
          setIsPlanModalOpen(true);
        }}
      />

      <ActivityDetailsModal
        activity={selectedActivity}
        isOpen={Boolean(selectedActivity)}
        onClose={() => setSelectedActivity(null)}
        onAddToTrip={(act) => showToast(`✅ "${act.name}" added to your itinerary!`)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <ActivitySearchPage />
              </ProtectedRoute>
            }
          />
          <Route path="/activities" element={<Navigate to="/search" replace />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
