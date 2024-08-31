import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Row, Col, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';

// Function to redirect to Spotify authentication
const reAuthenticateUser = () => {
  window.localStorage.removeItem('token'); // Clear the stored token
  window.localStorage.removeItem('token_expiry'); // Clear the token expiry time
  window.location.href = '/'; // Redirect to home/login page to re-authenticate
};

// CreatePlaylist component that receives the accessToken prop
const CreatePlaylist = ({ accessToken }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState(''); // New state for playlist description
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [playlists, setPlaylists] = useState([]); // State to store fetched playlists
  const [selectedPlaylists, setSelectedPlaylists] = useState([]); // State to store user-selected playlists
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0); // State to manage current playlist
  const [tracks, setTracks] = useState([]); // State to store tracks from selected playlists
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // State to manage the current track being previewed
  const [acceptedTracks, setAcceptedTracks] = useState([]); // State to store accepted tracks
  const [rejectedTracks, setRejectedTracks] = useState([]); // State to store rejected tracks
  const [seenTracks, setSeenTracks] = useState(new Set()); // State to store seen tracks to avoid duplicates
  const [actionHistory, setActionHistory] = useState([]); // State to store a history of actions for undo functionality
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(''); // State to store the current user's ID
  const audioRef = useRef(null); // Ref to control audio playback

  // Fetch user profile to get the user ID on component mount
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
        setUserId(response.data.id); // Set the user ID in state
        console.log('Fetched user profile:', response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.response.data);
        alert('Error fetching user profile. Please log in again.');
        reAuthenticateUser();
      }
    };

    fetchUserProfile();
  }, [accessToken]); // Run only when accessToken changes

  // Function to create a new playlist and add accepted tracks to it
  const handleFinishAndCreatePlaylist = async () => {
    if (!playlistName) {
      alert('Please enter a playlist name.');
      return;
    }

    if (!accessToken) { // Check if token is missing
      alert('Token is invalid or expired. Please log in again.');
      reAuthenticateUser();
      return;
    }

    console.log('Creating playlist with token:', accessToken);

    try {
      // Create a new playlist using the Spotify API
      const createPlaylistResponse = await axios.post(
        'https://api.spotify.com/v1/me/playlists',
        {
          name: playlistName,
          description: description, // Include description in the playlist creation
          public: isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newPlaylistId = createPlaylistResponse.data.id; // Get the newly created playlist ID
      console.log('New playlist created with ID:', newPlaylistId);

      // Add the accepted tracks to the newly created playlist
      if (acceptedTracks.length > 0) {
        const uris = acceptedTracks.map(track => track.uri); // Get track URIs
        await axios.post(
          `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
          { uris },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Tracks added to playlist:', uris);
      }

      alert('Playlist created successfully with selected tracks!');
      // Reset states after creating the playlist
      setPlaylistName('');
      setDescription(''); // Reset description
      setTags('');
      setIsPublic(false);
      setPlaylists([]);
      setSelectedPlaylists([]);
      setCurrentPlaylistIndex(0);
      setTracks([]);
      setCurrentTrackIndex(0);
      setAcceptedTracks([]);
      setRejectedTracks([]);
      setSeenTracks(new Set());
      setActionHistory([]);
    } catch (error) {
      console.error('Error creating playlist or adding tracks:', error.response.data);
      if (error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
        reAuthenticateUser(); // Re-authenticate user on unauthorized error
      }
    }
  };

  // Function to search for playlists using tags and present them to the user
  const handleSearchPlaylists = async () => {
    if (!tags) {
      alert('Please enter some tags to search for suggestions.');
      return;
    }

    if (!accessToken) { // Check if token is missing
      alert('Token is invalid or expired. Please log in again.');
      reAuthenticateUser();
      return;
    }

    console.log('Searching playlists with token:', accessToken);
    setLoading(true);

    // Split tags by commas and trim whitespace
    const tagArray = tags.split(',').map(tag => tag.trim());
    const allPlaylists = []; // To store playlists from all searches

    try {
      // Make a separate search request for each tag
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

        // Filter out playlists created by the current user
        const filteredPlaylists = response.data.playlists.items.filter(
          (playlist) => playlist.owner.id !== userId
        );

        // Combine playlists while avoiding duplicates
        filteredPlaylists.forEach((playlist) => {
          if (!allPlaylists.find((p) => p.id === playlist.id)) {
            allPlaylists.push(playlist);
          }
        });
      }

      setPlaylists(allPlaylists); // Update state with combined playlists
    } catch (error) {
      console.error('Error searching playlists:', error.response.data);
      if (error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
        reAuthenticateUser(); // Re-authenticate user on unauthorized error
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch tracks from the currently selected playlist
  const fetchTracksFromSelectedPlaylists = async () => {
    if (!accessToken) { // Check if token is missing
      alert('Token is invalid or expired. Please log in again.');
      reAuthenticateUser();
      return;
    }

    const currentPlaylist = selectedPlaylists[currentPlaylistIndex]; // Get the current playlist

    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${currentPlaylist.id}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const allTracks = response.data.items
        .map((item) => item.track)
        .filter((track) => track && !seenTracks.has(track.id)); // Filter out seen tracks

      setTracks(allTracks); // Update state with all fetched tracks
      setCurrentTrackIndex(0); // Start from the first track
      if (allTracks.length > 0 && audioRef.current) {
        audioRef.current.play(); // Auto-play the first track
      }
    } catch (error) {
      console.error('Error fetching tracks:', error.response.data);
      alert('Error fetching tracks. Please try again.');
    }
  };

  // Function to handle accepting a track into the new playlist
  const handleAcceptTrack = () => {
    const currentTrack = tracks[currentTrackIndex];
    setAcceptedTracks([...acceptedTracks, currentTrack]); // Add the track to accepted tracks list
    setSeenTracks((prevSeen) => new Set(prevSeen).add(currentTrack.id)); // Mark track as seen
    setActionHistory([...actionHistory, { type: 'accept', track: currentTrack }]); // Store action in history
    handleNextTrack(); // Move to the next track
  };

  // Function to handle rejecting a track from the new playlist
  const handleRejectTrack = () => {
    const currentTrack = tracks[currentTrackIndex];
    setRejectedTracks([...rejectedTracks, currentTrack]); // Add the track to rejected tracks list
    setSeenTracks((prevSeen) => new Set(prevSeen).add(currentTrack.id)); // Mark track as seen
    setActionHistory([...actionHistory, { type: 'reject', track: currentTrack }]); // Store action in history
    handleNextTrack(); // Move to the next track
  };

  // Function to move to the next track in the list
  const handleNextTrack = () => {
    if (currentTrackIndex + 1 < tracks.length) {
      setCurrentTrackIndex(currentTrackIndex + 1); // Move to the next track
    } else {
      alert('All tracks have been reviewed in this playlist!');
    }
  };

  // Function to skip to the next playlist
  const handleSkipToNextPlaylist = () => {
    if (currentPlaylistIndex + 1 < selectedPlaylists.length) {
      setActionHistory([...actionHistory, { type: 'skip', index: currentPlaylistIndex }]); // Store action in history
      setCurrentPlaylistIndex(currentPlaylistIndex + 1); // Move to the next playlist
      fetchTracksFromSelectedPlaylists(); // Fetch tracks for the new playlist
    } else {
      alert('You have reviewed all selected playlists!');
    }
  };

  // Function to undo the last action (acceptance, rejection, or skipping a playlist)
  const handleUndo = () => {
    if (actionHistory.length > 0) {
      const lastAction = actionHistory[actionHistory.length - 1]; // Get the last action
      const newHistory = actionHistory.slice(0, -1); // Remove the last action from history

      if (lastAction.type === 'accept') {
        // Undo last accepted track
        setAcceptedTracks(acceptedTracks.filter((track) => track.id !== lastAction.track.id));
        setSeenTracks((prevSeen) => {
          const newSeen = new Set(prevSeen);
          newSeen.delete(lastAction.track.id);
          return newSeen;
        });
      } else if (lastAction.type === 'reject') {
        // Undo last rejected track
        setRejectedTracks(rejectedTracks.filter((track) => track.id !== lastAction.track.id));
        setSeenTracks((prevSeen) => {
          const newSeen = new Set(prevSeen);
          newSeen.delete(lastAction.track.id);
          return newSeen;
        });
      } else if (lastAction.type === 'skip') {
        // Undo skip to previous playlist
        setCurrentPlaylistIndex(lastAction.index);
        fetchTracksFromSelectedPlaylists(); // Reload tracks for the previous playlist
      }

      setActionHistory(newHistory); // Update action history
    }
  };

  // JSX to render the component
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
          <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} /> {/* New description field */}
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

      {/* Display playlists to user for selection */}
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
          <Button variant="primary" onClick={fetchTracksFromSelectedPlaylists}>
            Fetch Tracks from Selected Playlists
          </Button>
        </>
      )}

      {/* Present tracks to user one by one for acceptance or rejection */}
      {selectedPlaylists.length > 0 && currentPlaylistIndex < selectedPlaylists.length && tracks.length > 0 && currentTrackIndex < tracks.length && (
        <div className="mt-4 text-center">
          <h4 className="text-light">Current Playlist: {selectedPlaylists[currentPlaylistIndex].name}</h4>
          <img src={selectedPlaylists[currentPlaylistIndex].images[0]?.url} alt="Playlist" style={{ width: '150px', borderRadius: '8px' }} className="mb-3" />
          <p className="text-light">By: {selectedPlaylists[currentPlaylistIndex].owner.display_name}</p>
          <h4 className="text-light mt-3">Track Preview: {tracks[currentTrackIndex].name}</h4>
          <p className="text-light">
            Artist: {tracks[currentTrackIndex].artists.map((artist) => artist.name).join(', ')}
          </p>
          <div className="mb-3">
            <img src={tracks[currentTrackIndex].album.images[0]?.url} alt="Album Cover" style={{ width: '150px', borderRadius: '8px' }} className="mb-2" />
            <audio ref={audioRef} controls autoPlay src={tracks[currentTrackIndex].preview_url} className="w-100">
              Your browser does not support the audio element.
            </audio>
          </div>
          <div>
            <Button variant="success" className="me-2" onClick={handleAcceptTrack}>
              Accept
            </Button>
            <Button variant="danger" className="me-2" onClick={handleRejectTrack}>
              Reject
            </Button>
            <Button variant="secondary" className="me-2" onClick={handleSkipToNextPlaylist}>
              Skip to Next Playlist
            </Button>
            <Button variant="warning" onClick={handleUndo}>
              Undo
            </Button>
          </div>
        </div>
      )}

      {/* Display the running list of accepted tracks */}
      {acceptedTracks.length > 0 && (
        <>
          <h3 className="text-light mt-4">Preview of Accepted Tracks</h3>
          <ListGroup className="w-50">
            {acceptedTracks.map((track, index) => (
              <ListGroup.Item key={track.id} className="bg-dark text-light">
                {index + 1}. {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}

      {/* Button to finish adding tracks and create the playlist */}
      {acceptedTracks.length > 0 && (
        <Button variant="success" className="mt-4" onClick={handleFinishAndCreatePlaylist}>
          Finish and Create Playlist
        </Button>
      )}
    </Container>
  );
};

export default CreatePlaylist;
