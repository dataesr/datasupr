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
} from "@dataesr/dsfr-plus";
import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../../main";
import { useState } from "react";

const { VITE_APP_SERVER_URL } = import.meta.env;

function DashboardCard({ dashboard, nbMessages }) {
  return (
    <div className="fr-card fr-enlarge-link">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <h2 className="fr-card__title">
            <Link href={`/admin/${dashboard.id}`}>{dashboard.name}</Link>
            <br />
            <Badge color="green-emeraude">{`${dashboard?.data?.length} collections`}</Badge>
            <p className="fr-m-0">
              {nbMessages > 0 && (
                <Badge
                  className="fr-mt-1w"
                  color="brown-caramel"
                  icon="mail-line"
                >
                  {`${nbMessages} message${
                    nbMessages > 1 ? "s" : ""
                  } ticketOffice`}
                </Badge>
              )}
            </p>
          </h2>
          <p>{dashboard.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["list-dashboards"],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/admin/list-dashboards`).then((response) =>
        response.json()
      ),
  });

  const deleteFilesMutation = useMutation({
    mutationFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/admin/delete-uploaded-files`, {
        method: "DELETE",
      }).then((response) => response.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-uploaded-files"] });
    },
  });

  const { data: filesData } = useQuery({
    queryKey: ["list-uploaded-files"],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/admin/list-uploaded-files`).then(
        (response) => response.json()
      ),
  });

  const { data: messages } = useQuery({
    queryKey: ["get-ticket-office-messages"],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/admin/get-ticket-office-messages`).then(
        (response) => response.json()
      ),
  });

  const [sortedFiles, setSortedFiles] = useState(filesData);

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

  let totalFilesSize = 0;
  if (filesData) {
    totalFilesSize = filesData?.reduce(
      (acc, file) => acc + Number(file.size),
      0
    );
  }

  const files = sortedFiles || filesData;

  return (
    <Container>
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
      <Row gutters>
        <Col xs={12} sm={6} md={4}>
          <div className="fr-card fr-enlarge-link">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h2 className="fr-card__title">
                  Uploads directory
                  <br />
                  <Badge className="fr-mr-1w" color="brown-caramel">
                    {`${filesData?.length} file${
                      filesData?.length > 1 ? "s" : ""
                    }`}
                  </Badge>
                  <Badge color="blue-cumulus">{`${totalFilesSize} Mo`}</Badge>
                  <br />
                  <br />
                  <Button
                    aria-controls="list-of-files-modal-id"
                    data-fr-opened="false"
                    className="fr-mr-1w"
                    icon="eye-line"
                    variant="tertiary"
                  >
                    View list
                  </Button>
                  <Button
                    color="error"
                    icon="delete-line"
                    onClick={() => deleteFilesMutation.mutate()}
                  >
                    Delete all files
                  </Button>
                </h2>
              </div>
            </div>
          </div>
        </Col>
        {data.map((dashboard) => (
          <Col xs={12} sm={6} md={4} key={dashboard.id}>
            <DashboardCard
              dashboard={dashboard}
              nbMessages={
                messages?.data?.data?.filter(
                  (el) => el.extra.subApplication === dashboard.id
                ).length
              }
            />
          </Col>
        ))}
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
                        <Button
                          variant="text"
                          size="sm"
                          icon="arrow-up-s-fill"
                          onClick={() => sortFiles("name", "asc")}
                        />
                        <Button
                          variant="text"
                          size="sm"
                          icon="arrow-down-s-fill"
                          onClick={() => sortFiles("name", "desc")}
                        />
                      </th>
                      <th>
                        Size (Mo)
                        <Button
                          variant="text"
                          size="sm"
                          icon="arrow-up-s-fill"
                          onClick={() => sortFiles("size", "asc")}
                        />
                        <Button
                          variant="text"
                          size="sm"
                          icon="arrow-down-s-fill"
                          onClick={() => sortFiles("size", "desc")}
                        />
                      </th>
                      <th>
                        Date
                        <Button
                          variant="text"
                          size="sm"
                          icon="arrow-up-s-fill"
                          onClick={() => sortFiles("date", "asc")}
                        />
                        <Button
                          variant="text"
                          size="sm"
                          icon="arrow-down-s-fill"
                          onClick={() => sortFiles("date", "desc")}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {files?.map((file) => (
                      <tr key={file.id}>
                        <td>{file.name.split("_").slice(1).join("_")}</td>
                        <td>{file.size}</td>
                        <td>
                          {new Date(
                            Number(file.name.split("_")[0])
                          ).toLocaleString()}
                        </td>
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
