import { Title, Badge } from "@dataesr/dsfr-plus";

type GenderData = {
  gender_gap: {
    total_percent: number;
    titulaires_gap: number;
    quotite_temps_plein_gap: number;
  };
};

type GenderGapsProps = {
  genderData?: GenderData | null;
};

export const GenderGaps = ({ genderData }: GenderGapsProps) => {
  if (!genderData) return null;

  return (
    <div className="fr-card fr-mb-3w">
      <div className="fr-p-2w">
        <Title as="h4" look="h6" className="fr-mb-1w">
          Écarts significatifs entre hommes et femmes
        </Title>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-4">
            <div className="fr-text--sm fr-text--bold">
              Écart de représentation
            </div>
            <Badge className="fr-mt-1w">
              {Math.abs(genderData.gender_gap.total_percent)}% en faveur des{" "}
              {genderData.gender_gap.total_percent > 0 ? "hommes" : "femmes"}
            </Badge>
          </div>
          <div className="fr-col-4">
            <div className="fr-text--sm fr-text--bold">
              Écart de titularisation
            </div>
            <Badge className="fr-mt-1w">
              {genderData.gender_gap.titulaires_gap > 0 ? "hommes" : "femmes"}
            </Badge>
          </div>
          <div className="fr-col-4">
            <div className="fr-text--sm fr-text--bold">Écart temps plein</div>
            <Badge className="fr-mt-1w">
              {Math.abs(genderData.gender_gap.quotite_temps_plein_gap)}% en
              faveur des{" "}
              {genderData.gender_gap.quotite_temps_plein_gap > 0
                ? "hommes"
                : "femmes"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
