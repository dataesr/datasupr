import { Title } from "@dataesr/dsfr-plus";

interface GenderData {
  hommes: {
    titulaires_percent: number;
    enseignants_chercheurs_percent: number;
  };
  femmes: {
    titulaires_percent: number;
    enseignants_chercheurs_percent: number;
  };
  gender_gap: {
    titulaires_gap: number;
  };
}

type GenderSpecificInfoProps = {
  genderData: GenderData;
  gender: "hommes" | "femmes";
};

export const GenderSpecificInfo = ({
  genderData,
  gender,
}: GenderSpecificInfoProps) => {
  if (!genderData) return null;

  const data = gender === "hommes" ? genderData.hommes : genderData.femmes;
  const gap = genderData.gender_gap.titulaires_gap;
  const showGapInfo = gender === "hommes" ? gap > 0 : gap < 0;

  return (
    <div className="fr-card fr-mb-2w">
      <div className="fr-p-2w">
        <Title as="h4" look="h6">
          Points spécifiques chez les {gender}
        </Title>
        <ul className="fr-text--sm">
          <li>
            Proportion de titulaires :{" "}
            <strong>{data.titulaires_percent}%</strong>
          </li>
          <li>
            Proportion d'enseignants-chercheurs :{" "}
            <strong>{data.enseignants_chercheurs_percent}%</strong>
          </li>
          {showGapInfo && (
            <li>
              Taux de titularisation{" "}
              <strong>{Math.abs(gap)}% plus élevé</strong> que chez les{" "}
              {gender === "hommes" ? "femmes" : "hommes"}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
