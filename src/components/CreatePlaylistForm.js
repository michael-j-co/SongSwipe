// CreatePlaylistForm.js
import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const CreatePlaylistForm = ({ playlistName, setPlaylistName, description, setDescription, tags, setTags, isPublic, setIsPublic, onNext }) => {
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
          <Form.Label className="text-light">Tags (comma-separated)</Form.Label>
          <Form.Control type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., gym, chill, driving" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="Public" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        </Form.Group>
        <Button variant="success" onClick={onNext}>
          Next: Select Playlists
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePlaylistForm;
