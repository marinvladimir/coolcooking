import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Page } from '../styles/ui';
import EmptyState from '../components/EmptyState';

const NotFound: React.FC = () => (
  <Page>
    <Container>
      <EmptyState
        image="/assets/soup.png"
        title="Page not found"
        description="This page has left the kitchen. Let’s get you back to something tasty."
        actions={
          <>
            <Button as={Link} to="/">
              Go home
            </Button>
            <Button as={Link} to="/recipes" $variant="secondary">
              Browse recipes
            </Button>
          </>
        }
      />
    </Container>
  </Page>
);

export default NotFound;
