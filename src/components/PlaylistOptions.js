// src/components/PlaylistOptions.js
import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PlaylistOptions = () => {
  const navigate = useNavigate();

  const handleCreatePlaylist = () => {
    navigate('/create-playlist-form');
  };

  const handleEditPlaylist = () => {
    navigate('/edit-playlist');
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h1 className="text-light mb-4">What would you like to do?</h1>
      <Row>
        <Col className="mb-3">
          {/* Button to create a new playlist */}
          <Button variant="success" size="lg" onClick={handleCreatePlaylist}>
            Create New Playlist
          </Button>
        </Col>
        <Col>
          {/* Button to edit an existing playlist */}
          <Button variant="success" size="lg" onClick={handleEditPlaylist}>
            Edit Existing Playlist
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaylistOptions;
