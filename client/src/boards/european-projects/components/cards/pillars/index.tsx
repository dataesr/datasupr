import { Text } from "@dataesr/dsfr-plus";

export default function PillarCard({ title, subtitle, description, to }: { title: string; subtitle?: string; description?: string; to: string }) {
  return (
    <div className="fr-card fr-enlarge-link" style={{ borderBottom: "4px solid #a00351ff" }}>
      <div className="fr-card__body">
        <div className="fr-card__content">
          <h3 className="fr-card__title">
            <a href={to}>{title}</a>
          </h3>
          {subtitle && <Text>{subtitle}</Text>}
          {description && <p className="fr-card__desc">{description}</p>}
        </div>
      </div>
    </div>
  );
}
