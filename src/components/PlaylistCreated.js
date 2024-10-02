import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext hook
import { FaCheckCircle, FaShareAlt } from 'react-icons/fa'; // Import icons for visual feedback

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

  // Function to handle sharing the playlist link
  const handleShare = () => {
    const shareData = {
      title: playlist.name,
      text: `Check out this playlist I made using SongSwipe: ${playlist.name}!`,
      url: playlist.external_urls.spotify,
    };

    if (navigator.share) {
      // Use the Web Share API if available
      navigator
        .share(shareData)
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback: Create a mailto link or copy to clipboard
      const message = `${shareData.text}\n${shareData.url}`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent(
        shareData.title
      )}&body=${encodeURIComponent(message)}`;

      // Open email client or fallback to copying the message to clipboard
      if (window.confirm('Do you want to share via email?')) {
        window.location.href = mailtoLink;
      } else {
        navigator.clipboard
          .writeText(message)
          .then(() => alert('Playlist link and message copied to clipboard!'))
          .catch((error) =>
            console.error('Error copying to clipboard:', error)
          );
      }
    }
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        minHeight: '100vh',
        backgroundColor: theme.primary, // Use theme background color
        color: theme.textPrimary, // Use theme text color
        padding: '20px',
      }}
    >
      {/* Success Icon and Heading */}
      <FaCheckCircle
        size={60}
        color={theme.successButtonBackground}
        className="mb-4"
      />{' '}
      {/* Success icon */}
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

      {/* Share Button */}
      <Button
        onClick={handleShare}
        style={{
          backgroundColor: theme.buttonBackground,
          color: theme.buttonText,
          border: 'none',
          padding: '10px 20px',
          fontSize: '1.2rem',
          fontWeight: '600',
          borderRadius: '5px',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
          display: 'flex',
          alignItems: 'center',
        }}
        onMouseEnter={(e) => (e.target.style.opacity = 0.8)} // Hover effect
        onMouseLeave={(e) => (e.target.style.opacity = 1)}
        className="mb-3" // Margin bottom for spacing
      >
        <FaShareAlt className="me-2" /> {/* Share icon */}
        Share Playlist
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
