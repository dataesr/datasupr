import "./styles.scss";

interface StructureCardProps {
  title: string;
  region?: string;
  category?: string;
  studentCount?: number;
  onClick?: () => void;
  className?: string;
  type?: string;
}

export default function StructureCard({
  title,
  region,
  category,
  studentCount,
  type,
  onClick,
  className = "",
}: StructureCardProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`structure-card ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={handleKeyPress}
    >
      <h2 className="structure-card__title">{title}</h2>

      {(region || category) && (
        <p className="structure-card__meta">
          {region}
          {region && category && <> • </>}
          {category}
        </p>
      )}
      {type !== undefined && <p className="structure-card__meta">{type}</p>}

      {studentCount !== undefined && (
        <p className="structure-card__stat">
          {studentCount.toLocaleString("fr-FR")} étudiants inscrits
        </p>
      )}
    </div>
  );
}
