/**
 * Application constants
 *
 * All magic numbers, strings, and configuration values defined here.
 * No hardcoding of values in components or services.
 */

// ============================================================================
// Design System / Colors
// ============================================================================

export const COLORS = {
  PRIMARY: '#378ADD', // Blue 400 — primary buttons, active nav states
  CONFIRMATION: '#1D9E75', // Teal 400 — "Watched" and saved states
  SURFACE_LIGHT: '#F5F7FA',
  TEXT_PRIMARY: '#1F2937',
  TEXT_SECONDARY: '#6B7280',
  BORDER: '#E5E7EB',
  ERROR: '#EF4444',
} as const;

// ============================================================================
// Spacing & Layout
// ============================================================================

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
} as const;

export const BORDER_RADIUS = {
  SHARP: 6, // Cards, buttons
  ROUND: 20,
} as const;

// ============================================================================
// Typography (for fonts in components)
// ============================================================================

export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 24,
  XXL: 32,
} as const;

export const FONT_WEIGHTS = {
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
} as const;

// ============================================================================
// Rating System
// ============================================================================

export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0,
} as const;

// ============================================================================
// Cache Configuration
// ============================================================================

export const CACHE_EXPIRY = {
  SEARCH_HOURS: parseInt(process.env.CACHE_EXPIRY_SEARCH_HOURS || '1', 10),
  SOURCES_HOURS: parseInt(process.env.CACHE_EXPIRY_SOURCES_HOURS || '24', 10),
} as const;

// ============================================================================
// Pagination & Limits
// ============================================================================

export const PAGINATION = {
  SEARCH_LIMIT: 20,
  LIST_LIMIT: 50,
  REVIEWS_LIMIT: 10,
} as const;

// ============================================================================
// Navigation
// ============================================================================

export const BOTTOM_NAV_TABS = ['Home', 'Search', 'MyLists', 'Profile'] as const;

export const NAVIGATION_ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  TITLE_DETAIL: '/title/:id',
  MY_LISTS: '/mylists',
  WATCHLIST: '/watchlist',
  WATCHED: '/watched',
  PROFILE: '/profile',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

// ============================================================================
// User-Facing Strings
// ============================================================================

export const STRINGS = {
  // Common actions
  SAVE: 'Save',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  SUBMIT: 'Submit',
  LOADING: 'Loading...',
  ERROR: 'Something went wrong',
  RETRY: 'Retry',
  NO_DATA: 'No data available',

  // Features
  ADD_TO_WATCHLIST: 'Add to Watch List',
  REMOVE_FROM_WATCHLIST: 'Remove from Watch List',
  MARK_WATCHED: 'Mark as Watched',
  WRITE_REVIEW: 'Write a Review',
  NOT_AVAILABLE: 'Not currently available to stream',

  // Errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',

  // Navigation
  HOME: 'Home',
  SEARCH: 'Search',
  MY_LISTS: 'My Lists',
  PROFILE: 'Profile',
} as const;

export default {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
  RATING,
  CACHE_EXPIRY,
  PAGINATION,
  NAVIGATION_ROUTES,
  BOTTOM_NAV_TABS,
  STRINGS,
};
