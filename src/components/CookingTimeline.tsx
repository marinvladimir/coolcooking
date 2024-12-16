import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const CookingTimeline: React.FC<Props> = ({ cookingTime, category }) => {
  const [steps, setSteps] = useState<CookingStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(steps[0]?.time || 0);

  const totalSteps = steps.length;

  useEffect(() => {
    const newSteps: CookingStep[] = generateCookingSteps(cookingTime, category);
    setSteps(newSteps);
    setTimeLeft(newSteps[0]?.time || 0);
  }, [cookingTime, category]);

  const generateCookingSteps = (
    totalTime: number,
    category: string
  ): CookingStep[] => {
    let baseSteps: CookingStep[] = [];

    switch (category) {
      case 'soups':
        baseSteps = [
          { step: 'Chop vegetables', time: 10 },
          { step: 'Boil water/broth', time: 5 },
          { step: 'Add ingredients', time: 15 },
          { step: 'Simmer the soup', time: 25 },
          { step: 'Season to taste', time: 5 },
          { step: 'Serve and enjoy!', time: 5 },
        ];
        break;
      case 'desserts':
        baseSteps = [
          { step: 'Preheat the oven', time: 10 },
          { step: 'Mix dry ingredients', time: 15 },
          { step: 'Mix wet ingredients', time: 10 },
          { step: 'Combine wet and dry ingredients', time: 10 },
          { step: 'Bake the dessert', time: 30 },
          { step: 'Let cool', time: 10 },
          { step: 'Serve and enjoy!', time: 5 },
        ];
        break;
      case 'salads':
        baseSteps = [
          { step: 'Chop vegetables', time: 10 },
          { step: 'Mix dressing', time: 5 },
          { step: 'Toss the salad', time: 10 },
          { step: 'Serve and enjoy!', time: 5 },
        ];
        break;
      case 'mainDishes':
        baseSteps = [
          { step: 'Preheat the oven or stove', time: 10 },
          { step: 'Prepare ingredients', time: 15 },
          { step: 'Cook the main dish', time: 30 },
          { step: 'Add finishing touches', time: 10 },
          { step: 'Let the dish rest', time: 5 },
          { step: 'Serve and enjoy!', time: 5 },
        ];
        break;
      case 'drinks':
        baseSteps = [
          { step: 'Prepare ingredients', time: 5 },
          { step: 'Mix the drink', time: 5 },
          { step: 'Serve over ice', time: 5 },
          { step: 'Garnish and enjoy!', time: 5 },
        ];
        break;
      default:
        baseSteps = [];
    }

    const totalBaseTime = baseSteps.reduce((acc, step) => acc + step.time, 0);
    const scaleFactor = totalTime / totalBaseTime;

    return baseSteps.map((step) => ({
      ...step,
      time: Math.round(step.time * scaleFactor),
    }));
  };

  useEffect(() => {
    if (currentStep < totalSteps) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      if (timeLeft <= 0) {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps));
        setTimeLeft(steps[currentStep + 1]?.time || 0);
      }

      return () => clearInterval(interval);
    }
  }, [currentStep, timeLeft, steps, totalSteps]);

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <TimelineWrapper>
      <ProgressBarWrapper>
        <ProgressBarFill style={{ width: `${progressPercentage}%` }} />
      </ProgressBarWrapper>

      <StepDescriptionWrapper>
        <CurrentStepText>{steps[currentStep]?.step}</CurrentStepText>
      </StepDescriptionWrapper>
    </TimelineWrapper>
  );
};

const TimelineWrapper = styled.div`
  width: 100%;
  padding: 20px;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-bottom: 20px;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.5s ease;
`;

const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const StepDescriptionWrapper = styled.div`
  margin-top: 10px;
  text-align: center;
  color: #4caf50;
  animation: ${blinkAnimation} 2s infinite;
`;

const CurrentStepText = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #4caf50;
`;

export default CookingTimeline;
