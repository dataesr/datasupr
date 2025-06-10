import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Title } from "@dataesr/dsfr-plus";
import "./styles.scss";
import { useFacultyMembersTypology } from "../../../api/use-typology";
import { useContextDetection } from "../../../utils";
import { formatToPercent } from "../../../../../utils/format";

interface GenderDataCardProps {
  gender: "hommes" | "femmes";
}

export const GenderDataCard = ({ gender }: GenderDataCardProps) => {
  const [searchParams] = useSearchParams();
  const { context, contextId } = useContextDetection();
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const {
    data: typologyData,
    isLoading,
    error,
  } = useFacultyMembersTypology({
    context,
    annee_universitaire: selectedYear,
    contextId: contextId || undefined,
  });

  const genderData = useMemo(() => {
    if (!typologyData) return null;

    const getItemData = () => {
      switch (context) {
        case "fields":
          return typologyData.discipline;
        case "geo":
          return typologyData.region;
        case "structures":
          return typologyData.structure;
        default:
          return null;
      }
    };

    if (contextId) {
      const itemData = getItemData();
      if (!itemData) return null;

      const maleData = itemData.gender_breakdown?.find(
        (g) => g.gender === "Masculin"
      );
      const femaleData = itemData.gender_breakdown?.find(
        (g) => g.gender === "Féminin"
      );

      return {
        total_count: itemData.total_count,
        hommes: {
          total_count: maleData?.count || 0,
          percent: maleData
            ? Math.round((maleData.count / itemData.total_count) * 100)
            : 0,
          titulaires_percent: Math.round(maleData?.titulaires_percent || 0),
          titulaires_count: maleData?.titulaires_count || 0,
          enseignants_chercheurs_percent: Math.round(
            maleData?.enseignants_chercheurs_percent || 0
          ),
          enseignants_chercheurs_count:
            maleData?.enseignants_chercheurs_count || 0,
          quotite_distribution: {
            "Temps plein": {
              percent: Math.round(maleData?.temps_plein_percent || 0),
              count: maleData?.temps_plein_count || 0,
            },
          },
          age_distribution: maleData?.age_distribution || {},
        },
        femmes: {
          total_count: femaleData?.count || 0,
          percent: femaleData
            ? Math.round((femaleData.count / itemData.total_count) * 100)
            : 0,
          titulaires_percent: Math.round(femaleData?.titulaires_percent || 0),
          titulaires_count: femaleData?.titulaires_count || 0,
          enseignants_chercheurs_percent: Math.round(
            femaleData?.enseignants_chercheurs_percent || 0
          ),
          enseignants_chercheurs_count:
            femaleData?.enseignants_chercheurs_count || 0,
          quotite_distribution: {
            "Temps plein": {
              percent: Math.round(femaleData?.temps_plein_percent || 0),
              count: femaleData?.temps_plein_count || 0,
            },
          },
          age_distribution: femaleData?.age_distribution || {},
        },
        item: {
          name: itemData._id?.item_name,
          code: itemData._id?.item_code,
        },
      };
    } else {
      const globalSummary = typologyData.global_summary;
      if (!globalSummary || !typologyData.items) return null;

      let totalMaleTitulaires = 0;
      let totalFemaleTitulaires = 0;
      let totalMaleEnseignantsChercheurs = 0;
      let totalFemaleEnseignantsChercheurs = 0;
      let totalMaleTempsPlein = 0;
      let totalFemaleTempsPlein = 0;

      const maleAgeDistribution = {
        "35 ans et moins": { count: 0, percent: 0 },
        "36 à 55 ans": { count: 0, percent: 0 },
        "56 ans et plus": { count: 0, percent: 0 },
      };
      const femaleAgeDistribution = {
        "35 ans et moins": { count: 0, percent: 0 },
        "36 à 55 ans": { count: 0, percent: 0 },
        "56 ans et plus": { count: 0, percent: 0 },
      };

      typologyData.items.forEach((item) => {
        const maleData = item.gender_breakdown?.find(
          (g) => g.gender === "Masculin"
        );
        const femaleData = item.gender_breakdown?.find(
          (g) => g.gender === "Féminin"
        );

        if (maleData) {
          totalMaleTitulaires += maleData.titulaires_count || 0;
          totalMaleEnseignantsChercheurs +=
            maleData.enseignants_chercheurs_count || 0;
          totalMaleTempsPlein += maleData.temps_plein_count || 0;

          Object.entries(maleData.age_distribution || {}).forEach(
            ([age, data]) => {
              if (maleAgeDistribution[age]) {
                maleAgeDistribution[age].count +=
                  (data as { count: number }).count || 0;
              }
            }
          );
        }

        if (femaleData) {
          totalFemaleTitulaires += femaleData.titulaires_count || 0;
          totalFemaleEnseignantsChercheurs +=
            femaleData.enseignants_chercheurs_count || 0;
          totalFemaleTempsPlein += femaleData.temps_plein_count || 0;

          Object.entries(femaleData.age_distribution || {}).forEach(
            ([age, data]) => {
              if (femaleAgeDistribution[age]) {
                femaleAgeDistribution[age].count +=
                  (data as { count: number }).count || 0;
              }
            }
          );
        }
      });

      Object.keys(maleAgeDistribution).forEach((age) => {
        maleAgeDistribution[age].percent =
          globalSummary.total_male > 0
            ? Math.round(
                (maleAgeDistribution[age].count / globalSummary.total_male) *
                  100
              )
            : 0;
      });

      Object.keys(femaleAgeDistribution).forEach((age) => {
        femaleAgeDistribution[age].percent =
          globalSummary.total_female > 0
            ? Math.round(
                (femaleAgeDistribution[age].count /
                  globalSummary.total_female) *
                  100
              )
            : 0;
      });

      const avgMaleData = {
        total_count: globalSummary.total_male,
        percent: Math.round(
          (globalSummary.total_male / globalSummary.total_count) * 100
        ),
        titulaires_percent:
          globalSummary.total_male > 0
            ? Math.round((totalMaleTitulaires / globalSummary.total_male) * 100)
            : 0,
        titulaires_count: totalMaleTitulaires,
        enseignants_chercheurs_percent:
          globalSummary.total_male > 0
            ? Math.round(
                (totalMaleEnseignantsChercheurs / globalSummary.total_male) *
                  100
              )
            : 0,
        enseignants_chercheurs_count: totalMaleEnseignantsChercheurs,
        quotite_distribution: {
          "Temps plein": {
            percent:
              globalSummary.total_male > 0
                ? Math.round(
                    (totalMaleTempsPlein / globalSummary.total_male) * 100
                  )
                : 0,
            count: totalMaleTempsPlein,
          },
        },
        age_distribution: maleAgeDistribution,
      };

      const avgFemaleData = {
        total_count: globalSummary.total_female,
        percent: Math.round(
          (globalSummary.total_female / globalSummary.total_count) * 100
        ),
        titulaires_percent:
          globalSummary.total_female > 0
            ? Math.round(
                (totalFemaleTitulaires / globalSummary.total_female) * 100
              )
            : 0,
        titulaires_count: totalFemaleTitulaires,
        enseignants_chercheurs_percent:
          globalSummary.total_female > 0
            ? Math.round(
                (totalFemaleEnseignantsChercheurs /
                  globalSummary.total_female) *
                  100
              )
            : 0,
        enseignants_chercheurs_count: totalFemaleEnseignantsChercheurs,
        quotite_distribution: {
          "Temps plein": {
            percent:
              globalSummary.total_female > 0
                ? Math.round(
                    (totalFemaleTempsPlein / globalSummary.total_female) * 100
                  )
                : 0,
            count: totalFemaleTempsPlein,
          },
        },
        age_distribution: femaleAgeDistribution,
      };

      return {
        total_count: globalSummary.total_count,
        hommes: avgMaleData,
        femmes: avgFemaleData,
      };
    }
  }, [typologyData, contextId, context]);

  if (isLoading) {
    return (
      <div className="fr-p-3w fr-mb-3w">
        <div className="fr-skeleton-text" style={{ height: "200px" }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-p-3w fr-mb-3w">
        <div className="fr-alert fr-alert--error fr-alert--sm">
          <p>Erreur lors du chargement des données de typologie</p>
          <p className="fr-text--sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!genderData) {
    return (
      <div className="fr-p-3w fr-mb-3w">
        <div className="fr-alert fr-alert--info fr-alert--sm">
          <p>Aucune donnée disponible pour cette période</p>
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
            {specificGenderData.percent}%
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
              const ageOrderMap = {
                "35 ans et moins": 1,
                "36 à 55 ans": 2,
                "56 ans et plus": 3,
              };
              return ageOrderMap[a[0]] - ageOrderMap[b[0]];
            })
            .map(([age, data]) => {
              const ageData = data as { percent: number; count: number };
              const ageLabel = age
                .replace(" ans et moins", "-")
                .replace(" à ", "-")
                .replace(" ans et plus", "+");

              return (
                <div
                  key={age}
                  className={`age-bar age-bar-${genderClass}`}
                  style={{
                    flex: Math.max(ageData.percent, 5),
                    opacity: 0.7 + 0.3 * (ageData.percent / 100),
                  }}
                  title={`${age}: ${
                    ageData.percent
                  }% (${ageData.count.toLocaleString()} personnes)`}
                >
                  <div className="age-label">{ageLabel}</div>
                  <div className="age-percent">
                    {formatToPercent(ageData.percent)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
