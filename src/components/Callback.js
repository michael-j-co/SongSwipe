import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSpotifyUserProfile } from '../utils/spotifyAuth'; // Assuming we have this function to fetch user profile

// Import approved email list
import { approvedEmails } from '../config';

const Callback = ({ setAccessToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    const validateUser = async (token) => {
      try {
        const profile = await fetchSpotifyUserProfile(token);
        const userEmail = profile.email;

        if (approvedEmails.includes(userEmail)) {
          // Store the token and proceed to playlists if approved
          window.localStorage.setItem('token', token);
          setAccessToken(token);  
          navigate('/playlists');
        } else {
          // If not approved, redirect to a rejection page
          navigate('/access-denied');
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate('/'); // Redirect to login if any error occurs
      }
    };

    if (!token && hash) {
      const tokenMatch = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token='));

      if (tokenMatch) {
        token = tokenMatch.split('=')[1];
        validateUser(token);
        window.location.hash = ''; // Clear the hash
      } else {
        navigate('/'); // Redirect to login if no token found
      }
    } else if (token) {
      validateUser(token);
    } else {
      navigate('/'); // Redirect to login if no hash
    }
  }, [navigate, setAccessToken]);

  return <div>Loading...</div>;
};

export default Callback;
