import { Badge } from "@dataesr/dsfr-plus";
import { DSFR_COLORS } from "../../../constants/colors";

interface EtablissementInfoProps {
  data: any;
}

export default function EtablissementInfo({ data }: EtablissementInfoProps) {
  return (
    <div
      className="fr-mb-3w"
      style={{
        backgroundColor: "var(--background-contrast-info)",
        borderRadius: "8px",
      }}
    >
      <div className="fr-p-3w">
        <div
          className="fr-mb-2v"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <span className="fr-text--sm">
            <strong style={{ color: DSFR_COLORS.textDefault }}>Type :</strong>{" "}
            {data.type}
          </span>
          <span className="fr-text--sm">
            <strong style={{ color: DSFR_COLORS.textDefault }}>Région :</strong>{" "}
            {data.region}
          </span>
          <span className="fr-text--sm">
            <strong style={{ color: DSFR_COLORS.textDefault }}>
              Commune :
            </strong>{" "}
            {data.commune}
          </span>
          <span className="fr-text--sm">
            <strong style={{ color: DSFR_COLORS.textDefault }}>RCE :</strong>{" "}
            {data.is_rce ? (
              <>
                Oui
                {data.rce && (
                  <span style={{ fontStyle: "italic" }}>
                    {" "}
                    (depuis {data.rce})
                  </span>
                )}
              </>
            ) : (
              "Non"
            )}
          </span>
        </div>

        {data.effectif_sans_cpge && (
          <p className="fr-text--sm">
            <strong style={{ color: DSFR_COLORS.textDefault }}>
              Nombre d'étudiants inscrits :
            </strong>{" "}
            {data.effectif_sans_cpge.toLocaleString("fr-FR")}
          </p>
        )}

        <div style={{ marginTop: "0.75rem" }}>
          <p
            className="fr-text--sm fr-mb-1v"
            style={{
              fontWeight: 600,
              color: DSFR_COLORS.textDefault,
            }}
          >
            Formations proposées :
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.5rem",
              alignItems: "center",
            }}
          >
            {data.has_effectif_l && (
              <Badge
                color="blue-cumulus"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Licence
              </Badge>
            )}
            {data.has_effectif_m && (
              <Badge
                color="green-archipel"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Master
              </Badge>
            )}
            {data.has_effectif_d && (
              <Badge
                color="pink-tuile"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Doctorat
              </Badge>
            )}

            {(data.has_effectif_l ||
              data.has_effectif_m ||
              data.has_effectif_d) &&
              (data.has_effectif_iut ||
                data.has_effectif_sante ||
                data.has_effectif_ing) && <span>•</span>}

            {data.has_effectif_iut && (
              <Badge
                color="blue-cumulus"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                IUT
              </Badge>
            )}
            {data.has_effectif_sante && (
              <Badge
                color="brown-caramel"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Santé
              </Badge>
            )}
            {data.has_effectif_ing && (
              <Badge
                color="yellow-tournesol"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Ingénieur
              </Badge>
            )}

            {(data.has_effectif_iut ||
              data.has_effectif_sante ||
              data.has_effectif_ing) &&
              (data.has_effectif_dsa ||
                data.has_effectif_llsh ||
                data.has_effectif_theo ||
                data.has_effectif_si ||
                data.has_effectif_staps ||
                data.has_effectif_veto ||
                data.has_effectif_interd) && <span>•</span>}

            {data.has_effectif_dsa && (
              <Badge
                color="green-emeraude"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Droit Sciences Éco AES
              </Badge>
            )}
            {data.has_effectif_llsh && (
              <Badge
                color="pink-tuile"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Lettres Langues SHS
              </Badge>
            )}
            {data.has_effectif_theo && (
              <Badge
                color="purple-glycine"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Théologie
              </Badge>
            )}
            {data.has_effectif_si && (
              <Badge
                color="orange-terre-battue"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Sciences et Ingénierie
              </Badge>
            )}
            {data.has_effectif_staps && (
              <Badge
                color="green-menthe"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                STAPS
              </Badge>
            )}
            {data.has_effectif_veto && (
              <Badge
                color="green-archipel"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Vétérinaire
              </Badge>
            )}
            {data.has_effectif_interd && (
              <Badge
                color="pink-macaron"
                style={{
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: "var(--background-default-grey)",
                  border: "2px solid",
                }}
              >
                Interdisciplinaire
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
