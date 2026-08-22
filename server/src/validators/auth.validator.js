import { z } from 'zod';

const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must not exceed 50 characters' }),
  lastName: z
    .string()
    .trim()
    .max(50, { message: 'Last name must not exceed 50 characters' })
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(passwordRegex, {
      message: 'Password must contain at least one number and one special character',
    }),
  phoneNumber: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().max(100).optional().or(z.literal('')),
  country: z.string().trim().max(100).optional().or(z.literal('')),
  bio: z.string().trim().max(500).optional().or(z.literal('')),
  profileImageUrl: z.string().trim().optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional().default(false),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email address' }),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(passwordRegex, {
      message: 'Password must contain at least one number and one special character',
    }),
});
