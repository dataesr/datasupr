import { Col, Container, Row } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo, useState, useEffect } from "react";

const { VITE_APP_SERVER_URL } = import.meta.env;

async function getGraduatesTests(id: string, diplome: string, composante?: string) {
  let url = `${VITE_APP_SERVER_URL}/graduates/tests/${id}/${diplome}`;
  if (composante && composante.trim()) {
    url += `?composante=${encodeURIComponent(composante.trim())}`;
  }
  console.log(`Fetching graduates tests from: ${url}`);

  return fetch(url).then((response) => response.json());
}

async function getGraduatesOptions() {
  const url = `${VITE_APP_SERVER_URL}/graduates/tests/options`;
  console.log(`Fetching graduates options from: ${url}`);

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
  const composante = searchParams.get("composante");

  const [inputId, setInputId] = useState(id || "");
  const [inputDiplome, setInputDiplome] = useState(diplome || "");
  const [inputComposante, setInputComposante] = useState(composante || "");

  // Synchroniser l'état local avec l'URL
  useEffect(() => {
    setInputId(id || "");
  }, [id]);

  useEffect(() => {
    setInputDiplome(diplome || "");
  }, [diplome]);

  useEffect(() => {
    setInputComposante(composante || "");
  }, [composante]);

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

    if (inputComposante.trim()) {
      newSearchParams.set("composante", inputComposante.trim());
    } else {
      newSearchParams.delete("composante");
    }

    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["graduates/tests", id, diplome, composante],
    queryFn: () => getGraduatesTests(id!, diplome!, composante || undefined),
    enabled: !!id && !!diplome,
  });

  const { data: optionsData, isLoading: optionsLoading } = useQuery({
    queryKey: ["graduates/options"],
    queryFn: () => getGraduatesOptions(),
  });

  const chartOptions = useMemo(() => {
    if (!data?.data || data.data.length === 0) {
      return null;
    }

    return {
      title: {
        text: `Nombre de diplômes délivrés par année - ${diplome}${composante ? ` (${composante})` : ""}`,
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
  }, [data, diplome, composante]);

  const renderFormInputs = () => (
    <div style={{ marginBottom: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
      {optionsLoading ? (
        <div>Chargement des options...</div>
      ) : (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "end" }}>
          <div style={{ flex: "1", minWidth: "250px" }}>
            <label htmlFor="id-select" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              ID Établissement :
            </label>
            <select
              id="id-select"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <option value="">Sélectionnez un établissement</option>
              {optionsData?.etablissement_ids?.map((idOption: string) => (
                <option key={idOption} value={idOption}>
                  {idOption}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1", minWidth: "250px" }}>
            <label htmlFor="diplome-select" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Diplôme :
            </label>
            <select
              id="diplome-select"
              value={inputDiplome}
              onChange={(e) => setInputDiplome(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <option value="">Sélectionnez un diplôme</option>
              {optionsData?.diplomes?.map((diplomeOption: string) => (
                <option key={diplomeOption} value={diplomeOption}>
                  {diplomeOption}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1", minWidth: "250px" }}>
            <label htmlFor="composante-select" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Composante <span style={{ fontWeight: "normal", fontStyle: "italic" }}>(facultatif)</span> :
            </label>
            <select
              id="composante-select"
              value={inputComposante}
              onChange={(e) => setInputComposante(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <option value="">Sélectionnez une composante</option>
              {optionsData?.composantes?.map((composanteOption: string) => (
                <option key={composanteOption} value={composanteOption}>
                  {composanteOption}
                </option>
              ))}
            </select>
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
      )}
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
