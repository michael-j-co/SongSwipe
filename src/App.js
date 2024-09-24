// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Login from './components/Login';
import Callback from './components/Callback';
import PlaylistOptions from './components/PlaylistOptions';
import CreatePlaylistForm from './components/CreatePlaylistForm';
import SearchAndSelectPlaylists from './components/SearchAndSelectPlaylists';
import EditPlaylist from './components/EditPlaylist';
import SelectTracks from './components/SelectTracks';
import PlaylistCreated from './components/PlaylistCreated';
import Header from './components/Header';
import { CustomThemeProvider, useTheme } from './context/ThemeContext'; // Import ThemeProvider and hook

// Styled component for App container
const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textPrimary};
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  return (
    <CustomThemeProvider> 
      <Router>
        <AppContainer>
          <Header /> 
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/callback" element={<Callback setAccessToken={setAccessToken} />} />
            <Route
              path="/playlists"
              element={accessToken ? <PlaylistOptions /> : <Navigate to="/" />}
            />
            <Route
              path="/create-playlist-form"
              element={accessToken ? <CreatePlaylistForm accessToken={accessToken} /> : <Navigate to="/" />}
            />
            <Route
              path="/search-playlists"
              element={accessToken ? <SearchAndSelectPlaylists /> : <Navigate to="/" />}
            />
            <Route
              path="/edit-playlist"
              element={accessToken ? <EditPlaylist accessToken={accessToken} /> : <Navigate to="/" />}
            />
            <Route
              path="/select-tracks"
              element={accessToken ? <SelectTracks accessToken={accessToken} playlistName="Your Playlist Name" playlistDescription="Your Playlist Description" /> : <Navigate to="/" />}
            />
            <Route path="/playlist-created" element={<PlaylistCreated />} />
          </Routes>
        </AppContainer>
      </Router>
    </CustomThemeProvider>
  );
};

export default App;
