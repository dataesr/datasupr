import { useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Button, Breadcrumb, Container, Row, Col, Link } from '@dataesr/dsfr-plus';
import { useTitle } from '../../../../hooks/usePageTitle.tsx';

import { getFiltersValues } from '../../../../api/atlas.ts';
import { getGeoLabel, setfavoriteIdsInCookie } from '../../../../utils.tsx';
import { Search } from './search.tsx';
import Header from './header/index.tsx';
import YearsModalButton from './header/years-modal-button.tsx';

export default function AtlasHeader() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useTitle('dataSupR - Atlas des effectifs étudiant-e-s');

  useEffect(() => {
    if (searchParams.get('geo_id')) {
      setfavoriteIdsInCookie(searchParams.get('geo_id') || '');
    }
  }, [searchParams]);

  const { data: filtersValues, isLoading: isLoadingFiltersValues } = useQuery({
    queryKey: ["atlas/get-filters-values"],
    queryFn: () => getFiltersValues()
  })

  if (isLoadingFiltersValues) {
    return <div>Loading...</div>
  }

  let geoLabelFull = '';
  const geoId = searchParams.get('geo_id') || '';
  const geoLabel = getGeoLabel(geoId, filtersValues.geo_id);
  switch (geoId?.charAt(0)) {
    case 'R':
      geoLabelFull = `Région ${geoLabel}`;
      break;
    case 'D':
      geoLabelFull = `Département "${geoLabel}"`;
      break;
    case 'A':
      geoLabelFull = `Académie "${geoLabel}"`;
      break;
  }

  return (
    <Container as="main">
      <Row>
        <Col>
          {
            geoId && (
              <Button size="sm" color="pink-tuile" onClick={() => navigate('/atlas')}>
                Revenir à la page de sélection des territoires
              </Button>
            )
          }
        </Col>
        <Col style={{ textAlign: 'right' }}>
          <YearsModalButton />
        </Col>
      </Row>

      <Breadcrumb>
        <Link href="/">Accueil</Link>
        <Link href="/atlas">Atlas des effectifs étudiant-e-s</Link>
        <Link>{geoLabelFull}</Link>
      </Breadcrumb>

      {(!geoId) ? <Search /> : <Header />}
    </Container>
  )
}
