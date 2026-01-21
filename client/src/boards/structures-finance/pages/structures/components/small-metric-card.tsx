import { CHART_COLORS } from "../../../constants/colors";

interface SmallMetricCardProps {
  label: string;
  value: string | number;
  color?: string;
  sparklineData?: number[];
}

export function SmallMetricCard({
  label,
  value,
  color = CHART_COLORS.primary,
  sparklineData,
}: SmallMetricCardProps) {
  const createSparklinePath = (data: number[]) => {
    if (!data || data.length < 2) return "";

    const width = 150;
    const height = 50;
    const padding = 2;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y =
        height - padding - ((value - min) / range) * (height - 2 * padding);
      return { x, y };
    });

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const tension = 0.3;
      const cp1x = current.x + (next.x - current.x) * tension;
      const cp1y = current.y;
      const cp2x = next.x - (next.x - current.x) * tension;
      const cp2y = next.y;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }

    return path;
  };

  const sparklinePath = sparklineData ? createSparklinePath(sparklineData) : "";

  const trend =
    sparklineData && sparklineData.length >= 2 && sparklineData[0] !== 0
      ? ((sparklineData[sparklineData.length - 1] - sparklineData[0]) /
          sparklineData[0]) *
        100
      : null;

  const trendFormatted =
    trend !== null && isFinite(trend)
      ? `${trend > 0 ? "+" : ""}${trend.toFixed(1)}%`
      : null;

  const gradientId = `gradient-small-${label.replace(
    /[^a-zA-Z0-9]/g,
    "-"
  )}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      style={{
        position: "relative",
        width: "180px",
        padding: "10px 12px",
        borderRadius: "4px",
        backgroundColor: "var(--background-contrast-grey)",
        overflow: "hidden",
      }}
    >
      {sparklineData && sparklineData.length > 1 && (
        <svg
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "50px",
            pointerEvents: "none",
            opacity: 0.4,
          }}
          viewBox="0 0 150 50"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d={`${sparklinePath} L 150,50 L 0,50 Z`}
            fill={`url(#${gradientId})`}
          />
          <path
            d={sparklinePath}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
        </svg>
      )}
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
        <div
          style={{
            fontSize: "0.625rem",
            color: "var(--text-mention-grey)",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.3px",
            marginBottom: "2px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text-title-grey)",
            lineHeight: "1.3",
            marginTop: "4px",
          }}
        >
          {value}
        </div>
        {trendFormatted && (
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              right: "10px",
              fontSize: "0.7rem",
              fontWeight: 600,
              color:
                trend && trend > 0
                  ? "var(--green-archipel-sun-391)"
                  : trend && trend < 0
                    ? "var(--pink-tuile-sun-425)"
                    : "var(--text-mention-grey)",
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            {trend && trend > 0 ? "↗" : trend && trend < 0 ? "↘" : "→"}
            {trendFormatted}
          </div>
        )}
      </div>
    </div>
  );
}
