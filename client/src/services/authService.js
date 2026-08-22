import { api } from './api';

export const authService = {
  /**
   * Login user with email and password
   * @param {{ email: string, password: string, rememberMe?: boolean }} credentials
   */
  async login({ email, password, rememberMe = false }) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        rememberMe,
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Login failed', { cause: error });
      }
      // Demo fallback when server is not running
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        message: 'Logged in successfully (Demo Mode)',
        data: {
          user: {
            id: 1,
            firstName: email.split('@')[0] || 'Traveler',
            lastName: 'Explorer',
            email,
            role: 'USER',
            profileImageUrl: null,
          },
          tokens: {
            accessToken: 'mock_demo_access_token',
            refreshToken: 'mock_demo_refresh_token',
          },
        },
      };
    }
  },

  /**
   * Register a new user account
   * @param {Object} userData
   */
  async register(userData) {
    try {
      const isFormData = userData instanceof FormData;
      const response = await api.post('/auth/register', userData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Registration failed', { cause: error });
      }
      // Demo fallback when server is not running
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const firstName = userData instanceof FormData ? userData.get('firstName') : userData.firstName;
      const lastName = userData instanceof FormData ? userData.get('lastName') : userData.lastName;
      const email = userData instanceof FormData ? userData.get('email') : userData.email;
      const city = userData instanceof FormData ? userData.get('city') : userData.city;
      const country = userData instanceof FormData ? userData.get('country') : userData.country;
      const bio = userData instanceof FormData ? userData.get('bio') : userData.bio;

      return {
        success: true,
        message: 'Account created successfully (Demo Mode)',
        data: {
          user: {
            id: Date.now(),
            firstName: firstName || 'Aliza',
            lastName: lastName || 'Saiyed',
            email: email || 'you@example.com',
            city: city || 'Your city',
            country: country || 'India',
            bio: bio || '',
            role: 'USER',
            profileImageUrl: null,
          },
          tokens: {
            accessToken: 'mock_demo_access_token',
            refreshToken: 'mock_demo_refresh_token',
          },
        },
      };
    }
  },

  /**
   * Get current authenticated user
   */
  async getMe() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to get profile', { cause: error });
      }
      return null;
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      const refreshToken = localStorage.getItem('gt_refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.warn('Logout API error:', error);
    } finally {
      localStorage.removeItem('gt_access_token');
      localStorage.removeItem('gt_refresh_token');
      localStorage.removeItem('gt_user');
    }
  },

  /**
   * Request password reset
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to send reset link', { cause: error });
      }
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        success: true,
        message: 'Password reset link sent to your email (Demo Mode)',
      };
    }
  },
};
