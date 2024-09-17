// src/components/Header.js 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Navbar, Container } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext hook
import { FaSun, FaMoon } from 'react-icons/fa'; // Import sun and moon icons from react-icons
import lightLogo from '../assets/lightlogo.png'; // Import light theme logo
import darkLogo from '../assets/darklogo.png'; // Import dark theme logo
import './Header.css'; // Import custom CSS for styling

const Header = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Access theme and toggleTheme from context

  const handleHomeClick = () => {
    const confirmNavigation = window.confirm(
      'Are you sure you want to return to PlaylistBuddy? Your progress will not be saved.'
    );
    if (confirmNavigation) {
      navigate('/playlists');
    }
  };

  // Define dynamic background color for Navbar based on theme
  const navbarBackgroundColor =
    theme.primary === '#d6dcdc' ? '#d1d7d7' : '#111113'; // Light grey for light theme, dark shade for dark theme

  // Choose logo based on the current theme
  const logo = theme.primary === '#d6dcdc' ? lightLogo : darkLogo;

  return (
    <Navbar
      style={{ backgroundColor: navbarBackgroundColor, borderBottom:'none' }} // Dynamically set Navbar background color
      variant={theme.primary === '#d6dcdc' ? 'light' : 'dark'}
      className="header-navbar"
    >
      <Container fluid className="p-0 d-flex justify-content-between align-items-center">
        {/* Logo Button for PlaylistBuddy at the very top left */}
        <Button
          variant="link" // Change variant to link to remove default button styling
          onClick={handleHomeClick}
          className="playlist-buddy-button"
          style={{ padding: 0, marginLeft: '20px' }} // Add left margin to create gap
        >
          <img
            src={logo}
            alt="PlaylistBuddy Logo"
            style={{ width: '80px', height: 'auto' }} // Set image size
          />
        </Button>

        {/* Theme Toggle Button with Icon */}
        <Button
          variant="link"
          onClick={toggleTheme}
          className="theme-toggle-button"
          style={{ color: theme.textPrimary }} // Use dynamic color from theme
        >
          {theme.primary === '#d6dcdc' ? <FaMoon size={24} /> : <FaSun size={24} />}
        </Button>
      </Container>
    </Navbar>
  );
};

export default Header;
