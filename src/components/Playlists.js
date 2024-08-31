// src/components/Playlists.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const Playlists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [songSuggestions, setSongSuggestions] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    // Fetch user's playlists
    axios
      .get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => setPlaylists(response.data.items))
      .catch((error) => console.error('Error fetching playlists:', error));
  }, [accessToken]);

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    fetchSongSuggestions(playlistId);
  };

  const fetchSongSuggestions = (playlistId) => {
    setSongSuggestions([/* mocked song data */]); // Example
  };

  const addSongToPlaylist = () => {
    axios
      .post(
        `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`,
        { uris: [selectedSong.uri] },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(() => {
        setShowModal(false);
        alert('Song added to playlist!');
      })
      .catch((error) => console.error('Error adding song to playlist:', error));
  };

  return (
    <Container className="mt-5">
      <h2 className="text-light">Your Playlists</h2> {/* Add text-light to header */}
      <Row>
        {playlists.map((playlist) => (
          <Col key={playlist.id} md={4} className="mb-4">
            <Card className="bg-dark text-light shadow-sm"> {/* Add bg-dark and text-light classes */}
              {playlist.images[0] && (
                <Card.Img variant="top" src={playlist.images[0].url} />
              )}
              <Card.Body>
                <Card.Title>{playlist.name}</Card.Title>
                {/* Change button variant to 'success' to make it green */}
                <Button
                  variant="success"
                  onClick={() => handlePlaylistSelect(playlist.id)}
                >
                  Select Playlist
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h2 className="mt-5 text-light">Suggested Songs</h2> {/* Add text-light to header */}
      <Row>
        {songSuggestions.map((song) => (
          <Col key={song.id} md={4} className="mb-4">
            <Card className="bg-dark text-light shadow-sm"> {/* Add bg-dark and text-light classes */}
              <Card.Body>
                <Card.Title>{song.name}</Card.Title>
                <Button
                  variant="success"
                  onClick={() => {
                    setSelectedSong(song);
                    setShowModal(true);
                  }}
                >
                  Add to Playlist
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Adding Songs */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-dark text-light"> {/* Add bg-dark and text-light classes */}
          <Modal.Title>Add Song to Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light"> {/* Add bg-dark and text-light classes */}
          Are you sure you want to add "{selectedSong?.name}" to the playlist?
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={addSongToPlaylist}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Playlists;
