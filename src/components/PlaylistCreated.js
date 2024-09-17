import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext hook
import { FaCheckCircle } from 'react-icons/fa'; // Import an icon for visual feedback

const PlaylistCreated = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const { playlist } = location.state || {}; // Retrieve the playlist from state
  const { theme } = useTheme(); // Access the current theme

  if (!playlist) {
    return (
      <div className="text-center mt-5" style={{ color: theme.textPrimary }}>
        No playlist information available.
      </div>
    );
  }

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background, // Use theme background color
        color: theme.textPrimary, // Use theme text color
        padding: '20px',
      }}
    >
      {/* Success Icon and Heading */}
      <FaCheckCircle size={60} color={theme.successButtonBackground} className="mb-4" /> {/* Success icon */}
      <h2 className="mb-3" style={{ color: theme.textPrimary }}>
        Playlist Created Successfully!
      </h2>
      <h4 className="mb-4" style={{ color: theme.textPrimary }}>
        {playlist.name}
      </h4>

      {/* Button to Listen on Spotify */}
      <Button
        href={playlist.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: theme.successButtonBackground, // Use theme success button background
          color: theme.buttonText, // Use theme button text color
          border: 'none',
          padding: '10px 20px', // Adjust padding for better appearance
          fontSize: '1.2rem', // Increase font size for better readability
          fontWeight: '600', // Bold font for better visibility
          borderRadius: '5px', // Rounded corners for a modern look
          transition: 'background-color 0.3s ease, transform 0.2s ease', // Add hover and transition effect
        }}
        onMouseEnter={(e) => (e.target.style.opacity = 0.8)} // Hover effect
        onMouseLeave={(e) => (e.target.style.opacity = 1)}
        className="mb-3" // Margin bottom for spacing
      >
        Listen on Spotify
      </Button>

      {/* Button to Go to Playlist Options */}
      <Button
        style={{
          backgroundColor: theme.buttonBackground,
          color: theme.buttonText,
          border: 'none',
          padding: '10px 20px',
          fontSize: '1.2rem',
          fontWeight: '600',
          borderRadius: '5px',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.target.style.opacity = 0.8)} // Hover effect
        onMouseLeave={(e) => (e.target.style.opacity = 1)}
        onClick={() => navigate('/playlists')} // Navigate to PlaylistOptions
      >
        Start Over!
      </Button>
    </Container>
  );
};

export default PlaylistCreated;
