import "./styles.scss";

interface StructureCardProps {
  title: string;
  region?: string;
  studentCount?: number;
  onClick?: () => void;
  className?: string;
  type?: string;
  year?: string | number;
}

export default function StructureCard({
  title,
  region,
  studentCount,
  type,
  year,
  onClick,
  className = "",
}: StructureCardProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };
  console.log(year);

  return (
    <div
      className={`structure-card ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={handleKeyPress}
    >
      <h2 className="structure-card__title">{title}</h2>

      {type !== undefined && <p className="structure-card__meta">{type}</p>}
      {region && <p className="structure-card__meta">{region}</p>}

      {studentCount && (
        <p className="structure-card__stat">
          {studentCount.toLocaleString("fr-FR")} étudiants inscrits en {year}
        </p>
      )}
    </div>
  );
}
