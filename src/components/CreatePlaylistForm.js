// src/components/CreatePlaylistForm.js
import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreatePlaylistForm = ({ accessToken }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const navigate = useNavigate();

  const handleNext = () => {
    if (!playlistName) {
      alert('Please enter a playlist name.');
      return;
    }

    // Navigate to the next step and pass the collected data
    navigate('/search-playlists', { state: { playlistName, description, isPublic, accessToken } });
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h2 className="text-light mb-4">Create a New Playlist</h2>
      <Form className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Playlist Name</Form.Label>
          <Form.Control type="text" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Playlist Description</Form.Label>
          <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="Public" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        </Form.Group>
        <Button variant="primary" onClick={handleNext}>
          Next
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePlaylistForm;
