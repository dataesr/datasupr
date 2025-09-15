export const TrendIndicator = ({ trend }: { trend: number }) => {
  if (trend === 0) {
    return <span style={{ color: "grey", marginLeft: 4 }}>●</span>;
  }
  const isUp = trend > 0;
  const color = isUp
    ? "var(--green-emeraude-main-525)"
    : "var(--red-marianne-main-472)";
  const icon = isUp ? "▲" : "▼";

  return (
    <span
      style={{ color, marginLeft: 4, fontSize: "0.9em" }}
      title={`Tendance: ${trend > 0 ? "+" : ""}${trend.toLocaleString()}`}
    >
      {icon} ({Math.abs(trend).toLocaleString()})
    </span>
  );
};
