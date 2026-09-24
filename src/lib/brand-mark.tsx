/** The ECG Bank symbol (coin ring + pulse + growth arrow) as inline SVG,
 * shared by icon.tsx and apple-icon.tsx so the mark itself never drifts
 * between the two ImageResponse routes. */
export function BrandMarkSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width={512} height={512} rx={116} fill="#173D2A" />
      <g transform="translate(76 76) scale(5.5)">
        <circle
          cx={32}
          cy={32}
          r={24}
          fill="none"
          stroke="#fff"
          strokeWidth={4}
          strokeDasharray="125 26"
          strokeLinecap="round"
          opacity={0.4}
        />
        <path
          d="M4 36H18L23 28L28 44L33 20L38 38L43 30L53 18.2"
          fill="none"
          stroke="#fff"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M56.8 21.4L58 12L49 15Z" fill="#fff" stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
      </g>
    </svg>
  );
}
