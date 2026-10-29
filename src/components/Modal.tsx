import React, { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { CloseIcon } from '../icons/icons';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const popIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 4vh 1rem;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.2s ease-out;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0;
    align-items: flex-end;
  }
`;

const Dialog = styled.div<{ $width: number }>`
  position: relative;
  width: 100%;
  max-width: ${({ $width }) => $width}px;
  margin: auto 0;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  animation: ${popIn} 0.25s ease-out;

  &:focus {
    outline: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0;
    max-height: 92vh;
    overflow-y: auto;
    border-radius: ${({ theme }) => theme.radius.lg}
      ${({ theme }) => theme.radius.lg} 0 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadow.md};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

interface ModalProps {
  onClose: () => void;
  labelledBy: string;
  width?: number;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  labelledBy,
  width = 880,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return createPortal(
    <Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        $width={width}
      >
        <CloseButton type="button" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </CloseButton>
        {children}
      </Dialog>
    </Backdrop>,
    document.body
  );
};

export default Modal;
