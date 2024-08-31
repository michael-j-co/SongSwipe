// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Callback from './components/Callback';
import PlaylistOptions from './components/PlaylistOptions';
import CreatePlaylist from './components/CreatePlaylist';
import EditPlaylist from './components/EditPlaylist';
import SelectTracks from './components/SelectTracks'; // Import SelectTracks component
import PlaylistCreated from './components/PlaylistCreated'; // Import PlaylistCreated component
import Header from './components/Header'; // Import Header component
import './App.css'; // Import custom CSS for dark theme

const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      setAccessToken(token); // Set the token in state
    }
  }, []);

  return (
    <Router>
      {/* Include Header on all pages */}
      <Header />
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback setAccessToken={setAccessToken} />} />
        <Route
          path="/playlists"
          element={accessToken ? <PlaylistOptions /> : <Navigate to="/" />}
        />
        <Route
          path="/create-playlist"
          element={accessToken ? <CreatePlaylist accessToken={accessToken} /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-playlist"
          element={accessToken ? <EditPlaylist accessToken={accessToken} /> : <Navigate to="/" />}
        />
        {/* Route for SelectTracks component */}
        <Route
          path="/select-tracks"
          element={accessToken ? <SelectTracks accessToken={accessToken} playlistName="Your Playlist Name" playlistDescription="Your Playlist Description" /> : <Navigate to="/" />}
        />
        {/* New route for PlaylistCreated component */}
        <Route
          path="/playlist-created"
          element={<PlaylistCreated />}
        />
      </Routes>
    </Router>
  );
};

export default App;
