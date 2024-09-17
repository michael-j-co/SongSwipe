import React, { useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap'; // Removed Button, added Spinner for loading
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext hook
import { FaPlus, FaEdit } from 'react-icons/fa'; // Icons for actions
import styled from 'styled-components'; // Import styled-components

// Styled Components for Card and Container
const StyledCard = styled.div`
  width: 18rem;
  height: 125px; // Set a fixed height to ensure cards are the same size
  background-color: ${({ theme }) => theme.secondary}; // Use theme card background color
  color: ${({ theme }) => theme.primary}; // Use theme card text color
  cursor: pointer; // Indicate that the card is clickable
  transition: transform 0.2s ease, box-shadow 0.2s ease; // Smooth hover effect
  border-radius: 8px; // Rounded corners
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // Subtle shadow
  display: flex; // Use flexbox to center content
  flex-direction: column; // Arrange content in a column
  justify-content: center; // Center content vertically
  align-items: center; // Center content horizontally

  &:hover {
    transform: scale(1.05); // Scale up on hover
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15); // Enhance shadow on hover
  }
`;

const CardBody = styled.div`
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.textPrimary};
  animation: fadeIn 0.5s ease;
`;

const PlaylistOptions = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Access the current theme
  const [loading, setLoading] = useState(false); // Loading state for actions

  const handleCreatePlaylist = () => {
    setLoading(true);
    navigate('/create-playlist-form');
  };

  const handleEditPlaylist = () => {
    setLoading(true);
    navigate('/edit-playlist');
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background, // Use theme background color
        padding: '20px',
      }}
    >
      <Title>What would you like to do?</Title>
      <Row className="d-flex justify-content-center">
        {/* Card for "Create a New Playlist" */}
        <Col xs={12} md={6} className="mb-4 d-flex justify-content-center">
          <StyledCard theme={theme} onClick={handleCreatePlaylist}>
            <CardBody>
              <FaPlus size={30} className="mb-3" /> {/* Icon above the title */}
              <h5>Create a New Playlist</h5>
              {loading && <Spinner animation="border" size="sm" className="mt-2" />} {/* Show loading spinner if loading */}
            </CardBody>
          </StyledCard>
        </Col>
        {/* Card for "Edit an Existing Playlist" */}
        <Col xs={12} md={6} className="d-flex justify-content-center">
          <StyledCard theme={theme} onClick={handleEditPlaylist}>
            <CardBody>
              <FaEdit size={30} className="mb-3" /> {/* Icon above the title */}
              <h5>Edit an Existing Playlist</h5>
              {loading && <Spinner animation="border" size="sm" className="mt-2" />} {/* Show loading spinner if loading */}
            </CardBody>
          </StyledCard>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaylistOptions;
