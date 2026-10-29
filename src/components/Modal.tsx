import React, { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CloseIcon } from '../icons/icons';
import { Button } from '../styles/ui';

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 5vh 1rem;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.overlay};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0;
    align-items: flex-end;
  }
`;

const Dialog = styled(motion.div)<{ $width: number }>`
  position: relative;
  width: 100%;
  max-width: ${({ $width }) => $width}px;
  margin: auto 0;
  background: ${({ theme }) => theme.colors.surface};
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xl};

  &:focus {
    outline: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0;
    max-height: 94vh;
    overflow-y: auto;
    border-radius: ${({ theme }) => theme.radius.lg}
      ${({ theme }) => theme.radius.lg} 0 0;
    box-shadow: none;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 3;
  padding: 0.5rem;

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

/** Accessible dialog; render it inside <AnimatePresence> to animate the exit. */
const Modal: React.FC<ModalProps> = ({
  onClose,
  labelledBy,
  width = 960,
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
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
        initial={{ opacity: 0, y: 60, rotate: -2, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, rotate: 1, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      >
        <CloseButton
          type="button"
          $variant="secondary"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </CloseButton>
        {children}
      </Dialog>
    </Backdrop>,
    document.body
  );
};

export default Modal;
