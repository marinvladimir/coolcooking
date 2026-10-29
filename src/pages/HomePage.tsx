import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { Recipe } from '../types';
import { apiService } from '../api/api';
import {
  CATEGORY_IMAGES,
  CATEGORY_LABELS,
  RECIPE_CATEGORIES,
} from '../constants/categories';
import { useAuth } from '../states/contexts';
import { ArrowRightIcon } from '../icons/icons';
import { CATEGORY_COLORS, palette } from '../styles/theme';
import {
  bob,
  Button,
  Container,
  Eyebrow,
  Grid,
  Highlight,
  hop,
  Lead,
  Page,
  Sticker,
} from '../styles/ui';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import CountUp from '../components/fx/CountUp';
import Marquee from '../components/fx/Marquee';
import Reveal from '../components/fx/Reveal';
import SpinningBadge from '../components/fx/SpinningBadge';
import { pixelBurst } from '../components/fx/pixelBurst';
import { IngredientEnum } from '../enums/ingredientEnum';
import { ingredientIconSrc } from '../utils/recipes';

/* ---------- Hero ---------- */

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 3rem;
  padding: 1rem 0 5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 3.5rem;
    padding-bottom: 4rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(3.4rem, 8.4vw, 7.4rem);
  line-height: 0.92;
  letter-spacing: -0.055em;
  margin-bottom: 1.75rem;

  > span {
    display: block;
    overflow: hidden;
    padding: 0.04em 0.1em 0.06em 0;
  }

  > span > span {
    display: inline-block;
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2.25rem;
`;

const Stats = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2.5rem;
  margin-top: 2.75rem;

  div {
    display: flex;
    flex-direction: column-reverse;
  }

  dd {
    font-size: 2.4rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  dt {
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.7rem;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const Stage = styled.div`
  position: relative;
  aspect-ratio: 1;
  width: min(100%, 540px);
  justify-self: center;
`;

const StageCard = styled(motion.div)`
  position: absolute;
  inset: 8%;
  background-color: ${({ theme }) => theme.colors.accent};
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.ink}33 2px,
    transparent 2px
  );
  background-size: 20px 20px;
  border: ${({ theme }) => theme.border};
  border-radius: 32px;
  box-shadow: ${({ theme }) => theme.shadow.xl};
  transition: background-color 0.4s ease;
`;

const Chef = styled(motion.button)`
  position: absolute;
  inset: 16% 14% 10%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(8px 10px 0 rgba(21, 18, 16, 0.25));
  }
`;

const Floater = styled(motion.img)`
  position: absolute;
  max-width: none;
  width: 64px;
  height: 64px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.surface};
  border: ${({ theme }) => theme.border};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 48px;
    height: 48px;
    padding: 5px;
  }
`;

const FloaterWrap = styled.div<{ $duration: number; $delay: number }>`
  position: absolute;
  animation: ${bob} ${({ $duration }) => $duration}s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const Badge = styled(SpinningBadge)`
  position: absolute;
  right: -2%;
  bottom: 2%;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    transform: scale(0.75);
    transform-origin: bottom right;
  }
`;

const ClickHint = styled(Sticker)`
  position: absolute;
  top: 3%;
  left: 2%;
`;

const FLOATERS = [
  {
    icon: 'tomatoes',
    top: '4%',
    left: '62%',
    depth: 30,
    duration: 3.2,
    rotate: 8,
  },
  {
    icon: 'cheese',
    top: '30%',
    left: '-4%',
    depth: 45,
    duration: 3.8,
    rotate: -10,
  },
  { icon: 'eggs', top: '72%', left: '2%', depth: 25, duration: 2.9, rotate: 6 },
  {
    icon: 'strawberries',
    top: '18%',
    left: '84%',
    depth: 50,
    duration: 3.5,
    rotate: -6,
  },
  {
    icon: 'carrots',
    top: '55%',
    left: '88%',
    depth: 35,
    duration: 4.1,
    rotate: 12,
  },
  {
    icon: 'mushrooms',
    top: '86%',
    left: '40%',
    depth: 40,
    duration: 3.3,
    rotate: -8,
  },
];

