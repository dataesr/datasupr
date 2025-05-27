import { useRef, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "@dataesr/dsfr-plus";
import useFacultyMembersGenderComparison from "../../api/use-by-gender";
import "../../../../styles.scss";

interface GenderStats {
  total_count: number;
  titulaires_count?: number;
  titulaires_percent?: number;
  enseignants_chercheurs_count?: number;
  enseignants_chercheurs_percent?: number;
  quotite_distribution?: Record<string, { count: number; percent: number }>;
  age_distribution?: Record<string, { count: number; percent: number }>;
}

interface DisciplineGenderData {
  discipline: {
    code: string;
    label: string;
  };
  total_count: number;
  hommes: GenderStats;
  femmes: GenderStats;
}

interface GenderComparisonResponse {
  total_count: number;
  hommes: GenderStats;
  femmes: GenderStats;
  allDisciplines?: DisciplineGenderData[];
}

interface DisciplineBarChartProps {
  selectedYear: string;
}

const DisciplineBarChart: React.FC<DisciplineBarChartProps> = ({
  selectedYear,
}) => {
  const { fieldId } = useParams<{ fieldId?: string }>();
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const navigate = useNavigate();

  const { data: genderComparisonData, isLoading } =
    useFacultyMembersGenderComparison({
      selectedYear,
      disciplineCode: fieldId,
    });

  const [sortKey, setSortKey] = useState<
    "total" | "femmesPercent" | "hommesPercent"
  >("total");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [stackType, setStackType] = useState<"percent" | "normal">("percent");

  const rootStyles = getComputedStyle(document.documentElement);

  const disciplines = useMemo(() => {
    if (!genderComparisonData) return [];

    let genderData: GenderComparisonResponse | null = null;

    if (Array.isArray(genderComparisonData)) {
      if (fieldId) {
        genderData = genderComparisonData.find(
          (item) => item.discipline?.code === fieldId
        ) as GenderComparisonResponse;
      } else {
        genderData = genderComparisonData[0] as GenderComparisonResponse;
      }
    } else {
      genderData = genderComparisonData as GenderComparisonResponse;
    }

    const allDisciplines = genderData?.allDisciplines || [];

    if (
      !allDisciplines ||
      !Array.isArray(allDisciplines) ||
      allDisciplines.length === 0
    ) {
      return [];
    }

    return allDisciplines.map((disc: DisciplineGenderData) => ({
      discipline: disc.discipline.label,
      disciplineCode: disc.discipline.code,
      hommesCount: disc.hommes.total_count,
      hommesPercent: Math.round(
        (disc.hommes.total_count / disc.total_count) * 100
      ),
      femmesCount: disc.femmes.total_count,
      femmesPercent: Math.round(
        (disc.femmes.total_count / disc.total_count) * 100
      ),
    }));
  }, [genderComparisonData, fieldId]);

  const sortedDisciplines = useMemo(() => {
    return [...disciplines].sort((a, b) => {
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
  }, [disciplines, sortKey, sortOrder]);

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
      height: categories.length * 65,
      marginLeft: 0,
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    title: {
      text: "Répartition hommes / femmes par discipline",
      align: "left",
      style: {
        fontWeight: "bold",
        fontSize: "18px",
      },
    },
    subtitle: {
      text: `Année universitaire ${selectedYear}`,
      style: {
        color: "#666666",
        fontSize: "14px",
      },
      align: "left",
    },
    credits: { enabled: false },
    xAxis: {
      categories,
      title: { text: null },
      labels: {
        useHTML: true,
        align: "left",
        x: 10,
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
        pointWidth: 40,
        pointPadding: 1,
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

  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">
        Chargement des données de répartition par genre...
      </div>
    );
  }

  if (!disciplines || disciplines.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour la répartition par genre pour l'année{" "}
        {selectedYear}
      </div>
    );
  }

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
