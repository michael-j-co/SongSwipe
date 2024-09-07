import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, ListGroup, Container } from 'react-bootstrap';
import 'react-h5-audio-player/lib/styles.css';
import AudioPlayer from 'react-h5-audio-player';
import axios from 'axios';
import './SelectTracks.css';
import CreatePlaylist from './CreatePlaylist';  // Import the CreatePlaylist component
import UpdatePlaylist from './UpdatePlaylist';  // Import the EditPlaylist component

const SelectTracks = ({ accessToken }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPlaylists, playlistName, playlistDescription, isPublic, editingPlaylistId } = location.state || { selectedPlaylists: [] };

  const [tracks, setTracks] = useState([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [acceptedTracks, setAcceptedTracks] = useState([]);
  const [rejectedTracks, setRejectedTracks] = useState([]);
  const [seenTracks, setSeenTracks] = useState(new Set());
  const [actionHistory, setActionHistory] = useState([]);
  const [existingTracks, setExistingTracks] = useState(new Set()); // Tracks already in the playlist being edited

  // Fetch tracks from the playlist being edited to exclude them from available tracks for selection
  const fetchExistingPlaylistTracks = useCallback(async () => {
    if (!editingPlaylistId || !accessToken) return;

    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${editingPlaylistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Extract track IDs to use for filtering
      const trackIds = new Set(response.data.items.map(item => item.track.id));
      setExistingTracks(trackIds);
    } catch (error) {
      console.error('Error fetching existing playlist tracks:', error.response?.data || error);
      alert('Error fetching existing playlist tracks. Please try again.');
    }
  }, [editingPlaylistId, accessToken]);

  // Fetch tracks from selected playlists
  const fetchTracksFromSelectedPlaylists = useCallback(async () => {
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

      // Filter tracks not already seen and, if editing, not already in the playlist being edited
      const allTracks = response.data.items
        .map((item) => item.track)
        .filter((track) => track && !seenTracks.has(track.id) && (!editingPlaylistId || !existingTracks.has(track.id)));

      setTracks(allTracks);
      setCurrentTrackIndex(0);
    } catch (error) {
      console.error('Error fetching tracks:', error.response?.data || error);
      alert('Error fetching tracks. Please try again.');
    }
  }, [accessToken, selectedPlaylists, currentPlaylistIndex, seenTracks, editingPlaylistId, existingTracks]);

  useEffect(() => {
    if (editingPlaylistId) {
      // If editing a playlist, fetch its existing tracks first
      fetchExistingPlaylistTracks();
    }
  }, [editingPlaylistId, fetchExistingPlaylistTracks]);

  useEffect(() => {
    if (selectedPlaylists.length > 0) {
      fetchTracksFromSelectedPlaylists();
    }
  }, [selectedPlaylists, fetchTracksFromSelectedPlaylists]);

  const handleAcceptTrack = () => {
    const currentTrack = tracks[currentTrackIndex];
    setAcceptedTracks([...acceptedTracks, currentTrack]);
    setSeenTracks((prevSeen) => new Set(prevSeen).add(currentTrack.id));
    setActionHistory([...actionHistory, { type: 'accept', track: currentTrack, playlistIndex: currentPlaylistIndex, trackIndex: currentTrackIndex }]);
    handleNextTrack();
  };

  const handleRejectTrack = () => {
    const currentTrack = tracks[currentTrackIndex];
    setRejectedTracks([...rejectedTracks, currentTrack]);
    setSeenTracks((prevSeen) => new Set(prevSeen).add(currentTrack.id));
    setActionHistory([...actionHistory, { type: 'reject', track: currentTrack, playlistIndex: currentPlaylistIndex, trackIndex: currentTrackIndex }]);
    handleNextTrack();
  };

  const handleNextTrack = () => {
    if (currentTrackIndex + 1 < tracks.length) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      alert('All tracks have been reviewed in this playlist!');
    }
  };

  const handleSkipToNextPlaylist = async () => {
    if (currentPlaylistIndex + 1 < selectedPlaylists.length) {
      const nextPlaylistIndex = currentPlaylistIndex + 1;
      const tracksFetched = await fetchTracksForPlaylist(nextPlaylistIndex);
      
      if (tracksFetched) {
        setActionHistory([
          ...actionHistory,
          { type: 'skip', playlistIndex: currentPlaylistIndex, trackIndex: currentTrackIndex },
        ]);
        setCurrentPlaylistIndex(nextPlaylistIndex);
        setCurrentTrackIndex(0);
      }
    } else {
      alert('You have reviewed all selected playlists!');
    }
  };

  const fetchTracksForPlaylist = useCallback(async (playlistIndex) => {
    if (!accessToken) {
      alert('Token is invalid or expired. Please log in again.');
      return false;
    }

    const currentPlaylist = selectedPlaylists[playlistIndex];

    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${currentPlaylist.id}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const allTracks = response.data.items
        .map((item) => item.track)
        .filter((track) => track && !seenTracks.has(track.id) && (!editingPlaylistId || !existingTracks.has(track.id)));

      setTracks(allTracks);
      return true;
    } catch (error) {
      console.error('Error fetching tracks:', error.response?.data || error);
      alert('Error fetching tracks. Please try again.');
      return false;
    }
  }, [accessToken, selectedPlaylists, seenTracks, editingPlaylistId, existingTracks]);

  const handleUndo = () => {
    if (actionHistory.length > 0) {
      const lastAction = actionHistory[actionHistory.length - 1];
      const newHistory = actionHistory.slice(0, -1);

      if (lastAction.type === 'accept') {
        setAcceptedTracks(acceptedTracks.filter((track) => track.id !== lastAction.track.id));
        setSeenTracks((prevSeen) => {
          const newSeen = new Set(prevSeen);
          newSeen.delete(lastAction.track.id);
          return newSeen;
        });
        setCurrentPlaylistIndex(lastAction.playlistIndex);
        setCurrentTrackIndex(lastAction.trackIndex);
      } else if (lastAction.type === 'reject') {
        setRejectedTracks(rejectedTracks.filter((track) => track.id !== lastAction.track.id));
        setSeenTracks((prevSeen) => {
          const newSeen = new Set(prevSeen);
          newSeen.delete(lastAction.track.id);
          return newSeen;
        });
        setCurrentPlaylistIndex(lastAction.playlistIndex);
        setCurrentTrackIndex(lastAction.trackIndex);
      } else if (lastAction.type === 'skip') {
        setCurrentPlaylistIndex(lastAction.playlistIndex);
        setCurrentTrackIndex(lastAction.trackIndex);
        fetchTracksFromSelectedPlaylists();
      }

      setActionHistory(newHistory);
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
            {/* Display track image along with the audio player */}
            <div className="d-flex align-items-center" style={{ width: '100%', maxWidth: '400px', margin: '20px auto' }}>
              <img 
                src={tracks[currentTrackIndex].album.images[0]?.url} 
                alt="Track" 
                style={{ width: '80px', height: '80px', borderRadius: '8px', marginRight: '10px' }} 
              />
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
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'  
                }}
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
          {!editingPlaylistId ? (
            <CreatePlaylist 
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
      )}
    </Container>
  );
};

export default SelectTracks;
