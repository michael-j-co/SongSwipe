// CreatePlaylist.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const reAuthenticateUser = () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('token_expiry');
  window.location.href = '/';
};

const CreatePlaylist = ({ accessToken }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) {
        alert('Token is invalid or expired. Please log in again.');
        reAuthenticateUser();
        return;
      }

      try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserId(response.data.id);
        console.log('Fetched user profile:', response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.response.data);
        alert('Error fetching user profile. Please log in again.');
        reAuthenticateUser();
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  const handleSearchPlaylists = async () => {
    if (!tags) {
      alert('Please enter some tags to search for suggestions.');
      return;
    }

    if (!accessToken) {
      alert('Token is invalid or expired. Please log in again.');
      reAuthenticateUser();
      return;
    }

    console.log('Searching playlists with token:', accessToken);
    setLoading(true);

    const tagArray = tags.split(',').map(tag => tag.trim());
    const allPlaylists = [];

    try {
      for (const tag of tagArray) {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${tag}&type=playlist&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log(`Playlists fetched for tag "${tag}":`, response.data);

        const filteredPlaylists = response.data.playlists.items.filter(
          (playlist) => playlist.owner.id !== userId
        );

        filteredPlaylists.forEach((playlist) => {
          if (!allPlaylists.find((p) => p.id === playlist.id)) {
            allPlaylists.push(playlist);
          }
        });
      }

      setPlaylists(allPlaylists);
    } catch (error) {
      console.error('Error searching playlists:', error.response.data);
      if (error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
        reAuthenticateUser();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTracksClick = () => {
    if (selectedPlaylists.length === 0) {
      alert('Please select at least one playlist.');
      return;
    }

    // Navigate to the SelectTracks component with the selected playlists and playlist information
    navigate('/select-tracks', { state: { selectedPlaylists, playlistName, playlistDescription: description, isPublic } });
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h2 className="text-light mb-4">Create a New Playlist</h2>
      <Form className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Playlist Name</Form.Label>
          <Form.Control type="text" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Playlist Description</Form.Label>
          <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Tags (comma-separated)</Form.Label>
          <Form.Control type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., gym, chill, driving" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="Public" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        </Form.Group>
        <Button variant="success" onClick={handleSearchPlaylists} disabled={loading}>
          {loading ? 'Searching...' : 'Search for Playlists'}
        </Button>
      </Form>

      {playlists.length > 0 && (
        <>
          <h3 className="text-light mb-4">Select Playlists That Seem Appealing</h3>
          <Row>
            {playlists.map((playlist) => (
              <Col key={playlist.id} md={4} className="mb-4">
                <Card className="bg-dark text-light shadow-sm">
                  <Card.Img variant="top" src={playlist.images[0]?.url} />
                  <Card.Body>
                    <Card.Title>{playlist.name}</Card.Title>
                    <Button
                      variant={selectedPlaylists.includes(playlist) ? "danger" : "success"}
                      onClick={() =>
                        setSelectedPlaylists((prevSelected) =>
                          prevSelected.includes(playlist)
                            ? prevSelected.filter((p) => p.id !== playlist.id)
                            : [...prevSelected, playlist]
                        )
                      }
                    >
                      {selectedPlaylists.includes(playlist) ? "Deselect" : "Select"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {/* Button to navigate to SelectTracks component */}
          <Button variant="primary" onClick={handleFetchTracksClick}>
            Fetch Tracks from Selected Playlists
          </Button>
        </>
      )}
    </Container>
  );
};

export default CreatePlaylist;
