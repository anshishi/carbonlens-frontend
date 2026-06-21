import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to execute API calls with loading, data, and error state tracking.
 * @param apiFn - Async function returning a promise
 * @param immediate - If true, execute the API call on mount
 * @returns State object with execute refetch function
 */
export function useApi<T>(apiFn: () => Promise<T>, immediate = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFn();
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {});
    }
  }, [execute, immediate]);

  return { data, loading, error, execute };
}
