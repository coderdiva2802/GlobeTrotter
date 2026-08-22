import crypto from 'crypto';

/**
 * Creates a SHA-256 hash of a raw token string for secure DB storage
 * @param {string} token
 * @returns {string} hex encoded hash
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generates a cryptographically secure random token string
 * @param {number} bytes
 * @returns {string} hex encoded random string
 */
export const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};
