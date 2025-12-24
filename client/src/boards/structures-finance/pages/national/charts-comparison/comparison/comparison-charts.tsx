import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import { Row, Col, Button } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { CHART_COLORS, DSFR_COLORS } from "../../../../constants/colors";

interface ComparisonChartsProps {
  data: any[];
  filters: {
    annee?: string;
    type?: string;
    typologie?: string;
    region?: string;
  };
}

const num = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";

export default function ComparisonCharts({
  data,
  filters,
}: ComparisonChartsProps) {
  const [chartType, setChartType] = useState<
    | "scsp"
    | "taux-encadrement"
    | "ressources"
    | "effectifs"
    | "taux-encadrement-niveaux"
  >("scsp");

  const etablissements = useMemo(
    () => data.map((d) => d.etablissement_actuel_lib || "Inconnu"),
    [data]
  );

  const scspChartOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: Math.max(400, data.length * 40),
        backgroundColor: "transparent",
      },
      title: {
        text: undefined,
      },
      exporting: {
        enabled: false,
      },
      xAxis: {
        categories: etablissements,
        labels: {
          style: {
            fontSize: "12px",
            color: "var(--text-default-grey)",
          },
        },
      },
      yAxis: {
        title: {
          text: "Montant (€)",
          style: {
            color: "var(--text-default-grey)",
          },
        },
        labels: {
          formatter: function () {
            return Highcharts.numberFormat(Number(this.value), 0, ",", " ");
          },
        },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const point = this as any;
          return `<div style="padding:10px">
                  <div style="font-weight:bold;margin-bottom:5px">${
                    point.x
                  }</div>
                  <div style="font-size:16px;font-weight:bold">${Highcharts.numberFormat(
                    point.y,
                    0,
                    ",",
                    " "
                  )} €</div>
                  </div>`;
        },
      },
      plotOptions: {
        bar: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return Highcharts.numberFormat(Number(this.y), 0, ",", " ");
            },
            style: {
              fontSize: "11px",
              fontWeight: "bold",
              textOutline: "none",
            },
          },
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "SCSP",
          type: "bar",
          data: data.map((d) => ({
            y: d.scsp || 0,
            color: CHART_COLORS.primary,
          })),
        },
      ],
    }),
    [data, etablissements]
  );

  const tauxEncadrementChartOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: Math.max(400, data.length * 40),
        backgroundColor: "transparent",
      },
      title: {
        text: undefined,
      },
      exporting: {
        enabled: false,
      },
      xAxis: {
        categories: etablissements,
        labels: {
          style: {
            fontSize: "12px",
            color: "var(--text-default-grey)",
          },
        },
      },
      yAxis: {
        title: {
          text: "Taux d'encadrement (%)",
          style: {
            color: "var(--text-default-grey)",
          },
        },
        labels: {
          formatter: function () {
            return `${this.value}%`;
          },
        },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const point = this as any;
          return `<div style="padding:10px">
                  <div style="font-weight:bold;margin-bottom:5px">${
                    point.x
                  }</div>
                  <div style="font-size:16px;font-weight:bold">${point.y.toFixed(
                    2
                  )}%</div>
                  </div>`;
        },
      },
      plotOptions: {
        bar: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return `${Number(this.y).toFixed(1)}%`;
            },
            style: {
              fontSize: "11px",
              fontWeight: "bold",
              textOutline: "none",
            },
          },
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Taux d'encadrement",
          type: "bar",
          data: data.map((d) => ({
            y: d.taux_encadrement || 0,
            color: CHART_COLORS.secondary,
          })),
        },
      ],
    }),
    [data, etablissements]
  );

  const ressourcesChartOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "column",
        height: 500,
        backgroundColor: "transparent",
      },
      title: {
        text: undefined,
      },
      exporting: {
        enabled: false,
      },
      xAxis: {
        categories: etablissements,
        labels: {
          rotation: -45,
          style: {
            fontSize: "11px",
            color: "var(--text-default-grey)",
          },
        },
      },
      yAxis: {
        title: {
          text: "Montant (€)",
          style: {
            color: "var(--text-default-grey)",
          },
        },
        labels: {
          formatter: function () {
            return Highcharts.numberFormat(Number(this.value), 0, ",", " ");
          },
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: "bold",
            color: "gray",
          },
          formatter: function () {
            return Highcharts.numberFormat(Number(this.total), 0, ",", " ");
          },
        },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const point = this as any;
          return `<div style="padding:10px">
                  <div style="font-weight:bold;margin-bottom:5px">${
                    point.x
                  }</div>
                  <div style="color:${point.color};font-weight:bold">${
            point.series.name
          }</div>
                  <div style="font-size:16px;font-weight:bold">${Highcharts.numberFormat(
                    point.y,
                    0,
                    ",",
                    " "
                  )} €</div>
                  </div>`;
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          borderWidth: 0,
          dataLabels: {
            enabled: false,
          },
        },
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "SCSP",
          type: "column",
          data: data.map((d) => d.scsp || 0),
          color: CHART_COLORS.primary,
        },
        {
          name: "Ressources propres",
          type: "column",
          data: data.map((d) => d.ressources_propres || 0),
          color: CHART_COLORS.secondary,
        },
      ],
    }),
    [data, etablissements]
  );

  const effectifsChartOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "column",
        height: 500,
        backgroundColor: "transparent",
      },
      title: {
        text: undefined,
      },
      exporting: {
        enabled: false,
      },
      xAxis: {
        categories: etablissements,
        labels: {
          rotation: -45,
          style: {
            fontSize: "11px",
            color: "var(--text-default-grey)",
          },
        },
      },
      yAxis: {
        title: {
          text: "Nombre d'étudiants",
          style: {
            color: "var(--text-default-grey)",
          },
        },
        labels: {
          formatter: function () {
            return Highcharts.numberFormat(Number(this.value), 0, ",", " ");
          },
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: "bold",
            color: "gray",
          },
          formatter: function () {
            return Highcharts.numberFormat(Number(this.total), 0, ",", " ");
          },
        },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const point = this as any;
          return `<div style="padding:10px">
                  <div style="font-weight:bold;margin-bottom:5px">${
                    point.x
                  }</div>
                  <div style="color:${point.color};font-weight:bold">${
            point.series.name
          }</div>
                  <div style="font-size:16px;font-weight:bold">${Highcharts.numberFormat(
                    point.y,
                    0,
                    ",",
                    " "
                  )} étudiants</div>
                  </div>`;
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          borderWidth: 0,
        },
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Licence",
          type: "column",
          data: data.map((d) => d.effectif_sans_cpge_l || 0),
          color: CHART_COLORS.primary,
        },
        {
          name: "Master",
          type: "column",
          data: data.map((d) => d.effectif_sans_cpge_m || 0),
          color: CHART_COLORS.secondary,
        },
        {
          name: "Doctorat",
          type: "column",
          data: data.map((d) => d.effectif_sans_cpge_d || 0),
          color: CHART_COLORS.tertiary,
        },
      ],
    }),
    [data, etablissements]
  );

  const groupedData = useMemo(() => {
    if (!data.length) return { categories: [], data: { l: [], m: [], d: [] } };

    const groupKey = filters.type
      ? "type_lib"
      : filters.typologie
      ? "type_d_etablissement"
      : filters.region
      ? "region_lib"
      : "type_lib";

    const grouped = data.reduce((acc: any, item: any) => {
      const key = item[groupKey] || "Non renseigné";
      if (!acc[key]) {
        acc[key] = {
          count: 0,
          totalEmplois: 0,
          totalL: 0,
          totalM: 0,
          totalD: 0,
          totalEffectifs: 0,
        };
      }
      acc[key].count++;
      acc[key].totalEmplois += item.emploi_etpt || 0;
      acc[key].totalL += item.effectif_sans_cpge_l || 0;
      acc[key].totalM += item.effectif_sans_cpge_m || 0;
      acc[key].totalD += item.effectif_sans_cpge_d || 0;
      acc[key].totalEffectifs += item.effectif_sans_cpge || 0;
      return acc;
    }, {});

    const categories = Object.keys(grouped);

    const dataL = categories.map((cat) => {
      const g = grouped[cat];
      if (g.totalEffectifs === 0) return 0;
      const tauxGlobal = (g.totalEmplois / g.totalEffectifs) * 100;
      return tauxGlobal;
    });
    const dataM = categories.map((cat) => {
      const g = grouped[cat];
      if (g.totalEffectifs === 0) return 0;
      const tauxGlobal = (g.totalEmplois / g.totalEffectifs) * 100;
      return tauxGlobal;
    });
    const dataD = categories.map((cat) => {
      const g = grouped[cat];
      if (g.totalEffectifs === 0) return 0;
      const tauxGlobal = (g.totalEmplois / g.totalEffectifs) * 100;
      return tauxGlobal;
    });

    return { categories, data: { l: dataL, m: dataM, d: dataD } };
  }, [data, filters]);

  const tauxEncadrementNiveauxChartOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "column",
        height: 500,
        backgroundColor: "transparent",
      },
      title: {
        text: undefined,
      },
      exporting: {
        enabled: false,
      },
      xAxis: {
        categories: groupedData.categories,
        labels: {
          rotation: -45,
          style: {
            fontSize: "11px",
            color: "var(--text-default-grey)",
          },
        },
      },
      yAxis: {
        title: {
          text: "Taux d'encadrement (%)",
          style: {
            color: "var(--text-default-grey)",
          },
        },
        labels: {
          formatter: function () {
            return `${this.value}%`;
          },
        },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const point = this as any;
          return `<div style="padding:10px">
                  <div style="font-weight:bold;margin-bottom:5px">${
                    point.x
                  }</div>
                  <div style="color:${point.color};font-weight:bold">${
            point.series.name
          }</div>
                  <div style="font-size:16px;font-weight:bold">${point.y.toFixed(
                    2
                  )}%</div>
                  </div>`;
        },
      },
      plotOptions: {
        column: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return `${Number(this.y).toFixed(1)}%`;
            },
            style: {
              fontSize: "10px",
              fontWeight: "bold",
              textOutline: "none",
            },
          },
        },
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Licence",
          type: "column",
          data: groupedData.data.l,
          color: CHART_COLORS.primary,
        },
        {
          name: "Master",
          type: "column",
          data: groupedData.data.m,
          color: CHART_COLORS.secondary,
        },
        {
          name: "Doctorat",
          type: "column",
          data: groupedData.data.d,
          color: CHART_COLORS.tertiary,
        },
      ],
    }),
    [groupedData]
  );

  const stats = useMemo(() => {
    if (!data.length) return null;

    const avgSCSP =
      data.reduce((sum, d) => sum + (d.scsp || 0), 0) / data.length;
    const avgTaux =
      data.reduce((sum, d) => sum + (d.taux_encadrement || 0), 0) / data.length;
    const totalEffectifs = data.reduce(
      (sum, d) => sum + (d.effectif_sans_cpge || 0),
      0
    );

    return {
      count: data.length,
      avgSCSP,
      avgTaux,
      totalEffectifs,
    };
  }, [data]);

  const getChartConfig = () => {
    switch (chartType) {
      case "scsp":
        return {
          options: scspChartOptions,
          title: "Comparaison des SCSP",
          comment: `Comparaison des Subventions pour charges de service public (SCSP) entre ${
            data.length
          } établissements pour l'année ${filters.annee || "toutes années"}.`,
          readingKey: `La moyenne des SCSP est de ${num(
            stats?.avgSCSP
          )} € pour les ${stats?.count} établissements sélectionnés.`,
        };
      case "taux-encadrement":
        return {
          options: tauxEncadrementChartOptions,
          title: "Comparaison des taux d'encadrement",
          comment: `Comparaison des taux d'encadrement (ratio emplois/étudiants) entre ${data.length} établissements.`,
          readingKey: `Le taux d'encadrement moyen est de ${stats?.avgTaux.toFixed(
            2
          )}% pour les établissements sélectionnés.`,
        };
      case "ressources":
        return {
          options: ressourcesChartOptions,
          title: "Comparaison SCSP et ressources propres",
          comment: `Comparaison des ressources financières (SCSP + ressources propres) entre ${data.length} établissements.`,
          readingKey: `Visualisation empilée des sources de financement pour chaque établissement.`,
        };
      case "effectifs":
        return {
          options: effectifsChartOptions,
          title: "Comparaison des effectifs par niveau",
          comment: `Répartition des effectifs étudiants par niveau (L/M/D) pour ${data.length} établissements.`,
          readingKey: `Total de ${num(
            stats?.totalEffectifs
          )} étudiants répartis dans les établissements sélectionnés.`,
        };
      case "taux-encadrement-niveaux":
        const groupLabel = filters.type
          ? "type"
          : filters.typologie
          ? "typologie"
          : filters.region
          ? "région"
          : "catégorie";
        return {
          options: tauxEncadrementNiveauxChartOptions,
          title: `Taux d'encadrement global par ${groupLabel}`,
          comment: `Taux d'encadrement global (emplois/effectifs totaux) regroupé par ${groupLabel}. Le même taux s'applique à tous les niveaux car les données d'emplois par niveau ne sont pas disponibles.`,
          readingKey: `Le taux d'encadrement représente le ratio (emplois / étudiants) × 100. Un taux de 15% signifie environ 1 emploi pour 6-7 étudiants.`,
        };
    }
  };

  const chartConfig = getChartConfig();

  return (
    <div>
      <Row className="fr-mb-3w">
        <Col>
          <div
            className="fr-p-2w"
            style={{
              backgroundColor: DSFR_COLORS.backgroundAlt,
              borderRadius: "8px",
              borderLeft: `4px solid ${CHART_COLORS.primary}`,
            }}
          >
            <h3 className="fr-h6 fr-mb-1w">Statistiques générales</h3>
            <Row gutters>
              <Col md="3">
                <strong>{stats?.count}</strong> établissement
                {(stats?.count || 0) > 1 ? "s" : ""}
              </Col>
              <Col md="3">
                SCSP moyen : <strong>{num(stats?.avgSCSP)} €</strong>
              </Col>
              <Col md="3">
                Taux encadrement moyen :{" "}
                <strong>{stats?.avgTaux.toFixed(2)}%</strong>
              </Col>
              <Col md="3">
                Total étudiants : <strong>{num(stats?.totalEffectifs)}</strong>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <div
        className="fr-mb-2w"
        style={{ display: "flex", gap: "1rem", alignItems: "center" }}
      >
        <h3
          className="fr-h5 fr-mb-0"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
            paddingLeft: "1rem",
            flex: 1,
          }}
        >
          Analyse comparative
        </h3>
        <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
          <Button
            size="sm"
            variant={chartType === "scsp" ? "primary" : "secondary"}
            onClick={() => setChartType("scsp")}
          >
            SCSP
          </Button>
          <Button
            size="sm"
            variant={chartType === "taux-encadrement" ? "primary" : "secondary"}
            onClick={() => setChartType("taux-encadrement")}
          >
            Encadrement
          </Button>
          <Button
            size="sm"
            variant={chartType === "ressources" ? "primary" : "secondary"}
            onClick={() => setChartType("ressources")}
          >
            Ressources
          </Button>
          <Button
            size="sm"
            variant={chartType === "effectifs" ? "primary" : "secondary"}
            onClick={() => setChartType("effectifs")}
          >
            Effectifs
          </Button>
          <Button
            size="sm"
            variant={
              chartType === "taux-encadrement-niveaux" ? "primary" : "secondary"
            }
            onClick={() => setChartType("taux-encadrement-niveaux")}
          >
            Taux enca. groupé
          </Button>
        </div>
      </div>

      <ChartWrapper
        config={{
          id: `comparison-${chartType}-chart`,
          idQuery: `comparison-${chartType}`,
          title: {
            className: "fr-mt-0w",
            look: "h5",
            size: "h3",
            fr: chartConfig?.title || "",
          },
          comment: { fr: <>{chartConfig?.comment || ""}</> },
          readingKey: { fr: <>{chartConfig?.readingKey || ""}</> },
          updateDate: new Date(),
          integrationURL: "/integration-url",
        }}
        options={chartConfig?.options || {}}
        legend={null}
      />
    </div>
  );
}
