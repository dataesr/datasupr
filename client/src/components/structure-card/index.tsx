import { Title } from "@dataesr/dsfr-plus";
import "./styles.scss";

interface StructureCardProps {
  title: string;
  region?: string;
  studentCount?: number;
  onClick?: () => void;
  className?: string;
  type?: string;
  year?: string | number;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export default function StructureCard({
  title,
  region,
  studentCount,
  type,
  year,
  onClick,
  as = "h2",
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
      <Title as={as} className="structure-card__title">
        {title}
      </Title>

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
