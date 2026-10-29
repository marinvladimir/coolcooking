import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import type { RecipeCategory } from '../types';
import { CheckIcon, PauseIcon, PlayIcon, ResetIcon } from '../icons/icons';
import { Button } from '../styles/ui';
import { formatClock } from '../utils/recipes';

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

const Wrapper = styled.section`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Clock = styled.p`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: ${({ theme }) => theme.colors.primaryDark};

  small {
    display: block;
    margin-top: 0.4rem;
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Progress = styled.div`
  height: 8px;
  margin: 1.25rem 0;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.pill};
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: inherit;
    transition: width 0.5s linear;
  }
`;

const Steps = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Step = styled.li<{ $state: 'done' | 'current' | 'next' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-weight: ${({ $state }) => ($state === 'current' ? 700 : 500)};
  background: ${({ $state, theme }) =>
    $state === 'current' ? theme.colors.surface : 'transparent'};
  color: ${({ $state, theme }) =>
    $state === 'next' ? theme.colors.textMuted : theme.colors.text};
  text-decoration: ${({ $state }) =>
    $state === 'done' ? 'line-through' : 'none'};

  > span:first-child {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    font-size: 0.8rem;
    border-radius: 50%;
    color: ${({ $state }) => ($state === 'next' ? 'inherit' : '#fff')};
    background: ${({ $state, theme }) =>
      $state === 'next' ? theme.colors.surface : theme.colors.primary};

    svg {
      width: 14px;
      height: 14px;
    }
  }

  > span:last-child {
    margin-left: auto;
    font-size: 0.8rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.colors.textMuted};
    text-decoration: none;
  }
`;

const Done = styled.p`
  margin-top: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success};
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

  const reset = () => {
    setElapsed(0);
    setIsRunning(true);
  };

  return (
    <Wrapper aria-label="Cooking timer">
      <Top>
        <Clock role="timer" aria-live="off">
          {formatClock(totalSeconds - elapsed)}
          <small>{isFinished ? 'Time is up' : 'Remaining'}</small>
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
        </Controls>
      </Top>

      <Progress
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((elapsed / totalSeconds) * 100)}
        aria-label="Cooking progress"
      >
        <span style={{ width: `${(elapsed / totalSeconds) * 100}%` }} />
      </Progress>

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

      {isFinished && (
        <Done role="status">Bon appétit! Your dish is ready.</Done>
      )}
    </Wrapper>
  );
};

export default CookingSession;
