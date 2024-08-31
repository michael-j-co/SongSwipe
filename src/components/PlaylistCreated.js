// PlaylistCreated.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const PlaylistCreated = () => {
  const location = useLocation();
  const { playlist } = location.state || {}; // Retrieve the playlist from state

  if (!playlist) {
    return <div className="text-light text-center mt-5">No playlist information available.</div>;
  }

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h2 className="text-light mb-4">Playlist Created Successfully!</h2>
      <h4 className="text-light mb-4">{playlist.name}</h4>
      <Button 
        variant="success" 
        href={playlist.external_urls.spotify} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Listen on Spotify
      </Button>
    </Container>
  );
};

export default PlaylistCreated;
