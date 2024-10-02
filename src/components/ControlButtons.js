import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { FaUndoAlt, FaTimes, FaCheck, FaForward } from 'react-icons/fa'; // Import icons
import { useTheme } from '../context/ThemeContext'; // Corrected import, useTheme is used here

const ControlButtons = ({ handleAcceptTrack, handleRejectTrack, handleUndo, handleSkipToNextPlaylist }) => {
  const { theme } = useTheme(); // Get theme from the useTheme hook

  // Use the colors from the theme for button styling
  const buttonStyle = {
    backgroundColor: theme.buttonBackground,
    color: theme.buttonText,
    borderColor: theme.borderColor,
  };

  return (
    <Row className="justify-content-center align-items-center my-4">
      {/* Undo Button (Small) */}
      <Col xs={2} className="d-flex justify-content-center">
        <Button
          style={{ ...buttonStyle, width: '50px', height: '50px' }}
          className="rounded-circle"
          onClick={handleUndo}
        >
          <FaUndoAlt size={24} />
        </Button>
      </Col>

      {/* Reject Button (Big) */}
      <Col xs={4} className="d-flex justify-content-center">
        <Button
          style={{ ...buttonStyle, backgroundColor: theme.dangerButtonBackground, width: '80px', height: '80px' }}
          className="rounded-circle"
          onClick={handleRejectTrack}
        >
          <FaTimes size={36} />
        </Button>
      </Col>

      {/* Accept Button (Big) */}
      <Col xs={4} className="d-flex justify-content-center">
        <Button
          style={{ ...buttonStyle, backgroundColor: theme.successButtonBackground, width: '80px', height: '80px' }}
          className="rounded-circle"
          onClick={handleAcceptTrack}
        >
          <FaCheck size={36} />
        </Button>
      </Col>

      {/* Skip Button (Small) */}
      <Col xs={2} className="d-flex justify-content-center">
        <Button
          style={{ ...buttonStyle, width: '50px', height: '50px' }}
          className="rounded-circle"
          onClick={handleSkipToNextPlaylist}
        >
          <FaForward size={24} />
        </Button>
      </Col>
    </Row>
  );
};

export default ControlButtons;
