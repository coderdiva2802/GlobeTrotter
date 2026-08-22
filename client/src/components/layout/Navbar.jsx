import { Globe, Home, Compass, Users, Search } from 'lucide-react';

export const Navbar = ({ activeTab, onTabChange, user, onSearchOpen }) => {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => onTabChange('home')}>
          <div className="brand-logo-wrapper">
            <Globe className="brand-icon" size={24} />
          </div>
          <span className="brand-title">GlobalTrotter</span>
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

          <div className="user-profile-pill" title={`${user?.fullName || 'User Profile'} (${user?.email || ''})`}>
            <img
              src={user?.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
              alt={user?.name || 'User'}
              className="user-avatar-img"
            />
            <span className="user-name-label">{user?.name || 'User'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
