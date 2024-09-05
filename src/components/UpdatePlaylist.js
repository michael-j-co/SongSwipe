// src/components/EditPlaylist.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const EditPlaylist = ({ accessToken, editingPlaylistId, acceptedTracks }) => {
  const navigate = useNavigate();

  const handleFinishAndAddTracks = async () => {
    if (acceptedTracks.length === 0) {
      alert('No tracks to add to the playlist. Please accept some tracks first.');
      return;
    }

    try {
      // Add tracks to the existing playlist
      const uris = acceptedTracks.map((track) => track.uri);
      await axios.post(
        `https://api.spotify.com/v1/playlists/${editingPlaylistId}/tracks`,
        { uris },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Navigate to PlaylistCreated component with the updated playlist information
      navigate('/playlist-created', { state: { playlist: { id: editingPlaylistId, name: "Edited Playlist", external_urls: { spotify: `https://open.spotify.com/playlist/${editingPlaylistId}` } } } });
    } catch (error) {
      console.error('Error adding tracks to playlist:', error.response?.data || error);
      alert('Error adding tracks to playlist. Please try again.');
    }
  };

  return (
    <Button variant="success" className="mt-4" onClick={handleFinishAndAddTracks}>
      Finish and Add Tracks to Playlist
    </Button>
  );
};

export default EditPlaylist;
