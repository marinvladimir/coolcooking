import { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { themes } from '../styles/theme';
import { useTheme } from '../states/ThemeContext';

ChartJS.register(
  ArcElement,
  Filler,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const nutrientData = {
  male: {
    intake: [
      { nutrient: 'Calories', value: 2500, unit: 'kcal' },
      { nutrient: 'Protein', value: 56, unit: 'g' },
      { nutrient: 'Carbs', value: 300, unit: 'g' },
      { nutrient: 'Fats', value: 70, unit: 'g' },
      { nutrient: 'Fiber', value: 38, unit: 'g' },
      { nutrient: 'Sodium', value: 2300, unit: 'mg' },
    ],
    percentages: { carbs: 50, protein: 20, fats: 30 },
  },
  female: {
    intake: [
      { nutrient: 'Calories', value: 2000, unit: 'kcal' },
      { nutrient: 'Protein', value: 46, unit: 'g' },
      { nutrient: 'Carbs', value: 260, unit: 'g' },
      { nutrient: 'Fats', value: 55, unit: 'g' },
      { nutrient: 'Fiber', value: 25, unit: 'g' },
      { nutrient: 'Sodium', value: 2300, unit: 'mg' },
    ],
    percentages: { carbs: 55, protein: 15, fats: 30 },
  },
};

const PlanPage = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const { setCategory } = useTheme();

  const selectedData = nutrientData[gender];
  const themeColors =
    gender === 'male' ? themes.drinks.colors : themes.desserts.colors;

  const doughnutData = {
    labels: ['Carbs', 'Protein', 'Fats'],
    datasets: [
      {
        label: 'Percentage of Macronutrients',
        data: Object.values(selectedData.percentages),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#5CC4F0', '#FF829B', '#FFDC76'],
      },
    ],
  };

  const barData = {
    labels: selectedData.intake.map((item) => item.nutrient),
    datasets: [
      {
        label: 'Daily Intake',
        data: selectedData.intake.map((item) => item.value),
        backgroundColor: themeColors.primary,
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Calorie Intake Trend',
        data:
          gender === 'male'
            ? [2400, 2500, 2550, 2500]
            : [1900, 2000, 2100, 2000],
        fill: true,
        backgroundColor: `${themeColors.primary}33`,
        borderColor: themeColors.primary,
      },
    ],
  };

  return (
    <Content>
      <h1>Welcome to Meal Plan Page</h1>
      <p>Meal Plan</p>
      <DashboardContainer>
        <GenderToggle>
          <Button
            onClick={() => {
              setGender('male');
              setCategory('drinks');
            }}
            className={gender === 'male' ? 'active' : ''}
          >
            Male
          </Button>
          <Button
            onClick={() => {
              setGender('female');
              setCategory('desserts');
            }}
            className={gender === 'female' ? 'active' : ''}
          >
            Female
          </Button>
        </GenderToggle>

        <ChartSection>
          <h3>Macronutrient Distribution</h3>
          <Doughnut data={doughnutData} />
        </ChartSection>

        <ChartSection>
          <h3>Daily Intake (by Nutrient)</h3>
          <Bar data={barData} />
        </ChartSection>

        <ChartSection>
          <h3>Calorie Intake Trends</h3>
          <Line data={lineData} />
        </ChartSection>
      </DashboardContainer>
    </Content>
  );
};

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
  transition:
    background 0.3s ease,
    color 0.3s ease;

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1rem;

    h1 {
      font-size: 1.8rem !important;
      margin: 1.5rem 0;
      color: ${(props) => props.theme.colors.accent};
    }

    p {
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: ${(props) => props.theme.colors.accent};
  }

  p {
    font-size: 1.2rem;
    line-height: 1.8;
    max-width: 800px;
    margin-bottom: 2rem;
  }
`;

const GenderToggle = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ChartSection = styled.div`
  text-align: center;
  width: 100%;

  h3 {
    margin-bottom: 20px;
    font-size: 20px;
    color: #333;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1.5rem;
    }

    canvas {
      max-width: 100%;
    }
  }
`;

export default PlanPage;
