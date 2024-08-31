// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';

const Header = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    const confirmNavigation = window.confirm('Are you sure you want to return to Playlist Buddy? Your progress will not be saved.');
    if (confirmNavigation) {
      navigate('/playlists');
    }
  };

  return (
    <Navbar bg="dark" variant="dark" className="mb-4">
      <Container>
        {/* Button for PlaylistBuddy at the top left */}
        <Navbar.Brand>
          <Button variant="outline-light" onClick={handleHomeClick}>
            PlaylistBuddy
          </Button>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
