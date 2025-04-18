import { Title, Link, Badge } from "@dataesr/dsfr-plus";
import { CNUGroup } from "../../../types";

interface CnuGroupsTableProps {
  cnuGroups: CNUGroup[];
}

export default function CnuGroupsTable({ cnuGroups }: CnuGroupsTableProps) {
  if (!cnuGroups.length) {
    return <p>Aucune donnée disponible pour les groupes CNU</p>;
  }

  return (
    <>
      <Title as="h4" look="h6">
        Effectifs par groupe CNU
      </Title>
      <table className="fr-table fr-table--sm fr-table--bordered">
        <thead>
          <tr>
            <th scope="col">Groupe CNU</th>
            <th scope="col">Discipline</th>
            <th scope="col" className="text-center">
              Hommes
            </th>
            <th scope="col" className="text-center">
              Femmes
            </th>
            <th scope="col" className="text-center">
              Total
            </th>
            <th scope="col" className="text-center">
              Répartition H/F
            </th>
          </tr>
        </thead>
        <tbody>
          {cnuGroups.map((group) => {
            const malePercent = Math.round(
              (group.maleCount / group.totalCount) * 100
            );
            const femalePercent = 100 - malePercent;

            return (
              <tr key={group.cnuGroupId}>
                <td>
                  <strong>{group.cnuGroupLabel}</strong>
                  <br />
                  <small className="text-grey">Groupe {group.cnuGroupId}</small>
                </td>
                <td>
                  <Link
                    href={`/personnel-enseignant/discipline/vue-d'ensemble/${group.fieldId}`}
                  >
                    {group.fieldLabel}
                  </Link>
                </td>
                <td className="text-center">
                  {group.maleCount.toLocaleString()}
                </td>
                <td className="text-center">
                  {group.femaleCount.toLocaleString()}
                </td>
                <td className="text-center">
                  {group.totalCount.toLocaleString()}
                </td>
                <td className="text-center">
                  <div className="progress-container">
                    <div
                      className="progress-bar male"
                      style={{ width: `${malePercent}%` }}
                    ></div>
                    <div
                      className="progress-bar female"
                      style={{ width: `${femalePercent}%` }}
                    ></div>
                  </div>
                  <small>
                    <Badge>
                      {malePercent}% / {femalePercent}%
                    </Badge>{" "}
                  </small>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
