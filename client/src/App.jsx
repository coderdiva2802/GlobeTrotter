import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';
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

// Itinerary and Wizard Components
import { CreateTripWizard } from './components/wizard/CreateTripWizard.jsx';
import { DayWiseItineraryView } from './components/itinerary/DayWiseItineraryView.jsx';

import { apiService } from './services/api.js';
import { mockRegions, mockTrips } from './services/mockData.js';
import './App.css';

import { useSearchParams } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user: authUser } = useAuth();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'home');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [tripsViewMode, setTripsViewMode] = useState('cards');

  const [userData, setUserData] = useState(null);
  const [regions, setRegions] = useState(mockRegions);
  const [trips, setTrips] = useState(mockTrips);
  const [activities, setActivities] = useState([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'upcoming' | 'ongoing' | 'completed'
  const [activeSort, setActiveSort] = useState('date'); // 'date' | 'date_latest' | 'title' | 'budget_high' | 'budget_low'
  const [activeGroupBy, setActiveGroupBy] = useState('none'); // 'none' | 'status' | 'destination' | 'year'

  // Selected & Modal States
  const [activeItineraryTrip, setActiveItineraryTrip] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [wizardInitialStep, setWizardInitialStep] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedUser, regionsData, tripsData, activitiesData] = await Promise.all([
          apiService.getCurrentUser(),
          apiService.getRegions(),
          apiService.getUserTrips(),
          apiService.searchActivities({ query: searchQuery }),
        ]);
        setUserData(fetchedUser);
        if (Array.isArray(regionsData) && regionsData.length > 0) {
          setRegions(regionsData);
        }
        if (Array.isArray(tripsData) && tripsData.length > 0) {
          setTrips(tripsData);
        }
        setActivities(activitiesData?.activities || []);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    }
    loadData();
  }, [searchQuery]);

  // Format active user profile display
  const displayUser = useMemo(() => {
    const u = authUser || userData;
    if (!u) return null;
    const name = u.firstName
      ? `${u.firstName}${u.lastName ? ' ' + u.lastName : ''}`
      : u.name || u.fullName || 'User';
    return {
      ...u,
      name,
    };
  }, [authUser, userData]);

  const handleStartNewTrip = (initialData = null) => {
    setEditingTrip(initialData);
    setWizardInitialStep(1);
    setActiveTab('create-trip');
  };

  const handleEditItinerary = (trip, step = 2) => {
    setEditingTrip(trip);
    setWizardInitialStep(step);
    setActiveTab('create-trip');
  };

  const handleWizardComplete = (savedTrip) => {
    setTrips((prev) => {
      const idx = prev.findIndex((t) => t.id === savedTrip.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedTrip;
        return copy;
      }
      return [savedTrip, ...prev];
    });
    setActiveItineraryTrip(savedTrip);
    setActiveTab('itinerary-view');
    showToast(`🎉 Journey "${savedTrip.name}" saved successfully!`);
  };

  const handleSaveDraft = (draftTrip) => {
    handleWizardComplete(draftTrip);
  };

  const handleCreateTrip = async (tripData) => {
    const newTrip = await apiService.createTrip(tripData);
    setTrips((prev) => [newTrip, ...prev]);
    showToast(`✈️ Trip "${newTrip.name}" created successfully!`);
    return newTrip;
  };

  const handleDeleteTrip = async (tripId) => {
    const result = await apiService.deleteTrip(tripId);
    if (result?.success || result) {
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      if (activeItineraryTrip?.id === tripId) {
        setActiveItineraryTrip(null);
        setActiveTab('home');
      }
      showToast('🗑️ Trip deleted.');
    }
  };

  // Filter and sort trips dynamically
  const processedTrips = useMemo(() => {
    let result = [...trips];

    // Filter by status tab
    if (activeFilter !== 'all') {
      result = result.filter(
        (t) => t.status?.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.locationSummary?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    // Apply sorting
    if (activeSort === 'title') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'date') {
      result.sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0));
    } else if (activeSort === 'date_latest') {
      result.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0));
    } else if (activeSort === 'budget_high') {
      result.sort((a, b) => (Number(b.budget) || 0) - (Number(a.budget) || 0));
    } else if (activeSort === 'budget_low') {
      result.sort((a, b) => (Number(a.budget) || 0) - (Number(b.budget) || 0));
    }

    return result;
  }, [trips, activeFilter, searchQuery, activeSort]);

  // Filter regions by search query with guaranteed mock fallback
  const processedRegions = useMemo(() => {
    const list = Array.isArray(regions) && regions.length > 0 ? regions : mockRegions;
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    const filtered = list.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
    return filtered.length > 0 ? filtered : list;
  }, [regions, searchQuery]);

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header / Navbar */}
      <Navbar
        user={displayUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'profile') {
            navigate('/profile');
          } else if (tab === 'search' || tab === 'activities') {
            navigate('/search');
          } else if (tab === 'create-trip') {
            handleStartNewTrip();
          } else {
            setActiveTab(tab);
            if (tab === 'trips') {
              setActiveFilter('all');
            }
          }
        }}
        onSearchOpen={() => navigate('/search')}
      />

      {/* Main Page Content */}
      <main className="main-content">
        {activeTab === 'itinerary-view' && (
          <DayWiseItineraryView
            trip={activeItineraryTrip}
            onEditItinerary={(trip) => handleEditItinerary(trip, 2)}
            onBackToDashboard={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'create-trip' && (
          <CreateTripWizard
            initialTripData={editingTrip}
            initialStep={wizardInitialStep}
            onComplete={handleWizardComplete}
            onSaveDraft={handleSaveDraft}
            onCancel={() => {
              setEditingTrip(null);
              setActiveTab(activeItineraryTrip ? 'itinerary-view' : 'home');
            }}
          />
        )}

        {activeTab === 'home' && (
          <>
            {/* Hero Banner */}
            <HeroBanner onExploreClick={handleStartNewTrip} />

            {/* Search & Filter Bar */}
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

            {/* Top Regional Selections */}
            <RegionalSelections
              regions={processedRegions}
              onSelectRegion={(region) => setSelectedRegion(region)}
              onViewAll={() => {
                showToast(`Viewing all destinations in ${processedRegions.length} regions`);
              }}
            />

            {/* Activities & Treks Section */}
            <HomeActivitiesSection
              activities={activities}
              searchQuery={searchQuery}
              onViewAll={() => navigate(searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search')}
              onViewActivity={(act) => setSelectedActivity(act)}
            />

            {/* Previous Trips Section */}
            <PreviousTrips
              trips={processedTrips}
              activeGroupBy={activeGroupBy}
              onViewDetails={(trip) => {
                setActiveItineraryTrip(trip);
                setActiveTab('itinerary-view');
              }}
              onDeleteTrip={handleDeleteTrip}
              onViewAll={() => setActiveTab('trips')}
              onPlanTrip={handleStartNewTrip}
            />
          </>
        )}

        {activeTab === 'calendar' && (
          <TripsCalendarView
            userTrips={trips}
            onSelectTrip={(calTrip) => {
              const matchingTrip = trips.find((t) => t.id === calTrip.id || t.name === calTrip.name) || calTrip;
              setActiveItineraryTrip(matchingTrip);
              setActiveTab('itinerary-view');
            }}
          />
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

              {/* View Switcher Toggle */}
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
              <TripsCalendarView
                userTrips={trips}
                onSelectTrip={(calTrip) => {
                  const matchingTrip = trips.find((t) => t.id === calTrip.id || t.name === calTrip.name) || calTrip;
                  setActiveItineraryTrip(matchingTrip);
                  setActiveTab('itinerary-view');
                }}
              />
            ) : (
              <PreviousTrips
                trips={processedTrips}
                activeGroupBy={activeGroupBy}
                sectionTitle={`All Trips (${processedTrips.length})`}
                hideHeader={false}
                onViewDetails={(trip) => {
                  setActiveItineraryTrip(trip);
                  setActiveTab('itinerary-view');
                }}
                onDeleteTrip={handleDeleteTrip}
                onViewAll={() => {}}
                onPlanTrip={handleStartNewTrip}
              />
            )}
          </div>
        )}

        {activeTab === 'community' && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <h2>GlobeTrotter Community Hub</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Connect with fellow travelers, share trip itineraries, and ask questions.
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {activeTab !== 'create-trip' && activeTab !== 'itinerary-view' && (
        <FloatingPlanButton onClick={handleStartNewTrip} />
      )}

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
        onPlanForRegion={() => handleStartNewTrip()}
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
      <CurrencyProvider>
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
      </CurrencyProvider>
    </AuthProvider>
  );
}
