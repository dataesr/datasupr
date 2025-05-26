import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Row, Col, Title } from "@dataesr/dsfr-plus";
import { AgeDistributionByRegionProps } from "../../../../types";

const rootStyles = getComputedStyle(document.documentElement);

export default function AgeDistributionByRegion({
  regionsData,
  year,
}: AgeDistributionByRegionProps) {
  const regionsWithProcessedData = useMemo(() => {
    return regionsData.map((region) => ({
      ...region,
      totalHeadcount:
        region.totalHeadcount ||
        (region.totalHeadcountWoman || 0) + (region.totalHeadcountMan || 0),
    }));
  }, [regionsData]);

  const regionsWithAgeData = useMemo(() => {
    return regionsWithProcessedData
      .filter(
        (region) =>
          region.age_distribution && region.age_distribution.length > 0
      )
      .sort((a, b) => (b.totalHeadcount || 0) - (a.totalHeadcount || 0))
      .slice(0, 12);
  }, [regionsWithProcessedData]);

  const regionChartOptions = useMemo(() => {
    return regionsWithAgeData
      .map((region) => {
        if (!region.age_distribution) return null;

        const totalCount = region.age_distribution.reduce(
          (sum, age) => sum + age.headcount,
          0
        );

        const pieData = region.age_distribution.map((age) => ({
          name: age.age_class,
          y: totalCount > 0 ? (age.headcount / totalCount) * 100 : 0,
          count: age.headcount,
        }));

        const sortOrder = {
          "35 ans et moins": 1,
          "36 à 55 ans": 2,
          "56 ans et plus": 3,
        };

        pieData.sort((a, b) => {
          if (
            sortOrder[a.name] !== undefined &&
            sortOrder[b.name] !== undefined
          ) {
            return sortOrder[a.name] - sortOrder[b.name];
          }
          return a.name.localeCompare(b.name);
        });

        const colors = {
          "35 ans et moins": rootStyles.getPropertyValue(
            "--green-bourgeon-925"
          ),
          "36 à 55 ans": rootStyles.getPropertyValue("--green-menthe-925"),
          "56 ans et plus": rootStyles.getPropertyValue(
            "--blue-cumulus-sun-368"
          ),
        };

        return {
          chart: {
            type: "pie",
            height: 250,
            style: {
              fontFamily: "'Marianne', sans-serif",
            },
            backgroundColor: "transparent",
            spacing: [10, 0, 0, 0],
          },
          title: {
            text: `${region.geo_nom}`,
            style: {
              fontSize: "16px",
              fontWeight: "bold",
            },
            align: "center",
            margin: 15,
          },
          subtitle: {
            text: `${region.totalHeadcount.toLocaleString(
              "fr-FR"
            )} enseignants`,
            style: {
              fontSize: "13px",
              color: "#666666",
            },
            align: "center",
          },
          tooltip: {
            pointFormat:
              "{point.name}: <b>{point.percentage:.1f}%</b><br>({point.count} enseignants)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderWidth: 0,
            shadow: true,
            style: {
              fontSize: "12px",
            },
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: "pointer",
              startAngle: -90,
              endAngle: 90,
              center: ["50%", "60%"],
              size: "150%",
              dataLabels: {
                enabled: true,
                format: "{point.percentage:.1f}%",
                distance: -25,
                style: {
                  fontWeight: "bold",
                  color: "white",
                  textOutline: "1px contrast",
                  fontSize: "12px",
                  textShadow: "0px 0px 3px rgba(0, 0, 0, 0.5)",
                },
                filter: {
                  property: "percentage",
                  operator: ">",
                  value: 5,
                },
              },
              showInLegend: true,
              colors: pieData.map((item) => colors[item.name] || "#CCCCCC"),
              borderWidth: 0,
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
              name: "Âge",
              colorByPoint: true,
              data: pieData,
              type: "pie",
              innerSize: "40%",
            },
          ],
        };
      })
      .filter(Boolean);
  }, [regionsWithAgeData]);

  const genderBarOptions = useMemo(() => {
    return regionsWithAgeData.map((region) => {
      const femaleCount = region.totalHeadcountWoman || 0;
      const maleCount = region.totalHeadcountMan || 0;
      const totalCount = femaleCount + maleCount;
      const femalePercent =
        totalCount > 0 ? (femaleCount / totalCount) * 100 : 0;
      const malePercent = totalCount > 0 ? (maleCount / totalCount) * 100 : 0;

      return {
        chart: {
          type: "bar",
          height: 40,
          backgroundColor: "transparent",
          spacing: [0, 0, 0, 0],
          margin: [0, 0, 0, 0],
        },
        title: {
          text: null,
        },
        xAxis: {
          categories: [""],
          lineWidth: 0,
          labels: {
            enabled: false,
          },
        },
        yAxis: {
          title: {
            text: null,
          },
          labels: {
            enabled: false,
          },
          gridLineWidth: 0,
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          formatter: function (this: Highcharts.TooltipFormatterContextObject) {
            const femme = this.point.series.name === "Femmes";
            return `<b>${femme ? "Femmes" : "Hommes"}</b>: ${Math.round(
              this.y || 0
            )}% (${femme ? femaleCount : maleCount} enseignants)`;
          },
          shadow: true,
        },
        exporting: {
          enabled: false,
        },
        plotOptions: {
          series: {
            stacking: "percent",
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              formatter: function (this: Highcharts.PointLabelObject) {
                const value = Math.round(this.y || 0);
                if (value < 10) return "";
                return `${value}%`;
              },
              style: {
                fontSize: "11px",
                fontWeight: "bold",
                color: "white",
                textOutline: "1px contrast",
              },
            },
          },
          bar: {
            pointWidth: 30,
            borderRadius: 3,
          },
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            name: "Hommes",
            data: [malePercent],
            color: rootStyles.getPropertyValue("--men-color"),
          },
          {
            name: "Femmes",
            data: [femalePercent],
            color: rootStyles.getPropertyValue("--women-color"),
          },
        ],
      };
    });
  }, [regionsWithAgeData]);

  if (regionsWithAgeData.length === 0 || regionChartOptions.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée de répartition par âge disponible pour les régions cette
        année
      </div>
    );
  }

  return (
    <div className="fr-mt-4w">
      <Title as="h3" look="h5" className="fr-mb-3w">
        Répartition par âge des enseignants par région ({year})
      </Title>

      <Row gutters>
        {regionChartOptions.map((options, index) => (
          <Col
            md={4}
            key={regionsWithAgeData[index].geo_id}
            className="fr-mb-4w"
          >
            <div
              style={{
                border: "1px solid rgb(229, 229, 229)",
                borderRadius: "16px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffffff",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0, 0, 0, 0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 12px rgba(0, 0, 0, 0.1)";
              }}
            >
              <HighchartsReact highcharts={Highcharts} options={options} />

              <div
                style={{
                  padding: "0 15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    marginBottom: "10px",
                  }}
                >
                  {Object.entries({
                    "35 ans et moins": rootStyles.getPropertyValue(
                      "--green-bourgeon-925"
                    ),
                    "36 à 55 ans":
                      rootStyles.getPropertyValue("--green-menthe-925"),
                    "56 ans et plus": rootStyles.getPropertyValue(
                      "--blue-cumulus-sun-368"
                    ),
                  }).map(([label, color]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "11px",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: color,
                          borderRadius: "2px",
                        }}
                      />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    textAlign: "center",
                    marginTop: "5px",
                    marginBottom: "3px",
                  }}
                >
                  Répartition par sexe
                </div>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={genderBarOptions[index]}
                />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <div className="fr-mt-2w fr-mt-md-4w fr-mb-4w">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <div style={{ fontSize: "14px", fontStyle: "italic" }}>
            Répartition des enseignants selon l'âge et le sexe dans chaque
            région de France
          </div>
        </div>
      </div>
    </div>
  );
}
