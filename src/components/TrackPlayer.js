import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';  // Ensure the audio player styles are imported
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext hook

const TrackPlayer = ({ track, swipeDirection }) => {
  const { theme } = useTheme(); // Access the current theme

  return (
    <div className="track-player-container text-center w-100" style={{ color: theme.textPrimary }}>
      {/* Display the track title and artist information */}
      <h4 className="track-title mt-3" style={{ color: theme.textPrimary }}>
        Track Preview: <a href={`https://open.spotify.com/track/${track.id}`} target="_blank" rel="noopener noreferrer" style={{ color: theme.textPrimary }}>{track.name}</a>
      </h4>
      
      {/* Correctly display artist names */}
      <p className="track-artist" style={{ color: theme.textPrimary }}>
        Artist: {track.artists.map((artist, index) => (
          <span key={artist.id}>
            <a href={`https://open.spotify.com/artist/${artist.id}`} target="_blank" rel="noopener noreferrer" style={{ color: theme.textPrimary }}>{artist.name}</a>
            {index < track.artists.length - 1 ? ', ' : ''} {/* Add a comma between artist names */}
          </span>
        ))}
      </p>
      
      {/* Track cover with animation */}
      <div className={`track-image-player d-flex align-items-center justify-content-center ${swipeDirection === 'right' ? 'swipe-right' : swipeDirection === 'left' ? 'swipe-left' : ''}`} style={{ width: '100%', maxWidth: '400px', margin: '20px auto' }}>
        <a href={`https://open.spotify.com/track/${track.id}`} target="_blank" rel="noopener noreferrer">
          <img
            src={track.album.images[0]?.url}
            alt="Track"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '8px',
              marginRight: '10px',
              border: `2px solid ${theme.textPrimary}` // Use theme color for border
            }}
          />
        </a>
        
        {/* Audio Player */}
        <AudioPlayer
          src={track.preview_url}
          autoPlay
          showJumpControls={false}
          customAdditionalControls={[]}
          customVolumeControls={[]}
          layout="horizontal-reverse"
          style={{
            backgroundColor: theme.secondary, // Use theme background color
            color: theme.textPrimary, // Use theme text color
            borderRadius: '8px',
            width: '100%',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          }}
        />
      </div>

      <p style={{ color: theme.textPrimary }}>
        Content provided by <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" style={{ color: theme.textPrimary }}>Spotify</a>
      </p>
    </div>
  );
};

export default TrackPlayer;
