import { Container } from "@dataesr/dsfr-plus";
import { glossary } from "./definitions";

export default function Glossary() {
  return (
    <Container>
      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        {glossary.map(({ title, definition }) => (
          <div className="fr-col-12 fr-col-md-6 fr-col-lg-4" key={title}>
            <div className="fr-card fr-enlarge-link">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <h2 className="fr-card__title">{title}</h2>
                  <p className="fr-card__desc">{definition}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
