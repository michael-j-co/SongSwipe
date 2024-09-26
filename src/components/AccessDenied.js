// src/components/AccessDenied.js
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';

const AccessDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.primary};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.textPrimary};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.textPrimary};
  margin-top: 20px;
`;

const AccessDenied = () => {
  const { theme } = useTheme();

  return (
    <AccessDeniedContainer>
      <Title theme={theme}>Access Denied</Title>
      <Message theme={theme}>
        You are not an approved user. Please contact us at{' '}
        <a href="mailto:your-email@example.com">your-email@example.com</a> for access approval.
      </Message>
    </AccessDeniedContainer>
  );
};

export default AccessDenied;
