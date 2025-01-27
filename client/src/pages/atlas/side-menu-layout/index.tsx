import { ReactNode, useEffect, useState } from "react";
import { Container, Row, Col, Link, SideMenu, Title, Alert } from "@dataesr/dsfr-plus";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';

import Source from "../components/source";

import "./styles.scss";
import { DEFAULT_CURRENT_YEAR } from "../../../constants";
import { getFiltersValues } from "../../../api";

export function AtlasSideMenu({ geoLabel, level, title }: 
  { geoLabel: string, level: string, title: ReactNode }) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const currentYear = searchParams.get("annee_universitaire") || DEFAULT_CURRENT_YEAR;
  const geoId = searchParams.get('geo_id') || '';
  
  const [showAlertMessage, setShowAlertMessage] = useState(false);
  
  const { data: filtersValues } = useQuery({
    queryKey: ["atlas/get-filters-values", geoId],
    queryFn: () => getFiltersValues(geoId)
  })

  useEffect(() => {
    document.title = `${geoLabel} (${level}) - Atlas des effectifs étudiant-e-s ${currentYear}`;
  }, [geoLabel, level, currentYear]);

  useEffect(() => {
    setShowAlertMessage(!filtersValues?.annees_universitaires?.onlyWithData.includes(currentYear));
  }, [currentYear, filtersValues]);

  if (!pathname) return null;

  const filtersParams = searchParams.toString();
  const is = (str: string): boolean => pathname?.startsWith(str);

  return (
    <Container>
      <Row>
        <Col xs={12} md={3}>
          <SideMenu title="" sticky fullHeight>
            <Link
              current={is("/atlas/general")}
              href={`/atlas/general?${filtersParams}`}
            >
              En un coup d'oeil
            </Link>
            <Link
              current={is("/atlas/effectifs-par-filiere")}
              href={`/atlas/effectifs-par-filiere?${filtersParams}`}
            >
              Effectifs par filière
            </Link>
            <Link
              current={is("/atlas/effectifs-par-secteur")}
              href={`/atlas/effectifs-par-secteur?${filtersParams}`}
            >
              Effectifs par secteur
            </Link>
            <Link
              current={is("/atlas/effectifs-par-genre")}
              href={`/atlas/effectifs-par-genre?${filtersParams}`}
            >
              Effectifs par genre
            </Link>
          </SideMenu>
        </Col>
        <Col xs={12} md={9}>
          <Title as="h1" look="h3" className="fr-mb-5w">
            <span
              className="fr-icon-map-pin-2-line fr-mr-1w"
              aria-hidden="true"
            />
            {title}
          </Title>
          {showAlertMessage && (
            <Alert
              className="fr-mb-3w"
              description="Aucune donnée n'est disponible pour l'année universitaire sélectionnée. Veuillez sélectionner une autre année."
              title="Alerte"
              variant="error"
            />
          )}
          <Outlet />
          <Source />
        </Col>
      </Row>
    </Container>
  );
}
