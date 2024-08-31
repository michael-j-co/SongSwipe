// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Callback from './components/Callback';
import PlaylistOptions from './components/PlaylistOptions';  // Import PlaylistOptions component
import CreatePlaylist from './components/CreatePlaylist';    // Import CreatePlaylist component
import EditPlaylist from './components/EditPlaylist';        // Import EditPlaylist component
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
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback setAccessToken={setAccessToken} />} />
        <Route
          path="/playlists"
          element={accessToken ? <PlaylistOptions /> : <Navigate to="/" />} // Ensure this route is correctly mapped
        />
        <Route
          path="/create-playlist"
          element={accessToken ? <CreatePlaylist accessToken={accessToken} /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-playlist"
          element={accessToken ? <EditPlaylist accessToken={accessToken} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
