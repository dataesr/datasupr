import { Container, Row, Col, TagGroup, Tag, Badge } from '@dataesr/dsfr-plus';

import './style.scss';

type CardProps = {
  descriptionNode?: JSX.Element,
  label?: string,
  number: number | string,
  tagsNode?: JSX.Element,
  to?: string,
  year?: string,
};

export default function StudentsCard({
  descriptionNode,
  label,
  number,
  tagsNode,
  to = "#",
  year,
}: CardProps) {
  return (
    <div className="fr-card fr-enlarge-link fr-card--horizontal students-card">
      <div className="fr-card__body">
        <div className="fr-card__content fr-pb-1w">
          <Row>
            <Col>
              {
                tagsNode && (
                  <div className="fr-card__start">
                    {tagsNode}
                  </div>
                )
              }
            </Col>
            {year && (
              <Col style={{ textAlign: "right" }}>
                <Badge color="yellow-tournesol">{year}</Badge>
              </Col>

            )}
          </Row>
          <p className="fr-card__desc card-description">
            {descriptionNode}
          </p>
          <h3 className="fr-card__title">
            <a href={to} className="fr-card__link">
              <div className="key-number">
                {number.toLocaleString('fr-FR')}
              </div>
              {
                label ? (
                  <div className="students-label">{label}</div>
                ) : (
                  <div className="students-label">Etudiants<br />inscrits</div>
                )
              }
            </a>
          </h3>
        </div>
      </div>
    </div>
  );
}