// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';
import './Header.css'; // Import custom CSS for styling

const Header = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    const confirmNavigation = window.confirm('Are you sure you want to return to Playlist Buddy? Your progress will not be saved.');
    if (confirmNavigation) {
      navigate('/playlists');
    }
  };

  return (
    <Navbar bg="dark" variant="dark" className="header-navbar">
      <Container fluid className="p-0">
        {/* Button for PlaylistBuddy at the very top left */}
        <Button variant="outline-light" onClick={handleHomeClick} className="playlist-buddy-button">
          PlaylistBuddy
        </Button>
      </Container>
    </Navbar>
  );
};

export default Header;
