import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const SomeProtectedRoute = (url, method) => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');  // Access the token from the cookie

    console.log(token);
    if (!token) {
      // Redirect if there's no token (user is not logged in)
      navigate('/login');  // Redirect to the login page if not authenticated
      return;
    }

    // Make your authenticated request with the token
    const fetchData = async () => {
        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `AUCTIONS_PLATFORMS ${token}`,  // Pass token in the Authorization header
          },
        });

          const result = await response.json();
          return result 
    };

    fetchData();
  }, [navigate]);
}

export default SomeProtectedRoute;
