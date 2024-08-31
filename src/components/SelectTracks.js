// SelectTracks.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button, ListGroup, Container } from 'react-bootstrap';
import 'react-h5-audio-player/lib/styles.css'; // Import default styles
import AudioPlayer from 'react-h5-audio-player'; // Import AudioPlayer component
import axios from 'axios';
import './SelectTracks.css'; // Import custom CSS

const SelectTracks = ({ accessToken }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { selectedPlaylists, playlistName, playlistDescription, isPublic } = location.state || { selectedPlaylists: [] };

  const [tracks, setTracks] = useState([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [acceptedTracks, setAcceptedTracks] = useState([]);
  const [rejectedTracks, setRejectedTracks] = useState([]);
  const [seenTracks, setSeenTracks] = useState(new Set());
  const [actionHistory, setActionHistory] = useState([]);

  useEffect(() => {
    if (selectedPlaylists.length > 0) {
      fetchTracksFromSelectedPlaylists();
    }
  }, [selectedPlaylists]);

  const fetchTracksFromSelectedPlaylists = async () => {
    if (!accessToken) {
      alert('Token is invalid or expired. Please log in again.');
      return;
    }

    const currentPlaylist = selectedPlaylists[currentPlaylistIndex];

    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${currentPlaylist.id}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const allTracks = response.data.items
        .map((item) => item.track)
        .filter((track) => track && !seenTracks.has(track.id)); 

      setTracks(allTracks);
      setCurrentTrackIndex(0);
    } catch (error) {
      console.error('Error fetching tracks:', error.response.data);
      alert('Error fetching tracks. Please try again.');
    }
  };

  const handleAcceptTrack = () => {
    const currentTrack = tracks[currentTrackIndex];
    setAcceptedTracks([...acceptedTracks, currentTrack]);
    setSeenTracks((prevSeen) => new Set(prevSeen).add(currentTrack.id));
    setActionHistory([...actionHistory, { type: 'accept', track: currentTrack, playlistIndex: currentPlaylistIndex, trackIndex: currentTrackIndex }]); // Store action in history
    handleNextTrack();
  };

  const handleRejectTrack = () => {
    const currentTrack = tracks[currentTrackIndex];
    setRejectedTracks([...rejectedTracks, currentTrack]);
    setSeenTracks((prevSeen) => new Set(prevSeen).add(currentTrack.id));
    setActionHistory([...actionHistory, { type: 'reject', track: currentTrack, playlistIndex: currentPlaylistIndex, trackIndex: currentTrackIndex }]); // Store action in history
    handleNextTrack();
  };

  const handleNextTrack = () => {
    if (currentTrackIndex + 1 < tracks.length) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      alert('All tracks have been reviewed in this playlist!');
    }
  };

  const handleSkipToNextPlaylist = () => {
    if (currentPlaylistIndex + 1 < selectedPlaylists.length) {
      setActionHistory([...actionHistory, { type: 'skip', playlistIndex: currentPlaylistIndex, trackIndex: currentTrackIndex }]); // Store action in history
      setCurrentPlaylistIndex(currentPlaylistIndex + 1);
      fetchTracksFromSelectedPlaylists();
    } else {
      alert('You have reviewed all selected playlists!');
    }
  };

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
        setCurrentPlaylistIndex(lastAction.playlistIndex); // Go back to the previous playlist
        setCurrentTrackIndex(lastAction.trackIndex); // Go back to the previous track
      } else if (lastAction.type === 'reject') {
        // Undo last rejected track
        setRejectedTracks(rejectedTracks.filter((track) => track.id !== lastAction.track.id));
        setSeenTracks((prevSeen) => {
          const newSeen = new Set(prevSeen);
          newSeen.delete(lastAction.track.id);
          return newSeen;
        });
        setCurrentPlaylistIndex(lastAction.playlistIndex); // Go back to the previous playlist
        setCurrentTrackIndex(lastAction.trackIndex); // Go back to the previous track
      } else if (lastAction.type === 'skip') {
        // Undo skip to previous playlist
        setCurrentPlaylistIndex(lastAction.playlistIndex); // Go back to the previous playlist
        setCurrentTrackIndex(lastAction.trackIndex); // Go back to the previous track
        fetchTracksFromSelectedPlaylists(); // Reload tracks for the previous playlist
      }

      setActionHistory(newHistory); // Update action history
    }
  };

  const handleFinishAndCreatePlaylist = async () => {
    if (acceptedTracks.length === 0) {
      alert('No tracks to add to the playlist. Please accept some tracks first.');
      return;
    }

    try {
      // Create a new playlist using the Spotify API
      const createPlaylistResponse = await axios.post(
        'https://api.spotify.com/v1/me/playlists',
        {
          name: playlistName,
          description: playlistDescription,
          public: isPublic, // Use the value passed from CreatePlaylist component
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newPlaylist = createPlaylistResponse.data; // Get the newly created playlist details
      console.log('New playlist created:', newPlaylist);

      // Add the accepted tracks to the newly created playlist
      const uris = acceptedTracks.map((track) => track.uri); // Get track URIs
      await axios.post(
        `https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`,
        { uris },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Navigate to PlaylistCreated component with the new playlist data
      navigate('/playlist-created', { state: { playlist: newPlaylist } });

    } catch (error) {
      console.error('Error creating playlist or adding tracks:', error.response?.data || error);
      alert('Error creating playlist. Please try again.');
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      {selectedPlaylists.length > 0 && currentPlaylistIndex < selectedPlaylists.length && tracks.length > 0 && currentTrackIndex < tracks.length && (
        <div className="mt-4 text-center w-100">
          <h4 className="text-light">Current Playlist: {selectedPlaylists[currentPlaylistIndex].name}</h4>
          <div className="d-flex flex-column align-items-center">
            <img 
              src={selectedPlaylists[currentPlaylistIndex].images[0]?.url} 
              alt="Playlist" 
              style={{ width: '150px', borderRadius: '8px' }} 
              className="mb-3" 
            />
            <p className="text-light">By: {selectedPlaylists[currentPlaylistIndex].owner.display_name}</p>
            <h4 className="track-title text-light mt-3">
              Track Preview: {tracks[currentTrackIndex].name}
            </h4>
            <p className="track-artist text-light">
              Artist: {tracks[currentTrackIndex].artists.map((artist) => artist.name).join(', ')}
            </p>
            {/* Custom audio player using react-h5-audio-player */}
            <div style={{ width: '100%', maxWidth: '400px', margin: '20px auto' }}> {/* Centered and constrained width */}
              <AudioPlayer
                src={tracks[currentTrackIndex].preview_url}
                autoPlay
                showJumpControls={false}
                customAdditionalControls={[]}
                customVolumeControls={[]}
                layout="horizontal-reverse"
                style={{ 
                  backgroundColor: '#212529', 
                  color: '#ffffff', 
                  borderRadius: '8px', 
                  width: '100%', 
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'  // Add a subtle shadow for better visibility
                }} // Custom dark theme with lighter text
              />
            </div>
          </div>
          <div className="mt-4">
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

      {/* Centered list of accepted tracks */}
      {acceptedTracks.length > 0 && (
        <div className="text-center mt-4">
          <h3 className="text-light">Preview of Accepted Tracks</h3>
          <ListGroup className="w-50 mx-auto">
            {acceptedTracks.map((track, index) => (
              <ListGroup.Item key={track.id} className="bg-dark text-light">
                {index + 1}. {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="success" className="mt-4" onClick={handleFinishAndCreatePlaylist}>
            Finish and Create Playlist
          </Button>
        </div>
      )}
    </Container>
  );
};

export default SelectTracks;
