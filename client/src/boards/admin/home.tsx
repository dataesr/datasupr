import { Badge, Breadcrumb, Button, Col, Container, Link, Modal, ModalContent, ModalTitle, Row, Text, Title } from "@dataesr/dsfr-plus";
// import { useMutation, useQuery } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { queryClient } from "../../main";
import { useState } from "react";
import Callout from "../atlas/components/callout";

const { VITE_APP_SERVER_URL } = import.meta.env;

const formatCreationDate = (timestamp: number | null) => {
  if (!timestamp) return null;

  return new Date(timestamp * 1000).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// function DashboardCard({ dashboard, nbMessages }) {
//   return (
//     <div className="fr-card fr-enlarge-link">
//       <div className="fr-card__body">
//         <div className="fr-card__content">
//           <h2 className="fr-card__title">
//             <Link href={`/admin/${dashboard.id}`}>{dashboard.name}</Link>
//             <br />
//             <Badge color="green-emeraude">{`${dashboard?.data?.length} collections`}</Badge>
//             <p className="fr-m-0">
//               {nbMessages > 0 && (
//                 <Badge className="fr-mt-1w" color="brown-caramel" icon="mail-line">
//                   {`${nbMessages} message${nbMessages > 1 ? "s" : ""} ticketOffice`}
//                 </Badge>
//               )}
//             </p>
//           </h2>
//           <p>{dashboard.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["list-dashboards"],
    queryFn: () => fetch(`${VITE_APP_SERVER_URL}/admin/list-dashboards`).then((response) => response.json()),
  });

  const { data: boards, isLoading: isLoadingBoards } = useQuery({
    queryKey: ["list-boards"],
    queryFn: () => fetch(`${VITE_APP_SERVER_URL}/admin/list-boards`).then((response) => response.json()),
  });

  // const deleteFilesMutation = useMutation({
  //   mutationFn: () =>
  //     fetch(`${VITE_APP_SERVER_URL}/admin/delete-uploaded-files`, {
  //       method: "DELETE",
  //     }).then((response) => response.json()),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["list-uploaded-files"] });
  //   },
  // });

  const { data: filesData } = useQuery({
    queryKey: ["list-uploaded-files"],
    queryFn: () => fetch(`${VITE_APP_SERVER_URL}/admin/list-uploaded-files`).then((response) => response.json()),
  });

  // const { data: messages } = useQuery({
  //   queryKey: ["get-ticket-office-messages"],
  //   queryFn: () => fetch(`${VITE_APP_SERVER_URL}/admin/get-ticket-office-messages`).then((response) => response.json()),
  // });

  const [sortedFiles, setSortedFiles] = useState(filesData);
  const [successMessages, setSuccessMessages] = useState<Map<string, string>>(new Map());
  const [copyingCollections, setCopyingCollections] = useState<Set<string>>(new Set());

  const groupedBoards: Record<string, Record<string, Record<string, string>>> = boards?.reduce((acc, board) => {
    if (!acc[board.boardName]) {
      acc[board.boardName] = {};
    }
    if (!acc[board.boardName][board.collectionName]) {
      acc[board.boardName][board.collectionName] = {
        staging: "",
        "staging-previous": "",
        prod: "",
        "prod-previous": "",
      };
    }
    acc[board.boardName][board.collectionName][board.version] = board.version;
    return acc;
  }, {} as Record<string, Record<string, Record<string, string>>>);

  if (isLoading || !data) return <>Loading ...</>;

  const sortFiles = (key, order) => {
    const sorted = [...filesData].sort((a, b) => {
      if (order === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    setSortedFiles(sorted);
  };

  // let totalFilesSize = 0;
  // if (filesData) {
  //   totalFilesSize = filesData?.reduce((acc, file) => acc + Number(file.size), 0);
  // }

  const stagingToProd = async (collectionName, prodTimestamp) => {
    setCopyingCollections((prev) => new Set(prev).add(collectionName));
    setSuccessMessages((prev) => {
      const next = new Map(prev);
      next.delete(collectionName);
      return next;
    });

    try {
      const copyCollection = async (overwrite = false) => {
        const response = await fetch(`${VITE_APP_SERVER_URL}/admin/copy-collection`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceName: `${collectionName}_staging`,
            targetName: `${collectionName}_prod`,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 409 && !overwrite) {
            const shouldOverwrite = window.confirm("Une collection existe déjà en production. Voulez-vous la remplacer ?");
            if (!shouldOverwrite) {
              return false;
            }

            // If user confirms, copy prod collection to prod-previous after deleting it
            const deletePreviousResponse = await fetch(`${VITE_APP_SERVER_URL}/admin/delete-collection`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                collectionName: `${collectionName}_prod-previous`,
              }),
            });
            if (!deletePreviousResponse.ok) {
              throw new Error("Erreur lors de la suppression de la collection prod-previous");
            }

            const previousResponse = await fetch(`${VITE_APP_SERVER_URL}/admin/copy-collection`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sourceName: `${collectionName}_prod`,
                targetName: `${collectionName}_prod-previous`,
                timestamp: prodTimestamp,
              }),
            });
            const previousData = await previousResponse.json();
            if (!previousResponse.ok) {
              throw new Error(previousData.error || "Erreur lors de la copie de la collection vers prod-previous");
            }

            const deleteResponse = await fetch(`${VITE_APP_SERVER_URL}/admin/delete-collection`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                collectionName: `${collectionName}_prod`,
              }),
            });
            if (!deleteResponse.ok) {
              throw new Error("Erreur lors de la suppression de la collection");
            }

            return copyCollection(true);
          }
          throw new Error(data.error || "Erreur lors de la copie de la collection");
        }

        return true;
      };

      const success = await copyCollection();

      if (success) {
        queryClient.invalidateQueries({ queryKey: ["list-boards"] });
        setSuccessMessages((prev) => {
          const next = new Map(prev);
          next.set(collectionName, "Mise en production effectuée");
          return next;
        });
        setTimeout(() => {
          setSuccessMessages((prev) => {
            const next = new Map(prev);
            next.delete(collectionName);
            return next;
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Une erreur est survenue lors de la copie de la collection");
    } finally {
      setCopyingCollections((prev) => {
        const next = new Set(prev);
        next.delete(collectionName);
        return next;
      });
    }
  };

  const files = sortedFiles || filesData;

  return (
    <Container fluid className="fr-mx-10w">
      <Row className="fr-mb-5w">
        <Col>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/">Accueil</Link>
            <Link>
              <strong>Administration de dataSupR</strong>
            </Link>
          </Breadcrumb>
        </Col>
      </Row>
      {/* 
      <Row gutters>
        <Col xs={12} sm={6} md={4}>
          <div className="fr-card fr-enlarge-link">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h2 className="fr-card__title">
                  Uploads directory
                  <br />
                  <Badge className="fr-mr-1w" color="brown-caramel">
                    {`${filesData?.length} file${filesData?.length > 1 ? "s" : ""}`}
                  </Badge>
                  <Badge color="blue-cumulus">{`${totalFilesSize} Mo`}</Badge>
                  <br />
                  <br />
                  <Button aria-controls="list-of-files-modal-id" data-fr-opened="false" className="fr-mr-1w" icon="eye-line" variant="tertiary">
                    View list
                  </Button>
                  <Button color="error" icon="delete-line" onClick={() => deleteFilesMutation.mutate()}>
                    Delete all files
                  </Button>
                </h2>
              </div>
            </div>
          </div>
        </Col>
        {data.map((dashboard) => (
          <Col xs={12} sm={6} md={4} key={dashboard.id}>
            <DashboardCard dashboard={dashboard} nbMessages={messages?.data?.data?.filter((el) => el.extra.subApplication === dashboard.id).length} />
          </Col>
        ))}
      </Row>
      */}
      <h2 className="fr-mb-2w">Administration des versions</h2>
      <Callout>
        Règles de nommage des collections :<br />
        nom-du-tableau_nom-de-la-collection_version <br />
        - Le nom de la collection doit être préfixé par le nom du tableau
        <br />- Le nom de la collection doit être suffixé par la version (staging-previous, staging, prod-previous, prod)
      </Callout>
      <Row>
        <Col>
          {isLoadingBoards ? (
            <p>Loading boards...</p>
          ) : (
            <div className="fr-table fr-table--layout-fixed">
              <table>
                <thead>
                  <tr>
                    <th>Board Name</th>
                    <th>Collection</th>
                    <th>staging-previous</th>
                    <th>staging</th>
                    <th>prod-previous</th>
                    <th>prod</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedBoards || {})
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([boardName, collections]) =>
                      Object.entries(collections)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([collectionName, versions]) => {
                          const getVersionInfo = (version) =>
                            boards?.find((b) => b.boardName === boardName && b.collectionName === collectionName && b.version === version);

                          return (
                            <>
                              <tr key={`${boardName}-${collectionName}`}>
                                <td rowSpan={2}>
                                  <Title as="h3" look="h6">
                                    {boardName}
                                  </Title>
                                </td>
                                <td>
                                  <Text className="fr-text--bold fr-text--lg">{collectionName}</Text>
                                </td>
                                <td>
                                  {getVersionInfo("staging-previous")?.createdAt && (
                                    <Badge className="fr-ml-1w" color="blue-cumulus">
                                      <div className="fr-hint-text">Créé le {formatCreationDate(getVersionInfo("staging-previous").createdAt)}</div>
                                    </Badge>
                                  )}
                                </td>
                                <td>
                                  {getVersionInfo("staging")?.createdAt && (
                                    <Badge className="fr-ml-1w" color="blue-cumulus">
                                      <div className="fr-hint-text">Créé le {formatCreationDate(getVersionInfo("staging").createdAt)}</div>
                                    </Badge>
                                  )}
                                  {successMessages.get(`${boardName}_${collectionName}`) && (
                                    <Badge className="fr-ml-1w" color="success">
                                      {successMessages.get(`${boardName}_${collectionName}`)}
                                    </Badge>
                                  )}
                                </td>
                                <td>
                                  {getVersionInfo("prod-previous")?.createdAt && (
                                    <Badge className="fr-ml-1w" color="blue-cumulus">
                                      <div className="fr-hint-text">Créé le {formatCreationDate(getVersionInfo("prod-previous").createdAt)}</div>
                                    </Badge>
                                  )}
                                </td>
                                <td rowSpan={2} style={{ verticalAlign: "top" }}>
                                  {versions["prod"] && getVersionInfo("prod")?.createdAt && (
                                    <Badge className="fr-ml-1w" color="pink-tuile">
                                      <div className="fr-hint-text">Créé le {formatCreationDate(getVersionInfo("prod").createdAt)}</div>
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                              <tr key={`${boardName}-${collectionName}`}>
                                <td>
                                  <Button size="sm" color="blue-cumulus">
                                    Nouvelle version
                                  </Button>
                                </td>
                                <td>
                                  <Button color="blue-cumulus" disabled={!versions["staging-previous"]} size="sm">
                                    Restaurer vers staging
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    color="pink-tuile"
                                    disabled={!versions["staging"] || copyingCollections.has(`${boardName}_${collectionName}`)}
                                    onClick={() => stagingToProd(`${boardName}_${collectionName}`, getVersionInfo("prod").createdAt)}
                                    size="sm"
                                  >
                                    {copyingCollections.has(`${boardName}_${collectionName}`) ? "Copie en cours..." : "Mettre en production"}
                                  </Button>
                                </td>
                                <td>
                                  <Button color="green-emeraude" disabled={!versions["prod-previous"]} size="sm">
                                    Restaurer vers prod
                                  </Button>
                                </td>
                              </tr>
                            </>
                          );
                        })
                    )}
                </tbody>
              </table>
            </div>
          )}
        </Col>
      </Row>

      <Modal isOpen id="list-of-files-modal-id" hide={() => {}} size="lg">
        <ModalTitle>List of files</ModalTitle>
        <ModalContent>
          <div className="fr-table--sm fr-table fr-table">
            <div className="fr-table__wrapper">
              <div className="fr-table__container">
                <div className="fr-table__content"></div>
                <table>
                  <thead>
                    <tr>
                      <th>
                        File Name
                        <Button variant="text" size="sm" icon="arrow-up-s-fill" onClick={() => sortFiles("name", "asc")} />
                        <Button variant="text" size="sm" icon="arrow-down-s-fill" onClick={() => sortFiles("name", "desc")} />
                      </th>
                      <th>
                        Size (Mo)
                        <Button variant="text" size="sm" icon="arrow-up-s-fill" onClick={() => sortFiles("size", "asc")} />
                        <Button variant="text" size="sm" icon="arrow-down-s-fill" onClick={() => sortFiles("size", "desc")} />
                      </th>
                      <th>
                        Date
                        <Button variant="text" size="sm" icon="arrow-up-s-fill" onClick={() => sortFiles("date", "asc")} />
                        <Button variant="text" size="sm" icon="arrow-down-s-fill" onClick={() => sortFiles("date", "desc")} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {files?.map((file) => (
                      <tr key={file.id}>
                        <td>{file.name.split("_").slice(1).join("_")}</td>
                        <td>{file.size}</td>
                        <td>{new Date(Number(file.name.split("_")[0])).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </Container>
  );
}
