import { Plane } from 'lucide-react';
import './AuthLayout.css';

export default function AuthLayout({
  mode = 'login', // 'login' | 'register'
  children,
}) {
  const isLogin = mode === 'login';

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        {/* Left Scenic Hero Section */}
        <div className="auth-hero-pane">
          <div className="hero-scenic-overlay" />
          
          {/* Top Branding */}
          <div className="hero-brand-header">
            <div className="brand-logo-badge">
              <span className="globe-emoji" role="img" aria-label="Globe">🌎</span>
              <Plane size={22} className="plane-icon" />
              <span className="brand-title">GlobalTrotter</span>
            </div>
          </div>

          {/* Bottom Hero Content */}
          <div className="hero-content-block">
            <div className="hero-pill-badge">
              <span>PERSONALIZED TRAVEL PLANNING</span>
            </div>

            <h1 className="hero-headline">
              {isLogin ? (
                <>
                  Explore the world,<br />
                  create memories.
                </>
              ) : (
                <>
                  Your next adventure<br />
                  starts here.
                </>
              )}
            </h1>

            <p className="hero-description">
              {isLogin
                ? 'Plan trips, build itineraries and keep every journey organized in one place.'
                : 'Create your profile and start building personalized journeys.'}
            </p>
          </div>
        </div>

        {/* Right Interactive Form Section */}
        <div className="auth-form-pane">
          <div className="auth-form-wrapper">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
