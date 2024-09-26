import React, { useState } from 'react';
import { Container, Form, Button, Spinner, Tooltip, OverlayTrigger, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useDebouncedCallback } from 'use-debounce';

const CreatePlaylistForm = ({ accessToken }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleNext = (event) => {
    event.preventDefault();
    if (!playlistName) {
      setError('Please enter a playlist name.');
      return;
    }
    setLoading(true);
    navigate('/search-playlists', { state: { playlistName, description, isPublic, accessToken } });
  };

  const debouncedSetPlaylistName = useDebouncedCallback((value) => {
    setPlaylistName(value);
    setError('');
  }, 300);

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: theme.primary,
        color: theme.textPrimary,
        paddingTop: '10vh',
        paddingBottom: '10vh',
      }}
    >
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setError('')} show={!!error} delay={3000} autohide bg="danger">
          <Toast.Body>{error}</Toast.Body>
        </Toast>
      </ToastContainer>
      
      <h2 className="mb-4" style={{ color: theme.textPrimary }}>Create a New Playlist</h2>
      
      {/* Remove spring animation and animated.div */}
      <Form className="mb-4" onSubmit={handleNext} style={{ width: '100%', maxWidth: '500px' }}>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: theme.textPrimary }}>
            Playlist Name <span style={{ color: theme.dangerButtonBackground }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={playlistName}
            onChange={(e) => debouncedSetPlaylistName(e.target.value)}
            style={{
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
              borderColor: theme.inputBorder,
              transition: 'border-color 0.2s ease',
            }}
            isInvalid={!!error}
          />
          <Form.Control.Feedback type="invalid" style={{ color: theme.dangerButtonBackground }}>
            {error}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ color: theme.textPrimary }}>Playlist Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
              borderColor: theme.inputBorder,
              transition: 'border-color 0.2s ease',
              height: '100px', // Fixed height
              userSelect: 'none', // Prevent selection/dragging
            }}
            draggable={false} // Disable drag
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex align-items-center">
          <OverlayTrigger overlay={<Tooltip>Check this to make your playlist public and shareable.</Tooltip>}>
            <Form.Check
              type="checkbox"
              label="Public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={{ color: theme.textPrimary, marginLeft: '5px' }}
            />
          </OverlayTrigger>
        </Form.Group>

        <Button
          type="submit"
          style={{
            backgroundColor: theme.buttonBackground,
            color: theme.buttonText,
            border: 'none',
            width: '100%',
            padding: '10px 0',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
          }}
          disabled={loading}
          onMouseEnter={(e) => e.target.style.opacity = 0.8}
          onMouseLeave={(e) => e.target.style.opacity = 1}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Processing...
            </>
          ) : 'Next'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePlaylistForm;
