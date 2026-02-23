"use client";

import { useState, useEffect, useCallback } from "react";

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  // Initialize on mount (avoid SSR mismatch)
  useEffect(() => {
    setIsOnline(navigator.onLine);
  }, []);

  const handleOnline = useCallback(() => setIsOnline(true), []);
  const handleOffline = useCallback(() => setIsOnline(false), []);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return isOnline;
}
