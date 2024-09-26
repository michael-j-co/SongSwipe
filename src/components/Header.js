import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import sun and moon icons
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext hook
import lightLogo from '../assets/lightlogo.png'; // Light theme logo
import darkLogo from '../assets/darklogo.png'; // Dark theme logo

// Styled-components for Header
const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px; /* Slightly smaller than 100px for a more sleek header */
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.primary};
  transition: background-color 0.3s ease; /* Smooth transition */
  padding: 0 20px;
  z-index: 2000;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const LogoButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;

  img {
    width: 200px;
    height: auto;
    transition: opacity 0.3s ease; /* Smooth fade for logo */
  }
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.5rem;
  transition: color 0.3s ease; /* Smooth transition for icon color */
  display: flex;
  align-items: center;

  &:hover {
    transform: scale(1.1); /* Slight scaling on hover */
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Handle Home Click Navigation
  const handleHomeClick = () => {
    if (window.confirm('Are you sure you want to return to PlaylistBuddy? Your progress will not be saved.')) {
      navigate('/playlists');
    }
  };

  // Select the appropriate logo based on theme
  const logo = theme.primary === '#f4e6e3' ? lightLogo : darkLogo;

  return (
    <HeaderContainer>
      {/* Logo Button for navigating home */}
      <LogoButton onClick={handleHomeClick}>
        <img src={logo} alt="SongSwipe Logo" />
      </LogoButton>

      {/* Theme Toggle Button */}
      <ThemeToggleButton onClick={toggleTheme} aria-label="Toggle Theme">
        {theme.name === 'dark' ? <FaSun /> : <FaMoon />}
      </ThemeToggleButton>
    </HeaderContainer>
  );
};

export default Header;
