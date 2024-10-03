import React from 'react';
import { useTheme } from '../context/ThemeContext';
import styled, { keyframes } from 'styled-components';
import { getSpotifyAuthUrl } from '../utils/spotifyAuth';
import spotifyLightLogo from '../assets/spotifydark.png';
import spotifyDarkLogo from '../assets/spotifylight.png';

// Responsive Layout
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-top: 100px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.primary};
  text-align: left;
  transition: background-color 0.3s ease;

  @media (min-width: 768px) {
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
  animation: ${slideUp} 0.5s ease-out;

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
  transition: color 0.3s ease;
`;

const WelcomeTitle = styled.h1`
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 1rem;
  transition: color 0.3s ease;
`;

const LoginButton = styled.button.attrs(() => ({
  'aria-label': 'Login with Spotify',
}))`
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  padding: 12px 24px;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 5px;
  margin: 20px 0;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform; /* Optimizing animation performance */

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.buttonText};
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const SpotifyCredibility = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const SpotifyLogo = styled.img.attrs(() => ({
  alt: 'Spotify logo',
}))`
  width: 80px;
  transition: width 0.3s ease;

  @media (min-width: 768px) {
    width: 100px;
  }
`;

const StepCard = styled.div`
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.buttonText};
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  }
`;

const StepNumber = styled.span`
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  padding: 0.5rem 1rem;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.25rem;
  display: inline-block;
`;

// Extracted Step component for reusability
const Step = ({ number, step, description }) => (
  <StepCard>
    <StepNumber>{number}</StepNumber>
    <div>
      <h5>{step}</h5>
      <p>{description}</p>
    </div>
  </StepCard>
);

const Login = () => {
  const { theme } = useTheme();
  const { name, background, textPrimary } = theme; // Destructured for readability
  const spotifyLogo = theme.primary === '#f4e6e3' ? spotifyDarkLogo : spotifyLightLogo;

  return (
    <LoginContainer>
      <LeftSection>
        <WelcomeTitle>Welcome to SongSwipe</WelcomeTitle>
        <Text>Your Personalized Playlist Experience</Text>
        <Text>
          Playlist creation made fun and easy. Connect your Spotify account and let SongSwipe curate the perfect soundtrack for your mood and activities. Swipe, organize, and share your favorite tracks effortlessly.
        </Text>
        <LoginButton onClick={() => window.location.href = getSpotifyAuthUrl()}>
          Login with Spotify
        </LoginButton>
        <SpotifyCredibility>
          <Text>Made for</Text>
          <SpotifyLogo src={spotifyLogo} />
        </SpotifyCredibility>
      </LeftSection>
      <RightSection>
        <h3>How it Works</h3>
        {[
          { step: 'Step 1', description: 'Connect to Spotify' },
          { step: 'Step 2', description: 'Create a new playlist or edit an existing one' },
          { step: 'Step 3', description: 'Input descriptors' },
          { step: 'Step 4', description: 'Swipe through songs' },
          { step: 'Step 5', description: 'Enjoy and share your playlist' },
        ].map((item, index) => (
          <Step key={index} number={index + 1} step={item.step} description={item.description} />
        ))}
      </RightSection>
    </LoginContainer>
  );
};

export default Login;
