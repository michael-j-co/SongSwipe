import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.linkColor};
  text-decoration: none;
  margin: 0 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>Developed by Michael Co © {new Date().getFullYear()}</p>
      <p>
        Contact: <FooterLink href="mailto:comichael.j@gmail.com">comichael.j@gmail.com</FooterLink> |
        <FooterLink href="https://github.com/michael-j-co" target="_blank" rel="noopener noreferrer">
          GitHub
        </FooterLink> |
        <FooterLink href="https://www.linkedin.com/in/michael-co-b60503296/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </FooterLink>
      </p>
    </FooterContainer>
  );
};

export default Footer;
