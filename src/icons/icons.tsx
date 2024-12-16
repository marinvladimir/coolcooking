export const Pot = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className="loading-pot"
  >
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke="#ff6347"
      strokeWidth="4"
    />
    <circle
      cx="50"
      cy="50"
      r="25"
      fill="none"
      stroke="#32cd32"
      strokeWidth="4"
      strokeDasharray="157"
      strokeDashoffset="0"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="157;0;-157;0"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    stroke="none"
  >
    <g>
      <polygon
        points="32,4 39.09,23.26 59.08,23.26 42.49,37.74 49.58,57 32,44.52 14.42,57 21.51,37.74 4.92,23.26 24.91,23.26"
        fill="url(#starGradient)"
      />
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#ffcc00', stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: '#ff9900', stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
    </g>
  </svg>
);
