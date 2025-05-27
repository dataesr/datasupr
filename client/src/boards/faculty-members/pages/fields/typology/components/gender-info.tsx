import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { Title } from "@dataesr/dsfr-plus";
import useFacultyMembersGenderComparison from "../../api/use-by-gender";
import "./styles.scss";

interface GenderDataCardProps {
  selectedYear: string;
  gender: "hommes" | "femmes";
}

export const GenderDataCard = ({
  selectedYear,
  gender,
}: GenderDataCardProps) => {
  const { fieldId } = useParams<{ fieldId?: string }>();

  const { data: genderComparisonData, isLoading } =
    useFacultyMembersGenderComparison({
      selectedYear,
      disciplineCode: fieldId,
    });

  const genderData = useMemo(() => {
    if (!genderComparisonData) return null;

    if (Array.isArray(genderComparisonData)) {
      if (fieldId) {
        return genderComparisonData.find(
          (item) => item.discipline?.code === fieldId
        );
      }
      return genderComparisonData[0];
    }

    return genderComparisonData;
  }, [genderComparisonData, fieldId]);

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

  if (!genderData) {
    return (
      <div className="fr-p-3w fr-mb-3w">
        <div className="fr-text--center fr-text--mention-grey">
          Aucune donnée disponible pour {selectedYear}
          {fieldId && " et la discipline sélectionnée"}
        </div>
      </div>
    );
  }

  const specificGenderData =
    gender === "hommes" ? genderData.hommes : genderData.femmes;
  const isMale = gender === "hommes";
  const genderClass = isMale ? "male" : "female";
  const iconClass = isMale ? "ri-men-line" : "ri-women-line";
  const titleText = isMale ? "Hommes" : "Femmes";

  return (
    <div className={`gender-card gender-card-${genderClass}`}>
      <div className="fr-grid-row fr-grid-row--middle fr-mb-2w">
        <div className="fr-col-auto">
          <div className={`gender-icon gender-icon-${genderClass}`}>
            <i className={`${iconClass} `}></i>
          </div>
        </div>
        <div className="fr-col">
          <Title as="h3" look="h4" className="text-center fr-mb-0 fr-ml-1w ">
            <div className={`gender-percentage-${genderClass}`}>
              {titleText}
            </div>
          </Title>
        </div>
        <div className="fr-col-auto">
          <div className={`gender-percentage gender-percentage-${genderClass}`}>
            {specificGenderData.percent ||
              Math.round(
                (specificGenderData.total_count / genderData.total_count) * 100
              )}
            %
          </div>
          <div className="gender-count">
            {specificGenderData.total_count.toLocaleString()}
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
            {specificGenderData.titulaires_percent}%
          </div>
          <div className={`stat-count stat-count-${genderClass}`}>
            {specificGenderData.titulaires_count?.toLocaleString()} personnes
          </div>
        </div>

        <div className="fr-col-5">
          <div className={`stat-title stat-title-${genderClass}`}>
            ENSEIG.-CHERCHEURS
          </div>
          <div className={`stat-value stat-value-${genderClass}`}>
            {specificGenderData.enseignants_chercheurs_percent}%
          </div>
          <div className={`stat-count stat-count-${genderClass}`}>
            {specificGenderData.enseignants_chercheurs_count?.toLocaleString()}{" "}
            personnes
          </div>
        </div>

        <div className="fr-col-3">
          <div className={`stat-title stat-title-${genderClass}`}>
            TEMPS PLEIN
          </div>
          <div className={`stat-value stat-value-${genderClass}`}>
            {specificGenderData.quotite_distribution?.["Temps plein"]
              ?.percent || "N/A"}
            %
          </div>
          <div className={`stat-count stat-count-${genderClass}`}>
            {specificGenderData.quotite_distribution?.[
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
          {Object.entries(specificGenderData.age_distribution || {})
            .sort((a, b) => {
              const ageA = parseInt(a[0].split(" ")[0]);
              const ageB = parseInt(b[0].split(" ")[0]);
              return ageA - ageB;
            })
            .map(([age, data]) => {
              const ageData = data as { percent: number; count: number };
              return (
                <div
                  key={age}
                  className={`age-bar age-bar-${genderClass}`}
                  style={{
                    flex: ageData.percent,
                    opacity: 0.7 + 0.3 * (parseInt(age.split(" ")[0]) / 60),
                  }}
                  title={`${age}: ${ageData.percent}% (${ageData.count} personnes)`}
                >
                  <div className="age-label">{parseInt(age.split(" ")[0])}</div>
                  <div className="age-percent">{ageData.percent}%</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
