import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { hashToken, generateRandomToken } from '../utils/crypto.utils.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.utils.js';

/**
 * Helper to sanitize user object (removing passwordHash)
 */
const sanitizeUser = (user) => {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
};

export const registerUser = async (data) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    city,
    country,
    bio,
    profileImageUrl,
  } = data;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    const error = new Error('Email address is already registered');
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user and initial default user preferences inside a transaction
  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName,
        lastName: lastName || null,
        email: email.toLowerCase(),
        passwordHash,
        phoneNumber: phoneNumber || null,
        city: city || null,
        country: country || null,
        bio: bio || null,
        profileImageUrl: profileImageUrl || null,
      },
    });

    await tx.userPreference.create({
      data: {
        userId: user.id,
      },
    });

    return user;
  });

  // Generate tokens
  const accessToken = signAccessToken({
    userId: newUser.id,
    role: newUser.role,
    email: newUser.email,
  });

  const refreshToken = signRefreshToken({ userId: newUser.id }, false);

  // Hash and save refresh token in database (expires in 7 days)
  const hashedRefreshToken = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      userId: newUser.id,
      tokenHash: hashedRefreshToken,
      expiresAt,
    },
  });

  return {
    user: sanitizeUser(newUser),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const loginUser = async ({ email, password, rememberMe = false }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate tokens
  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  const refreshToken = signRefreshToken({ userId: user.id }, rememberMe);

  // Save hashed refresh token to DB
  const hashedRefreshToken = hashToken(refreshToken);
  const daysToExpire = rememberMe ? 30 : 7;
  const expiresAt = new Date(Date.now() + daysToExpire * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashedRefreshToken,
      expiresAt,
    },
  });

  return {
    user: sanitizeUser(user),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const rotateRefreshTokens = async (rawRefreshToken) => {
  const decoded = verifyRefreshToken(rawRefreshToken);

  if (!decoded || !decoded.userId) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }

  const hashedToken = hashToken(rawRefreshToken);

  // Find token in database
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashedToken },
    include: { user: true },
  });

  if (
    !tokenRecord ||
    tokenRecord.revokedAt !== null ||
    tokenRecord.expiresAt < new Date()
  ) {
    const error = new Error('Invalid or revoked refresh token');
    error.statusCode = 401;
    throw error;
  }

  // Revoke current token
  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { revokedAt: new Date() },
  });

  // Issue new token pair
  const newAccessToken = signAccessToken({
    userId: tokenRecord.user.id,
    role: tokenRecord.user.role,
    email: tokenRecord.user.email,
  });

  const newRefreshToken = signRefreshToken({ userId: tokenRecord.user.id });

  // Store new refresh token
  const newHashedToken = hashToken(newRefreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      userId: tokenRecord.user.id,
      tokenHash: newHashedToken,
      expiresAt,
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      preference: {
        select: {
          language: true,
          preferredCurrency: true,
          budgetLevel: true,
          travelStyle: true,
        },
      },
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
};

export const logoutUser = async (rawRefreshToken) => {
  if (!rawRefreshToken) return;

  const hashedToken = hashToken(rawRefreshToken);

  try {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashedToken },
      data: { revokedAt: new Date() },
    });
  } catch (error) {
    // Ignore error if token record is missing
  }
};

export const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (user) {
    const rawResetToken = generateRandomToken();
    const tokenHash = hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    console.log(`[DEV MODE] Password Reset Token for ${user.email}: ${rawResetToken}`);
  }

  return {
    message: 'If an account with that email exists, a password reset link has been sent.',
  };
};

export const resetPassword = async (rawResetToken, newPassword) => {
  const tokenHash = hashToken(rawResetToken);

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (
    !resetRecord ||
    resetRecord.usedAt !== null ||
    resetRecord.expiresAt < new Date()
  ) {
    const error = new Error('Invalid or expired password reset token');
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    message: 'Password has been reset successfully. Please log in with your new password.',
  };
};
