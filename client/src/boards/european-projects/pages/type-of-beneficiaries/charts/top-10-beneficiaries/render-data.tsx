import { getI18nLabel as getI18nLabelFromUtils } from "../../../../../../utils";
import i18n from "./i18n.json";
import globalI18n from "../../../../i18n-global.json";

function TableWrapper({ children }) {
  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="table-bordered">{children}</table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RenderData(data, currentLang = "fr") {
  function getI18nLabel(key) {
    return i18n[key]?.[currentLang] || getI18nLabelFromUtils(globalI18n, key);
  }

  // Vérifier que nous avons des données
  if (!data || !data.data || !Array.isArray(data.data)) {
    return null;
  }

  // Créer un tableau des données combinées à partir des données MongoDB
  const tableData = data.data.map((country) => {
    // Récupérer les montants par type d'entité depuis la structure MongoDB
    const getAmountByType = (typeCode) => {
      const typeData = country.types.find((type) => type.cordis_type_entity_code === typeCode);
      return typeData ? typeData.total_fund_eur : 0;
    };

    const REC = getAmountByType("REC");
    const PUB = getAmountByType("PUB");
    const PRC = getAmountByType("PRC");
    const HES = getAmountByType("HES");
    const OTH = getAmountByType("OTH");

    return {
      country_code: country.country_code,
      country_name: country[`country_name_${currentLang}`] || country.country_name_fr,
      REC,
      PUB,
      PRC,
      HES,
      OTH,
      total: country.total_fund_eur || REC + PUB + PRC + HES + OTH,
    };
  });

  // Formater les montants en millions d'euros (les données sont déjà en euros, on divise par 1M)
  const formatAmount = (amount) => {
    const amountInMillions = amount / 1000000;
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", {
      style: "decimal",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amountInMillions);
  };

  return (
    <TableWrapper>
      <thead>
        <tr>
          <th>{getI18nLabel("country")}</th>
          <th>{getI18nLabel("REC")} (M€)</th>
          <th>{getI18nLabel("PUB")} (M€)</th>
          <th>{getI18nLabel("PRC")} (M€)</th>
          <th>{getI18nLabel("HES")} (M€)</th>
          <th>{getI18nLabel("OTH")} (M€)</th>
          <th>{getI18nLabel("total")}</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={row.country_code || index}>
            <td>
              <strong>{row.country_name}</strong>
            </td>
            <td>{formatAmount(row.REC)}</td>
            <td>{formatAmount(row.PUB)}</td>
            <td>{formatAmount(row.PRC)}</td>
            <td>{formatAmount(row.HES)}</td>
            <td>{formatAmount(row.OTH)}</td>
            <td>
              <strong>{formatAmount(row.total)}</strong>
            </td>
          </tr>
        ))}
      </tbody>
    </TableWrapper>
  );
}
