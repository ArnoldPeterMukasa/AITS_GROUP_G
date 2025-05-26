// src/contexts/NotificationContext.js
import { createContext, useState, useRef, useEffect } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);

  const showNotification = (message, type = "info") => {
    // Clear any existing notification and interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setNotification({ message, type });
    setProgress(100);

    // Start progress bar animation
    intervalRef.current = setInterval(() => {
      setProgress(prev => Math.max(0, prev - 1));
    }, 50);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification();
    }, 5000);
  };

  const dismissNotification = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setNotification(null);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, progress, showNotification, dismissNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}