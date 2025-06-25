import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo, useState, useEffect } from "react";

const { VITE_APP_SERVER_URL } = import.meta.env;

async function getGraduatesTests(id: string, diplome: string) {
  const url = `${VITE_APP_SERVER_URL}/graduates/tests/${id}/${diplome}`;
  console.log(`Fetching graduates tests from: ${url}`);

  return fetch(url).then((response) => response.json());
}

interface GraduateData {
  etablissement_id_paysage: string;
  DIPLOME_r: string;
  rentree: string;
  [key: string]: unknown;
}

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const diplome = searchParams.get("diplome");

  const [inputId, setInputId] = useState(id || "");
  const [inputDiplome, setInputDiplome] = useState(diplome || "");

  // Synchroniser l'état local avec l'URL
  useEffect(() => {
    setInputId(id || "");
  }, [id]);

  useEffect(() => {
    setInputDiplome(diplome || "");
  }, [diplome]);

  const handleBothParametersChange = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (inputId.trim()) {
      newSearchParams.set("id", inputId.trim());
    } else {
      newSearchParams.delete("id");
    }

    if (inputDiplome.trim()) {
      newSearchParams.set("diplome", inputDiplome.trim());
    } else {
      newSearchParams.delete("diplome");
    }

    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["graduates/tests", id, diplome],
    queryFn: () => getGraduatesTests(id!, diplome!),
    enabled: !!id && !!diplome,
  });

  const chartOptions = useMemo(() => {
    if (!data?.data || data.data.length === 0) {
      return null;
    }

    return {
      title: {
        text: `Nombre de diplômes délivrés par année - ${diplome}`,
      },
      xAxis: {
        categories: data.data.map((item: GraduateData) => item.rentree),
        title: {
          text: "Année de rentrée",
        },
      },
      yAxis: {
        title: {
          text: "Nombre de diplômes",
        },
      },
      series: [
        {
          name: "Diplômes délivrés",
          type: "line",
          data: data.data.map((item: GraduateData) => item["Nombre total de diplômes délivrés"]),
          marker: {
            enabled: true,
            radius: 4,
          },
        },
      ],
      tooltip: {
        pointFormat: "<b>{point.y}</b> diplômes délivrés",
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                enabled: false,
              },
            },
          },
        ],
      },
    };
  }, [data, diplome]);

  const renderFormInputs = () => (
    <div style={{ marginBottom: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "end" }}>
        <div style={{ flex: "1", minWidth: "250px" }}>
          <label htmlFor="id-input" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            ID Établissement :
          </label>
          <input
            id="id-input"
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleBothParametersChange();
              }
            }}
            placeholder="ex: 54VTe"
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
            }}
          />
        </div>

        <div style={{ flex: "1", minWidth: "250px" }}>
          <label htmlFor="diplome-input" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Diplôme :
          </label>
          <input
            id="diplome-input"
            type="text"
            value={inputDiplome}
            onChange={(e) => setInputDiplome(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleBothParametersChange();
              }
            }}
            placeholder="ex: MAST_M_AUTRES"
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
            }}
          />
        </div>

        <div>
          <button
            onClick={handleBothParametersChange}
            style={{
              padding: "8px 16px",
              backgroundColor: "#0078f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              height: "42px",
            }}
          >
            Mettre à jour
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <div>Chargement...</div>;
    }

    if (!id || !diplome) {
      return <div>Veuillez saisir un ID d'établissement et un diplôme pour afficher le graphique.</div>;
    }

    if (!data?.data || data.data.length === 0) {
      return <div>Aucune donnée disponible pour ces paramètres.</div>;
    }

    return chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
  };

  return (
    <Container as="main">
      <Row>
        <Col>
          {renderFormInputs()}
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
}
