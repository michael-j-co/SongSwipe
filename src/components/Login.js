import React from 'react';
import { useTheme } from '../context/ThemeContext';
import styled, { keyframes } from 'styled-components';
import { getSpotifyAuthUrl } from '../utils/spotifyAuth';
import spotifyLightLogo from '../assets/spotifydark.png';
import spotifyDarkLogo from '../assets/spotifylight.png';

// Responsive Layout
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column; /* Start with a single-column layout for mobile */
  align-items: center;
  justify-content: center;
  padding: 2rem;
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
  text-align: left;

  @media (min-width: 768px) { /* Two-column layout for larger screens */
    flex-direction: row;
  }
`;

// Animations
const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  animation: ${slideUp} 0.5s ease-out; /* Slide-up animation */

  @media (min-width: 768px) {
    text-align: center;
    padding-right: 2rem;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  animation: ${slideUp} 0.5s ease-out;

  @media (min-width: 768px) {
    padding-left: 2rem;
  }
`;

// Common styles for text
const Text = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 1rem;
`;

const WelcomeTitle = styled.h1`
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 1rem;
`;

const LoginButton = styled.button`
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  padding: 10px 20px;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 5px;
  margin: 20px 0;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SpotifyCredibility = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const SpotifyLogo = styled.img`
  width: 100px;
`;

const StepCard = styled.div`
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.buttonText};
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Login = () => {
  const { theme } = useTheme();
  const spotifyLogo = theme.primary === '#d6dcdc' ? spotifyDarkLogo : spotifyLightLogo;

  return (
    <LoginContainer>
      <LeftSection>
        <WelcomeTitle>Welcome to SongSwipe</WelcomeTitle>
        <Text>Your Personalized Playlist Experience</Text>
        <Text>
          Discover a new way to create personalized playlists with ease. Connect your Spotify account and let SongSwipe curate the perfect soundtrack for your mood and activities. Swipe, organize, and share your favorite tracks effortlessly.
        </Text>
        <LoginButton onClick={() => window.location.href = getSpotifyAuthUrl()}>
          Login with Spotify
        </LoginButton>
        <SpotifyCredibility>
          <Text>Made for Spotify</Text>
          <SpotifyLogo src={spotifyLogo} alt="Spotify Logo" />
        </SpotifyCredibility>
      </LeftSection>
      <RightSection>
        <h3>How it Works</h3>
        {[
          { step: 'Step 1', description: 'Connect to Spotify' },
          { step: 'Step 2', description: 'Create a new playlist or edit an existing one' },
          { step: 'Step 3', description: 'Swipe to choose songs' },
          { step: 'Step 4', description: 'Organize and save your playlist' },
          { step: 'Step 5', description: 'Enjoy and share your playlist' }
        ].map((item, index) => (
          <StepCard key={index}>
            <h5>{item.step}</h5>
            <p>{item.description}</p>
          </StepCard>
        ))}
      </RightSection>
    </LoginContainer>
  );
};

export default Login;
