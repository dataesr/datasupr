import { Outlet, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';

import { Badge, BadgeGroup, Button, Container, Row, Col, Title } from '@dataesr/dsfr-plus';

import { getNumberOfStudentsHistoricByLevel, getNumberOfStudentsMap } from '../../../../../api/atlas.ts';

import Menu from './menu.tsx';

import FranceMap from '../../../charts/France-map.tsx';
import MapWithPolygon from '../../../charts/map-with-polygon.tsx';
import Template from "../../../../../components/template/index.tsx";

export default function Header() {
  const [searchParams] = useSearchParams();
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  const navigate = useNavigate();

  const geoId = searchParams.get('geo_id') || '';
  const currentYear = searchParams.get('annee_universitaire') || '2022-23';

  const { data: dataMap, isLoading: isLoadingMap } = useQuery({
    queryKey: ["atlas/number-of-students-map", params],
    queryFn: () => getNumberOfStudentsMap(params)
  })

  const { data: dataHistoric, isLoading: isLoadingHistoric } = useQuery({
    queryKey: ["atlas/number-of-students-historic-by-level", geoId],
    queryFn: () => getNumberOfStudentsHistoricByLevel(geoId, currentYear)
  })

  // if (isLoadingHistoric || isLoadingMap) {
  //   return <div>Loading...</div>
  // }

  const getBadgesGeo = () => {
    if (!geoId) { return null; }

    if (geoId.startsWith('R')) { return <Badge color="blue-ecume">Région</Badge>; }
    if (geoId.startsWith('D')) { return <Badge color="blue-ecume">Département</Badge>; }
    if (geoId.startsWith('A')) { return <Badge color="blue-ecume">Académie</Badge>; }
  }

  const getSubLevel = () => {
    if (!geoId) { return null; }

    if (geoId.startsWith('R')) { return 'Liste des académies'; }
    if (geoId.startsWith('D')) { return 'Liste des communes'; }
    if (geoId.startsWith('A')) { return 'Liste des départements'; }
    if (geoId.startsWith('U')) { return 'Liste des communes'; }
  }

  const getTitle = () => {
    if (!geoId) { return 'Effectifs étudiants de la France'; }

    if (geoId.startsWith('R')) { return 'Effectifs étudiants de la région'; }
    if (geoId.startsWith('D')) { return 'Effectifs étudiants du département'; }
    if (geoId.startsWith('A')) { return 'Effectifs étudiants de l\'académie'; }
    if (geoId.startsWith('U')) { return 'Effectifs étudiants de l\'unité urbaine'; }

    return 'Effectifs étudiants de la commune';
  }

  function ListTitle({ currentYear }: { currentYear: string }) {
    return (
      <>
        <Row>
          <Col>
            <Title as="h2" look="h5" className="fr-mb-0">
              {getTitle()}
            </Title>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          <div style={{ flexGrow: "1" }}>
            <strong>
              <i>{getSubLevel()}</i>
            </strong>
          </div>
          <div className="fr-mb-1w">
            <Badge color="yellow-tournesol">{currentYear}</Badge>
          </div>
        </Row>
      </>
    )
  }

  function SubList({ data }) {
    if (isLoadingHistoric) {
      return <Template />;
    }
    if (!data) {
      return null;
    }
    return (
      <Container fluid as="section">
        <ListTitle currentYear={currentYear} />
        <div style={{ height: '338px', overflow: 'auto' }}>
          {
            data.slice(0, 15).map((item) => (
              <Row style={{ width: "100%", borderBottom: '1px solid #ddd' }}>
                <div style={{ flexGrow: "1" }}>
                  {item.geo_nom}
                </div>
                <div className="fr-mb-1w">
                  <strong>
                    {item.data.find((el) => el.annee_universitaire === currentYear)?.effectif.toLocaleString()}
                  </strong>
                  {
                    (["R", "D", "A", "U"].includes(geoId?.charAt(0))) && (
                      <Button
                        size="sm"
                        variant="text"
                        className="fr-ml-1w"
                        color="pink-tuile"
                        onClick={() => navigate(`/atlas/general?geo_id=${item.geo_id}&annee_universitaire=${currentYear}`)}
                      >
                        Voir
                      </Button>
                    )
                  }
                </div>
              </Row>
            ))
          }
        </div>
      </Container>
    );
  }

  return (
    <>
      <BadgeGroup>
        <Badge color="blue-ecume">France</Badge>
        {getBadgesGeo()}
      </BadgeGroup>
      <Container as="section" fluid>
        <Row gutters>
          <Col md={7}>
            {!geoId && <FranceMap data={dataMap || []} isLoading={isLoadingMap} />}
            {geoId && <MapWithPolygon id={geoId || ''} />}
          </Col>
          <Col md={5}>
            <SubList data={dataHistoric?.data} />
          </Col>
        </Row>
        <Row className="fr-pb-1w fr-mb-3w" style={{ borderBottom: '1px solid #ddd' }}>
          <Menu />
        </Row>
      </Container>
      <Outlet />
    </>
  );
}