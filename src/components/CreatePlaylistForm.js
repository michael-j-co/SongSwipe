import React, { useState } from 'react';
import { Container, Form, Button, Tooltip, OverlayTrigger } from 'react-bootstrap'; // Added Tooltip and OverlayTrigger
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext hook

const CreatePlaylistForm = ({ accessToken }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();
  const { theme } = useTheme(); // Access the current theme

  const handleNext = (event) => {
    event.preventDefault();

    if (!playlistName) {
      setError('Please enter a playlist name.');
      return;
    }

    setLoading(true); // Set loading state
    // Navigate to the next step and pass the collected data
    navigate('/search-playlists', { state: { playlistName, description, isPublic, accessToken } });
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background,
        color: theme.textPrimary,
        padding: '20px',
      }}
    >
      <h2 className="mb-4" style={{ color: theme.textPrimary }}>Create a New Playlist</h2>
      <Form className="mb-4" onSubmit={handleNext} style={{ width: '100%', maxWidth: '500px' }}>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: theme.textPrimary }}>Playlist Name</Form.Label>
          <Form.Control
            type="text"
            value={playlistName}
            onChange={(e) => {
              setPlaylistName(e.target.value);
              setError(''); // Clear error on input change
            }}
            style={{
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
              borderColor: theme.inputBorder,
              transition: 'border-color 0.2s ease', // Add transition for smoother focus effect
            }}
            isInvalid={!!error} // Show red border if error exists
          />
          <Form.Control.Feedback type="invalid" style={{ color: theme.dangerButtonBackground }}> {/* Error message in theme danger color */}
            {error}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: theme.textPrimary }}>Playlist Description</Form.Label>
          <Form.Control
            as="textarea" // Use textarea for description
            rows={3} // Provide more space for description input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
              borderColor: theme.inputBorder,
              transition: 'border-color 0.2s ease',
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3 d-flex align-items-center">
          {/* Tooltip to provide more information about the checkbox */}
          <OverlayTrigger
            overlay={<Tooltip>Check this to make your playlist public and shareable.</Tooltip>}
          >
            <Form.Check
              type="checkbox"
              label="Public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={{
                color: theme.textPrimary,
                marginLeft: '5px', // Add margin for better alignment
              }}
            />
          </OverlayTrigger>
        </Form.Group>
        <Button
          type="submit"
          style={{
            backgroundColor: theme.buttonBackground,
            color: theme.buttonText,
            border: 'none',
            width: '100%', // Full width button for better UX on mobile
            padding: '10px 0', // Adjust padding for consistent button size
            transition: 'background-color 0.3s ease, transform 0.2s ease', // Add hover transition
          }}
          disabled={loading} // Disable button while loading
          onMouseEnter={(e) => e.target.style.opacity = 0.8} // Hover effect
          onMouseLeave={(e) => e.target.style.opacity = 1}
        >
          {loading ? 'Processing...' : 'Next'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePlaylistForm;
