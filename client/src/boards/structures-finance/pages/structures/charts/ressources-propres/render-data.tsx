import { CHART_COLORS } from "../../../../constants/colors";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";
const pct = (n?: number) => (n != null ? `${n.toFixed(1)} %` : "—");

interface RessourcesPropresData {
  droits_d_inscription?: number;
  formation_continue_diplomes_propres_et_vae?: number;
  taxe_d_apprentissage?: number;
  valorisation?: number;
  anr_hors_investissements_d_avenir?: number;
  anr_investissements_d_avenir?: number;
  contrats_et_prestations_de_recherche_hors_anr?: number;
  subventions_de_la_region?: number;
  subventions_union_europeenne?: number;
  autres_ressources_propres?: number;
  autres_subventions?: number;
  part_droits_d_inscription?: number;
  part_formation_continue_diplomes_propres_et_vae?: number;
  part_taxe_d_apprentissage?: number;
  part_valorisation?: number;
  part_anr_hors_investissements_d_avenir?: number;
  part_anr_investissements_d_avenir?: number;
  part_contrats_et_prestations_de_recherche_hors_anr?: number;
  part_subventions_de_la_region?: number;
  part_subventions_union_europeenne?: number;
  part_autres_ressources_propres?: number;
  part_autres_subventions?: number;
  ressources_propres?: number;
}

interface RenderDataProps {
  data: RessourcesPropresData;
}

export function RenderData({ data }: RenderDataProps) {
  const ressourcesPropresDecomposition = [
    {
      label: "Droits d'inscription",
      value: data?.droits_d_inscription,
      part: data?.part_droits_d_inscription,
      color: CHART_COLORS.palette[0],
    },
    {
      label: "Formation continue",
      value: data?.formation_continue_diplomes_propres_et_vae,
      part: data?.part_formation_continue_diplomes_propres_et_vae,
      color: CHART_COLORS.palette[1],
    },
    {
      label: "Taxe d'apprentissage",
      value: data?.taxe_d_apprentissage,
      part: data?.part_taxe_d_apprentissage,
      color: CHART_COLORS.palette[2],
    },
    {
      label: "Valorisation",
      value: data?.valorisation,
      part: data?.part_valorisation,
      color: CHART_COLORS.palette[3],
    },
    {
      label: "ANR hors investissements d'avenir",
      value: data?.anr_hors_investissements_d_avenir,
      part: data?.part_anr_hors_investissements_d_avenir,
      color: CHART_COLORS.palette[4],
    },
    {
      label: "ANR investissements",
      value: data?.anr_investissements_d_avenir,
      part: data?.part_anr_investissements_d_avenir,
      color: CHART_COLORS.palette[5],
    },
    {
      label: "Contrats & prestations",
      value: data?.contrats_et_prestations_de_recherche_hors_anr,
      part: data?.part_contrats_et_prestations_de_recherche_hors_anr,
      color: CHART_COLORS.palette[6],
    },
    {
      label: "Subventions région",
      value: data?.subventions_de_la_region,
      part: data?.part_subventions_de_la_region,
      color: CHART_COLORS.palette[7],
    },
    {
      label: "Subventions UE",
      value: data?.subventions_union_europeenne,
      part: data?.part_subventions_union_europeenne,
      color: CHART_COLORS.palette[8],
    },
    {
      label: "Autres ressources",
      value: data?.autres_ressources_propres,
      part: data?.part_autres_ressources_propres,
      color: CHART_COLORS.palette[9],
    },
    {
      label: "Autres subventions",
      value: data?.autres_subventions,
      part: data?.part_autres_subventions,
      color: CHART_COLORS.palette[10],
    },
  ];

  const totalRessources = data?.ressources_propres || 0;

  if (!data) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div className="fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="ressources-propres-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "70%" }}>Catégorie</th>
                  <th style={{ width: "20%", textAlign: "right" }}>Montant</th>
                  <th style={{ width: "10%", textAlign: "right" }}>Part</th>
                </tr>
              </thead>
              <tbody>
                {ressourcesPropresDecomposition
                  .sort((a, b) => (b.value || 0) - (a.value || 0))
                  .map((item) => (
                    <tr key={item.label}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: item.color,
                              borderRadius: "2px",
                            }}
                          />
                          <span>{item.label}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {euro(item.value)} €
                      </td>
                      <td style={{ textAlign: "right" }}>{pct(item.part)}</td>
                    </tr>
                  ))}
                <tr
                  style={{
                    backgroundColor: "var(--background-contrast-grey)",
                    fontWeight: 700,
                  }}
                >
                  <td>
                    <strong>Total ressources propres</strong>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <strong>{euro(totalRessources)} €</strong>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <strong>100 %</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
