import { useEffect, useState, useCallback } from 'react';

export default function useAuth(triggerCheck = true) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(() => {
    return fetch('http://localhost:8080/auth/check', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(data.authenticated);
        setAuthChecked(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setAuthChecked(true);
      });
  }, []);

  useEffect(() => {
    if (triggerCheck) {
      checkAuth();
    }
  }, [triggerCheck, checkAuth]);

  return { isAuthenticated, authChecked, checkAuth };
}
