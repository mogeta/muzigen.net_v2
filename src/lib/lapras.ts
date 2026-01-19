import type { LaprasPublicPageData, LaprasApiError } from '../types/lapras';

const LAPRAS_API_BASE_URL = 'https://lapras.com';

/**
 * Fetch public profile data from Lapras API
 * @param shareId - The Lapras share ID (e.g., 'PCA9WVM')
 * @returns Promise with profile data or null if not found
 */
export async function fetchLaprasProfile(
  shareId: string
): Promise<LaprasPublicPageData | null> {
  try {
    const url = `${LAPRAS_API_BASE_URL}/public/${shareId}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`Lapras profile not found: ${shareId}`);
        return null;
      }
      throw new Error(`Failed to fetch Lapras profile: ${response.status}`);
    }

    const data = await response.json();

    // Check if response is an error
    if (isLaprasError(data)) {
      console.error(`Lapras API error: ${data.message}`);
      return null;
    }

    return data as LaprasPublicPageData;
  } catch (error) {
    console.error('Error fetching Lapras profile:', error);
    return null;
  }
}

/**
 * Type guard to check if response is an error
 */
function isLaprasError(data: unknown): data is LaprasApiError {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    data.error === true
  );
}

/**
 * Format score with one decimal place
 */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

/**
 * Get score color based on value
 */
export function getScoreColor(score: number): string {
  if (score >= 4.5) return 'text-purple-600';
  if (score >= 4.0) return 'text-blue-600';
  if (score >= 3.5) return 'text-green-600';
  if (score >= 3.0) return 'text-yellow-600';
  return 'text-gray-600';
}

/**
 * Get score background color based on value
 */
export function getScoreBgColor(score: number): string {
  if (score >= 4.5) return 'bg-purple-50';
  if (score >= 4.0) return 'bg-blue-50';
  if (score >= 3.5) return 'bg-green-50';
  if (score >= 3.0) return 'bg-yellow-50';
  return 'bg-gray-50';
}
