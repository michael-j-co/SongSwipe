import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import './SelectTracks.css';
import FinishNewPlaylist from './FinishNewPlaylist';
import UpdatePlaylist from './UpdatePlaylist';
import PlaylistInfo from './PlaylistInfo';
import TrackPlayer from './TrackPlayer';
import ControlButtons from './ControlButtons';
import AcceptedTracksPreview from './AcceptedTracksPreview';
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext hook

const SelectTracks = ({ accessToken }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme(); // Access the current theme
  const { selectedPlaylists, playlistName, playlistDescription, isPublic, editingPlaylistId } = location.state || { selectedPlaylists: [] };

  const [tracks, setTracks] = useState([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [acceptedTracks, setAcceptedTracks] = useState([]);
  const [rejectedTracks, setRejectedTracks] = useState([]);
  const [seenTracks, setSeenTracks] = useState(new Set());
  const [actionHistory, setActionHistory] = useState([]);
  const [existingTracks, setExistingTracks] = useState(new Set());
  const [swipeDirection, setSwipeDirection] = useState(''); // State for swipe animation

  const fetchExistingPlaylistTracks = useCallback(async () => {
    if (!editingPlaylistId || !accessToken) return;

    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${editingPlaylistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const trackIds = new Set(response.data.items.map((item) => item.track.id));
      setExistingTracks(trackIds);
    } catch (error) {
      console.error('Error fetching existing playlist tracks:', error.response?.data || error);
      alert('Error fetching existing playlist tracks. Please try again.');
    }
  }, [editingPlaylistId, accessToken]);

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
      fetchExistingPlaylistTracks();
    }
  }, [editingPlaylistId, fetchExistingPlaylistTracks]);

  useEffect(() => {
    if (selectedPlaylists.length > 0) {
      fetchTracksFromSelectedPlaylists();
    }
  }, [selectedPlaylists, fetchTracksFromSelectedPlaylists]);

  const handleAcceptTrack = () => {
    setSwipeDirection('right');
    setTimeout(() => {
      const currentTrack = tracks[currentTrackIndex];
      setAcceptedTracks([...acceptedTracks, currentTrack]);
      setSeenTracks((prevSeen) => new Set(prevSeen).add(currentTrack.id));
      setActionHistory([...actionHistory, { type: 'accept', track: currentTrack, playlistIndex: currentPlaylistIndex, trackIndex: currentTrackIndex }]);
      handleNextTrack();
    }, 500);
  };

  const handleRejectTrack = () => {
    setSwipeDirection('left');
    setTimeout(() => {
      const currentTrack = tracks[currentTrackIndex];
      setRejectedTracks([...rejectedTracks, currentTrack]);
      setSeenTracks((prevSeen) => new Set(prevSeen).add(currentTrack.id));
      setActionHistory([...actionHistory, { type: 'reject', track: currentTrack, playlistIndex: currentPlaylistIndex, trackIndex: currentTrackIndex }]);
      handleNextTrack();
    }, 500);
  };
  const handleSkipPlaylist = async () => {
    if (currentPlaylistIndex < selectedPlaylists.length - 1) {
      const nextPlaylistIndex = currentPlaylistIndex + 1;
  
      const tracksFetched = await fetchTracksForPlaylist(nextPlaylistIndex);
      if (tracksFetched) {
        setCurrentPlaylistIndex(nextPlaylistIndex);
        setCurrentTrackIndex(0);
        setActionHistory([
          ...actionHistory,
          { type: 'skipPlaylist', playlistIndex: currentPlaylistIndex },
        ]);
      } else {
        alert('Error fetching the next playlist. Please try again.');
      }
    } else {
      alert('You have reviewed all selected playlists!');
    }
  
    setSwipeDirection('');
  };
  
  
  const handleNextTrack = async () => {
    if (currentTrackIndex + 1 < tracks.length) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else if (currentPlaylistIndex + 1 < selectedPlaylists.length) {
      const nextPlaylistIndex = currentPlaylistIndex + 1;
      const tracksFetched = await fetchTracksForPlaylist(nextPlaylistIndex);

      if (tracksFetched) {
        setCurrentPlaylistIndex(nextPlaylistIndex);
        setCurrentTrackIndex(0);
        setActionHistory([
          ...actionHistory,
          { type: 'skip', playlistIndex: currentPlaylistIndex, trackIndex: currentTrackIndex },
        ]);
      } else {
        alert('Error fetching the next playlist. Please try again.');
      }
    } else {
      alert('You have reviewed all selected playlists! You can still undo your last action if needed.');
    }
    setSwipeDirection('');
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        handleAcceptTrack();
      } else if (event.key === 'ArrowLeft') {
        handleRejectTrack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleAcceptTrack, handleRejectTrack]);

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: theme.primary, // Use theme background color
        color: theme.textPrimary, // Use theme text color
        padding: '20px',
      }}
    >
      {selectedPlaylists.length > 0 && currentPlaylistIndex < selectedPlaylists.length && tracks.length > 0 && currentTrackIndex < tracks.length && (
        <>
          <PlaylistInfo playlist={selectedPlaylists[currentPlaylistIndex]} />
          <TrackPlayer
            track={tracks[currentTrackIndex]}
            swipeDirection={swipeDirection}
            handleAcceptTrack={handleAcceptTrack}
            handleRejectTrack={handleRejectTrack}
          />
          <ControlButtons
            handleAcceptTrack={handleAcceptTrack}
            handleRejectTrack={handleRejectTrack}
            handleUndo={handleUndo}
            handleSkipToNextPlaylist={handleSkipPlaylist}
          />
        </>
      )}

      {acceptedTracks.length > 0 && (
        <AcceptedTracksPreview
          acceptedTracks={acceptedTracks}
          editingPlaylistId={editingPlaylistId}
          accessToken={accessToken}
          playlistName={playlistName}
          playlistDescription={playlistDescription}
          isPublic={isPublic}
        />
      )}
    </Container>
  );
};

export default SelectTracks;
