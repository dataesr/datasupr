import { getI18nLabel } from "../../../../../../utils";
import i18n from "../../../../i18n-global.json";

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
  // Vérifier que nous avons des données
  if (!data || !data.countries || !Array.isArray(data.countries) || !data.years) {
    return null;
  }

  const { countries, years, entity_type } = data;

  // Formater les montants en millions d'euros (les données sont déjà en euros, on divise par 1M)
  const formatAmount = (amount) => {
    const amountInMillions = amount / 1000000;
    return new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", {
      style: "decimal",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amountInMillions);
  };

  // Traduction des types d'entités
  const getEntityTypeLabel = (entityType) => {
    const labels = {
      REC: getI18nLabel(i18n, "REC"),
      PUB: getI18nLabel(i18n, "PUB"),
      PRC: getI18nLabel(i18n, "PRC"),
      HES: getI18nLabel(i18n, "HES"),
      OTH: getI18nLabel(i18n, "OTH"),
    };
    return labels[entityType] || entityType;
  };

  // Calculer le total pour chaque pays sur toutes les années
  const countriesWithTotals = countries.map((country) => {
    const total = country.evolution.reduce((sum, yearData) => sum + yearData.total_fund_eur, 0);
    return {
      ...country,
      totalAcrossYears: total,
    };
  });

  // Trier les pays par total décroissant
  const sortedCountries = countriesWithTotals.sort((a, b) => b.totalAcrossYears - a.totalAcrossYears);

  return (
    <div>
      <div className="fr-mb-2w">
        <p>
          <strong>
            {getI18nLabel(i18n, "type-of-entity-evolution")} :{getEntityTypeLabel(entity_type)}
          </strong>
        </p>
      </div>

      <TableWrapper>
        <thead>
          <tr>
            <th>{getI18nLabel(i18n, "country")}</th>
            {years.map((year) => (
              <th key={year}>{year} (M€)</th>
            ))}
            <th>
              <strong>{getI18nLabel(i18n, "total")}</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCountries.map((country, index) => {
            // Créer un map des années pour un accès rapide
            const yearDataMap = {};
            country.evolution.forEach((yearData) => {
              yearDataMap[yearData.year] = yearData.total_fund_eur;
            });

            return (
              <tr key={country.country_code || index}>
                <td>
                  <strong>{country[`country_name_${currentLang}`] || country.country_name_fr || country.country_code}</strong>
                </td>
                {years.map((year) => (
                  <td key={year}>{formatAmount(yearDataMap[year] || 0)}</td>
                ))}
                <td>
                  <strong>{formatAmount(country.totalAcrossYears)}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableWrapper>
    </div>
  );
}
