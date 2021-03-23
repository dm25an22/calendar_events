import { useState } from "react";

export const useLoadStatus = () => {
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<Boolean | null>(null);

  return {
    isLoaded,
    setIsLoaded,
    error,
    setError
  }
};