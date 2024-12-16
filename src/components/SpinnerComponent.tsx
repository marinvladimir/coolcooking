import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerWrapper = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  position: relative;
`;

const Spinner = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 4px solid ${(props) => props.theme.colors.lightBackground};
  border-top: 4px solid ${(props) => props.theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SpinnerOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.lightBackground}CC;
  z-index: 999;
`;

const SpinnerComponent: React.FC<{ overlay?: boolean }> = ({
  overlay = false,
}) => {
  if (overlay) {
    return (
      <SpinnerOverlay>
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      </SpinnerOverlay>
    );
  }

  return (
    <SpinnerWrapper>
      <Spinner />
    </SpinnerWrapper>
  );
};

export default SpinnerComponent;
