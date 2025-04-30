import { Row, Col, Title } from "@dataesr/dsfr-plus";
import { DisciplineStatusSummaryProps } from "../../../types";

const DisciplineStatusSummary: React.FC<DisciplineStatusSummaryProps> = ({
  totalCount,
  aggregatedStats,
  fields,
  isSingleDiscipline = false,
}) => {
  if (!fields || fields.length === 0) return null;
  console.log(fields);
  const discipline = isSingleDiscipline ? fields[0] : null;
  return (
    <Row
      gutters
      className={isSingleDiscipline ? "fr-mb-3w" : "fr-mt-5w fr-mb-3w"}
    >
      <Col md={isSingleDiscipline ? 12 : undefined}>
        {!isSingleDiscipline && (
          <Title as="h3" look="h4" className="fr-mb-2w">
            Résumé des statuts par discipline
          </Title>
        )}
        <strong className="fr-text--lg">
          {isSingleDiscipline
            ? `Statuts de la discipline "${discipline?.fieldLabel}"`
            : "Statuts globaux"}
        </strong>
        <p className="fr-text--sm fr-text--grey fr-mb-1w">
          {isSingleDiscipline
            ? `Répartition des statuts pour ${totalCount?.toLocaleString()} enseignants`
            : `Répartition globale pour l'ensemble des disciplines (${totalCount?.toLocaleString()} pers.)`}
        </p>
        <div className="fr-mb-2w">
          <div className="fr-grid-row fr-grid-row--middle fr-mb-1v">
            <div className="fr-col-6">Titulaires</div>
            <div className="fr-col-6">
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${aggregatedStats?.titulairesPercent}%`,
                    backgroundColor: "#000091",
                  }}
                ></div>
              </div>
              <div className="fr-text--xs fr-text--grey">
                {aggregatedStats?.titulairesPercent}%
                {isSingleDiscipline && aggregatedStats?.totalTitulaires && (
                  <span className="fr-ml-1w">
                    ({aggregatedStats.totalTitulaires.toLocaleString()} pers.)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--middle">
            <div className="fr-col-6">Enseignants-chercheurs</div>
            <div className="fr-col-6">
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${aggregatedStats?.enseignantsChercheursPercent}%`,
                    backgroundColor: "#e1000f",
                  }}
                ></div>
              </div>
              <div className="fr-text--xs fr-text--grey">
                {aggregatedStats?.enseignantsChercheursPercent}%
                {isSingleDiscipline &&
                  aggregatedStats?.totalEnseignantsChercheurs && (
                    <span className="fr-ml-1w">
                      (
                      {aggregatedStats.totalEnseignantsChercheurs.toLocaleString()}{" "}
                      pers.)
                    </span>
                  )}
              </div>
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--middle">
            <div className="fr-col-6">Non titulaire</div>
            <div className="fr-col-6">
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${aggregatedStats?.nonTitulairesPercent}%`,
                    backgroundColor: "#6a6a6a",
                  }}
                ></div>
              </div>
              <div className="fr-text--xs fr-text--grey">
                {aggregatedStats?.nonTitulairesPercent}%
                {isSingleDiscipline &&
                  aggregatedStats?.nonTitulairesPercent && (
                    <span className="fr-ml-1w">
                      ({aggregatedStats?.nonTitulairesPercent.toLocaleString()}{" "}
                      pers.)
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default DisciplineStatusSummary;
