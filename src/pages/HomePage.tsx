import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  CATEGORY_IMAGES,
  CATEGORY_LABELS,
  RECIPE_CATEGORIES,
} from '../constants/categories';
import { useAuth } from '../states/contexts';
import { ArrowRightIcon, ClockIcon, HeartIcon, PlusIcon } from '../icons/icons';
import { Button, Container, Eyebrow, Lead, Page } from '../styles/ui';

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 3rem;
  padding-bottom: 4rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding-bottom: 1.5rem;
    text-align: center;

    ${Lead} {
      margin: 0 auto;
    }
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.4rem, 5.5vw, 4rem);
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;

  em {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const HeroArt = styled.div`
  position: relative;
  display: grid;
  place-items: center;

  &::before {
    content: '';
    position: absolute;
    inset: 8%;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primarySoft};
  }

  img {
    position: relative;
    width: min(100%, 420px);
    height: auto;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: -1;

    img {
      width: min(70%, 280px);
    }
  }
`;

const Section = styled.section`
  padding: 3.5rem 0 1rem;

  > h2 {
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    margin-bottom: 0.5rem;
  }

  > p {
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 2rem;
  }
`;

const Categories = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryTile = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem 1.25rem;
  text-decoration: none;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  img {
    width: 96px;
    height: 96px;
    object-fit: contain;
    transition: transform 0.25s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.md};
    border-color: ${({ theme }) => theme.colors.primary}66;

    img {
      transform: scale(1.06) rotate(-2deg);
    }
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Feature = styled.div`
  padding: 1.75rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};

  > span {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.4rem;
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Cta = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 4rem;
  padding: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primaryDark};
  color: #fff;

  h2 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    margin-bottom: 0.35rem;
  }

  p {
    opacity: 0.85;
  }

  ${Button} {
    background: #fff;
    border-color: #fff;
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const FEATURES = [
  {
    icon: <ClockIcon />,
    title: 'Cook along, step by step',
    text: 'Start any recipe and follow a guided timeline with a live countdown you can pause at any time.',
  },
  {
    icon: <HeartIcon />,
    title: 'Keep your favourites',
    text: 'Create a free account and save the dishes you love so they are always one click away.',
  },
  {
    icon: <PlusIcon />,
    title: 'Share your own recipes',
    text: 'Add your signature dish with a photo and ingredients and grow the collection.',
  },
];

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Page>
      <Container>
        <Hero>
          <div>
            <Eyebrow>Recipes · Cook-along timer · Meal planner</Eyebrow>
            <HeroTitle>
              Cook something <em>delicious</em> today.
            </HeroTitle>
            <Lead>
              From hearty soups to sweet desserts – discover recipes by
              category, cook along with a step-by-step timer and plan your daily
              nutrition, all in one place.
            </Lead>
            <HeroActions>
              <Button as={Link} to="/recipes" $size="lg">
                Browse recipes
                <ArrowRightIcon />
              </Button>
              <Button as={Link} to="/plan" $size="lg" $variant="secondary">
                Plan your meals
              </Button>
            </HeroActions>
          </div>
          <HeroArt>
            <img src="/assets/chief.png" alt="Pixel-art chef cooking" />
          </HeroArt>
        </Hero>

        <Section aria-labelledby="categories-title">
          <h2 id="categories-title">Browse by category</h2>
          <p>Pick what you are in the mood for.</p>
          <Categories>
            {RECIPE_CATEGORIES.map((category) => (
              <CategoryTile key={category} to={`/recipes?category=${category}`}>
                <img src={CATEGORY_IMAGES[category]} alt="" />
                {CATEGORY_LABELS[category]}
              </CategoryTile>
            ))}
          </Categories>
        </Section>

        <Section aria-labelledby="features-title">
          <h2 id="features-title">Everything you need in the kitchen</h2>
          <p>Simple tools that make cooking at home easier.</p>
          <Features>
            {FEATURES.map(({ icon, title, text }) => (
              <Feature key={title}>
                <span>{icon}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Feature>
            ))}
          </Features>
        </Section>

        <Cta>
          {isLoggedIn ? (
            <>
              <div>
                <h2>Ready to cook?</h2>
                <p>Your saved recipes are waiting for you.</p>
              </div>
              <Button as={Link} to="/favorites" $size="lg">
                Open my favorites
              </Button>
            </>
          ) : (
            <>
              <div>
                <h2>Join Cool Cooking</h2>
                <p>Save favourites and share your own recipes – it’s free.</p>
              </div>
              <Button as={Link} to="/register" $size="lg">
                Create an account
              </Button>
            </>
          )}
        </Cta>
      </Container>
    </Page>
  );
};

export default HomePage;
