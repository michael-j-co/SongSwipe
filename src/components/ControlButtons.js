import React from 'react';
import { Button } from 'react-bootstrap';

const ControlButtons = ({ handleAcceptTrack, handleRejectTrack, handleUndo, handleSkipToNextPlaylist }) => (
  <div className="mt-4">
    {/* Reordered buttons: Undo, Reject, Accept, Skip to Next Playlist */}
    <Button variant="warning" className="me-2" onClick={handleUndo}>
      Undo
    </Button>
    <Button variant="danger" className="me-2" onClick={handleRejectTrack}>
      Reject
    </Button>
    <Button variant="success" className="me-2" onClick={handleAcceptTrack}>
      Accept
    </Button>
    <Button variant="secondary" onClick={handleSkipToNextPlaylist}>
      Skip to Next Playlist
    </Button>
  </div>
);

export default ControlButtons;
