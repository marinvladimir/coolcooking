import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button, Container, hop, Page } from '../styles/ui';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;

  strong {
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: clamp(6rem, 24vw, 14rem);
    font-weight: 400;
    line-height: 1;
    color: ${({ theme }) => theme.colors.accent};
    -webkit-text-stroke: 3px ${({ theme }) => theme.colors.ink};
    text-shadow: 8px 8px 0 ${({ theme }) => theme.colors.ink};
  }

  img {
    width: 150px;
    margin: -1rem 0 1.5rem;
    animation: ${hop} 1s steps(3) infinite;
  }

  h1 {
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    margin-bottom: 0.75rem;
  }

  p {
    max-width: 440px;
    margin-bottom: 2rem;
  }

  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
`;

const NotFound: React.FC = () => (
  <Page>
    <Container>
      <Wrapper>
        <strong>404</strong>
        <img className="pixel" src="/assets/soup.png" alt="" />
        <h1>This dish got burnt.</h1>
        <p>
          The page you are looking for has left the kitchen. Let’s get you back
          to something tasty.
        </p>
        <div>
          <Button as={Link} to="/" $size="lg">
            Back home
          </Button>
          <Button as={Link} to="/recipes" $size="lg" $variant="secondary">
            Browse recipes
          </Button>
        </div>
      </Wrapper>
    </Container>
  </Page>
);

export default NotFound;
