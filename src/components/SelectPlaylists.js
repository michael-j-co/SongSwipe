// SelectPlaylists.js
import React, { useState } from 'react';
import { Container, Button, Row, Col, Card, Form } from 'react-bootstrap';
import axios from 'axios';

const SelectPlaylists = ({ accessToken, selectedPlaylists, setSelectedPlaylists, onNext }) => {
  const [playlists, setPlaylists] = useState([]);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to search for playlists using tags
  const handleSearchPlaylists = async () => {
    if (!tags) {
      alert('Please enter some tags to search for suggestions.');
      return;
    }

    if (!accessToken) {
      alert('Token is invalid or expired. Please log in again.');
      return;
    }

    console.log('Searching playlists with token:', accessToken);
    setLoading(true);

    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?q=${tags}&type=playlist&limit=10`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fetchedPlaylists = response.data.playlists.items;
      setPlaylists(fetchedPlaylists);
    } catch (error) {
      console.error('Error searching playlists:', error.response.data);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h3 className="text-light mb-4">Select Playlists to Use</h3>
      <Form className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Tags (comma-separated)</Form.Label>
          <Form.Control type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., gym, chill, driving" />
        </Form.Group>
        <Button variant="success" onClick={handleSearchPlaylists} disabled={loading}>
          {loading ? 'Searching...' : 'Search for Playlists'}
        </Button>
      </Form>

      {/* Display playlists to user for selection */}
      {playlists.length > 0 && (
        <>
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
          <Button variant="success" className="mt-4" onClick={onNext}>
            Next: Select Tracks
          </Button>
        </>
      )}
    </Container>
  );
};

export default SelectPlaylists;
