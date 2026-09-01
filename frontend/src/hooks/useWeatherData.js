// Custom React hook for fetching weather data

import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Phase 5
import axios from 'axios';

// 5 minutes in milliseconds.
// Matches the backend cache TTL so every poll is likely to get fresh data.
const POLL_INTERVAL_MS = 5 * 60 * 1000;


const API_PATH = '/api/weather';

function useWeatherData() {

  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
 
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);


  const [error, setError] = useState(null);

 
  const [lastUpdated, setLastUpdated] = useState(null);


  const fetchData = useCallback(async () => {
    try {

      setError(null);

      let token;
      try {
        token = await getAccessTokenSilently();
      } catch (tokenErr) {
     
        if (tokenErr.error === 'login_required' || tokenErr.error === 'consent_required') {
          loginWithRedirect();
          return; // exit fetchData early; the redirect will happen
        }
        throw tokenErr; // unexpected error — rethrow to outer catch
      }


      const response = await axios.get(API_PATH, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      setData(response.data.data);


      setLastUpdated(new Date());

    } catch (err) {

      const message =
        err.response?.data?.error?.message ||  // e.g. "Route not found"
        err.message ||                          // e.g. "Network Error"
        'Failed to fetch weather data';

      setError(message);

    } finally {
  
      setLoading(false);
    }
  }, [getAccessTokenSilently, loginWithRedirect]); 

  
  useEffect(() => {
  
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    // Fetch immediately on mount (don't wait 5 minutes for the first data).
    setLoading(true);
    fetchData();

    
    const intervalId = setInterval(fetchData, POLL_INTERVAL_MS);

    //  Cleanup function 
    return () => clearInterval(intervalId);

  }, [fetchData, isAuthenticated]); 


  return {
    data,       
    loading,    
    error,       
    lastUpdated, 
    refetch: fetchData, 
  };
}

export default useWeatherData;
