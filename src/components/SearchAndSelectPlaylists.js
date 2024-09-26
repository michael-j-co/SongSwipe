import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons for select/deselect actions

const reAuthenticateUser = () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('token_expiry');
  window.location.href = '/';
};

const SearchAndSelectPlaylists = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme(); // Access the current theme
  const { playlistName, description, isPublic, accessToken, editingPlaylistId } = location.state || {};

  const [tags, setTags] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [sortOption, setSortOption] = useState('Recommended');

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

  const handleSearchPlaylists = async (event) => {
    event.preventDefault();

    if (!tags) {
      alert('Please enter some tags to search for suggestions.');
      return;
    }

    if (!accessToken) {
      alert('Token is invalid or expired. Please log in again.');
      reAuthenticateUser();
      return;
    }

    setLoading(true);

    const tagArray = tags.split(',').map((tag) => tag.trim());
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
            followers: detailedResponse.data.followers.total,
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

  const handleFetchTracksClick = (event) => {
    event.preventDefault();

    if (selectedPlaylists.length === 0) {
      alert('Please select at least one playlist.');
      return;
    }

    navigate('/select-tracks', {
      state: {
        selectedPlaylists,
        playlistName,
        playlistDescription: description,
        isPublic,
        editingPlaylistId,
      },
    });
  };

  const sortPlaylists = (option) => {
    let sortedPlaylists = [...playlists];
  
    switch (option) {
      case 'A-Z':
        sortedPlaylists.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Author':
        sortedPlaylists.sort((a, b) => a.owner.display_name.localeCompare(b.owner.display_name));
        break;
      case 'Likes':
        sortedPlaylists.sort((a, b) => b.followers - a.followers);
        break;
      case 'Recommended':
      default:
        // Sort by recommended by placing Spotify playlists at the top
        sortedPlaylists.sort((a, b) => {
          const isSpotifyA = a.owner.id === 'spotify';
          const isSpotifyB = b.owner.id === 'spotify';
          if (isSpotifyA && !isSpotifyB) return -1; // a is Spotify, b is not -> a first
          if (!isSpotifyA && isSpotifyB) return 1;  // b is Spotify, a is not -> b first
          return 0; // If both are Spotify or neither, leave them as is
        });
        break;
    }
  
    setPlaylists(sortedPlaylists);
  };
  

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
    sortPlaylists(selectedOption);
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: theme.primary,
        color: theme.textPrimary,
        padding: '20px',
      }}
    >
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2 className="mb-4 text-center" style={{ color: theme.textPrimary }}>
          Search and Select Playlists
        </h2>
        <Form className="mb-4" onSubmit={handleSearchPlaylists}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: theme.textPrimary }}>Tags (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., gym, chill, driving"
              style={{
                backgroundColor: theme.inputBackground,
                color: theme.textPrimary,
                borderColor: theme.inputBorder,
              }}
            />
          </Form.Group>
          <Button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: theme.buttonBackground,
              color: theme.buttonText,
              border: 'none',
            }}
          >
            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Search for Playlists'}
          </Button>
        </Form>
      </div>

      <div className="w-100 mt-4">
        {playlists.length > 0 && (
          <>
            <Form.Group className="mb-4" style={{ maxWidth: '200px' }}>
              <Form.Label style={{ color: theme.textPrimary }}>Sort By:</Form.Label>
              <Form.Select
                value={sortOption}
                onChange={handleSortChange}
                style={{
                  backgroundColor: theme.inputBackground,
                  color: theme.textPrimary,
                  borderColor: theme.inputBorder,
                }}
              >
                <option value="Recommended">Recommended</option>
                <option value="A-Z">A-Z</option>
                <option value="Author">Author</option>
                <option value="Likes">Likes</option>
              </Form.Select>
            </Form.Group>

            <h3 className="mb-4 text-center" style={{ color: theme.textPrimary }}>
              Select Playlists That Seem Appealing
            </h3>
            <Row>
              {playlists.map((playlist) => (
                <Col key={playlist.id} md={4} className="mb-4">
                  <Card
                    className="shadow-sm h-100"
                    style={{
                      backgroundColor: theme.cardBackground,
                      color: theme.textPrimary,
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Card.Img variant="top" src={playlist.images[0]?.url} />
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title>{playlist.name}</Card.Title>
                        <OverlayTrigger
                          overlay={<Tooltip>{playlist.owner.display_name}</Tooltip>}
                        >
                          <Card.Text>Author: {playlist.owner.display_name}</Card.Text>
                        </OverlayTrigger>
                        <OverlayTrigger
                          overlay={<Tooltip>Likes: {playlist.followers || 0}</Tooltip>}
                        >
                          <Card.Text>Likes: {playlist.followers || 0}</Card.Text>
                        </OverlayTrigger>
                      </div>
                      <Button
                        onClick={() =>
                          setSelectedPlaylists((prevSelected) =>
                            prevSelected.includes(playlist)
                              ? prevSelected.filter((p) => p.id !== playlist.id)
                              : [...prevSelected, playlist]
                          )
                        }
                        style={{
                          backgroundColor: selectedPlaylists.includes(playlist)
                            ? theme.dangerButtonBackground
                            : theme.successButtonBackground,
                          color: theme.buttonText,
                          border: 'none',
                        }}
                      >
                        {selectedPlaylists.includes(playlist) ? <FaTimes /> : <FaCheck />} {/* Icons for better feedback */}
                        {selectedPlaylists.includes(playlist) ? 'Deselect' : 'Select'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            {/* Centered button container */}
            <div className="d-flex justify-content-center mt-4">
              <Button
                onClick={handleFetchTracksClick}
                style={{
                  backgroundColor: theme.buttonBackground,
                  color: theme.buttonText,
                  border: 'none',
                }}
              >
                Fetch Tracks from Selected Playlists
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default SearchAndSelectPlaylists;
