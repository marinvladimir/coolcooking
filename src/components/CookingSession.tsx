import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import type { RecipeCategory } from '../types';
import { CheckIcon, PauseIcon, PlayIcon, ResetIcon } from '../icons/icons';
import { Button } from '../styles/ui';
import { formatClock } from '../utils/recipes';
import { playBlip, playFanfare } from '../utils/chiptune';
import { pixelBurst } from './fx/pixelBurst';
import Steam from './fx/Steam';

interface CookingStep {
  step: string;
  weight: number;
}

const STEP_TEMPLATES: Record<RecipeCategory, CookingStep[]> = {
  soups: [
    { step: 'Chop the vegetables', weight: 10 },
    { step: 'Bring the water or broth to a boil', weight: 5 },
    { step: 'Add the ingredients', weight: 15 },
    { step: 'Simmer the soup', weight: 25 },
    { step: 'Season to taste', weight: 5 },
    { step: 'Serve and enjoy!', weight: 5 },
  ],
  desserts: [
    { step: 'Preheat the oven', weight: 10 },
    { step: 'Mix the dry ingredients', weight: 15 },
    { step: 'Mix the wet ingredients', weight: 10 },
    { step: 'Combine wet and dry ingredients', weight: 10 },
    { step: 'Bake the dessert', weight: 30 },
    { step: 'Let it cool', weight: 10 },
    { step: 'Serve and enjoy!', weight: 5 },
  ],
  salads: [
    { step: 'Wash and chop the vegetables', weight: 10 },
    { step: 'Whisk the dressing', weight: 5 },
    { step: 'Toss the salad', weight: 10 },
    { step: 'Serve and enjoy!', weight: 5 },
  ],
  mainDishes: [
    { step: 'Preheat the oven or stove', weight: 10 },
    { step: 'Prepare the ingredients', weight: 15 },
    { step: 'Cook the main dish', weight: 30 },
    { step: 'Add the finishing touches', weight: 10 },
    { step: 'Let the dish rest', weight: 5 },
    { step: 'Serve and enjoy!', weight: 5 },
  ],
  drinks: [
    { step: 'Prepare the ingredients', weight: 5 },
    { step: 'Mix the drink', weight: 5 },
    { step: 'Pour over ice', weight: 5 },
    { step: 'Garnish and enjoy!', weight: 5 },
  ],
};

const SEGMENTS = 24;

/** Splits the total time across the category's steps, in whole seconds. */
const buildSchedule = (category: RecipeCategory, totalSeconds: number) => {
  const template = STEP_TEMPLATES[category];
  const totalWeight = template.reduce((sum, { weight }) => sum + weight, 0);
  let start = 0;

  return template.map(({ step, weight }, index) => {
    const isLast = index === template.length - 1;
    const end = isLast
      ? totalSeconds
      : start + Math.round((weight / totalWeight) * totalSeconds);
    const entry = { step, start, end };
    start = end;
    return entry;
  });
};

const Screen = styled.section`
  margin-top: 1.75rem;
  padding: 1.5rem;
  color: ${({ theme }) => theme.colors.paper};
  background: ${({ theme }) => theme.colors.ink};
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.035) 0 2px,
    transparent 2px 4px
  );
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.1rem;
  }
`;

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
`;

const Pot = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 84px;
  height: 84px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const PotSteam = styled(Steam)`
  left: 24px;
  top: 22px;
  width: 50px;
