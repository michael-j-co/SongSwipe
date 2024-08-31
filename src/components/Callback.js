// src/components/Callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = ({ setAccessToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      const tokenMatch = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token='));

      if (tokenMatch) {
        token = tokenMatch.split('=')[1];
        window.localStorage.setItem('token', token);
        setAccessToken(token);
        window.location.hash = ''; // Clear the hash
        navigate('/playlists'); // Navigate to /playlists
      } else {
        navigate('/'); // Redirect to login if no token found
      }
    } else if (token) {
      setAccessToken(token);
      navigate('/playlists'); // Navigate to /playlists
    } else {
      navigate('/'); // Redirect to login if no hash
    }
  }, [navigate, setAccessToken]);

  return <div>Loading...</div>;
};

export default Callback;
