interface PageHeaderProps {
  data: any;
  onClose: () => void;
}

// Style pour l'icône dans les cartes (cercle coloré) - utilise les variables DSFR
const iconStyle = (
  bgColor: string,
  textColor: string
): React.CSSProperties => ({
  width: "2.5rem",
  height: "2.5rem",
  minWidth: "2.5rem",
  borderRadius: "50%",
  backgroundColor: `var(${bgColor})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: `var(${textColor})`,
});

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
    data.has_effectif_sante_disc ||
    data.has_effectif_interd;

  const hasFormations = hasCursus || hasFilieres || hasDisciplines;

  const showActuelName =
    data.etablissement_actuel_lib &&
    data.etablissement_lib &&
    data.etablissement_lib !== data.etablissement_actuel_lib;

  return (
    <div className="page-header fr-mb-4w">
      <div className="fr-grid-row fr-grid-row--middle fr-grid-row--gutters fr-mb-2w">
        <div className="fr-col">
          <h1 className="fr-h4 fr-mb-0">
            {data.etablissement_lib || data.etablissement_actuel_lib}
          </h1>
          {showActuelName && (
            <p className="fr-text--sm fr-mb-0 fr-text-mention--grey">
              Actuellement : {data.etablissement_actuel_lib}
            </p>
          )}
          {data.etablissement_actuel_categorie && (
            <p className="fr-text--xs fr-mb-0 fr-text-mention--grey">
              {data.etablissement_actuel_categorie}
            </p>
          )}
        </div>
        <div className="fr-col-auto">
          <button
            className="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-arrow-go-back-line"
            onClick={onClose}
          >
            Changer d'établissement
          </button>
        </div>
      </div>

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col">
          <div className="fr-grid-row fr-grid-row--gutters">
            {data.effectif_sans_cpge && (
              <div className="fr-col-auto">
                <div
                  className="fr-card fr-card--shadow fr-px-3v fr-py-2w"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={iconStyle(
                        "--background-contrast-pink-tuile",
                        "--text-action-high-pink-tuile"
                      )}
                    >
                      <span className="fr-icon-team-fill" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="fr-text--lg fr-text--bold fr-mb-0">
                        {data.effectif_sans_cpge.toLocaleString("fr-FR")}{" "}
                        étudiants
                      </p>
                      <p className="fr-text--xs fr-mb-0 fr-text-mention--grey">
                        Inscrits en {data.anuniv} (
                        {data.part_effectif_sans_cpge_dn?.toFixed(1)}% DN)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="fr-col-auto">
              <div
                className="fr-card fr-card--shadow fr-px-3v fr-py-2w"
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={iconStyle(
                      "--background-contrast-green-emeraude",
                      "--text-action-high-green-emeraude"
                    )}
                  >
                    <span
                      className="fr-icon-map-pin-2-fill"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="fr-text--lg fr-text--bold fr-mb-0">
                      {data.commune}
                    </p>
                    <p className="fr-text--xs fr-mb-0 fr-text-mention--grey">
                      {data.region}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {data.nb_sites && (
              <div className="fr-col-auto">
                <div
                  className="fr-card fr-card--shadow fr-px-3v fr-py-2w"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={iconStyle(
                        "--background-contrast-yellow-tournesol",
                        "--text-action-high-yellow-tournesol"
                      )}
                    >
                      <span
                        className="fr-icon-building-fill"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="fr-text--lg fr-text--bold fr-mb-0">
                        {data.nb_sites}
                      </p>
                      <p className="fr-text--xs fr-mb-0 fr-text-mention--grey">
                        {data.nb_sites > 1 ? "Sites" : "Site"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {data.is_rce && (
              <div className="fr-col-auto">
                <div
                  className="fr-card fr-card--shadow fr-px-3v fr-py-2w"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={iconStyle(
                        "--background-contrast-blue-france",
                        "--text-action-high-blue-france"
                      )}
                    >
                      <span className="fr-icon-bank-fill" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="fr-text--lg fr-text--bold fr-mb-0">RCE</p>
                      <p className="fr-text--xs fr-mb-0 fr-text-mention--grey">
                        Responsabilités et compétences élargies
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {hasFormations && (
          <div className="fr-col-auto">
            <table style={{ borderCollapse: "collapse" }}>
              <tbody>
                {hasCursus && (
                  <tr>
                    <td
                      style={{
                        paddingRight: "1rem",
                        paddingBottom: "0.5rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <span className="fr-text--xs fr-text-mention--grey">
                        Cursus
                      </span>
                    </td>
                    <td
                      style={{
                        paddingBottom: "0.5rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {data.has_effectif_l && (
                          <span className="fr-tag fr-tag--sm">Licence</span>
                        )}
                        {data.has_effectif_m && (
                          <span className="fr-tag fr-tag--sm">Master</span>
                        )}
                        {data.has_effectif_d && (
                          <span className="fr-tag fr-tag--sm">Doctorat</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {hasFilieres && (
                  <tr>
                    <td
                      style={{
                        paddingRight: "1rem",
                        paddingBottom: "0.5rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <span className="fr-text--xs fr-text-mention--grey">
                        Filières
                      </span>
                    </td>
                    <td
                      style={{
                        paddingBottom: "0.5rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {data.has_effectif_iut && (
                          <span className="fr-tag fr-tag--sm">IUT</span>
                        )}
                        {data.has_effectif_ing && (
                          <span className="fr-tag fr-tag--sm">Ingénieur</span>
                        )}
                        {data.has_effectif_sante && (
                          <span className="fr-tag fr-tag--sm">Santé</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {hasDisciplines && (
                  <tr>
                    <td
                      style={{ paddingRight: "1rem", verticalAlign: "middle" }}
                    >
                      <span className="fr-text--xs fr-text-mention--grey">
                        Disciplines
                      </span>
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {data.has_effectif_dsa && (
                          <span className="fr-tag fr-tag--sm">Droit Éco</span>
                        )}
                        {data.has_effectif_llsh && (
                          <span className="fr-tag fr-tag--sm">Lettres SHS</span>
                        )}
                        {data.has_effectif_si && (
                          <span className="fr-tag fr-tag--sm">Sciences</span>
                        )}
                        {data.has_effectif_staps && (
                          <span className="fr-tag fr-tag--sm">STAPS</span>
                        )}
                        {data.has_effectif_theo && (
                          <span className="fr-tag fr-tag--sm">Théologie</span>
                        )}
                        {data.has_effectif_veto && (
                          <span className="fr-tag fr-tag--sm">Vétérinaire</span>
                        )}
                        {data.has_effectif_sante_disc && (
                          <span className="fr-tag fr-tag--sm">Santé</span>
                        )}
                        {data.has_effectif_interd && (
                          <span className="fr-tag fr-tag--sm">
                            Pluridisciplinaire
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
