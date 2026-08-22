import { useState } from 'react';
import { X, Camera } from 'lucide-react';
import FormInput from '../common/FormInput';
import './EditProfileModal.css';

function EditProfileFormContent({ user, onClose, onSave }) {
  const [formData, setFormData] = useState(() => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    city: user?.city || '',
    country: user?.country || '',
    bio: user?.bio || '',
    profileImageUrl: user?.profileImageUrl || '',
  }));

  const [previewUrl, setPreviewUrl] = useState(() => user?.profileImageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData((prev) => ({ ...prev, profileImageUrl: url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = (formData.firstName?.[0] || 'A') + (formData.lastName?.[0] || 'S');

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      {/* Avatar Edit Section */}
      <div className="avatar-edit-section">
        <div className="edit-avatar-circle">
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar Preview" className="edit-avatar-img" />
          ) : (
            <span className="edit-avatar-initials">{initials}</span>
          )}
          <label htmlFor="modal-avatar-file" className="avatar-change-badge" title="Change photo">
            <Camera size={14} />
          </label>
          <input
            id="modal-avatar-file"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className="avatar-edit-info">
          <span className="avatar-edit-title">Profile Picture</span>
          <span className="avatar-edit-desc">JPG, PNG or WEBP. Max 5MB.</span>
        </div>
      </div>

      <div className="modal-form-grid-2col">
        <FormInput
          label="First name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Aarohi"
          required
        />
        <FormInput
          label="Last name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Sharma"
        />
      </div>

      <div className="modal-form-grid-2col">
        <FormInput
          label="Email address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="aarohi.sharma@example.com"
          disabled
          helperText="Email cannot be changed directly"
        />
        <FormInput
          label="Phone number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+91 9876543210"
        />
      </div>

      <div className="modal-form-grid-2col">
        <FormInput
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Mumbai"
        />
        <FormInput
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="India"
        />
      </div>

      <div className="form-group">
        <label htmlFor="bio" className="form-label">
          About you
        </label>
        <textarea
          id="bio"
          name="bio"
          rows="3"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about your travel interests..."
          className="form-textarea"
        />
      </div>

      <div className="modal-actions-row">
        <button
          type="button"
          className="modal-cancel-btn"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="modal-save-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving changes...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-content-card edit-profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Edit Profile</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <EditProfileFormContent
          key={user?.id || 'new'}
          user={user}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
