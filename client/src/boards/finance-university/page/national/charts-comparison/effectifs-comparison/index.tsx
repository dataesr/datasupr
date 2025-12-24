import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import { Row, Col, Button } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { CHART_COLORS, DSFR_COLORS } from "../../../../constants/colors";

interface EffectifsComparisonProps {
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
const pct = (n?: number) => (n != null ? `${n.toFixed(2)} %` : "—");

export default function EffectifsComparison({
  data,
}: EffectifsComparisonProps) {
  const [viewType, setViewType] = useState<
    "niveau" | "filiere" | "encadrement" | "ratio"
  >("niveau");

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => (b.effectif_sans_cpge || 0) - (a.effectif_sans_cpge || 0)
    );
  }, [data]);

  const etablissements = useMemo(
    () => sortedData.map((d) => d.etablissement_actuel_lib || "Inconnu"),
    [sortedData]
  );

  const niveauOptions: Highcharts.Options = useMemo(
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
            fontSize: "10px",
          },
          formatter: function () {
            return Highcharts.numberFormat(Number(this.total), 0, ",", " ");
          },
        },
      },
      tooltip: {
        useHTML: true,
        shared: true,
        formatter: function () {
          const points = this.points || [];
          let html = `<div style="padding:10px">
                      <div style="font-weight:bold;margin-bottom:8px;font-size:13px">${this.x}</div>`;

          points.forEach((point) => {
            html += `<div style="margin-bottom:4px">
                      <span style="color:${point.color};font-size:18px">●</span>
                      <strong>${point.series.name}:</strong> 
                      ${Highcharts.numberFormat(point.y || 0, 0, ",", " ")} 
                      étudiants
                    </div>`;
          });

          const total =
            points.reduce((sum, p) => sum + (p.y || 0), 0) || this.y || 0;
          html += `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border-default-grey)">
                    <strong>Total:</strong> ${Highcharts.numberFormat(
                      total,
                      0,
                      ",",
                      " "
                    )} étudiants
                  </div></div>`;
          return html;
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
          data: sortedData.map((d) => d.effectif_sans_cpge_l || 0),
          color: CHART_COLORS.primary,
        },
        {
          name: "Master",
          type: "column",
          data: sortedData.map((d) => d.effectif_sans_cpge_m || 0),
          color: CHART_COLORS.secondary,
        },
        {
          name: "Doctorat",
          type: "column",
          data: sortedData.map((d) => d.effectif_sans_cpge_d || 0),
          color: CHART_COLORS.tertiary,
        },
      ],
    }),
    [sortedData, etablissements]
  );

  const filiereOptions: Highcharts.Options = useMemo(() => {
    const filieres = [
      { key: "iut", label: "IUT", color: CHART_COLORS.primary },
      { key: "ing", label: "Ingénieur", color: CHART_COLORS.secondary },
      { key: "si", label: "Sciences", color: CHART_COLORS.palette[6] },
      { key: "llsh", label: "LLSH", color: CHART_COLORS.palette[2] },
      { key: "sante", label: "Santé", color: CHART_COLORS.quaternary },
      { key: "staps", label: "STAPS", color: CHART_COLORS.palette[7] },
    ];

    const series = filieres
      .map((filiere) => ({
        name: filiere.label,
        type: "column" as const,
        data: sortedData.map(
          (d) => d[`effectif_sans_cpge_${filiere.key}`] || 0
        ),
        color: filiere.color,
      }))
      .filter((s) => s.data.some((v) => v > 0));

    return {
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
      },
      tooltip: {
        useHTML: true,
        shared: true,
        formatter: function () {
          const points = this.points || [];
          let html = `<div style="padding:10px">
                      <div style="font-weight:bold;margin-bottom:8px;font-size:13px">${this.x}</div>`;

          points.forEach((point) => {
            if (point.y && point.y > 0) {
              html += `<div style="margin-bottom:4px">
                        <span style="color:${
                          point.color
                        };font-size:18px">●</span>
                        <strong>${point.series.name}:</strong> 
                        ${Highcharts.numberFormat(point.y, 0, ",", " ")} 
                        étudiants
                      </div>`;
            }
          });

          html += `</div>`;
          return html;
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
      series,
    };
  }, [sortedData, etablissements]);

  const encadrementOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: Math.max(400, sortedData.length * 40),
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
                  <div style="font-size:16px;font-weight:bold;margin-bottom:5px">${point.y.toFixed(
                    2
                  )}%</div>
                  <div style="color:var(--text-default-grey);font-size:12px">Taux d'encadrement</div>
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
          data: sortedData.map((d) => ({
            y: d.taux_encadrement || 0,
            color: CHART_COLORS.secondary,
          })),
        },
      ],
    }),
    [sortedData, etablissements]
  );

  const ratioOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "scatter",
        height: 500,
        backgroundColor: "transparent",
        zoomType: "xy",
      },
      title: {
        text: undefined,
      },
      exporting: {
        enabled: false,
      },
      xAxis: {
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
        gridLineWidth: 1,
      },
      yAxis: {
        title: {
          text: "Emplois ETPT",
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
                  <div style="font-weight:bold;margin-bottom:8px">${
                    point.name
                  }</div>
                  <div style="margin-bottom:4px"><strong>Étudiants:</strong> ${Highcharts.numberFormat(
                    point.x,
                    0,
                    ",",
                    " "
                  )}</div>
                  <div style="margin-bottom:4px"><strong>Emplois ETPT:</strong> ${Highcharts.numberFormat(
                    point.y,
                    0,
                    ",",
                    " "
                  )}</div>
                  <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border-default-grey)">
                    <strong>Taux d'encadrement:</strong> ${point.taux.toFixed(
                      2
                    )}%
                  </div>
                  </div>`;
        },
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 6,
            symbol: "circle",
            states: {
              hover: {
                enabled: true,
                lineColor: "rgb(100,100,100)",
              },
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
          name: "Établissements",
          type: "scatter",
          data: sortedData.map((d) => ({
            x: d.effectif_sans_cpge || 0,
            y: d.emploi_etpt || 0,
            name: d.etablissement_actuel_lib,
            taux: d.taux_encadrement || 0,
            color: CHART_COLORS.quaternary,
          })),
        },
      ],
    }),
    [sortedData]
  );

  const stats = useMemo(() => {
    if (!sortedData.length) return null;

    const totalEtudiants = sortedData.reduce(
      (sum, d) => sum + (d.effectif_sans_cpge || 0),
      0
    );
    const totalETPT = sortedData.reduce(
      (sum, d) => sum + (d.emploi_etpt || 0),
      0
    );
    const avgTaux =
      sortedData.reduce((sum, d) => sum + (d.taux_encadrement || 0), 0) /
      sortedData.length;
    const totalL = sortedData.reduce(
      (sum, d) => sum + (d.effectif_sans_cpge_l || 0),
      0
    );
    const totalM = sortedData.reduce(
      (sum, d) => sum + (d.effectif_sans_cpge_m || 0),
      0
    );
    const totalD = sortedData.reduce(
      (sum, d) => sum + (d.effectif_sans_cpge_d || 0),
      0
    );

    return {
      count: sortedData.length,
      totalEtudiants,
      totalETPT,
      avgTaux,
      totalL,
      totalM,
      totalD,
      pctL: totalEtudiants ? (totalL / totalEtudiants) * 100 : 0,
      pctM: totalEtudiants ? (totalM / totalEtudiants) * 100 : 0,
      pctD: totalEtudiants ? (totalD / totalEtudiants) * 100 : 0,
    };
  }, [sortedData]);

  const getChartConfig = () => {
    switch (viewType) {
      case "niveau":
        return {
          options: niveauOptions,
          title: "Répartition des effectifs par niveau (L/M/D)",
          comment: `Analyse de la distribution des étudiants par niveau de formation (Licence, Master, Doctorat) pour ${sortedData.length} établissements.`,
          readingKey: `Au total, ${num(
            stats?.totalEtudiants
          )} étudiants dont ${num(stats?.totalL)} en Licence (${pct(
            stats?.pctL
          )}), ${num(stats?.totalM)} en Master (${pct(stats?.pctM)}) et ${num(
            stats?.totalD
          )} en Doctorat (${pct(stats?.pctD)}).`,
        };
      case "filiere":
        return {
          options: filiereOptions,
          title: "Répartition des effectifs par filière",
          comment: `Distribution des étudiants par filière de formation (IUT, Ingénieur, Sciences, LLSH, Santé, STAPS) pour les établissements sélectionnés.`,
          readingKey: `Visualisation empilée des effectifs par filière pour chaque établissement.`,
        };
      case "encadrement":
        return {
          options: encadrementOptions,
          title: "Taux d'encadrement par établissement",
          comment: `Comparaison des taux d'encadrement (ratio emplois ETPT / étudiants) entre ${sortedData.length} établissements.`,
          readingKey: `Le taux d'encadrement moyen est de ${pct(
            stats?.avgTaux
          )} pour les établissements sélectionnés.`,
        };
      case "ratio":
        return {
          options: ratioOptions,
          title: "Corrélation Étudiants / Emplois ETPT",
          comment: `Analyse de la relation entre le nombre d'étudiants et les emplois ETPT. Chaque point représente un établissement.`,
          readingKey: `Total de ${num(
            stats?.totalEtudiants
          )} étudiants pour ${num(
            stats?.totalETPT
          )} emplois ETPT dans les établissements analysés.`,
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
              backgroundColor: DSFR_COLORS.purpleGlycine850,
              borderRadius: "8px",
              borderLeft: `4px solid ${CHART_COLORS.quaternary}`,
            }}
          >
            <h3 className="fr-h6 fr-mb-2w">
              Statistiques - Effectifs et encadrement
            </h3>
            <Row gutters>
              <Col md="2">
                <div
                  className="fr-text--sm"
                  style={{ color: DSFR_COLORS.textDefault }}
                >
                  Établissements
                </div>
                <div className="fr-text--lg" style={{ fontWeight: "bold" }}>
                  {stats?.count}
                </div>
              </Col>
              <Col md="2">
                <div
                  className="fr-text--sm"
                  style={{ color: DSFR_COLORS.textDefault }}
                >
                  Total étudiants
                </div>
                <div className="fr-text--lg" style={{ fontWeight: "bold" }}>
                  {num(stats?.totalEtudiants)}
                </div>
              </Col>
              <Col md="2">
                <div
                  className="fr-text--sm"
                  style={{ color: DSFR_COLORS.textDefault }}
                >
                  Licence
                </div>
                <div className="fr-text--lg" style={{ fontWeight: "bold" }}>
                  {num(stats?.totalL)} ({pct(stats?.pctL)})
                </div>
              </Col>
              <Col md="2">
                <div
                  className="fr-text--sm"
                  style={{ color: DSFR_COLORS.textDefault }}
                >
                  Master
                </div>
                <div className="fr-text--lg" style={{ fontWeight: "bold" }}>
                  {num(stats?.totalM)} ({pct(stats?.pctM)})
                </div>
              </Col>
              <Col md="2">
                <div
                  className="fr-text--sm"
                  style={{ color: DSFR_COLORS.textDefault }}
                >
                  Emplois ETPT
                </div>
                <div className="fr-text--lg" style={{ fontWeight: "bold" }}>
                  {num(stats?.totalETPT)}
                </div>
              </Col>
              <Col md="2">
                <div
                  className="fr-text--sm"
                  style={{ color: DSFR_COLORS.textDefault }}
                >
                  Taux moyen
                </div>
                <div className="fr-text--lg" style={{ fontWeight: "bold" }}>
                  {pct(stats?.avgTaux)}
                </div>
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
            borderLeft: `4px solid ${CHART_COLORS.quaternary}`,
            paddingLeft: "1rem",
            flex: 1,
          }}
        >
          Analyse des effectifs et de l'encadrement
        </h3>
        <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
          <Button
            size="sm"
            variant={viewType === "niveau" ? "primary" : "secondary"}
            onClick={() => setViewType("niveau")}
          >
            Par niveau
          </Button>
          <Button
            size="sm"
            variant={viewType === "filiere" ? "primary" : "secondary"}
            onClick={() => setViewType("filiere")}
          >
            Par filière
          </Button>
          <Button
            size="sm"
            variant={viewType === "encadrement" ? "primary" : "secondary"}
            onClick={() => setViewType("encadrement")}
          >
            Encadrement
          </Button>
          <Button
            size="sm"
            variant={viewType === "ratio" ? "primary" : "secondary"}
            onClick={() => setViewType("ratio")}
          >
            Corrélation
          </Button>
        </div>
      </div>

      <ChartWrapper
        config={{
          id: `effectifs-comparison-${viewType}-chart`,
          idQuery: `effectifs-comparison-${viewType}`,
          title: {
            className: "fr-mt-0w",
            look: "h5",
            size: "h3",
            fr: chartConfig?.title || "",
          },
          comment: {
            fr: <>{chartConfig?.comment || ""}</>,
          },
          readingKey: {
            fr: <>{chartConfig?.readingKey || ""}</>,
          },
          updateDate: new Date(),
          integrationURL: "/integration-url",
        }}
        options={chartConfig?.options || {}}
        legend={null}
      />
    </div>
  );
}
