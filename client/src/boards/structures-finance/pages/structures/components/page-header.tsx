import { Badge } from "@dataesr/dsfr-plus";

interface PageHeaderProps {
  data: any;
  onClose: () => void;
}

export default function PageHeader({ data, onClose }: PageHeaderProps) {
  if (!data) return null;

  const hasCursus =
    data.has_effectif_l || data.has_effectif_m || data.has_effectif_d;
  const hasFilieres =
    data.has_effectif_iut || data.has_effectif_sante || data.has_effectif_ing;
  const hasDisciplines =
    data.has_effectif_dsa ||
    data.has_effectif_llsh ||
    data.has_effectif_theo ||
    data.has_effectif_si ||
    data.has_effectif_staps ||
    data.has_effectif_veto ||
    data.has_effectif_sante ||
    data.has_effectif_interd;

  const hasFormations = hasCursus || hasFilieres || hasDisciplines;

  const showActuelName =
    data.etablissement_actuel_lib &&
    data.etablissement_lib &&
    data.etablissement_lib !== data.etablissement_actuel_lib;

  return (
    <div>
      <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle ">
        <div className="fr-col">
          <h1 className="fr-h3 fr-mb-0">
            {data.etablissement_lib || data.etablissement_actuel_lib}
          </h1>
          {showActuelName && (
            <p className="fr-text--sm fr-text--bold fr-mb-0 fr-mt-1v">
              {data.etablissement_actuel_lib}
            </p>
          )}
        </div>
        <div className="fr-col-auto">
          <button
            className="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-arrow-go-back-line"
            onClick={onClose}
            title="Changer d'établissement"
          >
            Changer d'établissement
          </button>
        </div>
      </div>

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6">
          <div className="fr-mb-2w">
            {data.etablissement_actuel_categorie && (
              <p className="fr-text--sm fr-text-mention--grey fr-mb-1v">
                {data.etablissement_actuel_categorie}
              </p>
            )}
            <p className="fr-text--sm fr-text-mention--grey fr-mb-0">
              <span aria-hidden="true" /> {data.commune} — {data.region}
              {data.nb_sites && (
                <>
                  {" "}
                  • {data.nb_sites} {data.nb_sites > 1 ? "sites" : "site"}
                </>
              )}
            </p>
          </div>

          {data.is_rce && (
            <p className="fr-text--sm fr-text-mention--grey fr-mb-2w">
              Responsabilités et compétences élargies (RCE)
              {data.rce && <> depuis {data.rce}</>}
            </p>
          )}

          {data.effectif_sans_cpge && (
            <div>
              <p className="fr-text--sm fr-mb-0">
                <span className="fr-text--bold">
                  {data.effectif_sans_cpge.toLocaleString("fr-FR")} étudiants
                </span>{" "}
                <span className="fr-text-mention--grey">
                  ({data.anuniv} • {data.part_effectif_sans_cpge_dn.toFixed(1)}%
                  Diplômes nationaux)
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="fr-col-12 fr-col-md-6">
          {hasFormations && (
            <div>
              <p
                className="fr-text--sm fr-text--bold fr-mb-0"
                style={{
                  textTransform: "uppercase",
                  color: "var(--text-mention-grey)",
                }}
              >
                Formations
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {hasCursus && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      className="fr-text--xs fr-mb-1w"
                      style={{
                        color: "var(--text-mention-grey)",
                        minWidth: "65px",
                        fontWeight: 500,
                      }}
                    >
                      Cursus
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {data.has_effectif_l && <Badge size="sm">Licence</Badge>}
                      {data.has_effectif_m && <Badge size="sm">Master</Badge>}
                      {data.has_effectif_d && <Badge size="sm">Doctorat</Badge>}
                    </div>
                  </div>
                )}

                {hasFilieres && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      className="fr-text--xs fr-mb-1w"
                      style={{
                        color: "var(--text-mention-grey)",
                        minWidth: "65px",
                        fontWeight: 500,
                      }}
                    >
                      Filières
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {data.has_effectif_iut && <Badge size="sm">IUT</Badge>}
                      {data.has_effectif_ing && (
                        <Badge size="sm">Ingénieur</Badge>
                      )}
                    </div>
                  </div>
                )}

                {hasDisciplines && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      className="fr-text--xs fr-mb-1w"
                      style={{
                        color: "var(--text-mention-grey)",
                        minWidth: "65px",
                        fontWeight: 500,
                      }}
                    >
                      Disciplines
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {data.has_effectif_dsa && (
                        <Badge size="sm">Droit Éco AES</Badge>
                      )}
                      {data.has_effectif_llsh && (
                        <Badge size="sm">Lettres SHS</Badge>
                      )}
                      {data.has_effectif_theo && (
                        <Badge size="sm">Théologie</Badge>
                      )}
                      {data.has_effectif_si && (
                        <Badge size="sm">Sciences</Badge>
                      )}
                      {data.has_effectif_staps && (
                        <Badge size="sm">STAPS</Badge>
                      )}
                      {data.has_effectif_veto && (
                        <Badge size="sm">Vétérinaire</Badge>
                      )}
                      {data.has_effectif_sante && (
                        <Badge size="sm">Santé</Badge>
                      )}
                      {data.has_effectif_interd && (
                        <Badge size="sm">Interdisciplinaire</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
