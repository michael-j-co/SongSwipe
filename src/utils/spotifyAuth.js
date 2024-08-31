// src/utils/spotifyAuth.js
const clientId = '0291931c55c94124adde3ce9066a5162';
const redirectUri = 'http://localhost:3000/callback'; // Replace with your redirect URI
const scopes = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
  'user-read-email'
];

export const getSpotifyAuthUrl = () => {
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scopes.join('%20')}&show_dialog=true`;
};
