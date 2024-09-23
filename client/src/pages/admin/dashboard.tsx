import {
  Button,
  Col,
  Container,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Title,
} from "@dataesr/dsfr-plus";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const { VITE_APP_SERVER_URL } = import.meta.env;

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState({
    collectionId: "",
    newCollectionId: "",
  });
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

  // const addCollection = ({ dashboardId, collectionId }) => {
  //   setSelected({ dashboardId, collectionId });
  //   setIsOpen(true);
  // };

  return (
    <Container>
      <Row>
        <Col>Liste des collections/tables du dashboard {dashboardId}</Col>
      </Row>
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
                    className="fr-ml-3w"
                    size="sm"
                    variant="tertiary"
                    icon="file-add-line"
                    onClick={() => {
                      setSelectedCollection({
                        collectionId: collection.id,
                        newCollectionId: `${collection.id}_${new Date()
                          .getTime()
                          .toString()}`,
                      });
                      setIsOpen(true);
                      // addCollection({
                      //   dashboardId,
                      //   collectionId: collection.id,
                      // });
                    }}
                  />
                </Title>
                <div
                  className="fr-table--sm fr-table fr-table"
                  id="table-sm-component"
                >
                  <div className="fr-table__wrapper">
                    <div className="fr-table__container">
                      <div className="fr-table__content">
                        <table>
                          <thead>
                            <tr>
                              <th>ID de la version</th>
                              <th>Date de création</th>
                              {/* <th>Version courante</th> */}
                            </tr>
                          </thead>
                          {collection.versions.map((version) => (
                            <tr key={version.id}>
                              <td>{version.id}</td>
                              <td>{version.createdAt}</td>
                              {version.id === collection.current && (
                                <td>
                                  <span
                                    className="fr-icon-star-s-fill"
                                    aria-hidden="true"
                                  />
                                </td>
                              )}
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)} size="lg">
        <ModalTitle>{dashboardId}</ModalTitle>
        <ModalContent>
          Ajout d'une nouvelle version à la collection{" "}
          <strong>{selectedCollection.collectionId}</strong>
          <div className="fr-upload-group fr-mt-3w">
            <label className="fr-label" htmlFor="file-upload-with-error">
              Sélectionnez un fichier
              <span className="fr-hint-text">
                Formats supportés : csv, json
              </span>
            </label>
            <input
              className="fr-upload"
              type="file"
              aria-describedby="file-upload-with-error-desc-error"
              id="file-upload-with-error"
              name="file-upload-with-error"
              accept=".csv,.json"
            />
            {/* <p id="file-upload-with-error-desc-error" className="fr-error-text">
              Format de fichier non supporté
            </p> */}
          </div>
          <div>
            Identifiant de la nouvelle version:{" "}
            {selectedCollection.newCollectionId}
          </div>
          <Button className="fr-mt-3w">Ajouter</Button>
        </ModalContent>
      </Modal>
    </Container>
  );
}
