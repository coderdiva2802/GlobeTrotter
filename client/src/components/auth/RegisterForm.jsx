import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import FormInput from '../common/FormInput';
import AvatarUpload from './AvatarUpload';
import Toast from '../common/Toast';
import './RegisterForm.css';

export default function RegisterForm() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    country: '',
    password: '',
    bio: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const initialLetter = formData.firstName.trim()
    ? formData.firstName.trim().charAt(0).toUpperCase()
    : 'A';

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarSelected = (file, previewUrl) => {
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
  };

  const handleAvatarRemoved = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!validateForm()) return;

    // Use FormData if an avatar file is selected, otherwise standard JSON object
    let payload;
    if (avatarFile) {
      payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) payload.append(key, formData[key]);
      });
      payload.append('avatar', avatarFile);
    } else {
      payload = { ...formData };
    }

    const result = await register(payload);
    if (result.success) {
      setToast({
        type: 'success',
        message: 'Account registered successfully! Welcome to GlobeTrotter.',
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } else {
      setToast({
        type: 'error',
        message: result.message || 'Registration failed. Please try again.',
      });
    }
  };

  return (
    <div className="register-form-container">
      <div className="form-header">
        <h2 className="form-title">Create account</h2>
      </div>

      <Toast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        {/* Photo Upload Section */}
        <AvatarUpload
          initialLetter={initialLetter}
          previewUrl={avatarPreview}
          onImageSelected={handleAvatarSelected}
          onImageRemoved={handleAvatarRemoved}
        />

        {/* 2-Column Responsive Grid */}
        <div className="form-grid-2col">
          <FormInput
            label="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Aliza"
            error={errors.firstName}
            required
            autoComplete="given-name"
            disabled={isLoading}
          />

          <FormInput
            label="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Saiyed"
            autoComplete="family-name"
            disabled={isLoading}
          />
        </div>

        <div className="form-grid-2col">
          <FormInput
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <FormInput
            label="Phone number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+91 00000 00000"
            autoComplete="tel"
            disabled={isLoading}
          />
        </div>

        <div className="form-grid-2col">
          <FormInput
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Your city"
            autoComplete="address-level2"
            disabled={isLoading}
          />

          <FormInput
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="India"
            autoComplete="country-name"
            disabled={isLoading}
          />
        </div>

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          error={errors.password}
          required
          autoComplete="new-password"
          disabled={isLoading}
        />

        {/* About You Textarea */}
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
            disabled={isLoading}
          />
        </div>

        {/* Register Submit Button */}
        <button
          type="submit"
          className={`submit-primary-btn ${isLoading ? 'is-loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="btn-spinner-wrapper">
              <span className="spinner-circle" />
              Registering...
            </span>
          ) : (
            'Register user'
          )}
        </button>

        {/* Redirect to Login */}
        <div className="form-footer-redirect">
          <span className="footer-text">Already have an account? </span>
          <Link to="/login" className="footer-link-highlight">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
