// SelectTracks.js
import React, { useState, useRef } from 'react';
import { Container, Button, ListGroup, Card, Row, Col } from 'react-bootstrap';

const SelectTracks = ({
  selectedPlaylists,
  accessToken,
  goBack,
  finishAndCreatePlaylist,
  acceptedTracks,
  setAcceptedTracks,
  rejectedTracks,
  setRejectedTracks,
  seenTracks,
  setSeenTracks,
  fetchTracksFromSelectedPlaylists,
  setCurrentPlaylistIndex,
  currentPlaylistIndex
}) => {
  const [tracks, setTracks] = useState([]); // State to store tracks from selected playlists
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // State to manage the current track being previewed
  const [actionHistory, setActionHistory] = useState([]); // State to store a history of actions for undo functionality
  const audioRef = useRef(null); // Ref to control audio playback

  // Function to fetch tracks for the currently selected playlist
  const fetchTracks = async () => {
    await fetchTracksFromSelectedPlaylists(
      selectedPlaylists,
      accessToken,
      currentPlaylistIndex,
      setTracks,
      setSeenTracks
    );
    setCurrentTrackIndex(0);
  };

  // Fetch tracks on component mount
  React.useEffect(() => {
    fetchTracks();
  }, []);

  // Function to handle accepting a track into the new playlist
  const handleAcceptTrack = () => {
    const currentTrack = tracks[currentTrackIndex];
    setAcceptedTracks([...acceptedTracks, currentTrack]); // Add the track to accepted tracks list
    setSeenTracks((prevSeen) => new Set(prevSeen).add(currentTrack.id)); // Mark track as seen
    setActionHistory([...actionHistory, { type: 'accept', track: currentTrack, index: currentTrackIndex }]); // Store action in history
    handleNextTrack(); // Move to the next track
  };

  // Function to handle rejecting a track from the new playlist
  const handleRejectTrack = () => {
    const currentTrack = tracks[currentTrackIndex];
    setRejectedTracks([...rejectedTracks, currentTrack]); // Add the track to rejected tracks list
    setSeenTracks((prevSeen) => new Set(prevSeen).add(currentTrack.id)); // Mark track as seen
    setActionHistory([...actionHistory, { type: 'reject', track: currentTrack, index: currentTrackIndex }]); // Store action in history
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

  // Function to undo the last action
  const handleUndo = () => {
    if (actionHistory.length > 0) {
      const lastAction = actionHistory.pop(); // Get and remove the last action
      setActionHistory([...actionHistory]); // Update action history

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
      }

      setCurrentTrackIndex(lastAction.index); // Bring back to the previous track
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      {tracks.length > 0 && currentTrackIndex < tracks.length && (
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
            <Button variant="warning" onClick={handleUndo}>
              Undo
            </Button>
          </div>
        </div>
      )}

      {/* Button to go back to playlist selection */}
      <Button variant="secondary" className="mt-4" onClick={goBack}>
        Go Back to Playlist Selection
      </Button>

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
        <Button variant="success" className="mt-4" onClick={finishAndCreatePlaylist}>
          Finish and Create Playlist
        </Button>
      )}
    </Container>
  );
};

export default SelectTracks;
