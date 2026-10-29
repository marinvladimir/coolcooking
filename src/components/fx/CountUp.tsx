import React, { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

interface CountUpProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
}

const defaultFormat = (value: number) => Math.round(value).toLocaleString();

/** Counts from the previous value to the new one once visible. */
const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 1.2,
  format = defaultFormat,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(0);
  const inView = useInView(ref, { once: true });
  const formatRef = useRef(format);
  formatRef.current = format;

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(previous.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = formatRef.current(latest);
      },
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, inView, duration]);

  return <span ref={ref}>{format(previous.current)}</span>;
};

export default CountUp;
