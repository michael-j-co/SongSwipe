// src/components/EditPlaylist.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';

const EditPlaylist = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    axios
      .get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => setPlaylists(response.data.items))
      .catch((error) => console.error('Error fetching playlists:', error));
  }, [accessToken]);

  const handleEditPlaylist = (playlistId) => {
    // Add logic to edit a selected playlist
    alert(`Edit playlist with ID: ${playlistId}`);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-light mb-4">Edit an Existing Playlist</h2>
      <Row>
        {playlists.map((playlist) => (
          <Col key={playlist.id} md={4} className="mb-4">
            <Card className="bg-dark text-light shadow-sm">
              {playlist.images[0] && <Card.Img variant="top" src={playlist.images[0].url} />}
              <Card.Body>
                <Card.Title>{playlist.name}</Card.Title>
                <Button variant="success" onClick={() => handleEditPlaylist(playlist.id)}>
                  Edit Playlist
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default EditPlaylist;