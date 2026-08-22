import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import FormInput from '../common/FormInput';
import Toast from '../common/Toast';
import './LoginForm.css';

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const validateForm = () => {
    const newErrors = {};
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!validateForm()) return;

    const result = await login(formData);
    if (result.success) {
      setToast({
        type: 'success',
        message: 'Welcome back! Login successful.',
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } else {
      setToast({
        type: 'error',
        message: result.message || 'Invalid credentials. Please try again.',
      });
    }
  };

  return (
    <div className="login-form-container">
      <div className="form-header">
        <h2 className="form-title">Welcome back</h2>
        <p className="form-subtitle">Login to continue your journey.</p>
      </div>

      <Toast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      <form onSubmit={handleSubmit} noValidate className="auth-form">
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
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          required
          autoComplete="current-password"
          disabled={isLoading}
        />

        <div className="form-options-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="custom-checkbox"
              disabled={isLoading}
            />
            <span className="checkbox-text">Remember me</span>
          </label>

          <button
            type="button"
            className="forgot-password-link"
            onClick={() => {
              alert('Password reset link has been dispatched to your email.');
            }}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className={`submit-primary-btn ${isLoading ? 'is-loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="btn-spinner-wrapper">
              <span className="spinner-circle" />
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        <div className="form-footer-redirect">
          <span className="footer-text">New to GlobeTrotter? </span>
          <Link to="/register" className="footer-link-highlight">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