const ParallaxFloater: React.FC<{
  floater: (typeof FLOATERS)[number];
  index: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}> = ({ floater, index, mx, my }) => {
  const x = useTransform(mx, (value) => value * floater.depth);
  const y = useTransform(my, (value) => value * floater.depth);
  return (
    <FloaterWrap
      $duration={floater.duration}
      $delay={index * 0.3}
      style={{ top: floater.top, left: floater.left }}
    >
      <Floater
        className="pixel"
        src={ingredientIconSrc(floater.icon)}
        alt=""
        style={{ x, y, rotate: floater.rotate }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.5 + index * 0.08,
          type: 'spring',
          stiffness: 400,
          damping: 14,
        }}
      />
    </FloaterWrap>
  );
};

const HERO_LINES = [
  <>Cook</>,
  <>something</>,
  <Highlight>ridiculously</Highlight>,
  <>good.</>,
];

/* ---------- Sections ---------- */

const MarqueeZone = styled.div`
  position: relative;
  margin: 0 0 4rem;
  padding: 2rem 0;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 1.5rem;
  }
`;

const MarqueeItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2rem;
  font-family: ${({ theme }) => theme.fonts.pixel};
  font-size: clamp(1.1rem, 2.4vw, 1.6rem);
  text-transform: uppercase;
  white-space: nowrap;

  img {
    width: 40px;
    height: 40px;
  }
`;

const Section = styled.section`
  padding: 2rem 0 5rem;
`;

const SectionHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  h2 {
    font-size: clamp(2.4rem, 6vw, 4.4rem);
    max-width: 760px;
  }
`;

