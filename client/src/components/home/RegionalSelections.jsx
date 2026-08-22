import { RegionCard } from './RegionCard.jsx';

export const RegionalSelections = ({ regions, onSelectRegion, onViewAll }) => {
  return (
    <section className="regional-selections-section">
      {/* Section Header */}
      <div className="section-header">
        <h2 className="section-title">Top Regional Selections</h2>
        <button
          type="button"
          className="section-view-all-btn"
          onClick={onViewAll}
        >
          View all
        </button>
      </div>

      {/* Regional Cards Grid */}
      <div className="regional-cards-grid">
        {regions && regions.map((region) => (
          <RegionCard
            key={region.id}
            region={region}
            onSelectRegion={onSelectRegion}
          />
        ))}
      </div>
    </section>
  );
};

export default RegionalSelections;
