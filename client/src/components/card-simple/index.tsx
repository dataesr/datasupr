import { Text, Title } from "@dataesr/dsfr-plus";

import "./styles.scss";

interface StructureCardProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  description?: string;
  onClick?: () => void;
  stat?: number;
  subtitle?: string;
  title: string;
  year?: string | number;
}

export default function CardSimple({
  as = "h2",
  className = "",
  description,
  onClick,
  stat,
  subtitle,
  title,
  year,
}: StructureCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`structure-card ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Title as={as} className="structure-card__title">
        {title}
      </Title>

      {subtitle && <Text className="structure-card__meta">{subtitle}</Text>}

      {description && (
        <Text className="structure-card__meta">{description}</Text>
      )}

      {stat && (
        <Text className="structure-card__stat">
          {stat.toLocaleString("fr-FR")} étudiant{stat > 1 ? "s" : ""} inscrit
          {stat > 1 ? "s" : ""} en {year}
        </Text>
      )}
    </div>
  );
}
