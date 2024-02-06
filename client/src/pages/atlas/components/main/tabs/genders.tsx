import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from "react-router-dom";

import { Container, Row, Col, Title, Text, Badge, Button } from '@dataesr/dsfr-plus';
import GenderChart from '../../../charts/gender.tsx';
import { getNumberOfStudents, getNumberOfStudentsByYear, getSimilarElements } from '../../../../../api/atlas.ts';
import GenderStackedChart from '../../../charts/gender-stacked.tsx';

import { DataByYear, SimilarData } from "../../../../../types/atlas.ts";
import StudentsCardWithTrend from '../../../../../components/cards/students-card-with-trend/index.tsx';
import TrendCard from '../../../charts/trend.tsx';

export function Genders() {
  const [searchParams] = useSearchParams();
  const currentYear = searchParams.get('annee_universitaire') || '2022-23';
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["atlas/number-of-students", params],
    queryFn: () => getNumberOfStudents(params)
  })

  const { data: dataByYear, isLoading: isLoadingByYear } = useQuery({
    queryKey: ["atlas/number-of-students-by-year", params],
    queryFn: () => getNumberOfStudentsByYear(params)
  })

  const dataGender = [
    {
      name: 'Masculin',
      y: dataByYear?.find((el: DataByYear) => el.annee_universitaire === data?.annee_universitaire)?.effectif_masculin || 0,
    },
    {
      name: 'Féminin',
      y: dataByYear?.find((el: DataByYear) => el.annee_universitaire === data?.annee_universitaire)?.effectif_feminin || 0,
    }
  ];

  const effectifF = dataByYear?.find((el: DataByYear) => el.annee_universitaire === data?.annee_universitaire)?.effectif_feminin || 0;
  const effectifM = dataByYear?.find((el: DataByYear) => el.annee_universitaire === data?.annee_universitaire)?.effectif_masculin || 0;
  const pctF = effectifF / (effectifF + effectifM);

  function getLevel() {
    if (searchParams.get('geo_id')?.startsWith("R")) { return "REGION" }
    if (searchParams.get('geo_id')?.startsWith("D")) { return "DEPARTEMENT" }
    if (searchParams.get('geo_id')?.startsWith("A")) { return "ACADEMIE" }
    if (searchParams.get('geo_id')?.startsWith("U")) { return "UNITE_URBAINE" }
    if (searchParams.get('geo_id')?.startsWith("C")) { return "COMMUNE" }

    return "";
  }

  const gt = pctF - pctF * 0.05;
  const lt = pctF + pctF * 0.05;
  const similarParams = {
    niveau_geo: getLevel(),
    needle: "pctF",
    gt: gt * 100,
    lt: lt * 100,
    annee_universitaire: currentYear
  };

  const { data: dataSimilar, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ["atlas/similar-elements", similarParams],
    queryFn: () => getSimilarElements(similarParams)
  })

  // order by distance
  const dataSimilarSorted = dataSimilar?.map((el: SimilarData) => {
    return {
      ...el,
      distance: Math.abs(pctF * 100 - el.pctF),
    }
  }).sort((a: SimilarData, b: SimilarData) => a.distance - b.distance);

  if (isLoading || isLoadingByYear || isLoadingSimilar) {
    return <div>Loading...</div>
  }

  return (
    <Container as="section" fluid>
      <Row className="fr-mt-5w" gutters>
        <Col>
          <Row gutters>
            <Col>
              <StudentsCardWithTrend
                descriptionNode={<Badge color="brown-cafe-creme">{`Année universitaire ${currentYear}`}</Badge>}
                number={dataByYear?.find((el: DataByYear) => el.annee_universitaire === data?.annee_universitaire)?.effectif_feminin || 0}
                label='Etudiantes inscrites'
                trendGraph={<TrendCard color="#e18b76" data={dataByYear.map((item: DataByYear) => item.effectif_feminin)} />}
              />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <StudentsCardWithTrend
                descriptionNode={<Badge color="brown-cafe-creme">{`Année universitaire ${currentYear}`}</Badge>}
                number={dataByYear?.find((el: DataByYear) => el.annee_universitaire === data?.annee_universitaire)?.effectif_masculin || 0}
                label='Etudiants inscrits'
                trendGraph={<TrendCard color="#efcb3a" data={dataByYear.map((item: DataByYear) => item.effectif_masculin)} />}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <GenderChart data={dataGender || []} isLoading={isLoading} currentYear={data?.annee_universitaire || ''} />
        </Col>
      </Row>
      <Row className="fr-mt-5w">
        <Col>
          <GenderStackedChart data={dataByYear} isLoading={isLoadingByYear} />
        </Col>
      </Row>

      <Row className="fr-mt-5w">
        <Col>
          <Title as="h2" look="h5">
            Liste des territoires similaires sur la répartition par genre pour l'année universitaire <Badge color="yellow-tournesol">{currentYear}</Badge>
          </Title>
          <Text>
            Les territoires similaires sont ceux qui ont une répartition par genre du nombre d'étudiants inscrits proche du territoire sélectionné.
            La tolérance maximum est de <strong>5%</strong>. Seuls les 5 premiers résutats sont affichés.
            <br />
            L'année universitaire sélectionnée est <Badge color="yellow-tournesol">{currentYear}</Badge>.
            <br />Seuls les territoires ayant le même niveau géographique que le territoire sélectionné sont pris en compte (<Badge color="blue-ecume">{getLevel()}</Badge>).
            <br />
            <br />
            <ul>
              {
                dataSimilarSorted?.slice(0, 6).filter((el: SimilarData) => el.geo_id !== searchParams.get('geo_id')).map((el: SimilarData) => (
                  <li key={el.geo_id}>
                    {el.geo_nom} (Féminin: <strong>{el.pctF.toFixed(2)}%</strong> - Masculin: <strong>{el.pctM.toFixed(2)}%</strong>)
                    <Button
                      size="sm"
                      variant="text"
                      className="fr-ml-1w"
                      color="pink-tuile"
                      onClick={() => navigate(`/atlas/general?geo_id=${el.geo_id}&annee_universitaire=${currentYear}`)}
                    >
                      Voir
                    </Button>
                  </li>
                ))
              }
            </ul>
          </Text>
        </Col>
      </Row>
    </Container>
  )
}

