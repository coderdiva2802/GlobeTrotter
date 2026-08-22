import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard';
import TripGridSection from '../components/profile/TripGridSection';
import TipBanner from '../components/profile/TipBanner';
import EditProfileModal from '../components/profile/EditProfileModal';
import TripDetailsModal from '../components/modals/TripDetailsModal';
import { apiService } from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [preplannedTrips, setPreplannedTrips] = useState([]);
  const [previousTrips, setPreviousTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function loadProfileData() {
      setIsLoading(true);
      try {
        const data = await apiService.getUserProfileWithStats();
        setUserProfile(data.user);
        setPreplannedTrips(data.preplannedTrips || []);
        setPreviousTrips(data.previousTrips || []);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfileData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = async (updatedData) => {
    const savedUser = await apiService.updateUserProfile(updatedData);
    setUserProfile((prev) => ({
      ...prev,
      ...savedUser,
    }));
    showToast('✅ Profile updated successfully!');
  };

  const handleTabChange = (tab) => {
    if (tab === 'home') {
      navigate('/dashboard');
    } else if (tab === 'trips') {
      navigate('/dashboard');
    } else if (tab === 'community') {
      navigate('/dashboard');
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
        user={userProfile}
        onSearchOpen={() => navigate('/dashboard')}
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
              user={userProfile}
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
        user={userProfile}
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
