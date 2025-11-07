import { glossary } from "./definitions";
import "./styles.scss";

export default function Glossary() {
  return (
    <div className="glossary-container">
      <div className="glossary-header">
        <h1 className="glossary-title">Glossaire</h1>
        <p className="glossary-subtitle">
          Découvrez les définitions des termes clés utilisés dans le domaine de
          l'enseignement supérieur et de la recherche
        </p>
      </div>

      <div className="glossary-grid">
        {glossary.map(({ title, definition }) => (
          <div className="glossary-card" key={title}>
            <h2 className="glossary-card__title">{title}</h2>
            <p className="glossary-card__definition">{definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
