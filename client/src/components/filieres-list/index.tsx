import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  TagGroup,
  Tag,
  Text,
  Title,
  Badge,
} from "@dataesr/dsfr-plus";

import ListSkeleton from "../../pages/atlas/charts/skeletons/list.tsx";
import { getNumberOfStudents } from "../../api/atlas.ts";

export default function FilieresList() {
  const [searchParams] = useSearchParams();
  const params = [...searchParams]
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const currentYear = searchParams.get("annee_universitaire") || "2022-23";

  const { data, isLoading } = useQuery({
    queryKey: ["atlas/number-of-students", params],
    queryFn: () => getNumberOfStudents(params),
  });

  if (isLoading || !data || !data.filieres.length) {
    return <ListSkeleton />;
  }

  return (
    <Container fluid className="fr-my-1w">
      <Title as="h2" look="h5" className="fr-mb-0">
        Liste des filières représentées sur le territoire
        <Badge color="blue-ecume" size="sm">
          {data?.filieres.length}
        </Badge>
      </Title>
      <hr />
      <Row gutters>
        <Col>
          {data?.filieres.map((filiere) => {
            if ((filiere.effectif_PR || 0) + (filiere.effectif_PU || 0) !== 0) {
              return (
                <li style={{ listStyle: "none" }}>
                  <Title as="h3" look="h6" className="fr-mb-0">
                    <Link
                      to={`/atlas/effectifs-par-filiere/${filiere.id}?${params}`}
                    >
                      {filiere.label}
                    </Link>
                  </Title>
                  <Text as="p" className="fr-mb-1w">
                    Effectifs étudiants{" "}
                    <Badge color="yellow-tournesol" size="sm">
                      {currentYear}
                    </Badge>{" "}
                    :{" "}
                    {(
                      (filiere.effectif_PR || 0) + (filiere.effectif_PU || 0)
                    ).toLocaleString("fr-FR")}
                  </Text>
                  <TagGroup>
                    {filiere.effectif_PU > 0 && (
                      <Tag color="blue-cumulus" size="sm">
                        Secteur public
                      </Tag>
                    )}
                    {filiere.effectif_PR > 0 && (
                      <Tag color="yellow-moutarde" size="sm">
                        Secteur privé
                      </Tag>
                    )}
                  </TagGroup>
                  <hr />
                </li>
              );
            }
            return null;
          })}
        </Col>
      </Row>
    </Container>
  );
}
