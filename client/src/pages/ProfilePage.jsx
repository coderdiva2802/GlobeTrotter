import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard.jsx';
import TripGridSection from '../components/profile/TripGridSection.jsx';
import TipBanner from '../components/profile/TipBanner.jsx';
import EditProfileModal from '../components/profile/EditProfileModal.jsx';
import TripDetailsModal from '../components/modals/TripDetailsModal.jsx';
import { useAuth } from '../context/useAuth.js';
import { apiService } from '../services/api.js';
import { mockTrips } from '../services/mockData.js';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [userTrips, setUserTrips] = useState([]);
  const [profileOverriddenUser, setProfileOverriddenUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Load user trips & server profile info
  useEffect(() => {
    async function loadProfileData() {
      setIsLoading(true);
      try {
        const [fetchedProfile, tripsData] = await Promise.all([
          apiService.getCurrentUser(),
          apiService.getUserTrips(),
        ]);
        if (fetchedProfile) {
          setProfileOverriddenUser(fetchedProfile);
        }
        setUserTrips(Array.isArray(tripsData) && tripsData.length > 0 ? tripsData : mockTrips);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setUserTrips(mockTrips);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfileData();
  }, []);

  // Filter trips into preplanned (Upcoming/Ongoing) and previous (Completed)
  const preplannedTrips = useMemo(() => {
    return userTrips.filter(
      (t) => (t.status || '').toUpperCase() === 'UPCOMING' || (t.status || '').toUpperCase() === 'ONGOING'
    );
  }, [userTrips]);

  const previousTrips = useMemo(() => {
    return userTrips.filter((t) => (t.status || '').toUpperCase() === 'COMPLETED');
  }, [userTrips]);

  // Compute realistic user statistics based on actual user trips
  const computedStats = useMemo(() => {
    const tripsPlanned = userTrips.length;

    // Unique cities count across all trip stops
    const uniqueCities = new Set(
      userTrips
        .flatMap((t) => (t.stops || []).map((s) => s.cityName || s.locationSummary))
        .filter(Boolean)
    );
    const placesExplored = uniqueCities.size || (tripsPlanned > 0 ? tripsPlanned * 2 : 0);

    // Upcoming trips count
    const upcomingTrips = preplannedTrips.length;

    // Unique countries count across all trip stops & location summaries
    const uniqueCountries = new Set(
      userTrips
        .flatMap((t) => {
          const fromStops = (t.stops || []).map((s) => s.countryName);
          const fromLoc = t.locationSummary ? t.locationSummary.split(',').pop().trim() : null;
          return [...fromStops, fromLoc];
        })
        .filter(Boolean)
    );
    const countriesVisited = uniqueCountries.size || (tripsPlanned > 0 ? 1 : 0);

    return {
      tripsPlanned,
      placesExplored,
      upcomingTrips,
      countriesVisited,
    };
  }, [userTrips, preplannedTrips]);

  // Unified Active User Object
  const displayUser = useMemo(() => {
    const baseUser = profileOverriddenUser || authUser;
    if (!baseUser) return null;

    const name = baseUser.firstName
      ? `${baseUser.firstName}${baseUser.lastName ? ' ' + baseUser.lastName : ''}`
      : baseUser.name || baseUser.fullName || 'User Profile';

    return {
      ...baseUser,
      name,
      fullName: name,
      stats: computedStats,
    };
  }, [authUser, profileOverriddenUser, computedStats]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = async (updatedData) => {
    const savedUser = await apiService.updateUserProfile(updatedData);
    setProfileOverriddenUser((prev) => ({
      ...prev,
      ...savedUser,
    }));
    showToast('✅ Profile updated successfully!');
  };

  const handleTabChange = (tab) => {
    if (tab === 'home' || tab === 'trips' || tab === 'community' || tab === 'calendar') {
      navigate('/dashboard');
    } else if (tab === 'search' || tab === 'activities') {
      navigate('/search');
    }
  };

  return (
    <div className="profile-page-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="profile-floating-toast">
          {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab="profile"
        onTabChange={handleTabChange}
        user={displayUser}
        onSearchOpen={() => navigate('/search')}
      />

      {/* Main Profile Content Area */}
      <main className="profile-main-container">
        {isLoading ? (
          <div className="profile-loading-state">
            <p>Loading profile and adventures...</p>
          </div>
        ) : (
          <div className="profile-content-wrapper animate-fade-in">
            {/* 1. Profile Summary & Stats Card */}
            <ProfileHeaderCard
              user={displayUser}
              onEditProfile={() => setIsEditModalOpen(true)}
            />

            {/* 2. Preplanned Trips Section */}
            <TripGridSection
              title="Preplanned Trips"
              icon={Calendar}
              iconClass="icon-blue"
              trips={preplannedTrips}
              onViewAll={() => navigate('/dashboard')}
              onViewTrip={(trip) => setSelectedTrip(trip)}
            />

            {/* 3. Previous Trips Section */}
            <TripGridSection
              title="Previous Trips"
              icon={CheckCircle2}
              iconClass="icon-green"
              trips={previousTrips}
              onViewAll={() => navigate('/dashboard')}
              onViewTrip={(trip) => setSelectedTrip(trip)}
            />

            {/* 4. Tip Banner */}
            <TipBanner />
          </div>
        )}
      </main>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={displayUser}
        onSave={handleSaveProfile}
      />

      <TripDetailsModal
        trip={selectedTrip}
        isOpen={Boolean(selectedTrip)}
        onClose={() => setSelectedTrip(null)}
      />
    </div>
  );
}
