import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import { Row, Col, Button } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { CHART_COLORS } from "../../../../constants/colors";

interface EncadrementByLevelChartProps {
  data: any[];
  filters: {
    annee?: string;
    type?: string;
    typologie?: string;
    region?: string;
  };
}

export default function EncadrementByLevelChart({
  data,
  filters,
}: EncadrementByLevelChartProps) {
  const [selectedLevel, setSelectedLevel] = useState<
    | "l"
    | "m"
    | "d"
    | "iut"
    | "ing"
    | "dsa"
    | "llsh"
    | "theo"
    | "si"
    | "staps"
    | "sante"
    | "veto"
    | "interd"
  >("l");

  const groupKey = useMemo(() => {
    if (filters.type) return "type";
    if (filters.typologie) return "etablissement_actuel_typologie";
    if (filters.region) return "region";
    return "type";
  }, [filters]);

  const groupLabel = useMemo(() => {
    if (filters.type) return "type";
    if (filters.typologie) return "typologie";
    if (filters.region) return "région";
    return "type";
  }, [filters]);

  const chartData = useMemo(() => {
    if (!data.length) return [];

    const effectifKey = `effectif_sans_cpge_${selectedLevel}`;

    const filtered = data
      .filter((item) => {
        const effectif = item[effectifKey];
        const taux = item.taux_encadrement;
        const group = item[groupKey];

        const hasValidData =
          effectif != null && effectif > 0 && taux != null && taux > 0 && group;

        return hasValidData;
      })
      .map((item) => {
        return {
          name: item.etablissement_actuel_lib || "Inconnu",
          x: item[effectifKey] || 0,
          y: item.taux_encadrement || 0,
          group: item[groupKey] || "Non renseigné",
          emplois: item.emploi_etpt || 0,
          effectifTotal: item.effectif_sans_cpge || 0,
        };
      })
      .filter((item) => item.y > 0 && item.x > 0);

    return filtered;
  }, [data, selectedLevel, groupKey]);

  const groupedData = useMemo(() => {
    const groups = new Map<string, any[]>();

    chartData.forEach((point) => {
      const key = point.group;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(point);
    });

    return Array.from(groups.entries()).map(([groupName, points]) => ({
      name: groupName,
      data: points.map((p) => ({
        name: p.name,
        x: p.x,
        y: p.y,
        emplois: p.emplois,
      })),
    }));
  }, [chartData]);

  const colors = CHART_COLORS.palette;

  const chartOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "scatter",
        height: 600,
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
            fontWeight: "bold",
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
          text: "Taux d'encadrement (%)",
          style: {
            color: "var(--text-default-grey)",
            fontWeight: "bold",
          },
        },
        labels: {
          formatter: function () {
            return `${this.value}%`;
          },
        },
        gridLineWidth: 1,
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const point = this as any;
          return `<div style="padding:10px">
                  <div style="font-weight:bold;margin-bottom:5px;color:${
                    point.color
                  }">${point.series.name}</div>
                  <div style="font-weight:bold;font-size:14px;margin-bottom:8px">${
                    point.point.name
                  }</div>
                  <div style="margin-bottom:4px">
                    <span style="color:var(--text-default-grey)">Effectifs ${
                      levelLabels[selectedLevel]
                    } :</span>
                    <strong> ${Highcharts.numberFormat(
                      point.x,
                      0,
                      ",",
                      " "
                    )} étudiants</strong>
                  </div>
                  <div style="margin-bottom:4px">
                    <span style="color:var(--text-default-grey)">Taux d'encadrement (global) :</span>
                    <strong> ${point.y.toFixed(2)}%</strong>
                  </div>
                  <div>
                    <span style="color:var(--text-default-grey)">Emplois totaux :</span>
                    <strong> ${Highcharts.numberFormat(
                      point.point.emplois,
                      0,
                      ",",
                      " "
                    )} ETPT</strong>
                  </div>
                  </div>`;
        },
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 6,
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
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
        itemStyle: {
          fontSize: "11px",
        },
      },
      credits: {
        enabled: false,
      },
      series: groupedData.map((group, index) => ({
        name: group.name,
        type: "scatter",
        data: group.data,
        color: colors[index % colors.length],
      })),
    }),
    [groupedData, colors]
  );

  const levelLabels: Record<string, string> = {
    l: "Licence",
    m: "Master",
    d: "Doctorat",
    iut: "IUT",
    ing: "Ingénieur",
    dsa: "DSA",
    llsh: "LLSH",
    theo: "Théologie",
    si: "Sciences",
    staps: "STAPS",
    sante: "Santé",
    veto: "Vétérinaire",
    interd: "Interdisciplinaire",
  };

  const stats = useMemo(() => {
    if (!chartData.length) return null;

    const totalEtudiants = chartData.reduce((sum, d) => sum + d.x, 0);

    return {
      count: chartData.length,
      totalEtudiants,
    };
  }, [chartData]);

  return (
    <div>
      <div
        className="fr-mb-3w"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h3
            className="fr-h5 fr-mb-0"
            style={{
              borderLeft: `4px solid ${CHART_COLORS.secondary}`,
              paddingLeft: "1rem",
            }}
          >
            Taux d'encadrement selon les effectifs par niveau
          </h3>
          <p
            className="fr-text--xs fr-mb-0"
            style={{
              color: "var(--text-default-grey)",
              marginTop: "0.5rem",
              paddingLeft: "1rem",
            }}
          >
            Le taux d'encadrement global de l'établissement (emplois totaux /
            effectifs totaux) est affiché en fonction des effectifs au niveau
            sélectionné. Seuls les établissements ayant des effectifs pour le
            niveau choisi sont affichés.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
            <Button
              size="sm"
              variant={selectedLevel === "l" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("l")}
            >
              Licence
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "m" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("m")}
            >
              Master
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "d" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("d")}
            >
              Doctorat
            </Button>
          </div>
          <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
            <Button
              size="sm"
              variant={selectedLevel === "iut" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("iut")}
            >
              IUT
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "ing" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("ing")}
            >
              Ingénieur
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "dsa" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("dsa")}
            >
              DSA
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "llsh" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("llsh")}
            >
              LLSH
            </Button>
          </div>
          <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
            <Button
              size="sm"
              variant={selectedLevel === "theo" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("theo")}
            >
              Théologie
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "si" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("si")}
            >
              Sciences
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "staps" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("staps")}
            >
              STAPS
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "sante" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("sante")}
            >
              Santé
            </Button>
          </div>
          <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
            <Button
              size="sm"
              variant={selectedLevel === "veto" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("veto")}
            >
              Vétérinaire
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "interd" ? "primary" : "secondary"}
              onClick={() => setSelectedLevel("interd")}
            >
              Interdisciplinaire
            </Button>
          </div>
        </div>
      </div>

      {!chartData.length && (
        <div className="fr-alert fr-alert--info fr-mb-3w">
          <p>
            Aucune donnée disponible pour {levelLabels[selectedLevel]}. Vérifiez
            que les établissements sélectionnés ont des effectifs pour ce niveau
            et un taux d'encadrement global renseigné.
          </p>
        </div>
      )}

      {stats && (
        <Row className="fr-mb-3w">
          <Col>
            <div
              className="fr-p-2w"
              style={{
                backgroundColor: "var(--background-contrast-info)",
                borderRadius: "8px",
                borderLeft: `4px solid ${CHART_COLORS.secondary}`,
              }}
            >
              <h4 className="fr-h6 fr-mb-2w">
                Statistiques - {levelLabels[selectedLevel]}
              </h4>
              <Row gutters>
                <Col md="6">
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span
                      style={{
                        color: "var(--text-default-grey)",
                        fontSize: "13px",
                      }}
                    >
                      Établissements affichés
                    </span>
                  </div>
                  <strong style={{ fontSize: "18px" }}>{stats.count}</strong>
                </Col>
                <Col md="6">
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span
                      style={{
                        color: "var(--text-default-grey)",
                        fontSize: "13px",
                      }}
                    >
                      Total étudiants ({levelLabels[selectedLevel]})
                    </span>
                  </div>
                  <strong style={{ fontSize: "18px" }}>
                    {Highcharts.numberFormat(stats.totalEtudiants, 0, ",", " ")}
                  </strong>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      )}

      {chartData.length > 0 && (
        <ChartWrapper
          config={{
            id: `encadrement-level-${selectedLevel}-chart`,
            idQuery: `encadrement-level-${selectedLevel}`,
            title: {
              className: "fr-mt-0w",
              look: "h5",
              size: "h3",
              fr: `Taux d'encadrement global vs effectifs ${levelLabels[selectedLevel]} par ${groupLabel}`,
            },
            comment: {
              fr: (
                <>
                  Nuage de points montrant le{" "}
                  <strong>taux d'encadrement global</strong>
                  de chaque établissement (emplois totaux / effectifs totaux) en
                  fonction du nombre d'étudiants en {levelLabels[selectedLevel]}
                  , regroupé par {groupLabel}.
                </>
              ),
            },
            readingKey: {
              fr: (
                <>
                  L'axe horizontal indique le nombre d'étudiants en{" "}
                  {levelLabels[selectedLevel]}. L'axe vertical indique le taux
                  d'encadrement global de l'établissement (tous niveaux
                  confondus). Les établissements sont colorés selon leur{" "}
                  {groupLabel}.
                </>
              ),
            },
            updateDate: new Date(),
            integrationURL: "/integration-url",
          }}
          options={chartOptions}
          legend={null}
        />
      )}
    </div>
  );
}
