import { useRef, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "@dataesr/dsfr-plus";
import "../../../../styles.scss";

interface DisciplineBarChartProps {
  disciplines: Array<{
    discipline: string;
    disciplineCode: string;
    hommesCount: number;
    hommesPercent: number;
    femmesCount: number;
    femmesPercent: number;
  }>;
}

const DisciplineBarChart: React.FC<DisciplineBarChartProps> = ({
  disciplines,
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<
    "total" | "femmesPercent" | "hommesPercent"
  >("total");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [stackType, setStackType] = useState<"percent" | "normal">("percent");

  const rootStyles = getComputedStyle(document.documentElement);

  const sortedDisciplines = [...disciplines].sort((a, b) => {
    const getVal = (d: typeof a) => {
      if (sortKey === "total") return d.femmesCount + d.hommesCount;
      if (sortKey === "femmesPercent") return d.femmesPercent;
      if (sortKey === "hommesPercent") return d.hommesPercent;
      return 0;
    };
    const valA = getVal(a);
    const valB = getVal(b);
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const categories = sortedDisciplines.map(
    (d) =>
      `${d.discipline} <span style="font-size:11px; color:#888">(${
        d.femmesCount + d.hommesCount
      } personnes)</span>`
  );

  const femmesData =
    stackType === "percent"
      ? sortedDisciplines.map((d) => d.femmesPercent)
      : sortedDisciplines.map((d) => d.femmesCount);

  const hommesData =
    stackType === "percent"
      ? sortedDisciplines.map((d) => d.hommesPercent)
      : sortedDisciplines.map((d) => d.hommesCount);

  const options: Highcharts.Options = {
    chart: {
      type: "bar",
      height: categories.length * 45,
    },
    title: {
      text: "Répartition femmes / hommes par discipline",
      align: "center",
      style: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    credits: { enabled: false },
    xAxis: {
      categories,
      title: { text: null },
      labels: {
        useHTML: true,
        align: "left",
        x: 0,
        style: {
          fontSize: "13px",
        },
      },
    },

    yAxis: {
      visible: stackType === "percent",
      max: stackType === "percent" ? 100 : undefined,
      title: {
        text: stackType === "percent" ? "Pourcentage" : "Effectif",
      },
    },
    legend: {
      reversed: false,
    },
    plotOptions: {
      series: {
        stacking: stackType,
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              const disciplineCode =
                sortedDisciplines[this.index]?.disciplineCode;
              if (disciplineCode) {
                navigate(
                  `/personnel-enseignant/discipline/typologie/${disciplineCode}`
                );
              }
            },
          },
        },
      },
      bar: {
        borderRadius: 4,
        borderWidth: 0,
      },
    },
    tooltip: {
      formatter: function () {
        const discipline = this.point.category?.toString().split("<br")[0];
        const value = Number(this.point.y).toFixed(1);
        return `<b>${discipline}</b><br/>
          <span style="color:${this.point.color}">\u25CF</span> ${
          this.series.name
        }: ${value}${stackType === "percent" ? "%" : ""}`;
      },
    },
    series: [
      {
        name: "Femmes",
        data: femmesData,
        color: rootStyles.getPropertyValue("--women-color"),
        type: "bar",
      },
      {
        name: "Hommes",
        data: hommesData,
        color: rootStyles.getPropertyValue("--men-color"),
        type: "bar",
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current?.chart) {
      chartRef.current.chart.reflow();
    }
  }, [disciplines, sortKey, sortOrder, stackType]);

  return (
    <Row gutters>
      <Col className="text-right">
        <Button
          size="sm"
          variant={sortKey === "total" ? undefined : "text"}
          onClick={() => setSortKey("total")}
        >
          <i className="ri-bar-chart-horizontal-line"></i>
        </Button>

        <Button
          size="sm"
          variant={sortKey === "femmesPercent" ? undefined : "text"}
          onClick={() => setSortKey("femmesPercent")}
        >
          <i className="ri-women-line"></i>
        </Button>

        <Button
          size="sm"
          variant={sortKey === "hommesPercent" ? undefined : "text"}
          onClick={() => setSortKey("hommesPercent")}
        >
          <i className="ri-men-line"></i>
        </Button>

        <Button
          size="sm"
          variant="text"
          onClick={() =>
            setStackType((prev) => (prev === "percent" ? "normal" : "percent"))
          }
        >
          <span
            className={
              stackType === "percent" ? "ri-percent-fill" : "ri-user-fill"
            }
            aria-hidden="true"
          />
        </Button>
        <Button
          size="sm"
          variant="text"
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          <span
            className={
              sortOrder === "asc"
                ? "fr-icon-arrow-up-s-fill"
                : "fr-icon-arrow-down-s-fill"
            }
            aria-hidden="true"
          />
          Ordre : {sortOrder}
        </Button>
      </Col>
      <Col md={12} lg={12} xl={12}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </Col>
    </Row>
  );
};

export default DisciplineBarChart;
