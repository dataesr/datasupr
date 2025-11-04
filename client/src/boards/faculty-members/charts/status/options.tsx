import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../components/creat-chart-options";
import { StatusOptionsProps } from "../../../../types/faculty-members";

export default function StatusOptions({
  disciplines,
  displayAsPercentage,
  alwaysIncludeLabels = [],
}: StatusOptionsProps): HighchartsInstance.Options | null {
  if (!disciplines || disciplines.length === 0) return null;

  disciplines.sort((a, b) => b.totalCount - a.totalCount);

  const topDisciplines = [...disciplines]
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 10);

  const includeSet = new Set<string>([
    ...topDisciplines.map((d) => d?.fieldLabel),
    ...alwaysIncludeLabels,
  ]);

  const sortedDisciplines = disciplines
    ?.filter((d) => includeSet.has(d.fieldLabel))
    ?.sort((a, b) => b.totalCount - a.totalCount);

  const categories = sortedDisciplines.map((d) => d.fieldLabel);

  const enseignantsChercheursData = sortedDisciplines.map((d) => ({
    y: displayAsPercentage
      ? Math.round((d.enseignantsChercheurs / d.totalCount) * 100 * 10) / 10
      : d.enseignantsChercheurs,
    count: d.enseignantsChercheurs,
    total: d.totalCount,
  }));

  const titulairesNonChercheursData = sortedDisciplines.map((d) => ({
    y: displayAsPercentage
      ? Math.round((d.titulairesNonChercheurs / d.totalCount) * 100 * 10) / 10
      : d.titulairesNonChercheurs,
    count: d.titulairesNonChercheurs,
    total: d.totalCount,
  }));

  const nonTitulairesData = sortedDisciplines.map((d) => ({
    y: displayAsPercentage
      ? Math.round((d.nonTitulaires / d.totalCount) * 100 * 10) / 10
      : d.nonTitulaires,
    count: d.nonTitulaires,
    total: d.totalCount,
  }));

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "bar",
    },
    exporting: { enabled: false },
    title: {
      text: "",
    },
    xAxis: {
      categories,
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: "500",
        },
        formatter(this: Highcharts.AxisLabelsFormatterContextObject) {
          const idx = this.pos as number;
          const label = String(this.value ?? "");
          const d = sortedDisciplines[
            idx
          ] as (typeof sortedDisciplines)[number] & {
            itemId?: string;
            itemType?: "fields" | "geo" | "structures";
          };
          const id = d?.itemId;
          const type = d?.itemType;
          if (!id || !type) return label;

          const sp = new URLSearchParams(window.location.search);
          const year = sp.get("annee_universitaire");

          let basePath = "/personnel-enseignant/discipline/vue-d'ensemble";
          let paramName = "field_id";
          if (type === "geo") {
            basePath = "/personnel-enseignant/geo/vue-d'ensemble";
            paramName = "geo_id";
          } else if (type === "structures") {
            basePath = "/personnel-enseignant/universite/vue-d'ensemble";
            paramName = "structure_id";
          }

          const qp = new URLSearchParams();
          if (year) qp.set("annee_universitaire", year);
          qp.set(paramName, id);
          const href = `${basePath}?${qp.toString()}`;
          return `<a href="${href}" >${label}</a>`;
        },
      },
    },
    yAxis: {
      min: 0,
      max: displayAsPercentage ? 100 : undefined,
      title: {
        text: displayAsPercentage ? "Pourcentage (%)" : "Nombre d'enseignants",
        style: {
          fontSize: "12px",
        },
      },
      labels: {
        format: displayAsPercentage ? "{value} %" : "{value}",
        formatter: function () {
          return displayAsPercentage
            ? `${this.value} %`
            : Number(this.value).toLocaleString("fr-FR");
        },
      },
    },
    tooltip: {
      useHTML: true,
      shared: true,
      formatter: function () {
        let s = `<span style="font-size: 10px">${this.x}</span><br/>`;
        let totalSum = 0;

        if (this.points) {
          type CustomPoint = Highcharts.Point & { count?: number };
          this.points.forEach(function (point) {
            totalSum += (point.point as CustomPoint).count ?? 0;
          });

          this.points.forEach(function (point) {
            const seriesName = point.series.name;
            const absoluteValue = (point.point as CustomPoint).count ?? 0;
            const percentage = (absoluteValue / totalSum) * 100;

            if (displayAsPercentage) {
              s += `<span style="color:${
                point.color
              }">\u25CF</span> ${seriesName}: <b>${(point.y ?? 0).toFixed(
                1
              )} %</b> (${absoluteValue.toLocaleString(
                "fr-FR"
              )} personnes)<br/>`;
            } else {
              s += `<span style="color:${
                point.color
              }">\u25CF</span> ${seriesName}: <b>${absoluteValue.toLocaleString(
                "fr-FR"
              )} personnes</b> (${percentage.toFixed(1)} %)<br/>`;
            }
          });
        }
        return s;
      },
    },
    plotOptions: {
      bar: {
        stacking: displayAsPercentage ? "normal" : undefined,
        dataLabels: {
          enabled: true,
          format: displayAsPercentage ? "{y:.1f} %" : "{point.count}",
          formatter: function () {
            if (displayAsPercentage) {
              return `${(this.y ?? 0).toFixed(1)} %`;
            } else {
              return Number(
                (this.point as { count?: number }).count
              ).toLocaleString("fr-FR");
            }
          },
          style: {
            fontSize: "10px",
            fontWeight: "bold",
            textOutline: "1px contrast",
          },
          filter: {
            property: "y",
            operator: ">" as HighchartsInstance.OptionsOperatorValue,
            value: 5,
          },
        },
      },
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        fontWeight: "normal",
        fontSize: "11px",
      },
    },
    series: [
      {
        name: "Enseignants-chercheurs",
        data: enseignantsChercheursData,
        color: "var(--orange-terre-battue-main-645)",
        zIndex: 3,
        type: "bar",
      },
      {
        name: "Enseignant du Secondaire Affecté dans le Supérieur (ESAS)",
        data: titulairesNonChercheursData,
        color: "var(--green-bourgeon-main-640)",
        zIndex: 2,
        type: "bar",
      },
      {
        name: "Non-permanents",
        data: nonTitulairesData,
        color: "var(--blue-ecume-moon-675)",
        zIndex: 1,
        type: "bar",
      },
    ] as HighchartsInstance.SeriesOptionsType[],
    credits: { enabled: false },
  };

  return CreateChartOptions("bar", newOptions);
}
