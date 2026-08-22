import {
  registerUser,
  loginUser,
  rotateRefreshTokens,
  getUserProfile,
  logoutUser,
  requestPasswordReset,
  resetPassword,
} from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await rotateRefreshTokens(refreshToken);
    res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userProfile = await getUserProfile(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        user: userProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await logoutUser(refreshToken);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const handleResetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPassword(token, newPassword);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
