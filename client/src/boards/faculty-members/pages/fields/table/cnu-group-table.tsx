import { CnuGroupsTableProps } from "../types";

export default function CnuGroupsTable({
  cnuGroups,
  showAgeDemographics = true,
}: CnuGroupsTableProps) {
  return (
    <table className="fr-table fr-table--bordered">
      <thead>
        <tr>
          <th scope="col">Groupe CNU</th>
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
          {showAgeDemographics && (
            <>
              <th scope="col" className="text-center">
                ≤ 35 ans
              </th>
              <th scope="col" className="text-center">
                36-55 ans
              </th>
              <th scope="col" className="text-center">
                ≥ 56 ans
              </th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {cnuGroups.map((group) => {
          const maleCount = group.maleCount ?? group.numberMan ?? 0;
          const femaleCount = group.femaleCount ?? group.numberWoman ?? 0;
          const totalCount = group.totalCount ?? maleCount + femaleCount;
          const groupId = group.cnuGroupId ?? group.cnu_group_id ?? "";
          const groupLabel = group.cnuGroupLabel ?? group.cnu_group_label ?? "";

          const malePercent =
            totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0;
          const femalePercent = 100 - malePercent;

          return (
            <tr key={groupId}>
              <td>
                <strong>{groupLabel}</strong>
                <br />
                <small className="text-grey">{groupId}</small>
              </td>
              <td className="text-center">{maleCount.toLocaleString()}</td>
              <td className="text-center">{femaleCount.toLocaleString()}</td>
              <td className="text-center">{totalCount.toLocaleString()}</td>
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
                  {malePercent}% / {femalePercent}%
                </small>
              </td>
              {showAgeDemographics && group.ageDistribution && (
                <>
                  <td className="text-center">
                    {group.ageDistribution.younger_35?.count.toLocaleString() ||
                      "N/A"}
                    <br />
                    <small>{group.ageDistribution.younger_35?.percent}%</small>
                  </td>
                  <td className="text-center">
                    {group.ageDistribution.middle_36_55?.count.toLocaleString() ||
                      "N/A"}
                    <br />
                    <small>
                      {group.ageDistribution.middle_36_55?.percent}%
                    </small>
                  </td>
                  <td className="text-center">
                    {group.ageDistribution.older_56?.count.toLocaleString() ||
                      "N/A"}
                    <br />
                    <small>{group.ageDistribution.older_56?.percent}%</small>
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
