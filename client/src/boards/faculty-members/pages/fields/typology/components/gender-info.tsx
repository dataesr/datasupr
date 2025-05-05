import { Title } from "@dataesr/dsfr-plus";
import { GenderDataCardProps } from "../../../../types";
import "./styles.scss";

export const GenderDataCard = ({
  data,
  gender,
  isLoading,
}: GenderDataCardProps) => {
  if (isLoading) {
    return (
      <div className="fr-p-3w fr-mb-3w">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12">
            <div className="fr-skeleton-text" style={{ height: "200px" }}></div>
          </div>
        </div>
      </div>
    );
  }
  if (!data) return null;

  const genderData = gender === "hommes" ? data.hommes : data.femmes;
  const isMale = gender === "hommes";
  const genderClass = isMale ? "male" : "female";
  const iconClass = isMale ? "ri-men-line" : "ri-women-line";
  const titleText = isMale ? "Hommes" : "Femmes";

  return (
    <div className={`gender-card gender-card-${genderClass}`}>
      <div className="fr-grid-row fr-grid-row--middle fr-mb-2w">
        <div className="fr-col-auto">
          <div className={`gender-icon gender-icon-${genderClass}`}>
            <i className={`${iconClass} fr-icon-snapchat-fill`}></i>
          </div>
        </div>
        <div className="fr-col">
          <Title as="h3" look="h4" className="text-center fr-mb-0 fr-ml-1w">
            {titleText}
          </Title>
        </div>
        <div className="fr-col-auto">
          <div className={`gender-percentage gender-percentage-${genderClass}`}>
            {genderData.percent ||
              Math.round((genderData.total_count / data.total_count) * 100)}
            %
          </div>
          <div className="gender-count">
            {genderData.total_count.toLocaleString()}
          </div>
        </div>
      </div>

      <hr className={`separator separator-${genderClass}`} />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-4">
          <div className={`stat-title stat-title-${genderClass}`}>
            TITULAIRES
          </div>
          <div className={`stat-value stat-value-${genderClass}`}>
            {genderData.titulaires_percent}%
          </div>
          <div className={`stat-count stat-count-${genderClass}`}>
            {genderData.titulaires_count?.toLocaleString()} personnes
          </div>
        </div>

        <div className="fr-col-5">
          <div className={`stat-title stat-title-${genderClass}`}>
            ENSEIG.-CHERCHEURS
          </div>
          <div className={`stat-value stat-value-${genderClass}`}>
            {genderData.enseignants_chercheurs_percent}%
          </div>
          <div className={`stat-count stat-count-${genderClass}`}>
            {genderData.enseignants_chercheurs_count?.toLocaleString()}{" "}
            personnes
          </div>
        </div>

        <div className="fr-col-3">
          <div className={`stat-title stat-title-${genderClass}`}>
            TEMPS PLEIN
          </div>
          <div className={`stat-value stat-value-${genderClass}`}>
            {genderData.quotite_distribution?.["Temps plein"]?.percent || "N/A"}
            %
          </div>
          <div className={`stat-count stat-count-${genderClass}`}>
            {genderData.quotite_distribution?.[
              "Temps plein"
            ]?.count?.toLocaleString() || "-"}{" "}
            personnes
          </div>
        </div>
      </div>
      <div className="fr-mt-4w">
        <div className={`stat-title stat-title-${genderClass} fr-mb-1w`}>
          RÉPARTITION PAR ÂGE
        </div>
        <div className="age-distribution">
          {Object.entries(genderData.age_distribution || {})
            .sort((a, b) => {
              const ageA = parseInt(a[0].split(" ")[0]);
              const ageB = parseInt(b[0].split(" ")[0]);
              return ageA - ageB;
            })
            .map(([age, data]) => (
              <div
                key={age}
                className={`age-bar age-bar-${genderClass}`}
                style={{
                  flex: data.percent,
                  opacity: 0.7 + 0.3 * (parseInt(age.split(" ")[0]) / 60),
                }}
                title={`${age}: ${data.percent}% (${data.count} personnes)`}
              >
                <div className="age-label">{parseInt(age.split(" ")[0])}</div>
                <div className="age-percent">{data.percent}%</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
