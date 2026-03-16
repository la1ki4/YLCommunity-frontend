import { useEffect, useState, useCallback } from "react";
import { getJson } from "@shared/api/httpClient.js";
import { AUTH_API } from "@shared/config/apiEndpoints.js";

export default function useAuth(triggerCheck = true) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(() => {
    return getJson(`${AUTH_API}/auth/check`)
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
