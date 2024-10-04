import {
  Badge,
  Breadcrumb,
  Button,
  Col,
  Container,
  Link,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Title,
} from "@dataesr/dsfr-plus";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { queryClient } from "../../main";
import UploadVersion from "./upload-version";

const { VITE_APP_SERVER_URL } = import.meta.env;

export default function Dashboard() {
  const { dashboardId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["list-dashboards"],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/admin/list-dashboards`).then((response) =>
        response.json()
      ),
  });

  if (isLoading || !data) {
    return (
      <Container>
        <Row>
          <Col>
            Chargement des collections/tables du dashboard {dashboardId}
          </Col>
        </Row>
      </Container>
    );
  }

  const invalidateDashboardQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["list-dashboards"] });
  };

  const setCurrentVersion = (collectionId, versionId) => {
    fetch(`${VITE_APP_SERVER_URL}/admin/set-current-version`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dashboardId,
        dataId: collectionId,
        versionId,
      }),
    }).then((response) => {
      if (response.ok) {
        invalidateDashboardQueries();
      } else {
        console.log("Erreur lors de la modification de la version courante");
      }
    });
  };

  const deleteVersion = (collectionId, versionId) => {
    fetch(`${VITE_APP_SERVER_URL}/admin/delete-version`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dashboardId,
        collectionId,
        versionId,
      }),
    }).then((response) => {
      if (response.ok) {
        invalidateDashboardQueries();
      } else {
        console.log("Erreur lors de la suppression de la version");
      }
    });
  };

  return (
    <Container>
      <Row className="fr-mb-5w">
        <Col>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/admin">Admin - accueil</Link>
            <Link>
              <strong>Dashboard {dashboardId}</strong>
            </Link>
          </Breadcrumb>
        </Col>
      </Row>
      <Title as="h1" look="h6">
        Liste des collections/tables
      </Title>

      <ul>
        {data
          .find((dashboard) => dashboard.id === dashboardId)
          .data.map((collection) => (
            <li key={collection.id}>
              <div className="fr-card fr-my-2w fr-p-3w">
                <Title as="h2" look="h6">
                  <span className="fr-icon-bookmark-line" aria-hidden="true" />
                  {collection.id}
                  <Button
                    aria-controls={`${collection.id}-modal-id`}
                    className="fr-ml-3w"
                    data-fr-opened="false"
                    icon="file-add-line"
                    size="sm"
                    variant="tertiary"
                  />

                  <Modal
                    isOpen
                    id={`${collection.id}-modal-id`}
                    size="lg"
                    hide={() => {}}
                  >
                    <ModalTitle>
                      Ajout d'une version à la collection
                      <Badge>{collection.id}</Badge>
                    </ModalTitle>
                    <ModalContent>
                      <UploadVersion
                        dashboardId={dashboardId || ""}
                        collectionId={collection.id}
                        invalidateDashboardQueries={invalidateDashboardQueries}
                      />
                    </ModalContent>
                  </Modal>
                </Title>
                <Row gutters>
                  <Col md={8}>
                    <div className="fr-table--sm fr-table fr-table">
                      <div className="fr-table__wrapper">
                        <div className="fr-table__container">
                          <div className="fr-table__content">
                            <table>
                              <thead>
                                <tr>
                                  <th>ID de la version</th>
                                  <th>Date de création</th>
                                  <th colSpan={2}>Staging</th>
                                  <th colSpan={2}>Production</th>
                                  <th />
                                </tr>
                              </thead>
                              {collection.versions.map((version) => (
                                <tr key={version.id}>
                                  <td>{version.id}</td>
                                  <td>
                                    {new Date(
                                      version.createdAt
                                    ).toLocaleString()}
                                  </td>
                                  {version.id === collection.current ? (
                                    <td>
                                      <Button
                                        color="yellow-tournesol"
                                        icon="star-s-fill"
                                        onClick={() => {
                                          setCurrentVersion(
                                            collection.id,
                                            version.id
                                          );
                                        }}
                                        title="Définir la version courante de staging"
                                        variant="text"
                                      />
                                    </td>
                                  ) : (
                                    <td>
                                      <Button
                                        color="beige-gris-galet"
                                        icon="star-s-line"
                                        onClick={() => {
                                          setCurrentVersion(
                                            collection.id,
                                            version.id
                                          );
                                        }}
                                        title="Définir la version courante de staging"
                                        variant="text"
                                      />
                                    </td>
                                  )}
                                  <td>
                                    <Button
                                      color="beige-gris-galet"
                                      icon="todo-line"
                                      onClick={() => {
                                        const aside =
                                          document.getElementById("aside");
                                        if (aside) {
                                          aside.innerText =
                                            "indexes en staging";
                                        }
                                      }}
                                      size="sm"
                                      title="Gérer les index en staging"
                                      variant="text"
                                    />
                                  </td>
                                  <td>
                                    <Button
                                      color="beige-gris-galet"
                                      disabled
                                      icon="star-s-line"
                                      title="Définir la version courante de production"
                                      variant="text"
                                    />
                                  </td>
                                  <td>
                                    <Button
                                      color="beige-gris-galet"
                                      disabled
                                      icon="todo-line"
                                      size="sm"
                                      title="Gérer les index en production"
                                      variant="text"
                                    />
                                  </td>
                                  <td>
                                    <Button
                                      color="error"
                                      icon="delete-bin-line"
                                      onClick={() => {
                                        deleteVersion(
                                          collection.id,
                                          version.id
                                        );
                                      }}
                                      size="sm"
                                      title="Supprimer la version"
                                      variant="text"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div id="aside">vide</div>
                  </Col>
                </Row>
              </div>
            </li>
          ))}
      </ul>
    </Container>
  );
}
