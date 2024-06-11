import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  Badge,
  Container,
  Row,
  Col,
  Title,
  Text,
  Link,
} from "@dataesr/dsfr-plus";

import { DataByYear } from "../../../../../types/atlas.ts";
import { getNumberOfStudents } from "../../../../../api/atlas.ts";
import { getNumberOfStudentsByYear } from "../../../../../api/atlas.ts";
import FieldsMainCard from "../../../../../components/cards/fields-main-card/index.tsx";
import GendersCard from "../../../../../components/cards/genders-card/index.tsx";
import SectorsCard from "../../../../../components/cards/sectors-card/index.tsx";
import StudentsCardWithTrend from "../../../../../components/cards/students-card-with-trend/index.tsx";
import TrendCard from "../../../charts/trend.tsx";

export function General() {
  const [searchParams] = useSearchParams();
  const params = [...searchParams]
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const currentYear = searchParams.get("annee_universitaire") || "2022-23";

  const { data, isLoading } = useQuery({
    queryKey: ["atlas/number-of-students", params],
    queryFn: () => getNumberOfStudents(params),
  });

  const { data: dataByYear, isLoading: isLoadingByYear } = useQuery({
    queryKey: ["atlas/number-of-students-by-year", params],
    queryFn: () => getNumberOfStudentsByYear(params),
  });

  if (isLoading || isLoadingByYear) {
    return <div>Loading...</div>;
  }

  const effectifPU =
    dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)
      ?.effectif_pu || 0;
  const effectifPR =
    dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)
      ?.effectif_pr || 0;
  const pctPU = Math.round((effectifPU / (effectifPU + effectifPR)) * 100);
  const pctPR = Math.round((effectifPR / (effectifPU + effectifPR)) * 100);

  const effectifM =
    dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)
      ?.effectif_masculin || 0;
  const effectifF =
    dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)
      ?.effectif_feminin || 0;
  const pctM = Math.round((effectifM / (effectifM + effectifF)) * 100);
  const pctF = Math.round((effectifF / (effectifM + effectifF)) * 100);

  return (
    <Container as="section" fluid>
      <Row gutters>
        <Col md={6}>
          <StudentsCardWithTrend
            descriptionNode={
              <Badge color="yellow-tournesol">{currentYear}</Badge>
            }
            number={
              dataByYear?.find(
                (el: DataByYear) => el.annee_universitaire === currentYear
              )?.effectif_total || 0
            }
            label="Etudiants inscrits"
            trendGraph={
              <TrendCard
                color="#e18b76"
                data={dataByYear?.map((item) => item.effectif_feminin)}
              />
            }
          />
        </Col>
        <Col md={6}>
          <FieldsMainCard
            descriptionNode={
              <Badge color="yellow-tournesol">{currentYear}</Badge>
            }
            number={
              data?.filieres?.filter((el) => el.effectif_PR || el.effectif_PU)
                .length || 0
            }
            label="Nombre de filières représentées sur le territoire"
            to={`/atlas/effectifs-par-filiere?${params}`}
          />
        </Col>
      </Row>
      <Row className="fr-mt-5w">
        <Col md={6}>
          <Title as="h3" look="h5">
            Répartition des étudiants par secteur
          </Title>
          <Text>
            Les effectifs étudiants sont répartis entre le secteur public et le
            secteur privé.
            <br />
            <br />
            <strong>{effectifPU.toLocaleString()}</strong> étudiants sont
            inscrits dans le secteur public et{" "}
            <strong>{effectifPR.toLocaleString()}</strong> dans le secteur
            privé, soit une répartition de <strong>{pctPU}%</strong> dans le
            secteur public et <strong>{pctPR}%</strong> dans le secteur privé
            pour l'année universitaire{" "}
            <Badge color="yellow-tournesol">{currentYear}</Badge>.
          </Text>
          <Link href={`/atlas/effectifs-par-secteurs?${params}`}>
            Voir le détail des effectifs par secteur
          </Link>
        </Col>
        <Col md={6}>
          <SectorsCard
            currentYear={currentYear}
            values={{
              labels: data?.secteurs?.map((item) => item.label) || [],
              values: data?.secteurs?.map((item) => item.value) || [],
            }}
          />
        </Col>
      </Row>
      <Row className="fr-mt-5w">
        <Col md={6}>
          <Title as="h3" look="h5">
            Répartition des étudiants par genre
          </Title>
          <Text>
            Les effectifs étudiants sont répartis entre les genres masculin et
            féminin.
            <br />
            <br />
            <strong>{effectifM.toLocaleString()}</strong> étudiants sont de
            genre masculin et <strong>{effectifF.toLocaleString()}</strong> de
            genre féminin, soit une répartition de <strong>{pctM}%</strong> dans
            le genre masculin et <strong>{pctF}%</strong> dans le genre féminin
            pour l'année universitaire{" "}
            <Badge color="yellow-tournesol">{currentYear}</Badge>.
          </Text>
          <Link href={`/atlas/effectifs-par-genre?${params}`}>
            Voir le détail des effectifs par genre
          </Link>
        </Col>
        <Col md={6}>
          <GendersCard
            currentYear={currentYear}
            values={{
              labels: data?.gender?.map((item) => item.label) || [],
              values: data?.gender?.map((item) => item.value) || [],
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}
