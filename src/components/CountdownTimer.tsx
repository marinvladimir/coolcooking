import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime - 1 <= 0) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  return (
    <TimerWrapper>
      <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>
      {timeLeft === 0 && <TimeUpMessage>Time's up!</TimeUpMessage>}
    </TimerWrapper>
  );
};

export default CountdownTimer;

const TimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
`;

const TimerDisplay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${(props) => props.theme.colors.background};
`;

const TimeUpMessage = styled.div`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.error};
  margin-top: 10px;
  font-weight: bold;
`;
