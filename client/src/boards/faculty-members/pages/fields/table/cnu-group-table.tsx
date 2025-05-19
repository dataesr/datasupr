type AgeGroup = {
  count: number;
  percent: number | string;
};

type AgeDistribution = {
  younger_35?: AgeGroup;
  middle_36_55?: AgeGroup;
  older_56?: AgeGroup;
};

type CnuGroup = {
  cnuGroupId: string | number;
  cnuGroupLabel: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
  ageDistribution?: AgeDistribution;
};

type CnuGroupsTableProps = {
  cnuGroups: Array<CnuGroup>;
  showAgeDemographics?: boolean;
};
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
          const malePercent = Math.round(
            (group.maleCount / group.totalCount) * 100
          );
          console.log(group);
          const femalePercent = 100 - malePercent;

          return (
            <tr key={group.cnuGroupId}>
              <td>
                <strong>{group.cnuGroupLabel}</strong>
                <br />
                <small className="text-grey">{group.cnuGroupId}</small>
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
                  {malePercent}% / {femalePercent}%
                </small>
              </td>
              {showAgeDemographics && group.ageDistribution && (
                <>
                  <td className="text-center">
                    {group.ageDistribution.younger_35?.count.toLocaleString()}
                    <br />
                    <small>{group.ageDistribution.younger_35?.percent}%</small>
                  </td>
                  <td className="text-center">
                    {group.ageDistribution.middle_36_55?.count.toLocaleString()}
                    <br />
                    <small>
                      {group.ageDistribution.middle_36_55?.percent}%
                    </small>
                  </td>
                  <td className="text-center">
                    {group.ageDistribution.older_56?.count.toLocaleString()}
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
