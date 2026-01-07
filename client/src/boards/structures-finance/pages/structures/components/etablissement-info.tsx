import { Row, Col, Badge } from "@dataesr/dsfr-plus";
import { DSFR_COLORS } from "../../../constants/colors";

interface EtablissementInfoProps {
  data: any;
}

export default function EtablissementInfo({ data }: EtablissementInfoProps) {
  const isActuel =
    data?.etablissement_id_paysage === data?.etablissement_id_paysage_actuel;

  return (
    <div
      className="fr-mb-3w"
      style={{
        backgroundColor: "var(--background-contrast-info)",
        borderRadius: "8px",
      }}
    >
      <div className="fr-p-3w">
        <Row gutters className="fr-mb-2v">
          <Col xs="12" sm="6" md="4">
            <p className="fr-text--sm fr-mb-1v">
              <strong style={{ color: DSFR_COLORS.textDefault }}>Type :</strong>{" "}
              {data.type}
            </p>
          </Col>
          <Col xs="12" sm="6" md="4">
            <p className="fr-text--sm fr-mb-1v">
              <strong style={{ color: DSFR_COLORS.textDefault }}>
                Région :
              </strong>{" "}
              {data.region}
            </p>
          </Col>
          <Col xs="12" md="4">
            <p className="fr-text--sm fr-mb-1v">
              <strong style={{ color: DSFR_COLORS.textDefault }}>
                Commune du siège :
              </strong>{" "}
              {data.commune}
            </p>
            <p className="fr-text--sm fr-mb-0 fr-mt-2v">
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
            </p>
          </Col>
        </Row>

        {data.effectif_sans_cpge && (
          <p className="fr-text--sm fr-mb-2v">
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
            }}
          >
            {data.has_effectif_l && (
              <Badge
                color="blue-cumulus"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                licence
              </Badge>
            )}
            {data.has_effectif_m && (
              <Badge
                color="green-archipel"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                master
              </Badge>
            )}
            {data.has_effectif_d && (
              <Badge
                color="pink-tuile"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                doctorat
              </Badge>
            )}
            {data.has_effectif_iut && (
              <Badge
                color="blue-cumulus"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                iut
              </Badge>
            )}
            {data.has_effectif_ing && (
              <Badge
                color="yellow-tournesol"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                ingénieur
              </Badge>
            )}
            {data.has_effectif_dsa && (
              <Badge
                color="green-emeraude"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                droit sciences éco aes
              </Badge>
            )}
            {data.has_effectif_llsh && (
              <Badge
                color="pink-tuile"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                lettres langues shs
              </Badge>
            )}
            {data.has_effectif_theo && (
              <Badge
                color="purple-glycine"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                théologie
              </Badge>
            )}
            {data.has_effectif_si && (
              <Badge
                color="orange-terre-battue"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                sciences et ingénierie
              </Badge>
            )}
            {data.has_effectif_staps && (
              <Badge
                color="green-menthe"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                staps
              </Badge>
            )}
            {data.has_effectif_sante && (
              <Badge
                color="brown-caramel"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                santé
              </Badge>
            )}
            {data.has_effectif_veto && (
              <Badge
                color="green-archipel"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                vétérinaire
              </Badge>
            )}
            {data.has_effectif_interd && (
              <Badge
                color="pink-macaron"
                style={{
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "white",
                  border: "2px solid",
                }}
              >
                interdisciplinaire
              </Badge>
            )}
          </div>
        </div>

        {!isActuel && (
          <div
            className="fr-mt-2w fr-p-2w"
            style={{
              backgroundColor: "var(--background-contrast-warning)",
              borderRadius: "4px",
              border: "1px solid var(--border-plain-warning)",
              fontStyle: "italic",
            }}
          >
            <span style={{ color: "var(--text-default-warning)" }}>
              → Actuellement : <strong>{data.etablissement_actuel_lib}</strong>{" "}
              ({data.etablissement_actuel_type})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
