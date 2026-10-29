import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Eyebrow,
  Field,
  FieldError,
  Hint,
  Input,
  Label,
  Lead,
  Page,
  PageTitle,
  Select,
} from '../styles/ui';

type Sex = 'male' | 'female';
type Goal = 'lose' | 'maintain' | 'gain';

interface PlanInputs {
  sex: Sex;
  age: string;
  height: string;
  weight: string;
  activity: string;
  goal: Goal;
}

const STORAGE_KEY = 'meal-plan-inputs';

const DEFAULT_INPUTS: PlanInputs = {
  sex: 'female',
  age: '30',
  height: '170',
  weight: '65',
  activity: '1.375',
  goal: 'maintain',
};

const ACTIVITY_LEVELS = [
  { value: '1.2', label: 'Sedentary – little or no exercise' },
  { value: '1.375', label: 'Light – exercise 1–3 days a week' },
  { value: '1.55', label: 'Moderate – exercise 3–5 days a week' },
  { value: '1.725', label: 'Active – exercise 6–7 days a week' },
  { value: '1.9', label: 'Very active – physical job or 2× training' },
];

const GOALS: Record<
  Goal,
  { label: string; calories: number; protein: number }
> = {
  lose: { label: 'Lose weight', calories: -500, protein: 2.0 },
  maintain: { label: 'Maintain weight', calories: 0, protein: 1.6 },
  gain: { label: 'Build muscle', calories: 300, protein: 1.8 },
};

const LIMITS = {
  age: [15, 100],
  height: [120, 230],
  weight: [35, 250],
} as const;

const MEALS = [
  { name: 'Breakfast', share: 0.25 },
  { name: 'Lunch', share: 0.35 },
  { name: 'Dinner', share: 0.3 },
  { name: 'Snacks', share: 0.1 },
];

// Categorical slots 1–3 of the validated data-viz palette.
const MACRO_COLORS = {
  carbs: '#2a78d6',
  protein: '#eb6834',
  fat: '#1baf7a',
};

const loadInputs = (): PlanInputs => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? { ...DEFAULT_INPUTS, ...JSON.parse(stored) }
      : DEFAULT_INPUTS;
  } catch {
    return DEFAULT_INPUTS;
  }
};

const inRange = (value: string, [min, max]: readonly [number, number]) => {
  const number = Number(value);
  return (
    value !== '' && Number.isFinite(number) && number >= min && number <= max
  );
};

/** Mifflin–St Jeor BMR, activity multiplier and goal-based macro split. */
const calculatePlan = (inputs: PlanInputs) => {
  const age = Number(inputs.age);
  const height = Number(inputs.height);
  const weight = Number(inputs.weight);
  const goal = GOALS[inputs.goal];

  const bmr =
    10 * weight + 6.25 * height - 5 * age + (inputs.sex === 'male' ? 5 : -161);
  const tdee = bmr * Number(inputs.activity);
  const calories = Math.max(tdee + goal.calories, 1200);

  const protein = weight * goal.protein;
  const fat = (calories * 0.27) / 9;
  const carbs = Math.max((calories - protein * 4 - fat * 9) / 4, 0);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories: Math.round(calories),
    macros: [
      { key: 'carbs', name: 'Carbs', grams: carbs, kcal: carbs * 4 },
      { key: 'protein', name: 'Protein', grams: protein, kcal: protein * 4 },
      { key: 'fat', name: 'Fat', grams: fat, kcal: fat * 9 },
    ] as const,
    fiber: Math.round((calories / 1000) * 14),
    water: (weight * 0.035).toFixed(1),
  };
};

const Layout = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  align-items: start;
  margin-top: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled(Card)`
  padding: 1.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.25rem;
  }

  h2 {
    font-size: 1.3rem;
    margin-bottom: 1.25rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 1rem 0;
`;

const Segmented = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: ${({ theme }) => theme.radius.pill};

  button {
    padding: 0.5rem;
    font-weight: 600;
    border: none;
    border-radius: ${({ theme }) => theme.radius.pill};
    background: transparent;
    color: ${({ theme }) => theme.colors.textMuted};
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &[aria-pressed='true'] {
      background: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.text};
      box-shadow: ${({ theme }) => theme.shadow.sm};
    }
  }
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;

    > :first-child {
      grid-column: 1 / -1;
    }
  }
