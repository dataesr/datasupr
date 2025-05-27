import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Row, Col, Title } from "@dataesr/dsfr-plus";
import { AgeDistributionByRegionProps } from "../../types";
import {
  AGE_COLORS,
  createGenderBarOptions,
  createPieChartOptions,
} from "./options";

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
      .map((region) => createPieChartOptions(region))
      .filter(Boolean) as Highcharts.Options[];
  }, [regionsWithAgeData]);

  const genderBarOptions = useMemo(() => {
    return regionsWithAgeData.map((region) => createGenderBarOptions(region));
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

              <div style={{ padding: "0 15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    marginBottom: "10px",
                  }}
                >
                  {Object.entries(AGE_COLORS).map(([label, color]) => (
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
