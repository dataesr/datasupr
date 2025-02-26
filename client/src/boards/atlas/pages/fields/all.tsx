import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { Badge, Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import FilieresSectorsChart from "../../charts/filieres-sectors.tsx";
import {
  getNumberOfStudents,
  getNumberOfStudentsByGenderAndLevel,
} from "../../../../api/atlas.ts";

import FilieresGendersChart from "../../charts/filieres-genders.tsx";
import FilieresList from "../../../../components/filieres-list/index.tsx";
import { useAtlas } from "../../useAtlas.tsx";

export default function AllFields() {
  const { DEFAULT_CURRENT_YEAR } = useAtlas();

  const [searchParams] = useSearchParams();
  const currentYear =
    searchParams.get("annee_universitaire") || DEFAULT_CURRENT_YEAR;
  const params = [...searchParams]
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const { data, isLoading } = useQuery({
    queryKey: ["atlas/number-of-students", params],
    queryFn: () => getNumberOfStudents(params),
  });

  const { data: dataByGender, isLoading: isLoadinByGender } = useQuery({
    queryKey: ["atlas/number-of-students-by-gender-and-level", params],
    queryFn: () => getNumberOfStudentsByGenderAndLevel(params),
  });

  return (
    <>
      <Container as="section" fluid>
        <Row>
          <Col>
            <FilieresList />
          </Col>
        </Row>
        <Row className="fr-my-5w">
          <Col>
            <Title as="h3" look="h6">
              Nombre d'étudiants inscrits par fillière répartis par secteur
              <Badge color="yellow-tournesol" className="fr-ml-1w">
                {currentYear}
              </Badge>
            </Title>
            <FilieresSectorsChart
              data={data?.filieres || []}
              isLoading={isLoading}
            />
          </Col>
        </Row>
        <Row className="fr-my-5w">
          <Col>
            <Title as="h3" look="h6">
              Nombre d'étudiants inscrits par fillière répartis par genre
              <Badge color="yellow-tournesol" className="fr-ml-1w">
                {currentYear}
              </Badge>
            </Title>
            <FilieresGendersChart
              data={dataByGender || []}
              isLoading={isLoadinByGender}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
