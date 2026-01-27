const FINANCE_DATASET_ENDPOINT =
  "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_esr_datasupr_finance/records";

const PAGE_SIZE = 100;

//  * Transforme un objet JS en clause WHERE pour l'API ODS
//  * exmemple : buildWhereClause({ exercice: "2024", type: "Université" })

function buildWhereClause(filters) {
  const conditions = [];
  for (const [fieldName, fieldValue] of Object.entries(filters)) {
    if (fieldValue == null) continue;
    if (fieldName === "$or") {
      const orConditions = fieldValue.map((condition) => {
        const [field, value] = Object.entries(condition)[0];
        return `\`${field}\`="${value}"`;
      });
      conditions.push(`(${orConditions.join(" OR ")})`);
    } else if (typeof fieldValue === "object" && fieldValue.$ne !== undefined) {
      conditions.push(`\`${fieldName}\` IS NOT NULL`);
    } else {
      conditions.push(`\`${fieldName}\`="${fieldValue}"`);
    }
  }
  //   Renvoit la clause WHERE complète ou une chaîne vide
  return conditions.join(" AND ");
}

//  * Récupère les objects depuis l'API ODS (max 100 par défaut)
//  * exemple fetchRecords({ select: ["etablissement_id"], where: { exercice: "2024" }, limit: 10 })

async function fetchRecords({
  select,
  where = {},
  groupBy,
  orderBy,
  limit = PAGE_SIZE,
  offset = 0,
}) {
  const queryParams = new URLSearchParams();
  if (select?.length) queryParams.set("select", select.join(","));
  const whereClause = buildWhereClause(where);
  if (whereClause) queryParams.set("where", whereClause);
  if (groupBy?.length) queryParams.set("group_by", groupBy.join(","));
  if (orderBy) queryParams.set("order_by", orderBy);
  queryParams.set("limit", limit);
  queryParams.set("offset", offset);

  const response = await fetch(`${FINANCE_DATASET_ENDPOINT}?${queryParams}`, {
    headers: { Authorization: `Apikey ${process.env.ODS_API_KEY}` },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`ODS API error: ${response.status} - ${errorBody}`);
  }

  const jsonResponse = await response.json();
  //   Renvoit les 100 premiers résultats
  return jsonResponse.results || [];
}

//  * Récupère TOUS les résultats en paginant automatiquement (100 par 100)
//  * exemple fetchAllRecords({ where: { exercice: "2024" } })

async function fetchAllRecords(options) {
  const allRecords = [];
  let currentOffset = 0;
  while (true) {
    const pageRecords = await fetchRecords({
      ...options,
      limit: PAGE_SIZE,
      offset: currentOffset,
    });
    allRecords.push(...pageRecords);
    if (pageRecords.length < PAGE_SIZE) break;
    currentOffset += PAGE_SIZE;
  }
  //   Renvoit l'ensemble des résultats (plusieurs pages)
  return allRecords;
}

//  * Retourne les valeurs uniques d'un champ (équivalent SQL DISTINCT)
//  * exemple getDistinctValues("Etablissement_id", { exercice: "2024" })
//  *          → ["12341", "43123", "43123", ...]
async function getDistinctValues(fieldName, filters = {}) {
  const records = await fetchAllRecords({
    select: [fieldName],
    where: filters,
    groupBy: [fieldName],
    orderBy: `${fieldName} ASC`,
  });
  //   Renvoit la liste des valeurs distinctes non nulles
  return records.map((record) => record[fieldName]).filter(Boolean);
}

export { fetchRecords, fetchAllRecords, getDistinctValues };

// En gros
// JE VEUX Les données des établissements	:
// fetchRecords quand j'ai un id
// JE VEUX les données de tous les établissements	:
// fetchAllRecords quand je n'ai pas d'id
// JE VEUX les années disponibles	:
// getDistinctValues

// TOUTE LA DOC https://help.opendatasoft.com/apis/ods-explore-v2/#section/Introduction/Base-URL
