import { useQuery } from "@tanstack/react-query";
// import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button, Col, Container, Row, Title, Modal, ModalContent, Tag, TagGroup, Link } from "@dataesr/dsfr-plus";

import { getCollaborations } from "./query";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { getFlagEmoji } from "../../../../utils";

interface Entity {
  entities_name: string;
  country_code: string;
  projects: Array<{ project_id: string; role: string }>;
}

export default function EntitiesTable({ entityId }) {
  // const [searchParams] = useSearchParams();
  // const currentLang = searchParams.get("language") || "fr";
  // TODO: traduction
  // const entityId = window.location.pathname.split("/").pop()?.split("?")[0] || "";

  const { data, isLoading } = useQuery({
    queryKey: ["EntitiesCollaborations", entityId],
    queryFn: () => getCollaborations(entityId),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [sortColumn, setSortColumn] = useState("total_collaborations");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  // Fonction de tri
  const sortData = (items) => {
    return [...items]?.sort((a, b) => {
      if (sortColumn === "entities_name") {
        return sortDirection === "asc" ? a.entities_name.localeCompare(b.entities_name) : b.entities_name.localeCompare(a.entities_name);
      }
      return sortDirection === "asc" ? a[sortColumn] - b[sortColumn] : b[sortColumn] - a[sortColumn];
    });
  };

  // Fonction de filtrage
  const filterData = (items) => {
    return items?.filter((item) => {
      const nameMatch = item.entities_name.toLowerCase().includes(searchTerm.toLowerCase());
      const countryMatch = countryFilter ? item.country_code === countryFilter : true;
      return nameMatch && countryMatch;
    });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filtrage et tri des données
  const filteredData = filterData(data?.collaborations);
  const sortedData = sortData(filteredData || []);
  const displayedData = showAll ? sortedData : sortedData.slice(0, 20);

  if (isLoading || !data) return <DefaultSkeleton />;

  return (
    <Container fluid className="fr-mt-5w">
      <Row>
        <Title as="h2" look="h4">
          Collaborations de {data.name_fr}
        </Title>
      </Row>
      {/* Filtres */}
      <Row gutters className="fr-mb-2w">
        <Col>
          <label className="fr-label">Rechercher une entité</label>
          <input
            type="text"
            className="fr-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nom de l'entité..."
          />
        </Col>
        <Col>
          <label className="fr-label">Filtrer par pays</label>
          <select className="fr-select" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
            <option value="">Tous les pays</option>
            {Array.from(new Set(data.collaborations.map((item: Entity) => item.country_code))).map((code) => (
              <option key={code as string} value={code as string}>
                {code as string}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="fr-table fr-table--sm fr-table--no-caption fr-pt-0">
            <div className="fr-table__wrapper">
              <div className="fr-table__container">
                <div className="fr-table__content">
                  <table className="fr-table--layout-fixed">
                    <thead>
                      <tr>
                        <th>
                          <Button variant="text" onClick={() => handleSort("entities_name")}>
                            Entités {sortColumn === "entities_name" && (sortDirection === "asc" ? "↑" : "↓")}
                          </Button>
                        </th>
                        <th>
                          <Button variant="text" onClick={() => handleSort("total_collaborations")}>
                            Nombre de collaborations {sortColumn === "total_collaborations" && (sortDirection === "asc" ? "↑" : "↓")}
                          </Button>
                        </th>
                        <th>Liste</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedData.map((item) => (
                        <tr key={item._id}>
                          <td className="fr-p-1w">{`${getFlagEmoji(item.country_code)} ${item.entities_name}`}</td>
                          <td className="fr-p-1w" style={{ textAlign: "center" }}>
                            {item.projects.length.toLocaleString()}
                          </td>
                          <td className="fr-p-1w">
                            <Button
                              icon="eye-line"
                              size="sm"
                              onClick={() => {
                                setSelectedEntity(item);
                                setIsModalOpen(true);
                              }}
                              variant="text"
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="fr-text--sm" style={{ textAlign: "right" }}>
                          {/* {getI18nLabel("total-collaborations")} */}
                          <i>Nombre total de collaborations</i>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <strong>
                            <i>{sortedData.reduce((acc, item) => acc + item.projects.length, 0).toLocaleString()}</i>
                          </strong>
                        </td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {sortedData.length > 20 && (
            <Button onClick={() => setShowAll(!showAll)} size="sm">
              {showAll ? "Voir moins" : "Voir tout"}
            </Button>
          )}
        </Col>
      </Row>
      {/* Modale des projets */}
      <Modal isOpen={isModalOpen} hide={() => setIsModalOpen(false)} size="sm">
        <ModalContent>
          {selectedEntity && (
            <>
              <Title as="h2">{`${selectedEntity.entities_name} ${getFlagEmoji(selectedEntity.country_code)}`}</Title>
              <TagGroup className="fr-mb-2w">
                <Tag color="yellow-tournesol">{selectedEntity.projects.length} collaborations</Tag>
                <Tag color="green-bourgeon">{selectedEntity.projects.filter((p) => p.role === "coordinator").length} coordinations</Tag>
              </TagGroup>

              <div className="fr-table fr-table--sm fr-table--no-caption fr-pt-0">
                <div className="fr-table__wrapper">
                  <div className="fr-table__container">
                    <div className="fr-table__content">
                      <table className="fr-table--layout-fixed">
                        <thead>
                          <tr>
                            <th>Projet ID</th>
                            <th>Rôle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEntity.projects.map((project) => (
                            <tr key={project.project_id}>
                              <td>
                                <Link href={`https://cordis.europa.eu/project/${project.project_id}`} target="_blank" rel="noopener noreferrer">
                                  {project.project_id}
                                </Link>
                              </td>
                              <td>{project.role}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
}
