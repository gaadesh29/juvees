import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const useApi = <T>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      apiCall: () => Promise<ApiResponse<T>>,
      options: {
        onSuccess?: (data: T) => void;
        onError?: (error: string) => void;
      } = {}
    ) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall();
        setState({ data: response.data, loading: false, error: null });
        options.onSuccess?.(response.data);
        return response.data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        options.onError?.(errorMessage);
        throw error;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}; 