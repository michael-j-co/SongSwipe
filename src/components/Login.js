// src/components/Login.js
import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { getSpotifyAuthUrl } from '../utils/spotifyAuth';
import logo from '../assets/pblogo.png'; // Import the PlaylistBuddy logo
import spotifyLogo from '../assets/spotifylogo.png'; // Import the Spotify logo
import './Login.css'; // Import custom CSS for styling

const Login = () => {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: '100vh' }}
    >
      {/* Welcome Section */}
      <div className="welcome-section mb-5">
        <img src={logo} alt="PlaylistBuddy Logo" style={{ width: '150px', marginBottom: '20px' }} />
        <h1 className="text-light">Welcome to PlaylistBuddy</h1>
        <p className="text-light">Playlist Creation Made Easy</p>
      </div>

      {/* Steps Section */}
      <div className="steps-section mb-5">
        <h3 className="text-light mb-4">How it Works</h3>
        <Row className="text-light">
          <Col md={4}>
            <h5>Step 1</h5>
            <p>Connect to Spotify</p>
          </Col>
          <Col md={4}>
            <h5>Step 2</h5>
            <p>Create a new playlist or edit an existing one</p>
          </Col>
          <Col md={4}>
            <h5>Step 3</h5>
            <p>Choose tags for your playlist</p>
          </Col>
          <Col md={4}>
            <h5>Step 4</h5>
            <p>Choose playlists to pull from</p>
          </Col>
          <Col md={4}>
            <h5>Step 5</h5>
            <p>Choose songs</p>
          </Col>
        </Row>
      </div>

      {/* Login Button */}
      <Button variant="success" size="lg" href={getSpotifyAuthUrl()} className="mb-4">
        Login with Spotify
      </Button>

      {/* Made for Spotify Section */}
      <div className="spotify-credibility mt-4">
        <p className="text-light">Made for</p>
        <img src={spotifyLogo} alt="Spotify Logo" style={{ width: '100px' }} />
      </div>
    </Container>
  );
};

export default Login;