`;

const Stat = styled(Card)<{ $highlight?: boolean }>`
  padding: 1.25rem 1.4rem;
  background: ${({ $highlight, theme }) =>
    $highlight ? theme.colors.primarySoft : theme.colors.surface};
  border-color: ${({ $highlight, theme }) =>
    $highlight ? 'transparent' : theme.colors.border};

  span {
    display: block;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  strong {
    display: block;
    margin-top: 0.35rem;
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: ${({ $highlight }) => ($highlight ? '2.6rem' : '1.7rem')};
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
    color: ${({ $highlight, theme }) =>
      $highlight ? theme.colors.primaryDark : theme.colors.text};
  }

  small {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const StackedBar = styled.div`
  display: flex;
  gap: 2px;
  height: 20px;
  margin: 0.5rem 0 1.25rem;

  span {
    height: 100%;
    border-radius: 4px;
    transition: width 0.4s ease;
  }
`;

const Legend = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }

  li {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  li > span {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMuted};

    i {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }
  }

  strong {
    font-size: 1.4rem;
    font-variant-numeric: tabular-nums;
  }

  small {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Bars = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;

  li {
    display: grid;
    grid-template-columns: 90px 1fr 90px;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.925rem;
  }

  li > span:first-child {
    font-weight: 600;
  }

  li > span:last-child {
    text-align: right;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

const Track = styled.span`
  height: 14px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 4px;

  span {
    display: block;
    height: 100%;
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.4s ease;
  }
`;

const Extras = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  strong {
    display: block;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Disclaimer = styled(Hint)`
  margin-top: 0.5rem;
`;

const PlanPage: React.FC = () => {
  const [inputs, setInputs] = useState<PlanInputs>(loadInputs);

  const errors = {
    age: !inRange(inputs.age, LIMITS.age),
    height: !inRange(inputs.height, LIMITS.height),
    weight: !inRange(inputs.weight, LIMITS.weight),
  };
  const isValid = !errors.age && !errors.height && !errors.weight;

  const plan = useMemo(
    () => (isValid ? calculatePlan(inputs) : null),
    [inputs, isValid]
  );

  useEffect(() => {
    if (!isValid) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      // Remembering the inputs is a convenience only.
    }
  }, [inputs, isValid]);

  const update =
    (key: keyof PlanInputs) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setInputs((current) => ({ ...current, [key]: event.target.value }));

  const macroTotal = plan
    ? plan.macros.reduce((sum, macro) => sum + macro.kcal, 0)
    : 1;

  return (
    <Page>
      <Container>
        <Eyebrow>Meal planner</Eyebrow>
        <PageTitle>Your daily nutrition plan</PageTitle>
        <Lead>
          Enter a few details to estimate how many calories you need each day
          and how to split them into protein, carbs, fat and meals.
        </Lead>

        <Layout>
          <Panel as="section" aria-labelledby="plan-inputs-title">
            <h2 id="plan-inputs-title">About you</h2>
            <Stack>
              <Segmented role="group" aria-label="Sex">
                {(['female', 'male'] as Sex[]).map((sex) => (
                  <button
                    key={sex}
                    type="button"
                    aria-pressed={inputs.sex === sex}
                    onClick={() =>
                      setInputs((current) => ({ ...current, sex }))
                    }
                  >
                    {sex === 'female' ? 'Female' : 'Male'}
                  </button>
                ))}
              </Segmented>
            </Stack>

            <FormGrid>
              {(
                [
                  ['age', 'Age', 'years'],
                  ['height', 'Height', 'cm'],
                  ['weight', 'Weight', 'kg'],
                ] as const
              ).map(([key, label, unit]) => (
                <Field key={key}>
                  <Label htmlFor={`plan-${key}`}>
                    {label} <Hint as="span">({unit})</Hint>
                  </Label>
                  <Input
                    id={`plan-${key}`}
                    type="number"
                    inputMode="decimal"
                    min={LIMITS[key][0]}
                    max={LIMITS[key][1]}
                    value={inputs[key]}
                    onChange={update(key)}
                    aria-invalid={errors[key]}
                    aria-describedby={errors[key] ? 'plan-error' : undefined}
                  />
                </Field>
              ))}
            </FormGrid>
            {!isValid && (
              <FieldError id="plan-error" style={{ marginBottom: '1rem' }}>
                Please use an age of {LIMITS.age.join('–')}, a height of{' '}
                {LIMITS.height.join('–')} cm and a weight of{' '}
                {LIMITS.weight.join('–')} kg.
              </FieldError>
            )}

            <Stack>
              <Field>
                <Label htmlFor="plan-activity">Activity level</Label>
                <Select
                  id="plan-activity"
                  value={inputs.activity}
                  onChange={update('activity')}
                >
                  {ACTIVITY_LEVELS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label htmlFor="plan-goal">Goal</Label>
                <Select
                  id="plan-goal"
                  value={inputs.goal}
                  onChange={update('goal')}
                >
                  {(Object.keys(GOALS) as Goal[]).map((goal) => (
                    <option key={goal} value={goal}>
                      {GOALS[goal].label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Button
                type="button"
                $variant="ghost"
                $size="sm"
                onClick={() => setInputs(DEFAULT_INPUTS)}
              >
                Reset to defaults
              </Button>
            </Stack>
          </Panel>

          <Results aria-live="polite">
            {plan ? (
              <>
                <Stats>
                  <Stat $highlight>
                    <span>Daily target</span>
                    <strong>{plan.calories.toLocaleString()}</strong>
                    <small>kcal per day · {GOALS[inputs.goal].label}</small>
                  </Stat>
                  <Stat>
                    <span>Maintenance</span>
                    <strong>{plan.tdee.toLocaleString()}</strong>
                    <small>kcal (TDEE)</small>
                  </Stat>
                  <Stat>
                    <span>At rest</span>
                    <strong>{plan.bmr.toLocaleString()}</strong>
                    <small>kcal (BMR)</small>
                  </Stat>
                </Stats>

                <Panel as="section" aria-labelledby="macro-title">
                  <h2 id="macro-title">Macronutrients</h2>
                  <StackedBar
                    role="img"
                    aria-label={plan.macros
                      .map(
                        (macro) =>
                          `${macro.name} ${Math.round((macro.kcal / macroTotal) * 100)}%`
                      )
                      .join(', ')}
                  >
                    {plan.macros.map((macro) => (
                      <span
                        key={macro.key}
                        title={`${macro.name}: ${Math.round(macro.grams)} g`}
                        style={{
                          width: `${(macro.kcal / macroTotal) * 100}%`,
                          background: MACRO_COLORS[macro.key],
                        }}
                      />
                    ))}
                  </StackedBar>
                  <Legend>
                    {plan.macros.map((macro) => (
                      <li key={macro.key}>
                        <span>
                          <i style={{ background: MACRO_COLORS[macro.key] }} />
                          {macro.name}
                        </span>
                        <strong>{Math.round(macro.grams)} g</strong>
                        <small>
                          {Math.round((macro.kcal / macroTotal) * 100)}% ·{' '}
                          {Math.round(macro.kcal)} kcal
                        </small>
                      </li>
                    ))}
                  </Legend>
                  <Extras>
                    <p>
                      <strong>{plan.fiber} g</strong>
                      fiber per day
                    </p>
                    <p>
                      <strong>{plan.water} l</strong>
                      water per day
                    </p>
                  </Extras>
                </Panel>

                <Panel as="section" aria-labelledby="meals-title">
                  <h2 id="meals-title">Calories per meal</h2>
                  <Bars>
                    {MEALS.map(({ name, share }) => (
                      <li key={name}>
                        <span>{name}</span>
                        <Track aria-hidden="true">
                          <span style={{ width: `${(share / 0.35) * 100}%` }} />
                        </Track>
                        <span>
                          {Math.round(plan.calories * share).toLocaleString()}{' '}
                          kcal
                        </span>
                      </li>
                    ))}
                  </Bars>
                  <Disclaimer>
                    Estimates based on the Mifflin–St Jeor equation. They are a
                    starting point, not medical advice.
                  </Disclaimer>
                </Panel>

                <Button
                  as={Link}
                  to="/recipes"
                  $variant="secondary"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Find recipes for your plan
                </Button>
              </>
            ) : (
              <Panel>
                <h2>Almost there</h2>
                <Hint>
                  Fix the highlighted values and your plan will appear here.
                </Hint>
              </Panel>
            )}
          </Results>
        </Layout>
      </Container>
    </Page>
  );
};

export default PlanPage;
