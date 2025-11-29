interface ScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

function ScoreCircle({ score, size = 'md' }: ScoreCircleProps) {
  const sizes = {
    sm: { width: 48, fontSize: 'text-sm', stroke: 3 },
    md: { width: 64, fontSize: 'text-lg', stroke: 4 },
    lg: { width: 80, fontSize: 'text-xl', stroke: 5 },
  };

  const { width, fontSize, stroke } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return { stroke: '#10B981', bg: '#D1FAE5' }; // green
    if (score >= 60) return { stroke: '#F59E0B', bg: '#FEF3C7' }; // amber
    return { stroke: '#EF4444', bg: '#FEE2E2' }; // red
  };

  const colors = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={width} height={width} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={colors.bg}
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <span className={`absolute ${fontSize} font-semibold`} style={{ color: colors.stroke }}>
        {Math.round(score)}
      </span>
    </div>
  );
}

export default ScoreCircle;
