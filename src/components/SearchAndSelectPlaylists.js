// src/components/SearchAndSelectPlaylists.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const reAuthenticateUser = () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('token_expiry');
  window.location.href = '/';
};

const SearchAndSelectPlaylists = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playlistName, description, isPublic, accessToken } = location.state || {};

  const [tags, setTags] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [sortOption, setSortOption] = useState('Recommended'); // State for sorting option

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

      // Fetch detailed information for each playlist to get accurate follower count
      const playlistsWithDetails = await Promise.all(
        allPlaylists.map(async (playlist) => {
          const detailedResponse = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlist.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          return {
            ...playlist,
            followers: detailedResponse.data.followers.total, // Update followers count
          };
        })
      );

      setPlaylists(playlistsWithDetails);
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

  // Function to sort playlists based on the selected option
  const sortPlaylists = (option) => {
    let sortedPlaylists = [...playlists]; // Clone the playlists array

    switch (option) {
      case 'A-Z':
        sortedPlaylists.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Author':
        sortedPlaylists.sort((a, b) => a.owner.display_name.localeCompare(b.owner.display_name));
        break;
      case 'Likes':
        sortedPlaylists.sort((a, b) => b.followers - a.followers); // Sort by number of followers descending
        break;
      case 'Recommended':
      default:
        // Default case, no sorting or custom logic for "Recommended"
        break;
    }

    setPlaylists(sortedPlaylists);
  };

  // Handle sorting option change
  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
    sortPlaylists(selectedOption);
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      {/* Search Form Section */}
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2 className="text-light mb-4 text-center">Search and Select Playlists</h2>
        <Form className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label className="text-light">Tags (comma-separated)</Form.Label>
            <Form.Control type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., gym, chill, driving" />
          </Form.Group>
          <Button variant="success" onClick={handleSearchPlaylists} disabled={loading}>
            {loading ? 'Searching...' : 'Search for Playlists'}
          </Button>
        </Form>
      </div>

      {/* Playlists Section */}
      <div className="w-100 mt-4">
        {playlists.length > 0 && (
          <>
            {/* Sorting Dropdown */}
            <Form.Group className="mb-4" style={{ maxWidth: '200px' }}> {/* Adjusted width */}
              <Form.Label className="text-light">Sort By:</Form.Label>
              <Form.Select value={sortOption} onChange={handleSortChange}>
                <option value="Recommended">Recommended</option>
                <option value="A-Z">A-Z</option>
                <option value="Author">Author</option>
                <option value="Likes">Likes</option> {/* New sorting option */}
              </Form.Select>
            </Form.Group>

            <h3 className="text-light mb-4 text-center">Select Playlists That Seem Appealing</h3>
            <Row>
              {playlists.map((playlist) => (
                <Col key={playlist.id} md={4} className="mb-4">
                  <Card className="bg-dark text-light shadow-sm h-100"> {/* Ensuring consistent height */}
                    <Card.Img variant="top" src={playlist.images[0]?.url} />
                    <Card.Body className="d-flex flex-column justify-content-between"> {/* Align content and button at the bottom */}
                      <div>
                        <Card.Title>{playlist.name}</Card.Title>
                        <Card.Text>
                          Author: {playlist.owner.display_name}
                          <br />
                          Likes: {playlist.followers || 0} {/* Correctly display likes */}
                        </Card.Text>
                      </div>
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
            <Button variant="success" className="mt-4" onClick={handleFetchTracksClick}>
              Fetch Tracks from Selected Playlists
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};

export default SearchAndSelectPlaylists;
