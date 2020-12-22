import { useState, useCallback, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const controller = new AbortController();
  const { signal } = controller;

  const sendRequest = useCallback(async (url, opt) => {
    setIsLoading(true);

    try {
      const response = await fetch(url, { ...opt, signal });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);

      return responseData;
    } catch (err) {
      setIsLoading(false);

      setError(err.message || "Something went wrong! Please try again.");
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  return { sendRequest, isLoading, error, clearError };
};
