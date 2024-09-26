import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

// Define light and dark theme objects
const lightTheme = {
  name: 'light',
  colors: {
    primary: '#f4e6e3',
    secondary: '#d1512c',
    textPrimary: '#130b09',
    textSecondary: '#f4e6e3',
    buttonBackground: '#d1512c',
    buttonText: '#f4e6e3',
    successButtonBackground: '#28a745',
    dangerButtonBackground: '#dc3545',
    borderColor: '#ccc',
    cardBackground: '#ffffff',
    inputText: '#051018',
    background: '#ffffff',
    backgroundSecondary: '#f4e6e3',
  },
};

const darkTheme = {
  name: 'dark',
  colors: {
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
    inputText: '#051018',
    background: '#111113',
    backgroundSecondary: '#1a1a1b',
  },
};

// Organize themes into a single object for scalability
const themes = { light: lightTheme, dark: darkTheme };

// Create the ThemeContext
const ThemeContext = createContext();

// Theme reducer function
const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return state.name === 'light' ? darkTheme : lightTheme;
    case 'SET_THEME':
      return themes[action.payload] || state; // Fallback if invalid theme provided
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// ThemeProvider component to wrap around the app
export const CustomThemeProvider = ({ children }) => {
  const [theme, dispatch] = useReducer(themeReducer, lightTheme);

  // Fetch the stored theme or detect system preference on first load
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme && themes[storedTheme]) {
      dispatch({ type: 'SET_THEME', payload: storedTheme });
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) dispatch({ type: 'SET_THEME', payload: 'dark' });
    }
  }, []);

  // Persist the theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme.name);
  }, [theme]);

  // Toggle between themes
  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });

  return (
    <ThemeContext.Provider value={{ theme: theme.colors, toggleTheme }}>
      <ThemeProvider theme={theme.colors}>
        {children}
      </ThemeProvider>
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
