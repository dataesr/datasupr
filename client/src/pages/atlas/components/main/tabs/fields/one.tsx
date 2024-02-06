import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getNumberOfStudentsByYear, getNumberOfStudents } from "../../../../../../api/atlas.ts";
import { useQuery } from "@tanstack/react-query";
import {
  Col, Container, Row,
  Title, Text,
  Button, Badge
} from '@dataesr/dsfr-plus';
import ColumnsChart from "../../../../charts/columns.tsx";
import { DEFAULT_CURRENT_YEAR } from "../../../../../../constants.tsx";
import { DataByYear } from "../../../../../../types/atlas.ts";
import StudentsCard from "../../../../../../components/cards/students-card/index.tsx";
import SectorsCard from "../../../../../../components/cards/sectors-card/index.tsx";
import GendersCard from "../../../../../../components/cards/genders-card/index.tsx";

export default function OneField() {
  const { idFiliere } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const retParams = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  const params = retParams + `&regroupement=${idFiliere}`;

  const { data: dataByYear, isLoading: isLoadingByYear } = useQuery({
    queryKey: ["atlas/number-of-students-by-year", params],
    queryFn: () => getNumberOfStudentsByYear(params)
  })

  const { data, isLoading } = useQuery({
    queryKey: ["atlas/number-of-students", params],
    queryFn: () => getNumberOfStudents(params)
  })

  const currentYear = searchParams.get('annee_universitaire') || DEFAULT_CURRENT_YEAR;

  if (isLoading || isLoadingByYear) {
    return <div>Loading...</div>
  }

  // const dataSectors = [
  //   {
  //     name: 'Secteur public',
  //     y: dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)?.effectif_pu || 0,
  //   },
  //   {
  //     name: 'Secteur privé',
  //     y: dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)?.effectif_pr || 0,
  //   }
  // ];

  // const dataGender = [
  //   {
  //     name: 'Masculin',
  //     y: dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)?.effectif_masculin || 0,
  //   },
  //   {
  //     name: 'Féminin',
  //     y: dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)?.effectif_feminin || 0,
  //   }
  // ];

  const effectifPU = dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)?.effectif_pu || 0;
  const effectifPR = dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)?.effectif_pr || 0;
  const pctPU = Math.round(effectifPU / (effectifPU + effectifPR) * 100);
  const pctPR = Math.round(effectifPR / (effectifPU + effectifPR) * 100);

  const effectifM = dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)?.effectif_masculin || 0;
  const effectifF = dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)?.effectif_feminin || 0;
  const pctM = Math.round(effectifM / (effectifM + effectifF) * 100);
  const pctF = Math.round(effectifF / (effectifM + effectifF) * 100);

  return (
    <>
      <Button size="sm" color="pink-tuile" onClick={() => navigate('/atlas/effectifs-par-filiere?' + retParams)}>
        Revenir à toutes les filières
      </Button>

      <Container as="section" fluid>
        <Row className="fr-mt-3w">
          <Col>
            <Title as="h2">{data?.filieres[0]?.label}</Title>
          </Col>
        </Row>
        <Row className="fr-mb-5w" gutters>
          <Col md={6}>
            <StudentsCard
              descriptionNode={<Badge color='yellow-tournesol'>{`Année universitaire ${currentYear}`}</Badge>}
              number={dataByYear?.find((el: DataByYear) => el.annee_universitaire === currentYear)?.effectif_total || 0}
            />
          </Col>
        </Row>
        <Row className="fr-mt-5w">
          <Col md={6}>
            <Title as="h3" look="h5">
              Répartition des étudiants par secteur
            </Title>
            <Text>
              Les effectifs étudiants sont répartis entre le secteur public et le secteur privé.
              <br />
              <br />
              <strong>{effectifPU.toLocaleString()}</strong> étudiants sont inscrits dans le secteur public et <strong>{effectifPR.toLocaleString()}</strong> dans le secteur privé, soit une répartition de <strong>{pctPU}%</strong> dans le secteur public et <strong>{pctPR}%</strong> dans le secteur privé pour l'année universitaire <Badge color="yellow-tournesol">{currentYear}</Badge>.
            </Text>
          </Col>
          <Col md={6}>
            {/* <SectortsChart data={dataSectors || []} isLoading={isLoadingByYear} currentYear={currentYear} /> */}
            <SectorsCard
              currentYear={currentYear}
              values={{
                labels: data?.secteurs?.map((item) => item.label),
                values: data?.secteurs?.map((item) => item.value)
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
              Les effectifs étudiants sont répartis entre les genres masculin et féminin.
              <br />
              <br />
              {effectifM.toLocaleString()} étudiants sont de genre masculin et <strong>{effectifF.toLocaleString()}</strong> de genre féminin, soit une répartition de <strong>{pctM}%</strong> dans le genre masculin et <strong>{pctF}%</strong> dans le genre féminin pour l'année universitaire <Badge color="yellow-tournesol">{currentYear}</Badge>.
            </Text>
          </Col>
          <Col md={6}>
            <GendersCard
              currentYear={currentYear}
              values={{
                labels: data?.gender?.map((item) => item.label),
                values: data?.gender?.map((item) => item.value)
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Title as="h3" look="h5">
              Données historiques depuis l'année universitaire <Badge color="yellow-tournesol">2001-02</Badge>
            </Title>
            <ColumnsChart
              data={dataByYear || []} label="effectif_total"
              currentYear={currentYear}
            />
          </Col>
        </Row>
      </Container>
    </>
  );

}