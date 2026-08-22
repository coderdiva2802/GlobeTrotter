import { useState } from 'react';
import { X, MapPin, Calendar, Users, DollarSign, Sparkles } from 'lucide-react';

export const PlanTripModal = ({ isOpen, onClose, onSubmitTrip }) => {
  const [formData, setFormData] = useState({
    name: '',
    locationSummary: '',
    startDate: '',
    endDate: '',
    travelerCount: 2,
    budget: '',
    coverImageUrl: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Please fill in the trip name, start date, and end date.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onSubmitTrip({
        ...formData,
        coverImageUrl:
          formData.coverImageUrl ||
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        locationSummary: formData.locationSummary || 'Scenic Destinations',
      });
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 id="modal-title" className="modal-title">Plan Your Next Trip</h2>
              <p className="modal-subtitle">Craft a personalized itinerary with AI recommendations</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="trip-name" className="form-label">
              Trip Name *
            </label>
            <input
              id="trip-name"
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Amalfi Coast Holiday or Tokyo Explorer"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="trip-location" className="form-label">
              Destination / Stops
            </label>
            <div className="input-with-icon">
              <MapPin size={17} className="field-icon" />
              <input
                id="trip-location"
                type="text"
                name="locationSummary"
                className="form-input has-icon"
                placeholder="e.g. Positano, Amalfi, Capri"
                value={formData.locationSummary}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-group">
              <label htmlFor="start-date" className="form-label">
                Start Date *
              </label>
              <div className="input-with-icon">
                <Calendar size={17} className="field-icon" />
                <input
                  id="start-date"
                  type="date"
                  name="startDate"
                  className="form-input has-icon"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="end-date" className="form-label">
                End Date *
              </label>
              <div className="input-with-icon">
                <Calendar size={17} className="field-icon" />
                <input
                  id="end-date"
                  type="date"
                  name="endDate"
                  className="form-input has-icon"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-group">
              <label htmlFor="traveler-count" className="form-label">
                Travelers
              </label>
              <div className="input-with-icon">
                <Users size={17} className="field-icon" />
                <input
                  id="traveler-count"
                  type="number"
                  name="travelerCount"
                  min="1"
                  max="50"
                  className="form-input has-icon"
                  value={formData.travelerCount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="trip-budget" className="form-label">
                Estimated Budget (USD)
              </label>
              <div className="input-with-icon">
                <DollarSign size={17} className="field-icon" />
                <input
                  id="trip-budget"
                  type="number"
                  name="budget"
                  placeholder="e.g. 2500"
                  className="form-input has-icon"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="trip-desc" className="form-label">
              Trip Description / Notes
            </label>
            <textarea
              id="trip-desc"
              name="description"
              rows={2}
              className="form-textarea"
              placeholder="What are your main goals for this trip? (e.g. beach relaxation, historic tours, food tasting)"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Form Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Trip...' : 'Create Travel Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanTripModal;
