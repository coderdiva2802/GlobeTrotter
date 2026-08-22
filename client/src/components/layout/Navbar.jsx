import { useState, useRef, useEffect } from 'react';
import { Globe, Home, Compass, Users, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';

export const Navbar = ({ activeTab, onTabChange, user, onSearchOpen }) => {
  const { logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => onTabChange('home')}>
          <div className="brand-logo-wrapper">
            <Globe className="brand-icon" size={24} />
          </div>
          <span className="brand-title">GlobeTrotter</span>
        </div>

        {/* Center Navigation Links */}
        <nav className="navbar-links">
          <button
            type="button"
            className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => onTabChange('home')}
          >
            <Home size={17} className="nav-icon" />
            <span>Home</span>
            {activeTab === 'home' && <div className="active-indicator" />}
          </button>

          <button
            type="button"
            className={`nav-link-btn ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => onTabChange('trips')}
          >
            <Compass size={17} className="nav-icon" />
            <span>Trips</span>
            {activeTab === 'trips' && <div className="active-indicator" />}
          </button>

          <button
            type="button"
            className={`nav-link-btn ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => onTabChange('community')}
          >
            <Users size={17} className="nav-icon" />
            <span>Community</span>
            {activeTab === 'community' && <div className="active-indicator" />}
          </button>
        </nav>

        {/* Right Section: Search and User Avatar */}
        <div className="navbar-actions">
          <button
            type="button"
            className="icon-btn search-trigger-btn"
            onClick={onSearchOpen}
            aria-label="Search"
            title="Quick Search"
          >
            <Search size={19} />
          </button>

          <div className="dropdown-wrapper" ref={menuRef}>
            <div
              className="user-profile-pill"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              title={`${user?.fullName || 'User Profile'} (${user?.email || ''})`}
            >
              <img
                src={
                  user?.profileImageUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                }
                alt={user?.name || 'User'}
                className="user-avatar-img"
              />
              <span className="user-name-label">{user?.name || 'User'}</span>
            </div>

            {isProfileMenuOpen && (
              <div className="dropdown-menu dropdown-align-right animate-fade-in" style={{ minWidth: '210px' }}>
                <div className="dropdown-header">
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                    {user?.fullName || 'User Profile'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'none', marginTop: '2px' }}>
                    {user?.email || ''}
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onTabChange('profile');
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserIcon size={15} /> My Profile & Travel Stats
                  </span>
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  style={{ color: 'var(--color-error)' }}
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={15} /> Logout
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
