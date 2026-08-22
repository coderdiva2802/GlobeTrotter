import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const signAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpiry,
  });
};

export const signRefreshToken = (payload, rememberMe = false) => {
  const expiresIn = rememberMe
    ? config.jwtRefreshExpiryRemember
    : config.jwtRefreshExpiryDefault;

  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwtAccessSecret);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret);
  } catch (error) {
    return null;
  }
};
