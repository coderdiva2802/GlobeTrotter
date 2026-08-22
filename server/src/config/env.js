import 'dotenv/config';

export const config = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_key_globetrotter_123',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key_globetrotter_456',
  jwtAccessExpiry: '15m',
  jwtRefreshExpiryDefault: '7d',
  jwtRefreshExpiryRemember: '30d',
};
