// src/components/FinishNewPlaylist.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const CreatePlaylist = ({ accessToken, playlistName, playlistDescription, isPublic, acceptedTracks }) => {
  const navigate = useNavigate();

  const handleCreatePlaylist = async () => {
    if (acceptedTracks.length === 0) {
      alert('No tracks to add to the playlist. Please accept some tracks first.');
      return;
    }

    try {
      // Create a new playlist
      const createPlaylistResponse = await axios.post(
        'https://api.spotify.com/v1/me/playlists',
        {
          name: playlistName,
          description: playlistDescription,
          public: isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newPlaylist = createPlaylistResponse.data;
      console.log('New playlist created:', newPlaylist);

      // Add tracks to the newly created playlist
      const uris = acceptedTracks.map((track) => track.uri);
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

      navigate('/playlist-created', { state: { playlist: newPlaylist } });
    } catch (error) {
      console.error('Error creating playlist or adding tracks:', error.response?.data || error);
      alert('Error creating playlist. Please try again.');
    }
  };

  return (
    <Button variant="success" className="mt-4" onClick={handleCreatePlaylist}>
      Finish and Create Playlist
    </Button>
  );
};

export default CreatePlaylist;
