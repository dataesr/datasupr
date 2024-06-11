import { Badge, Button, Container, Row } from "@dataesr/dsfr-plus";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Template from "../../../../components/template/index.tsx";
import { getNumberOfStudentsHistoricByLevel } from "../../../../api";

export default function SubList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const geoId = searchParams.get("geo_id") || "";
  const currentYear = searchParams.get("annee_universitaire") || "2022-23";

  const { data: dataHistoric, isLoading: isLoadingHistoric } = useQuery({
    queryKey: [
      "atlas/number-of-students-historic-by-level",
      geoId,
      currentYear,
    ],
    queryFn: () => getNumberOfStudentsHistoricByLevel(geoId, currentYear),
  });

  if (isLoadingHistoric) {
    return <Template height="338" />;
  }
  if (!dataHistoric?.data) {
    return null;
  }

  const getSubLevel = () => {
    if (!geoId || geoId === "PAYS_100") {
      return "Liste des régions";
    }
    if (geoId.startsWith("R")) {
      return "Liste des académies";
    }
    if (geoId.startsWith("D")) {
      return "Liste des communes";
    }
    if (geoId.startsWith("A")) {
      return "Liste des départements";
    }
    if (geoId.startsWith("U")) {
      return "Liste des communes";
    }
  };

  return (
    <Container fluid as="section">
      <Row style={{ width: "100%" }}>
        <div style={{ flexGrow: "1" }}>
          <strong>
            <i>{getSubLevel()}</i>
          </strong>
        </div>
        <div className="fr-mb-1w">
          <Badge color="yellow-tournesol">{currentYear}</Badge>
        </div>
      </Row>
      <div style={{ overflow: "auto" }}>
        {dataHistoric?.data.slice(0, 15).map((item) => (
          <Row
            style={{ width: "100%", borderBottom: "1px solid #ddd" }}
            key={item.geo_nom}
          >
            <div style={{ flexGrow: "1" }}>{item.geo_nom}</div>
            <div className="fr-mb-1w">
              <strong>
                {item.data
                  .find((el) => el.annee_universitaire === currentYear)
                  ?.effectif.toLocaleString()}
              </strong>
              {["R", "D", "A", "U", "P"].includes(geoId?.charAt(0)) && (
                <Button
                  className="fr-ml-1w"
                  color="pink-tuile"
                  onClick={() =>
                    navigate(
                      `/atlas/general?geo_id=${item.geo_id}&annee_universitaire=${currentYear}`
                    )
                  }
                  size="sm"
                  variant="text"
                >
                  Voir
                </Button>
              )}
            </div>
          </Row>
        ))}
      </div>
    </Container>
  );
}
