import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { FaUndoAlt, FaTimes, FaCheck, FaForward } from 'react-icons/fa'; // Import icons

const ControlButtons = ({ handleAcceptTrack, handleRejectTrack, handleUndo, handleSkipToNextPlaylist }) => {
  return (
    <Row className="justify-content-center align-items-center my-4">
      {/* Undo Button (Small) */}
      <Col xs={2} className="d-flex justify-content-center">
        <Button
          variant="outline-warning"
          className="rounded-circle"
          style={{ width: '50px', height: '50px' }}
          onClick={handleUndo}
        >
          <FaUndoAlt size={24} />
        </Button>
      </Col>

      {/* Reject Button (Big) */}
      <Col xs={4} className="d-flex justify-content-center">
        <Button
          variant="outline-danger"
          className="rounded-circle"
          style={{ width: '80px', height: '80px' }}
          onClick={handleRejectTrack}
        >
          <FaTimes size={36} />
        </Button>
      </Col>

      {/* Accept Button (Big) */}
      <Col xs={4} className="d-flex justify-content-center">
        <Button
          variant="outline-success"
          className="rounded-circle"
          style={{ width: '80px', height: '80px' }}
          onClick={handleAcceptTrack}
        >
          <FaCheck size={36} />
        </Button>
      </Col>

      {/* Skip Button (Small) */}
      <Col xs={2} className="d-flex justify-content-center">
        <Button
          variant="outline-primary"
          className="rounded-circle"
          style={{ width: '50px', height: '50px' }}
          onClick={handleSkipToNextPlaylist}
        >
          <FaForward size={24} />
        </Button>
      </Col>
    </Row>
  );
};

export default ControlButtons;
