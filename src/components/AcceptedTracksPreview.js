import React from 'react';
import { ListGroup } from 'react-bootstrap';
import FinishNewPlaylist from './FinishNewPlaylist';
import UpdatePlaylist from './UpdatePlaylist';

const AcceptedTracksPreview = ({ acceptedTracks, editingPlaylistId, accessToken, playlistName, playlistDescription, isPublic }) => (
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
      <FinishNewPlaylist 
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
);

export default AcceptedTracksPreview;