`;

const Clock = styled.div`
  flex: 1;
  min-width: 180px;

  p {
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: clamp(2.4rem, 8vw, 3.6rem);
    line-height: 1;
    color: ${({ theme }) => theme.colors.accent};
    text-shadow: 3px 3px 0 #000;
  }

  small {
    display: block;
    margin-top: 0.4rem;
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.7rem;
    text-transform: uppercase;
    opacity: 0.7;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  ${Button} {
    border-color: ${({ theme }) => theme.colors.paper};
    box-shadow: 3px 3px 0 ${({ theme }) => theme.colors.paper};
  }
`;

const Segments = styled.div`
  display: grid;
  grid-template-columns: repeat(${SEGMENTS}, 1fr);
  gap: 4px;
  margin: 1.4rem 0;
  padding: 4px;
  border: 3px solid ${({ theme }) => theme.colors.paper};
  border-radius: 6px;

  span {
    height: 16px;
    background: rgba(255, 255, 255, 0.12);
  }

  span.on {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

const Steps = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Step = styled.li<{ $state: 'done' | 'current' | 'next' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  font-weight: ${({ $state }) => ($state === 'current' ? 800 : 500)};
  color: ${({ $state, theme }) =>
    $state === 'current' ? theme.colors.ink : 'inherit'};
  background: ${({ $state, theme }) =>
    $state === 'current' ? theme.colors.accent : 'transparent'};
  opacity: ${({ $state }) => ($state === 'next' ? 0.6 : 1)};
  text-decoration: ${({ $state }) =>
    $state === 'done' ? 'line-through' : 'none'};

  > span:first-child {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.75rem;
    border: 2.5px solid currentColor;
    border-radius: 4px;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  > span:last-child {
    margin-left: auto;
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.75rem;
    text-decoration: none;
  }
`;

const Done = styled.p`
  margin-top: 1.25rem;
  font-family: ${({ theme }) => theme.fonts.pixel};
  font-size: 1.1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.mint};
`;

interface CookingSessionProps {
  category: RecipeCategory;
  minutes: number;
}

const CookingSession: React.FC<CookingSessionProps> = ({
  category,
  minutes,
}) => {
  const totalSeconds = Math.max(minutes, 1) * 60;
  const schedule = useMemo(
    () => buildSchedule(category, totalSeconds),
    [category, totalSeconds]
  );
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const screenRef = useRef<HTMLElement>(null);
  const isFinished = elapsed >= totalSeconds;

  useEffect(() => {
    if (!isRunning || isFinished) return;
    const timer = window.setInterval(() => {
      setElapsed((value) => Math.min(value + 1, totalSeconds));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning, isFinished, totalSeconds]);

  const currentIndex = isFinished
    ? schedule.length
    : schedule.findIndex(({ end }) => elapsed < end);

  // Chiptune blip on every new step, fanfare + pixel party at the end.
  const lastIndex = useRef(currentIndex);
  useEffect(() => {
    if (currentIndex === lastIndex.current) return;
    lastIndex.current = currentIndex;
    if (currentIndex === 0) return;
    if (currentIndex >= schedule.length) {
      if (!isMuted) playFanfare();
      if (screenRef.current) {
        pixelBurst(screenRef.current, {
          kind: 'party',
          count: 32,
          label: 'BON APPETIT!',
        });
      }
    } else if (!isMuted) {
      playBlip();
    }
  }, [currentIndex, schedule.length, isMuted]);

  const reset = () => {
    lastIndex.current = 0;
    setElapsed(0);
    setIsRunning(true);
  };

  const filled = Math.round((elapsed / totalSeconds) * SEGMENTS);

  return (
    <Screen ref={screenRef} aria-label="Cooking timer">
      <Top>
        <Pot>
          {isRunning && !isFinished && <PotSteam puffs={3} rise={34} />}
          <img className="pixel" src="/assets/pot.png" alt="" />
        </Pot>
        <Clock>
          <p role="timer" aria-live="off">
            {formatClock(totalSeconds - elapsed)}
          </p>
          <small>
            {isFinished
              ? 'Time is up'
              : isRunning
                ? `Step ${currentIndex + 1} of ${schedule.length}`
                : 'Paused'}
          </small>
        </Clock>
        <Controls>
          {!isFinished && (
            <Button
              type="button"
              $variant="secondary"
              $size="sm"
              onClick={() => setIsRunning((running) => !running)}
            >
              {isRunning ? <PauseIcon /> : <PlayIcon />}
              {isRunning ? 'Pause' : 'Resume'}
            </Button>
          )}
          <Button type="button" $variant="secondary" $size="sm" onClick={reset}>
            <ResetIcon />
            Restart
          </Button>
          <Button
            type="button"
            $variant="secondary"
            $size="sm"
            aria-pressed={!isMuted}
            onClick={() => setIsMuted((muted) => !muted)}
          >
            {isMuted ? 'Sound off' : 'Sound on'}
          </Button>
        </Controls>
      </Top>

      <Segments
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((elapsed / totalSeconds) * 100)}
        aria-label="Cooking progress"
      >
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <span key={index} className={index < filled ? 'on' : undefined} />
        ))}
      </Segments>

      <Steps>
        {schedule.map(({ step, start, end }, index) => {
          const state =
            index < currentIndex
              ? 'done'
              : index === currentIndex
                ? 'current'
                : 'next';
          return (
            <Step
              key={step}
              $state={state}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span>{state === 'done' ? <CheckIcon /> : index + 1}</span>
              {step}
              <span>{formatClock(end - start)}</span>
            </Step>
          );
        })}
      </Steps>

      {isFinished && <Done role="status">★ Your dish is ready ★</Done>}
    </Screen>
  );
};

export default CookingSession;
