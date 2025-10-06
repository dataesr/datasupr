export default function PillarCard({ label, description, to }: { label: string; description?: string; to: string }) {
  return (
    <div className="fr-card fr-enlarge-link">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <h3 className="fr-card__title">
            <a href={to}>{label}</a>
          </h3>
          {description && <p className="fr-card__desc">{description}</p>}
        </div>
      </div>
      {/* <div className="fr-card__header">
        <div className="fr-card__img">
          <img className="fr-responsive-img" src="/img/placeholder.16x9.png" alt="[À MODIFIER - vide ou texte alternatif de l'image]" />
        </div>
      </div> */}
    </div>
  );
}
