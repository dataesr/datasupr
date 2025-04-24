import { Row, Col, Title } from "@dataesr/dsfr-plus";
import { DisciplineStatusSummaryProps } from "../../../types";

const DisciplineStatusSummary: React.FC<DisciplineStatusSummaryProps> = ({
  totalCount,
  aggregatedStats,
  fields,
  isSingleDiscipline = false,
}) => {
  if (!fields || fields.length === 0) return null;

  const discipline = isSingleDiscipline ? fields[0] : null;

  return (
    <Row
      gutters
      className={isSingleDiscipline ? "fr-mb-3w" : "fr-mt-5w fr-mb-3w"}
    >
      <Col md={isSingleDiscipline ? 12 : 5}>
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
        </div>
      </Col>

      {!isSingleDiscipline && (
        <Col md={7}>
          <Title as="h2" look="h6">
            Les 3 plus grandes disciplines
          </Title>
          <div className="fr-table fr-table--bordered">
            <table>
              <thead>
                <tr>
                  <th scope="col">Discipline</th>
                  <th scope="col">Effectif</th>
                  <th scope="col">Titulaires</th>
                  <th scope="col">Ens.-Chercheurs</th>
                </tr>
              </thead>
              <tbody>
                {fields
                  .sort((a, b) => (b.totalCount ?? 0) - (a.totalCount ?? 0))
                  .slice(0, 3)
                  .map((discipline) => (
                    <tr key={discipline.fieldId || discipline.field_id}>
                      <td>{discipline.fieldLabel || discipline.field_label}</td>
                      <td>
                        {(
                          discipline.totalCount ??
                          discipline.total_count ??
                          0
                        ).toLocaleString()}
                      </td>
                      <td>
                        {discipline.status?.titulaires?.percent ||
                          discipline.titulaires_percent ||
                          (discipline.titulaires &&
                            (
                              (discipline.titulaires /
                                (discipline.totalCount ??
                                  discipline.total_count ??
                                  1)) *
                              100
                            ).toFixed(1))}
                        %
                      </td>
                      <td>
                        {discipline.status?.enseignantsChercheurs?.percent ||
                          discipline.enseignants_chercheurs_percent ||
                          (discipline.enseignants_chercheurs &&
                            (
                              (discipline.enseignants_chercheurs /
                                (discipline.totalCount ??
                                  discipline.total_count ??
                                  1)) *
                              100
                            ).toFixed(1))}
                        %
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default DisciplineStatusSummary;
