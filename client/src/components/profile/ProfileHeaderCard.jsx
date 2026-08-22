import { Edit3 } from 'lucide-react';
import ProfileStatsCards from './ProfileStatsCards.jsx';
import './ProfileHeaderCard.css';

export default function ProfileHeaderCard({ user, onEditProfile }) {
  const firstName =
    user?.firstName ||
    user?.name?.split(' ')[0] ||
    user?.fullName?.split(' ')[0] ||
    'Traveler';

  const fullName =
    user?.fullName ||
    (user?.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` : user?.name) ||
    'User Profile';

  const email = user?.email || '';
  const profileImageUrl = user?.profileImageUrl;

  const initials =
    fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'GT';

  return (
    <div className="profile-header-card">
      {/* Left Column: Avatar & User Identity */}
      <div className="profile-identity-col">
        <div className="profile-avatar-circle">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt={fullName} className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-initials">
              <span>{initials}</span>
            </div>
          )}
        </div>

        <div className="profile-name-block">
          <h2 className="profile-user-name">{fullName}</h2>
          <p className="profile-user-email">{email}</p>
        </div>

        <button
          type="button"
          className="edit-profile-btn"
          onClick={onEditProfile}
        >
          <Edit3 size={14} className="edit-btn-icon" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Right Column: Welcome Banner & 4 Stat Badges */}
      <div className="profile-welcome-col">
        <div className="welcome-banner-header">
          <h1 className="welcome-title">
            Welcome back, {firstName}! <span className="plane-emoji" role="img" aria-label="Airplane">✈️</span>
          </h1>
          <p className="welcome-subtitle">
            Manage your travel plans, view your trips and keep track of your adventures.
          </p>
        </div>

        {/* 4 Stats Cards */}
        <ProfileStatsCards stats={user?.stats} />
      </div>
    </div>
  );
}
