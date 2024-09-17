// src/context/ThemeContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

// Define light and dark theme objects
const lightTheme = {
  name: 'light',
  primary: '#d6dcdc',
  secondary: '#051018',
  textPrimary: '#051018',
  textSecondary: '#d6dcdc',
  buttonBackground: '#051018',
  buttonText: '#d6dcdc',
  successButtonBackground: '#28a745',
  dangerButtonBackground: '#dc3545',
  borderColor: '#ccc',
  cardBackground: '#ffffff',
  inputText: '#051018'
};

const darkTheme = {
  name: 'dark',
  primary: '#111113',
  secondary: '#dddee0',
  textPrimary: '#dddee0',
  textSecondary: '#051018',
  buttonBackground: '#dddee0',
  buttonText: '#051018',
  successButtonBackground: '#28a745',
  dangerButtonBackground: '#dc3545',
  borderColor: '#333',
  cardBackground: '#1a1a1b',
  inputText: '#051018'
};

// Default themes object
const themes = { light: lightTheme, dark: darkTheme };

// Create context
const ThemeContext = createContext();

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return state.name === 'light' ? darkTheme : lightTheme;
    case 'SET_THEME':
      return themes[action.payload] || state; // Fallback to current state if theme not found
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// ThemeProvider component to wrap around the app
export const CustomThemeProvider = ({ children }) => {
  const [theme, dispatch] = useReducer(themeReducer, lightTheme);

  // Persist theme to localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme && themes[storedTheme]) {
      dispatch({ type: 'SET_THEME', payload: storedTheme });
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) dispatch({ type: 'SET_THEME', payload: 'dark' });
    }
  }, []);

  // Store the theme choice in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme.name);
  }, [theme]);

  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  return context;
};
