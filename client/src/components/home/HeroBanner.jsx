import { useNavigate } from 'react-router-dom';

export const HeroBanner = ({ onExploreClick }) => {
  const navigate = useNavigate();

  return (
    <section className="hero-banner-section">
      <div className="hero-banner-container">
        {/* Background Image with Dark Vignette/Gradient */}
        <div className="hero-banner-bg" />
        
        {/* Content Overlay */}
        <div className="hero-banner-content">
          <h1 className="hero-title">
            Explore the world,<br />
            create memories
          </h1>
          
          <p className="hero-subtitle">
            Discover amazing places at exclusive deals<br />
            and make your dream trips a reality.
          </p>

          <div className="hero-buttons-row">
            <button
              type="button"
              className="hero-cta-btn"
              onClick={onExploreClick}
            >
              <span className="cta-dot">●</span>
              <span>Explore Now</span>
            </button>

            <button
              type="button"
              className="hero-search-activities-btn"
              onClick={() => navigate('/search')}
            >
              <span>Search Activities ➔</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
