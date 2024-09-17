import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext hook

const PlaylistInfo = ({ playlist }) => {
  const { theme } = useTheme(); // Access the current theme

  return (
    <div className="mt-4 text-center w-100" style={{ color: theme.textPrimary }}>
      <h4>
        Current Playlist: {playlist.name}
      </h4>
      <div className="d-flex flex-column align-items-center">
        <a
          href={`https://open.spotify.com/playlist/${playlist.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.textPrimary }} // Use theme text color
        >
          <img
            src={playlist.images[0]?.url}
            alt="Playlist"
            style={{
              width: '150px',
              borderRadius: '8px',
              border: `2px solid ${theme.textPrimary}`, // Use theme color for the border
            }}
            className="mb-3"
          />
          <p>By: {playlist.owner.display_name}</p>
        </a>
      </div>
    </div>
  );
};

export default PlaylistInfo;