const Bento = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 230px;
  gap: 1.25rem;

  > :first-child {
    grid-column: span 2;
    grid-row: span 2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 200px;

    > :first-child {
      grid-row: span 1;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-auto-rows: 170px;
    gap: 1rem;
  }
`;

const Tile = styled(Link)<{ $bg: string; $big?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.25rem 1.4rem;
  overflow: hidden;
  text-decoration: none;
  background: ${({ $bg }) => $bg};
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  h3 {
    position: relative;
    z-index: 1;
    font-size: ${({ $big }) =>
      $big ? 'clamp(2.4rem, 5vw, 4rem)' : 'clamp(1.5rem, 2.6vw, 2rem)'};
  }

  img {
    position: absolute;
    top: ${({ $big }) => ($big ? '8%' : '6%')};
    right: ${({ $big }) => ($big ? '6%' : '4%')};
    width: ${({ $big }) => ($big ? '62%' : '52%')};
    max-width: ${({ $big }) => ($big ? '360px' : '150px')};
    aspect-ratio: 1;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  ${Sticker} {
    position: relative;
    z-index: 1;
    align-self: flex-start;
    margin-bottom: 0.5rem;
  }

  &:hover {
    transform: translate(-3px, -3px) rotate(-0.6deg);
    box-shadow: ${({ theme }) => theme.shadow.xl};
  }

  &:hover img {
    animation: ${hop} 0.6s steps(3) infinite;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    img {
      width: ${({ $big }) => ($big ? '42%' : '52%')};
    }
  }
`;

const Steps = styled.ol`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled.li<{ $bg: string; $tilt: number }>`
  height: 100%;
  padding: 1.75rem;
  background: ${({ $bg }) => $bg};
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  transform: rotate(${({ $tilt }) => $tilt}deg);
  transition: transform 0.25s ease;

  &:hover {
    transform: rotate(0deg) translateY(-6px);
  }

  > span {
    display: block;
    margin-bottom: 1.5rem;
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 3.6rem;
    line-height: 1;
    color: ${({ theme }) => theme.colors.surface};
    -webkit-text-stroke: 2px ${({ theme }) => theme.colors.ink};
    text-shadow: 4px 4px 0 ${({ theme }) => theme.colors.ink};
  }

  h3 {
    font-size: 1.8rem;
    margin-bottom: 0.6rem;
  }
`;

const PlannerTeaser = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2.5rem;
  padding: clamp(1.75rem, 5vw, 3.5rem);
  color: ${({ theme }) => theme.colors.paper};
  background: ${({ theme }) => theme.colors.ink};
  border: ${({ theme }) => theme.border};
  border-radius: 32px;
  box-shadow: 12px 12px 0 ${({ theme }) => theme.colors.accent};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }

  h2 {
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    margin-bottom: 1rem;
  }

  p {
    opacity: 0.8;
    margin-bottom: 2rem;
  }

  ${Button} {
    border-color: ${({ theme }) => theme.colors.paper};
    box-shadow: 4px 4px 0 ${({ theme }) => theme.colors.paper};
  }
`;

const Screen = styled.div`
  padding: 1.5rem;
  border: 3px solid ${({ theme }) => theme.colors.paper};
  border-radius: 18px;
  font-family: ${({ theme }) => theme.fonts.pixel};

  strong {
    display: block;
    font-size: clamp(2.6rem, 6vw, 4rem);
    font-weight: 400;
    color: ${({ theme }) => theme.colors.accent};
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1.5rem;
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  li {
    display: grid;
    grid-template-columns: 70px 1fr;
    align-items: center;
    gap: 0.75rem;
  }
`;

const Bar = styled(motion.span)<{ $color: string }>`
  display: block;
  height: 14px;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.colors.paper};
  transform-origin: 0 50%;
`;

const Cta = styled.section`
  position: relative;
  margin-top: 6rem;
  padding: clamp(2rem, 6vw, 4rem);
  overflow: hidden;
  background: ${({ theme }) => theme.colors.mustard};
  border: ${({ theme }) => theme.border};
  border-radius: 32px;
  box-shadow: ${({ theme }) => theme.shadow.xl};

  h2 {
    position: relative;
    z-index: 1;
    max-width: 640px;
    font-size: clamp(2.8rem, 7vw, 5.4rem);
    margin-bottom: 1.5rem;
  }

  p {
    position: relative;
    z-index: 1;
    max-width: 460px;
    font-size: 1.15rem;
    margin-bottom: 2rem;
  }

  > img {
    position: absolute;
    right: 2%;
    bottom: -6%;
    width: min(42%, 380px);
    animation: ${bob} 3.4s ease-in-out infinite;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      position: relative;
      right: auto;
      bottom: auto;
      width: 180px;
      margin: 1.5rem auto -3rem;
    }
  }
`;

const MARQUEE_WORDS = ['Chop', 'Stir', 'Simmer', 'Bake', 'Taste', 'Repeat'];
const MARQUEE_ICONS = [
  'garlic',
  'chili',
  'butter',
  'lemons',
  'onions',
  'honey',
];

const HOW_IT_WORKS = [
  {
    title: 'Pick a dish',
    text: 'Browse by category or search by an ingredient you already have in the fridge.',
    color: palette.sky,
    tilt: -1.5,
  },
  {
    title: 'Hit start',
    text: 'Follow the arcade-style timer step by step – it even beeps when it’s time for the next move.',
    color: palette.mint,
    tilt: 1,
  },
  {
    title: 'Save the hits',
    text: 'Love it? Save it to your favorites, or share your own signature recipe with everyone.',
    color: palette.bubblegum,
    tilt: -1,
  },
];

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const chefRef = useRef<HTMLButtonElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mx = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const my = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const cardRotate = useTransform(mx, [-1, 1], [-5, 1]);

  useEffect(() => {
    apiService
      .fetchRecipes()
      .then(setRecipes)
      .catch(() => setRecipes([]));
  }, []);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    recipes?.forEach((recipe) => {
      result[recipe.category] = (result[recipe.category] ?? 0) + 1;
    });
    return result;
  }, [recipes]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    mouseX.set((event.clientX / window.innerWidth) * 2 - 1);
    mouseY.set((event.clientY / window.innerHeight) * 2 - 1);
  };

  const cookChef = () => {
    if (chefRef.current) {
      pixelBurst(chefRef.current, {
        kind: 'food',
        count: 22,
        label: 'ORDER UP!',
      });
    }
  };

  return (
    <Page onPointerMove={handlePointerMove}>
      <Container>
        <Hero>
          <div>
            <Eyebrow>Pixel kitchen · open 24/7</Eyebrow>
            <HeroTitle>
              {HERO_LINES.map((line, index) => (
                <span key={index}>
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.1 + index * 0.09,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </HeroTitle>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              <Lead>
                Recipes with personality, an arcade-style cook-along timer and a
                meal planner that does the maths for you.
              </Lead>
              <HeroActions>
                <Button as={Link} to="/recipes" $size="lg">
                  Browse recipes
                  <ArrowRightIcon />
                </Button>
                <Button as={Link} to="/plan" $size="lg" $variant="secondary">
                  Plan my day
                </Button>
              </HeroActions>
              <Stats>
                {!!recipes?.length && (
                  <div>
                    <dt>Recipes</dt>
                    <dd>
                      <CountUp value={recipes.length} />
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Categories</dt>
                  <dd>
                    <CountUp value={RECIPE_CATEGORIES.length} />
                  </dd>
                </div>
                <div>
                  <dt>Ingredients</dt>
                  <dd>
                    <CountUp value={Object.keys(IngredientEnum).length} />
                  </dd>
                </div>
              </Stats>
            </motion.div>
          </div>

          <Stage>
            <StageCard
              style={{ rotate: cardRotate }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 16,
                delay: 0.2,
              }}
            />
            <Chef
              ref={chefRef}
              type="button"
              aria-label="Poke the chef"
              onClick={cookChef}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.35,
                type: 'spring',
                stiffness: 220,
                damping: 18,
              }}
              whileHover={{ scale: 1.03, rotate: -2 }}
              whileTap={{ scale: 0.92, rotate: 3 }}
            >
              <img
                className="pixel"
                src="/assets/chief.png"
                alt="Pixel-art chef"
              />
            </Chef>
            {FLOATERS.map((floater, index) => (
              <ParallaxFloater
                key={floater.icon}
                floater={floater}
                index={index}
                mx={mx}
                my={my}
              />
            ))}
            <ClickHint $color="#fffdf7" $tilt={-6}>
              ← poke the chef
            </ClickHint>
            <Badge
              text="FRESH • TASTY • PIXEL • YUM • "
              icon={ingredientIconSrc('chili')}
            />
          </Stage>
        </Hero>
      </Container>

      <MarqueeZone>
        <Marquee bg={palette.tomato} fg="#151210" tilt={-2.5} duration={28}>
          {MARQUEE_WORDS.map((word, index) => (
            <MarqueeItem key={word}>
              {word}
              <img
                className="pixel"
                src={ingredientIconSrc(MARQUEE_ICONS[index])}
                alt=""
              />
            </MarqueeItem>
          ))}
        </Marquee>
        <div style={{ marginTop: '-1.4rem' }}>
          <Marquee bg="#151210" fg="#fff3df" tilt={1.5} duration={34} reverse>
            {[...RECIPE_CATEGORIES, ...RECIPE_CATEGORIES].map(
              (category, index) => (
                <MarqueeItem key={`${category}-${index}`}>
                  {CATEGORY_LABELS[category]} ★
                </MarqueeItem>
              )
            )}
          </Marquee>
        </div>
      </MarqueeZone>

      <Container>
        <Section aria-labelledby="categories-title">
          <Reveal>
            <SectionHead>
              <h2 id="categories-title">
                What are you{' '}
                <Highlight $color={palette.mint}>craving</Highlight>?
              </h2>
              <Button as={Link} to="/recipes" $variant="secondary">
                All recipes <ArrowRightIcon />
              </Button>
            </SectionHead>
          </Reveal>
          <Bento>
            {RECIPE_CATEGORIES.map((category, index) => (
              <Reveal key={category} delay={index * 0.07} y={30}>
                <Tile
                  to={`/recipes?category=${category}`}
                  $bg={CATEGORY_COLORS[category].accent}
                  $big={index === 0}
                  style={{ height: '100%' }}
                >
                  <img
                    className="pixel"
                    src={CATEGORY_IMAGES[category]}
                    alt=""
                  />
                  {!!recipes?.length && (
                    <Sticker $color="#fffdf7" $tilt={-3}>
                      {counts[category] ?? 0} recipes
                    </Sticker>
                  )}
                  <h3>{CATEGORY_LABELS[category]}</h3>
                </Tile>
              </Reveal>
            ))}
          </Bento>
        </Section>

        {recipes && recipes.length > 0 && (
          <Section aria-labelledby="fresh-title">
            <Reveal>
              <SectionHead>
                <h2 id="fresh-title">
                  Fresh from the{' '}
                  <Highlight $color={palette.sky}>oven</Highlight>
                </h2>
              </SectionHead>
            </Reveal>
            <Grid>
              {recipes.slice(0, 3).map((recipe, index) => (
                <Reveal key={recipe.id} delay={index * 0.1}>
                  <RecipeCard recipe={recipe} onSelect={setSelectedRecipe} />
                </Reveal>
              ))}
            </Grid>
          </Section>
        )}

        <Section aria-labelledby="how-title">
          <Reveal>
            <SectionHead>
              <h2 id="how-title">
                Three steps to{' '}
                <Highlight $color={palette.bubblegum}>dinner</Highlight>
              </h2>
            </SectionHead>
          </Reveal>
          <Steps>
            {HOW_IT_WORKS.map(({ title, text, color, tilt }, index) => (
              <Reveal key={title} delay={index * 0.12}>
                <StepCard $bg={color} $tilt={tilt}>
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </StepCard>
              </Reveal>
            ))}
          </Steps>
        </Section>

        <Reveal>
          <PlannerTeaser aria-labelledby="planner-title">
            <div>
              <Eyebrow>Meal planner</Eyebrow>
              <h2 id="planner-title">Know your numbers.</h2>
              <p>
                Tell us a bit about yourself and get your daily calories, macros
                and a per-meal breakdown in seconds.
              </p>
              <Button as={Link} to="/plan" $size="lg">
                Open the planner <ArrowRightIcon />
              </Button>
            </div>
            <Screen aria-hidden="true">
              daily target
              <strong>
                <CountUp value={2150} duration={1.8} /> kcal
              </strong>
              <ul>
                {[
                  ['Protein', 0.62, palette.tomato],
                  ['Carbs', 0.9, palette.mustard],
                  ['Fat', 0.48, palette.sky],
                ].map(([label, value, color], index) => (
                  <li key={label as string}>
                    {label}
                    <Bar
                      $color={color as string}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: value as number }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.15, duration: 0.8 }}
                    />
                  </li>
                ))}
              </ul>
            </Screen>
          </PlannerTeaser>
        </Reveal>

        <Reveal>
          <Cta>
            {isLoggedIn ? (
              <>
                <h2>Your apron is waiting.</h2>
                <p>Jump back to the recipes you saved and start cooking.</p>
                <Button as={Link} to="/favorites" $size="lg" $variant="dark">
                  My favorites <ArrowRightIcon />
                </Button>
              </>
            ) : (
              <>
                <h2>Hungry? Join the kitchen.</h2>
                <p>
                  Free account. Save favorites, share your own recipes and never
                  lose a good one again.
                </p>
                <Button as={Link} to="/register" $size="lg" $variant="dark">
                  Create an account <ArrowRightIcon />
                </Button>
              </>
            )}
            <img className="pixel" src="/assets/desserts.png" alt="" />
          </Cta>
        </Reveal>
      </Container>

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal
            key={selectedRecipe.id}
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </AnimatePresence>
    </Page>
  );
};

export default HomePage;
