import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext hook

const EditPlaylist = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(''); // Add error state
  const navigate = useNavigate(); // Initialize the navigate function
  const { theme } = useTheme(); // Access the current theme

  useEffect(() => {
    axios
      .get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setPlaylists(response.data.items);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch((error) => {
        console.error('Error fetching playlists:', error);
        setError('Failed to load playlists. Please try again.'); // Set error message
        setLoading(false); // Set loading to false in case of error
      });
  }, [accessToken]);

  const handleEditPlaylist = (playlistId) => {
    // Navigate to the SearchAndSelectPlaylists component with the selected playlist ID
    navigate('/search-playlists', {
      state: {
        accessToken,
        editingPlaylistId: playlistId, // Pass the selected playlist ID to edit
      },
    });
  };

  return (
    <Container
      className="mt-5 d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundColor: theme.primary, // Use theme background color
        color: theme.textPrimary, // Use theme text color
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <h2 className="mb-4" style={{ color: theme.textPrimary }}>
        Edit an Existing Playlist
      </h2>

      {loading ? ( // Show loading spinner while loading
        <Spinner animation="border" variant="primary" />
      ) : error ? ( // Show error message if there is an error
        <p style={{ color: theme.textPrimary }}>{error}</p>
      ) : playlists.length === 0 ? ( // Show message if there are no playlists
        <p style={{ color: theme.textPrimary }}>No playlists found. Create one to get started!</p>
      ) : (
        <Row className="w-100">
          {playlists.map((playlist) => (
            <Col key={playlist.id} md={4} className="mb-4 d-flex justify-content-center">
              <Card
                style={{
                  width: '100%', // Make cards take full width of the column
                  maxWidth: '300px', // Set a max width for better responsiveness
                  backgroundColor: theme.secondary, // Use theme background color for card
                  color: theme.textPrimary, // Use theme text color for card
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px', // Add rounded corners
                  overflow: 'hidden', // Prevent overflow of content
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Add smooth hover effect
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {playlist.images[0] && (
                  <Card.Img variant="top" src={playlist.images[0].url} style={{ height: '150px', objectFit: 'cover' }} />
                )}
                <Card.Body className="d-flex flex-column justify-content-between align-items-center">
                  <Card.Title style={{ color: theme.textPrimary, textAlign: 'center', marginBottom: '10px' }}>
                    {playlist.name}
                  </Card.Title>
                  <Button
                    onClick={() => handleEditPlaylist(playlist.id)}
                    style={{
                      backgroundColor: theme.buttonBackground, // Use theme success button background
                      color: theme.buttonText, // Use theme button text color
                      border: 'none',
                      padding: '10px 20px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      borderRadius: '5px',
                      transition: 'background-color 0.3s ease, transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = 0.8)} // Hover effect
                    onMouseLeave={(e) => (e.target.style.opacity = 1)}
                  >
                    Edit Playlist
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default EditPlaylist;
