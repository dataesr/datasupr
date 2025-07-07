import { Badge, Link } from "@dataesr/dsfr-plus";
import { useFacultyMembersResearchTeachers } from "../../../api/use-research-teachers";
import { useSearchParams } from "react-router-dom";
import { formatToPercent } from "../../../../../utils/format";

interface ResearchTeachersOverviewTableProps {
  context: "fields" | "geo" | "structures";
  annee_universitaire?: string;
  contextId?: string;
}

interface BaseItem {
  maleCount: number;
  femaleCount: number;
  totalCount: number;
}

interface FieldItem extends BaseItem {
  field_id: string;
  fieldLabel: string;
}

interface RegionItem extends BaseItem {
  geo_id: string;
  regionName: string;
}

interface StructureItem extends BaseItem {
  structure_id: string;
  structureName: string;
}

type TableItem = FieldItem | RegionItem | StructureItem;

export default function ResearchTeachersOverviewTable({
  context,
  annee_universitaire,
  contextId,
}: ResearchTeachersOverviewTableProps) {
  const [searchParams] = useSearchParams();

  const {
    data: researchTeachersData,
    isLoading,
    error,
  } = useFacultyMembersResearchTeachers({
    context,
    annee_universitaire,
    contextId,
  });

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement des données d'enseignants-chercheurs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fr-alert fr-alert--error">
        <p>Erreur lors du chargement des données : {error.message}</p>
      </div>
    );
  }

  if (!researchTeachersData) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune donnée d'enseignants-chercheurs disponible.</p>
      </div>
    );
  }

  let items: TableItem[] = [];
  let itemType = "";
  let linkBase = "";

  switch (context) {
    case "fields":
      items = (researchTeachersData.fields || []) as FieldItem[];
      itemType = "discipline";
      linkBase = "/personnel-enseignant/discipline/enseignants-chercheurs";
      break;
    case "geo":
      items = (researchTeachersData.regions || []) as RegionItem[];
      itemType = "région";
      linkBase = "/personnel-enseignant/geo/enseignants-chercheurs";
      break;
    case "structures":
      items = (researchTeachersData.structures || []) as StructureItem[];
      itemType = "établissement";
      linkBase = "/personnel-enseignant/universite/enseignants-chercheurs";
      break;
  }

  if (items.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune donnée disponible pour les {itemType}s.</p>
      </div>
    );
  }

  const getItemName = (item: TableItem): string => {
    switch (context) {
      case "fields":
        return (item as FieldItem).fieldLabel;
      case "geo":
        return (item as RegionItem).regionName;
      case "structures":
        return (item as StructureItem).structureName;
      default:
        return "Inconnu";
    }
  };

  const getItemId = (item: TableItem): string => {
    switch (context) {
      case "fields":
        return (item as FieldItem).field_id;
      case "geo":
        return (item as RegionItem).geo_id;
      case "structures":
        return (item as StructureItem).structure_id;
      default:
        return "";
    }
  };

  const getItemCode = (item: TableItem): string => {
    switch (context) {
      case "fields":
        return (item as FieldItem).field_id;
      case "geo":
        return (item as RegionItem).geo_id;
      case "structures":
        return (item as StructureItem).structure_id;
      default:
        return "";
    }
  };

  const generateItemLink = (item: TableItem): string => {
    const currentParams = new URLSearchParams(searchParams);

    switch (context) {
      case "fields":
        currentParams.set("field_id", getItemId(item));
        break;
      case "geo":
        currentParams.set("geo_id", getItemId(item));
        break;
      case "structures":
        currentParams.set("structure_id", getItemId(item));
        break;
    }

    return `${linkBase}?${currentParams.toString()}`;
  };

  return (
    <table className="fr-table fr-table--bordered" style={{ width: "90%" }}>
      <thead>
        <tr>
          <th scope="col">
            {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </th>
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
        {items.map((item) => {
          const malePercent =
            item.totalCount > 0
              ? Math.round((item.maleCount / item.totalCount) * 100)
              : 0;
          const femalePercent = 100 - malePercent;

          return (
            <tr key={getItemId(item)}>
              <td>
                <Link href={generateItemLink(item)}>
                  <strong>{getItemName(item)}</strong>
                  <br />
                  <small className="text-grey">{getItemCode(item)}</small>
                </Link>
              </td>
              <td className="text-center">{item.maleCount.toLocaleString()}</td>
              <td className="text-center">
                {item.femaleCount.toLocaleString()}
              </td>
              <td className="text-center">
                {item.totalCount.toLocaleString()}
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
                    {formatToPercent(malePercent)} /{" "}
                    {formatToPercent(femalePercent)}
                  </Badge>
                </small>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
