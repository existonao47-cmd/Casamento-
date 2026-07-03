interface FloralCornerProps {
  /** Which corner of its container the ornament anchors to */
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

const rotationByPosition: Record<FloralCornerProps["position"], string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0 -scale-x-100",
  "bottom-left": "bottom-0 left-0 -scale-y-100",
  "bottom-right": "bottom-0 right-0 -scale-x-100 -scale-y-100",
};

/**
 * Hand-drawn-style corner ornament: sage foliage with wine roses and a
 * sunflower accent, mirroring the invitation's corner florals.
 */
export default function FloralCorner({ position, className = "" }: FloralCornerProps) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={`pointer-events-none absolute w-28 h-28 sm:w-40 sm:h-40 ${rotationByPosition[position]} ${className}`}
      aria-hidden="true"
    >
      {/* trailing foliage */}
      <path
        d="M0 10 C 40 5, 70 30, 60 70 C 90 60, 120 90, 100 130 C 140 120, 150 160, 120 190"
        fill="none"
        stroke="#7C8A6B"
        strokeWidth="2"
        opacity="0.55"
      />
      <ellipse cx="35" cy="18" rx="14" ry="7" fill="#7C8A6B" opacity="0.5" transform="rotate(-25 35 18)" />
      <ellipse cx="62" cy="52" rx="12" ry="6" fill="#A3AF95" opacity="0.55" transform="rotate(15 62 52)" />
      <ellipse cx="95" cy="100" rx="13" ry="6.5" fill="#7C8A6B" opacity="0.5" transform="rotate(-10 95 100)" />
      <ellipse cx="118" cy="150" rx="11" ry="5.5" fill="#A3AF95" opacity="0.5" transform="rotate(20 118 150)" />

      {/* wine roses */}
      <g transform="translate(18 22)">
        <circle r="10" fill="#6E1F2B" opacity="0.9" />
        <circle r="6" fill="#8C2E3B" opacity="0.95" />
      </g>
      <g transform="translate(78 78)">
        <circle r="8" fill="#6E1F2B" opacity="0.85" />
        <circle r="4.5" fill="#8C2E3B" opacity="0.9" />
      </g>

      {/* sunflower accent */}
      <g transform="translate(46 46)">
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            rx="7"
            ry="3.2"
            fill="#D6A227"
            opacity="0.85"
            transform={`rotate(${i * 45}) translate(9 0)`}
          />
        ))}
        <circle r="5" fill="#3B2A22" opacity="0.8" />
      </g>
    </svg>
  );
}
