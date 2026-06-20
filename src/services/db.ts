/**
 * Database service layer
 *
 * Abstracts Firebase / Supabase database calls for:
 * - watchlist
 * - watched
 * - reviews
 * - users
 *
 * Implement either Firebase (Firestore) or Supabase methods based on chosen BaaS.
 */

export interface WatchlistItem {
  id: string;
  userId: string;
  titleId: string;
  titleName: string;
  posterUrl: string;
  addedAt: Date;
}

export interface WatchedItem extends WatchlistItem {
  watchedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  titleId: string;
  titleName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Watchlist Operations
// ============================================================================

export async function addToWatchlist(
  userId: string,
  titleId: string,
  titleName: string,
  posterUrl: string
): Promise<WatchlistItem> {
  throw new Error(
    'addToWatchlist not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

export async function removeFromWatchlist(
  userId: string,
  titleId: string
): Promise<void> {
  throw new Error(
    'removeFromWatchlist not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  throw new Error(
    'getWatchlist not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

// ============================================================================
// Watched Operations
// ============================================================================

export async function addToWatched(
  userId: string,
  titleId: string,
  titleName: string,
  posterUrl: string
): Promise<WatchedItem> {
  throw new Error(
    'addToWatched not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

export async function removeFromWatched(
  userId: string,
  titleId: string
): Promise<void> {
  throw new Error(
    'removeFromWatched not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

export async function getWatched(userId: string): Promise<WatchedItem[]> {
  throw new Error(
    'getWatched not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

// ============================================================================
// Review Operations
// ============================================================================

export async function createReview(
  userId: string,
  titleId: string,
  titleName: string,
  rating: 1 | 2 | 3 | 4 | 5,
  body?: string,
  isPublic = false
): Promise<Review> {
  throw new Error(
    'createReview not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

export async function updateReview(
  reviewId: string,
  updates: Partial<Omit<Review, 'id' | 'userId' | 'titleId' | 'titleName' | 'createdAt'>>
): Promise<Review> {
  throw new Error(
    'updateReview not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

export async function deleteReview(reviewId: string): Promise<void> {
  throw new Error(
    'deleteReview not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

export async function getReviewsForTitle(titleId: string): Promise<Review[]> {
  throw new Error(
    'getReviewsForTitle not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

export async function getReviewsByUser(userId: string): Promise<Review[]> {
  throw new Error(
    'getReviewsByUser not implemented. Choose Firebase or Supabase and implement accordingly.'
  );
}

export default {
  // Watchlist
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  // Watched
  addToWatched,
  removeFromWatched,
  getWatched,
  // Reviews
  createReview,
  updateReview,
  deleteReview,
  getReviewsForTitle,
  getReviewsByUser,
};
