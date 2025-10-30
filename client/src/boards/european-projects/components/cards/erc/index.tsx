import { Text } from "@dataesr/dsfr-plus";
import { Link } from "react-router-dom";

export default function ErcCard({ title, subtitle, description, to }: { title: string; subtitle?: string; description?: string; to: string }) {
  return (
    <div className="fr-card fr-enlarge-link" style={{ borderBottom: "4px solid #03a037ff" }}>
      <div className="fr-card__body">
        <div className="fr-card__content">
          <h3 className="fr-card__title">
            <Link to={to}>{title}</Link>
          </h3>
          {subtitle && <Text>{subtitle}</Text>}
          {description && <p className="fr-card__desc">{description}</p>}
        </div>
      </div>
    </div>
  );
}
