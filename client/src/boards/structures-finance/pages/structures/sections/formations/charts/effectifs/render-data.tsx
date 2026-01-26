const num = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";
const pct = (n?: number) => (n != null ? `${n.toFixed(2)} %` : "—");

interface RenderDataNiveauProps {
  data: any;
}

export function RenderDataNiveau({ data }: RenderDataNiveauProps) {
  const niveaux = [
    {
      name: "Licence",
      effectif: data.effectif_sans_cpge_l || 0,
      percentage: data.part_effectif_sans_cpge_l || 0,
      has: data.has_effectif_l,
    },
    {
      name: "Master",
      effectif: data.effectif_sans_cpge_m || 0,
      percentage: data.part_effectif_sans_cpge_m || 0,
      has: data.has_effectif_m,
    },
    {
      name: "Doctorat",
      effectif: data.effectif_sans_cpge_d || 0,
      percentage: data.part_effectif_sans_cpge_d || 0,
      has: data.has_effectif_d,
    },
  ].filter((item) => item.has);

  if (niveaux.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="effectifs-niveau-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "70%" }}>Niveau</th>
                  <th style={{ width: "20%" }}>Effectif</th>
                  <th style={{ width: "10%" }}>Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                {niveaux.map((niveau, index) => (
                  <tr key={index}>
                    <td>{niveau.name}</td>
                    <td>{num(niveau.effectif)}</td>
                    <td>{pct(niveau.percentage)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold" }}>
                  <td>Total</td>
                  <td>{num(data.effectif_sans_cpge)}</td>
                  <td>100 %</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RenderDataDegreesProps {
  data: any;
}

export function RenderDataDegrees({ data }: RenderDataDegreesProps) {
  const degrees = [
    {
      name: "BAC ou inférieur",
      effectif: data.effectif_sans_cpge_deg0 || 0,
    },
    {
      name: "BAC + 1",
      effectif: data.effectif_sans_cpge_deg1 || 0,
    },
    {
      name: "BAC + 2",
      effectif: data.effectif_sans_cpge_deg2 || 0,
    },
    {
      name: "BAC + 3",
      effectif: data.effectif_sans_cpge_deg3 || 0,
    },
    {
      name: "BAC + 4",
      effectif: data.effectif_sans_cpge_deg4 || 0,
    },
    {
      name: "BAC + 5",
      effectif: data.effectif_sans_cpge_deg5 || 0,
    },
    {
      name: "BAC + 6 et plus",
      effectif: data.effectif_sans_cpge_deg6 || 0,
    },
    {
      name: "Non renseigné",
      effectif: data.effectif_sans_cpge_deg9 || 0,
    },
  ].filter((item) => item.effectif > 0);

  if (degrees.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const total = degrees.reduce((sum, item) => sum + item.effectif, 0);

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="effectifs-degrees-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "100%" }}>Degré d'étude</th>
                  <th>Effectif</th>
                </tr>
              </thead>
              <tbody>
                {degrees.map((degree, index) => (
                  <tr key={index}>
                    <td>{degree.name}</td>
                    <td>{num(degree.effectif)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold" }}>
                  <td>Total</td>
                  <td>{num(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RenderDataSpecifiquesProps {
  data: any;
}

export function RenderDataSpecifiques({ data }: RenderDataSpecifiquesProps) {
  const specifiques = [
    {
      name: "IUT",
      effectif: data.effectif_sans_cpge_iut || 0,
      has: data.has_effectif_iut,
    },
    {
      name: "Ingénieur",
      effectif: data.effectif_sans_cpge_ing || 0,
      has: data.has_effectif_ing,
    },
    {
      name: "Santé",
      effectif: data.effectif_sans_cpge_sante || 0,
      has: data.has_effectif_sante,
    },
  ].filter((item) => item.has && item.effectif > 0);

  if (specifiques.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const total = specifiques.reduce((sum, item) => sum + item.effectif, 0);

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="effectifs-specifiques-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "100%" }}>Filière</th>
                  <th>Effectif</th>
                </tr>
              </thead>
              <tbody>
                {specifiques.map((filiere, index) => (
                  <tr key={index}>
                    <td>{filiere.name}</td>
                    <td>{num(filiere.effectif)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold" }}>
                  <td>Total</td>
                  <td>{num(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RenderDataDisciplinesProps {
  data: any;
}

export function RenderDataDisciplines({ data }: RenderDataDisciplinesProps) {
  const disciplines = [
    {
      name: "Droit, Sciences Éco, AES",
      effectif: data.effectif_sans_cpge_dsa || 0,
      percentage: data.part_effectif_sans_cpge_dsa || 0,
      has: data.has_effectif_dsa,
    },
    {
      name: "Lettres, Langues, SHS",
      effectif: data.effectif_sans_cpge_llsh || 0,
      percentage: data.part_effectif_sans_cpge_llsh || 0,
      has: data.has_effectif_llsh,
    },
    {
      name: "Théologie",
      effectif: data.effectif_sans_cpge_theo || 0,
      percentage: data.part_effectif_sans_cpge_theo || 0,
      has: data.has_effectif_theo,
    },
    {
      name: "Sciences et Ingénierie",
      effectif: data.effectif_sans_cpge_si || 0,
      percentage: data.part_effectif_sans_cpge_si || 0,
      has: data.has_effectif_si,
    },
    {
      name: "STAPS",
      effectif: data.effectif_sans_cpge_staps || 0,
      percentage: data.part_effectif_sans_cpge_staps || 0,
      has: data.has_effectif_staps,
    },
    {
      name: "Santé",
      effectif: data.effectif_sans_cpge_sante || 0,
      percentage: data.part_effectif_sans_cpge_sante || 0,
      has: data.has_effectif_sante,
    },
    {
      name: "Vétérinaire",
      effectif: data.effectif_sans_cpge_veto || 0,
      percentage: data.part_effectif_sans_cpge_veto || 0,
      has: data.has_effectif_veto,
    },
    {
      name: "Interdisciplinaire",
      effectif: data.effectif_sans_cpge_interd || 0,
      percentage: data.part_effectif_sans_cpge_interd || 0,
      has: data.has_effectif_interd,
    },
  ].filter((item) => item.has && item.effectif > 0);

  if (disciplines.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="effectifs-disciplines-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "70%" }}>Discipline</th>
                  <th style={{ width: "20%" }}>Effectif</th>
                  <th style={{ width: "10%" }}>Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                {disciplines.map((discipline, index) => (
                  <tr key={index}>
                    <td>{discipline.name}</td>
                    <td>{num(discipline.effectif)}</td>
                    <td>{pct(discipline.percentage)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold" }}>
                  <td>Total</td>
                  <td>{num(data.effectif_sans_cpge)}</td>
                  <td>100 %</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
