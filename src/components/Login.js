// src/components/Login.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { getSpotifyAuthUrl } from '../utils/spotifyAuth';
import logo from '../assets/pblogo.png'; // Import the logo

const Login = () => {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      {/* Add the logo above the title */}
      <img src={logo} alt="PlaylistBuddy Logo" style={{ width: '150px', marginBottom: '20px' }} />

      <h1 className="text-center mb-4 text-light">Welcome to PlaylistBuddy</h1>
      <Button variant="success" size="lg" href={getSpotifyAuthUrl()}>
        Login with Spotify
      </Button>
    </Container>
  );
};

export default Login;
