import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import FinishNewPlaylist from './FinishNewPlaylist';
import UpdatePlaylist from './UpdatePlaylist';
import { useTheme } from '../context/ThemeContext';

const AcceptedTracksPreview = ({ acceptedTracks, editingPlaylistId, accessToken, playlistName, playlistDescription, isPublic }) => {
  const { theme } = useTheme(); // Access theme from context

  return (
    <div style={{
      maxWidth: '650px',
      margin: '40px auto', // Centers component on page
      backgroundColor: theme.primary,
      padding: '30px',
      borderRadius: '12px'
    }}>
      <h2 style={{
        color: theme.textPrimary,
        textAlign: 'center',
        marginBottom: '30px',
        fontWeight: 'bold',
      }}>
        Preview of Accepted Tracks
      </h2>

      {/* List of Tracks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {acceptedTracks.map((track, index) => (
          <div
            key={track.id}
            style={{
              backgroundColor: theme.cardBackground,
              color: theme.textPrimary,
              padding: '15px 20px',
              borderRadius: '8px',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)', // Subtle shadow for list items
              border: `1px solid ${theme.borderColor}`, // Add border to each individual item
            }}
          >
            <strong>{index + 1}. {track.name}</strong> by {track.artists.map((artist) => artist.name).join(', ')}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        {!editingPlaylistId ? (
          <FinishNewPlaylist
            accessToken={accessToken}
            playlistName={playlistName}
            playlistDescription={playlistDescription}
            isPublic={isPublic}
            acceptedTracks={acceptedTracks}
          />
        ) : (
          <UpdatePlaylist 
            accessToken={accessToken} 
            editingPlaylistId={editingPlaylistId} 
            acceptedTracks={acceptedTracks} 
          />
        )}
      </div>
    </div>
  );
};

export default AcceptedTracksPreview;
