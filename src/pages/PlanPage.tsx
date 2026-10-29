import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from '../components/fx/CountUp';
import { palette } from '../styles/theme';
import {
  Button,
  Card,
  Container,
  Eyebrow,
  Field,
  FieldError,
  Highlight,
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

// Validated categorical trio (adjacent pairs pass the CVD checks); every
// segment also carries a direct label, so colour is never the only cue.
const MACRO_COLORS = {
  protein: '#f04a26',
  carbs: '#e09b00',
  fat: '#1a94e0',
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
      { key: 'protein', name: 'Protein', grams: protein, kcal: protein * 4 },
      { key: 'carbs', name: 'Carbs', grams: carbs, kcal: carbs * 4 },
      { key: 'fat', name: 'Fat', grams: fat, kcal: fat * 9 },
    ] as const,
    fiber: Math.round((calories / 1000) * 14),
    water: (weight * 0.035).toFixed(1),
  };
};

const Layout = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2rem;
  align-items: start;
  margin-top: 2.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled(Card)`
  padding: 1.9rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.3rem;
  }

  h2 {
    font-size: 1.9rem;
    margin-bottom: 1.4rem;
  }
`;

const InputPanel = styled(Panel)`
  position: sticky;
  top: 100px;
  background: ${({ theme }) => theme.colors.accentSoft};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: static;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  gap: 0.75rem;
  margin: 1.25rem 0;
`;

const Segmented = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  background: ${({ theme }) => theme.colors.surface};
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.md};

  button {
    position: relative;
    padding: 0.55rem;
    font-weight: 800;
    background: transparent;
    border: none;

    span {
      position: relative;
      z-index: 1;
    }
  }
`;

const UnitInput = styled.div`
  position: relative;

  ${Input} {
    padding: 0.8rem 2.3rem 0.8rem 0.7rem;
    appearance: textfield;
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  > span {
    position: absolute;
    top: 50%;
    right: 0.6rem;
    transform: translateY(-50%);
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.65rem;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.muted};
    pointer-events: none;
  }
`;

const SegmentIndicator = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.accent};
  border: 2.5px solid ${({ theme }) => theme.colors.ink};
  border-radius: 9px;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;

    > :first-child {
      grid-column: 1 / -1;
    }
  }
`;

const Stat = styled(Card)<{ $highlight?: boolean }>`
  padding: 1.3rem 1.4rem;
  color: ${({ $highlight, theme }) =>
    $highlight ? theme.colors.paper : theme.colors.ink};
  background: ${({ $highlight, theme }) =>
    $highlight ? theme.colors.ink : theme.colors.surface};
  box-shadow: ${({ $highlight, theme }) =>
    $highlight ? `6px 6px 0 ${theme.colors.accent}` : theme.shadow.md};

  > span {
    display: block;
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.7rem;
    text-transform: uppercase;
    opacity: 0.8;
  }

  strong {
    display: block;
    margin: 0.4rem 0 0.2rem;
    font-size: ${({ $highlight }) => ($highlight ? '3.4rem' : '2.2rem')};
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    color: ${({ $highlight, theme }) =>
      $highlight ? theme.colors.accent : 'inherit'};
  }

  small {
    font-size: 0.85rem;
    opacity: 0.8;
  }
`;

const StackedBar = styled.div`
  display: flex;
  gap: 4px;
  height: 34px;
  margin: 0.25rem 0 1.5rem;
  padding: 4px;
  border: ${({ theme }) => theme.border};
  border-radius: 10px;

  span {
    height: 100%;
    border: 2px solid ${({ theme }) => theme.colors.ink};
    border-radius: 4px;
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
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.75rem;
    text-transform: uppercase;

    i {
      width: 14px;
      height: 14px;
      border: 2px solid ${({ theme }) => theme.colors.ink};
    }
  }

  strong {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  small {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const Bars = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  li {
    display: grid;
    grid-template-columns: 100px 1fr 96px;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      grid-template-columns: 76px 1fr 80px;
      font-size: 0.9rem;
    }
  }

  li > span:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

const Track = styled.span`
  height: 22px;
  padding: 3px;
  border: ${({ theme }) => theme.border};
  border-radius: 8px;

  span {
    display: block;
    height: 100%;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 3px;
    transform-origin: 0 50%;
  }
`;

const Extras = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 2.5px dashed ${({ theme }) => theme.colors.ink};

  p {
    font-family: ${({ theme }) => theme.fonts.pixel};
    font-size: 0.7rem;
    text-transform: uppercase;
  }

  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.8rem;
    font-weight: 800;
    text-transform: none;
  }
`;

const Disclaimer = styled(Hint)`
  margin-top: 1.25rem;
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
        <PageTitle>
          Your daily <Highlight $color={palette.mint}>fuel</Highlight> plan
        </PageTitle>
        <Lead>
          Enter a few details to estimate how many calories you need each day
          and how to split them into protein, carbs, fat and meals.
        </Lead>

        <Layout>
          <InputPanel as="section" aria-labelledby="plan-inputs-title">
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
                    {inputs.sex === sex && (
                      <SegmentIndicator
                        layoutId="sex-toggle"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                    <span>{sex === 'female' ? 'Female' : 'Male'}</span>
                  </button>
                ))}
              </Segmented>
            </Stack>

            <FormGrid>
              {(
                [
                  ['age', 'Age', 'yrs'],
                  ['height', 'Height', 'cm'],
                  ['weight', 'Weight', 'kg'],
                ] as const
              ).map(([key, label, unit]) => (
                <Field key={key}>
                  <Label htmlFor={`plan-${key}`}>{label}</Label>
                  <UnitInput>
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
                    <span aria-hidden="true">{unit}</span>
                  </UnitInput>
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
          </InputPanel>

          <Results aria-live="polite">
            {plan ? (
              <>
                <Stats>
                  <Stat $highlight>
                    <span>Daily target</span>
                    <strong>
                      <CountUp value={plan.calories} duration={0.8} />
                    </strong>
                    <small>kcal per day · {GOALS[inputs.goal].label}</small>
                  </Stat>
                  <Stat>
                    <span>Maintenance</span>
                    <strong>
                      <CountUp value={plan.tdee} duration={0.8} />
                    </strong>
                    <small>kcal (TDEE)</small>
                  </Stat>
                  <Stat>
                    <span>At rest</span>
                    <strong>
                      <CountUp value={plan.bmr} duration={0.8} />
                    </strong>
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
                      <motion.span
                        key={macro.key}
                        title={`${macro.name}: ${Math.round(macro.grams)} g`}
                        initial={false}
                        animate={{
                          width: `${(macro.kcal / macroTotal) * 100}%`,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 160,
                          damping: 22,
                        }}
                        style={{ background: MACRO_COLORS[macro.key] }}
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
                        <strong>
                          <CountUp value={macro.grams} duration={0.8} /> g
                        </strong>
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
                          <motion.span
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: share / 0.35 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                        </Track>
                        <span>
                          <CountUp
                            value={plan.calories * share}
                            duration={0.8}
                          />{' '}
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
                  $size="lg"
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
