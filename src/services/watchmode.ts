/**
 * Watchmode API client
 *
 * Handles all API calls to Watchmode with:
 * - Automatic retry on 429 (rate limit) using fallback key
 * - Configurable timeout
 * - Error handling with user-friendly messages
 */

import axios, { AxiosError } from 'axios';

// Load environment variables
const WATCHMODE_API_KEY_1 = process.env.WATCHMODE_API_KEY_1 || '';
const WATCHMODE_API_KEY_2 = process.env.WATCHMODE_API_KEY_2 || '';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT_MS || '10000', 10);

const BASE_URL = 'https://api.watchmode.com/v1';

interface WatchmodeError {
  message: string;
  statusCode?: number;
  originalError?: unknown;
}

const client = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
});

/**
 * Make a request to Watchmode API with automatic fallback retry
 */
async function makeRequest<T>(
  method: string,
  endpoint: string,
  config?: Record<string, unknown>,
  retryCount = 0
): Promise<T> {
  const maxRetries = 1;
  const apiKey = retryCount === 0 ? WATCHMODE_API_KEY_1 : WATCHMODE_API_KEY_2;

  if (!apiKey) {
    throw {
      message: 'Watchmode API key is not configured. Check your .env file.',
      statusCode: 500,
    } as WatchmodeError;
  }

  const url = `${endpoint}?apiKey=${apiKey}`;

  try {
    const response = await client({
      method,
      url,
      ...config,
    });

    return response.data as T;
  } catch (error) {
    const axiosError = error as AxiosError<unknown>;

    // Retry on 429 (rate limit) with fallback key
    if (axiosError.response?.status === 429 && retryCount < maxRetries) {
      console.warn(
        `[Watchmode] Rate limit hit (429). Retrying with fallback key...`
      );
      return makeRequest<T>(method, endpoint, config, retryCount + 1);
    }

    const statusCode = axiosError.response?.status || 500;
    let message = 'Failed to fetch data from Watchmode';

    if (statusCode === 429) {
      message = 'Rate limit exceeded. Please try again later.';
    } else if (statusCode === 401) {
      message = 'Invalid API key. Please check your configuration.';
    } else if (statusCode === 404) {
      message = 'Content not found.';
    } else if (axiosError.code === 'ECONNABORTED') {
      message = 'Request timeout. Please check your connection.';
    }

    console.error('[Watchmode Error]', {
      status: statusCode,
      message,
      originalError: axiosError.message,
    });

    throw {
      message,
      statusCode,
      originalError: error,
    } as WatchmodeError;
  }
}

// ============================================================================
// API Methods
// ============================================================================

/**
 * Search for titles by name
 * @param query Search query string
 * @param types Filter by type: 'movie', 'tv_series', 'tv_movie'
 */
export async function searchTitles(
  query: string,
  types: string[] = ['movie', 'tv_series']
) {
  const typeFilter = types.join(',');
  return makeRequest(
    'GET',
    `/search/?search_field=name&search_value=${encodeURIComponent(query)}&types=${typeFilter}`
  );
}

/**
 * Get detailed metadata for a title
 * @param titleId Watchmode title ID
 */
export async function getTitleDetails(titleId: string | number) {
  return makeRequest('GET', `/title/${titleId}/details/`);
}

/**
 * Get streaming/rental/purchase sources for a title
 * @param titleId Watchmode title ID
 * @param region Country code (e.g., 'PT', 'US')
 */
export async function getTitleSources(titleId: string | number, region = 'PT') {
  return makeRequest(
    'GET',
    `/title/${titleId}/sources/?region=${region}`
  );
}

/**
 * Get trending/popular titles
 * @param sortBy Sort order (e.g., 'popularity_desc')
 * @param limit Number of results to return
 */
export async function getListTitles(sortBy = 'popularity_desc', limit = 50) {
  return makeRequest(
    'GET',
    `/list-titles/?sort_by=${sortBy}&limit=${limit}`
  );
}

/**
 * Get all available streaming services
 * @param region Country code (e.g., 'PT', 'US')
 */
export async function getStreamingSources(region = 'PT') {
  return makeRequest('GET', `/sources/?region=${region}`);
}

/**
 * Get episode-level streaming data for a TV series
 * @param titleId Watchmode title ID
 */
export async function getTitleEpisodes(titleId: string | number) {
  return makeRequest('GET', `/title/${titleId}/episodes/`);
}

export default {
  searchTitles,
  getTitleDetails,
  getTitleSources,
  getListTitles,
  getStreamingSources,
  getTitleEpisodes,
};
