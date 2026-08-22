import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

import { Navbar } from './components/layout/Navbar.jsx';
import { HeroBanner } from './components/home/HeroBanner.jsx';
import { SearchFilterBar } from './components/home/SearchFilterBar.jsx';
import { RegionalSelections } from './components/home/RegionalSelections.jsx';
import { PreviousTrips } from './components/home/PreviousTrips.jsx';
import { FloatingPlanButton } from './components/common/FloatingPlanButton.jsx';
import { RegionDetailsModal } from './components/modals/RegionDetailsModal.jsx';

// Itinerary and Wizard Components
import { CreateTripWizard } from './components/wizard/CreateTripWizard.jsx';
import { DayWiseItineraryView } from './components/itinerary/DayWiseItineraryView.jsx';

import { apiService } from './services/api.js';
import './App.css';

function Dashboard() {
  const { user: authUser, logout } = useAuth();
  // Navigation & View States
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'trips' | 'community' | 'create-trip' | 'itinerary-view'

  // Data States
  const [userData, setUserData] = useState(null);
  const [regions, setRegions] = useState([]);
  const [trips, setTrips] = useState([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'upcoming' | 'ongoing' | 'completed'
  const [activeSort, setActiveSort] = useState('date'); // 'date' | 'date_latest' | 'title' | 'budget_high' | 'budget_low'
  const [activeGroupBy, setActiveGroupBy] = useState('none'); // 'none' | 'status' | 'destination' | 'year'

  // Selected & Modal States
  const [activeItineraryTrip, setActiveItineraryTrip] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [wizardInitialStep, setWizardInitialStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const [fetchedUser, regionsData, tripsData] = await Promise.all([
        apiService.getCurrentUser(),
        apiService.getRegions(),
        apiService.getUserTrips(),
      ]);
      setUserData(fetchedUser);
      setRegions(regionsData);
      setTrips(tripsData);
    }
    loadData();
  }, []);

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

  // Start new trip
  const handleStartNewTrip = () => {
    setEditingTrip(null);
    setWizardInitialStep(1);
    setActiveTab('create-trip');
  };

  // Handle editing itinerary without losing data
  const handleEditItinerary = (tripToEdit, startStep = 2) => {
    setEditingTrip(tripToEdit || activeItineraryTrip);
    setWizardInitialStep(startStep);
    setActiveTab('create-trip');
  };

  // Handle deleting a trip
  const handleDeleteTrip = async (tripId) => {
    await apiService.deleteTrip(tripId);
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (activeItineraryTrip?.id === tripId) {
      setActiveItineraryTrip(null);
    }
    showToast('Trip deleted successfully');
  };

  // Handle completed trip creation from wizard -> navigate to Itinerary View
  const handleWizardComplete = async (tripFormData) => {
    const createdTrip = await apiService.createTrip(tripFormData);
    setTrips((prev) => {
      const existingIdx = prev.findIndex((t) => t.id === createdTrip.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = createdTrip;
        return updated;
      }
      return [createdTrip, ...prev];
    });
    setActiveItineraryTrip(createdTrip);
    setEditingTrip(null);
    setActiveTab('itinerary-view');
    showToast(`🎉 "${createdTrip.name}" itinerary updated!`);
  };

  // Handle saving draft from wizard
  const handleSaveDraft = async (draftData) => {
    const draftTrip = await apiService.createTrip({
      ...draftData,
      name: draftData.name || 'Untitled Draft Trip',
    });
    setTrips((prev) => [draftTrip, ...prev]);
    setEditingTrip(null);
    setActiveTab('home');
    showToast(`💾 Draft saved: "${draftTrip.name}"`);
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
        <div className="toast-notification animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header / Navbar with Currency Switcher */}
      <Navbar
        user={displayUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'create-trip') {
            handleStartNewTrip();
          } else {
            setActiveTab(tab);
          }
        }}
        onSearchClick={() => {
          const searchInput = document.querySelector('.search-input');
          if (searchInput) searchInput.focus();
        }}
        onProfileClick={() => {
          showToast(`Logged in as ${displayUser?.name || 'Traveler'}`);
        }}
        onLogoutClick={() => {
          logout();
          showToast('You have been logged out.');
        }}
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
            {/* 2. Canyon Hero Banner */}
            <HeroBanner onExploreClick={handleStartNewTrip} />

            {/* 3. Search & Filter Bar */}
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              activeSort={activeSort}
              onSortChange={setActiveSort}
              activeGroupBy={activeGroupBy}
              onGroupByChange={setActiveGroupBy}
            />

            {/* 4. Top Regional Selections */}
            <RegionalSelections
              regions={processedRegions}
              onSelectRegion={(region) => setSelectedRegion(region)}
              onViewAll={() => {
                showToast(`Viewing all destinations in ${regions.length} continents`);
              }}
            />

            {/* 5. Previous Trips Section */}
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

        {activeTab === 'trips' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <div>
                <h2 className="section-title">My Travel Journeys</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  All your planned, ongoing, and completed adventures in one place.
                </p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={handleStartNewTrip}
              >
                + New Trip
              </button>
            </div>

            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              activeSort={activeSort}
              onSortChange={setActiveSort}
              activeGroupBy={activeGroupBy}
              onGroupByChange={setActiveGroupBy}
            />

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

      {/* 6. Floating Action Button: + Plan a trip */}
      {activeTab !== 'create-trip' && activeTab !== 'itinerary-view' && (
        <FloatingPlanButton onClick={handleStartNewTrip} />
      )}

      {/* 7. Region Details Modal */}
      <RegionDetailsModal
        region={selectedRegion}
        isOpen={Boolean(selectedRegion)}
        onClose={() => setSelectedRegion(null)}
        onPlanForRegion={() => {
          handleStartNewTrip();
        }}
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </CurrencyProvider>
    </AuthProvider>
  );
}
