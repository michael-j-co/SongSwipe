import React, { useState } from 'react';
import {
  Container,
  Form,
  Button,
  Spinner,
  Toast,
  ToastContainer,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './CreatePlaylistForm.css';  // Add this for custom CSS

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
    navigate('/search-playlists', {
      state: { playlistName, description, isPublic, accessToken },
    });
  };

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
      {/* Error toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setError('')} show={!!error} delay={3000} autohide>
          <Toast.Body style={{ color: theme.textPrimary }}>{error}</Toast.Body>
        </Toast>
      </ToastContainer>

      <h2 className="mb-4" style={{ color: theme.textPrimary }}>
        Create a New Playlist
      </h2>

      <Form
        className="mb-4"
        onSubmit={handleNext}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        {/* Playlist Name Input */}
        <Form.Group className="mb-3">
          <Form.Label style={{ color: theme.textPrimary }}>
            Playlist Name <span style={{ color: theme.dangerButtonBackground }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={playlistName}
            onChange={(e) => {
              setPlaylistName(e.target.value);
              setError('');
            }}
            style={{
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
              borderColor: theme.borderColor,
            }}
            isInvalid={!!error}
          />
          <Form.Control.Feedback type="invalid" style={{ color: theme.dangerButtonBackground }}>
            {error}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Playlist Description Input */}
        <Form.Group className="mb-3">
          <Form.Label style={{ color: theme.textPrimary }}>
            Playlist Description
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              backgroundColor: theme.inputBackground,
              color: theme.inputText,
              borderColor: theme.borderColor,
              height: '100px',
            }}
          />
        </Form.Group>

        {/* Custom Styled Public Checkbox */}
        <Form.Group className="mb-3 d-flex align-items-center">
          <OverlayTrigger
            overlay={<Tooltip>Check this to make your playlist public and shareable.</Tooltip>}
          >
            <div className="custom-checkbox-wrapper" style={{
              '--checkbox-bg': theme.inputBackground,
              '--checkbox-border': theme.borderColor,
              '--checkbox-checked-bg': theme.buttonBackground,
              '--checkbox-checked-border': theme.buttonBackground,
              '--checkbox-checkmark-color': theme.buttonText,
              '--checkbox-focus': theme.textPrimary,
              '--label-color': theme.textPrimary
            }}>
              <input
                type="checkbox"
                id="public-checkbox"
                className="custom-checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label htmlFor="public-checkbox" className="custom-checkbox-label">
                <span>Public</span>
              </label>
            </div>
          </OverlayTrigger>
        </Form.Group>

        {/* Submit Button */}
        <Button
          type="submit"
          style={{
            backgroundColor: theme.buttonBackground,
            color: theme.buttonText,
            border: 'none',
            width: '100%',
            padding: '10px 0',
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Processing...
            </>
          ) : (
            'Next'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePlaylistForm;
