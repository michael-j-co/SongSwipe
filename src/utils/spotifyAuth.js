// src/utils/spotifyAuth.js

const clientId = '0291931c55c94124adde3ce9066a5162';
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

const scopes = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
  'user-read-email', // We need this to fetch the user's email
];

// Generate the Spotify Authorization URL
export const getSpotifyAuthUrl = () => {
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scopes.join('%20')}&show_dialog=true`;
};

// Fetch the user's Spotify profile information, including email
export const fetchSpotifyUserProfile = async (accessToken) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return data; // This will contain the user's email, display_name, etc.
  } catch (error) {
    console.error('Error fetching Spotify user profile:', error);
    throw error;
  }
};
