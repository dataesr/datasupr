import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Breadcrumb,
  Container,
  Row,
  Col,
  Link,
} from "@dataesr/dsfr-plus";

import { useTitle } from "../../hooks/usePageTitle.tsx";
import { getFiltersValues, getParentsFromGeoId } from "../../api/atlas.ts";
import {
  getGeoLabel,
  getParentFromLevel,
  setfavoriteIdsInCookie,
} from "../../utils.tsx";
import { Search } from "./components/main/tabs/search/index.tsx";
import YearsModalButton from "./components/main/header/years-modal-button.tsx";
import { AtlasSideMenu } from "./side-menu-layout/index.tsx";
import { GetLevelBadgeFromId } from "./utils/badges.tsx";

import "./styles.scss";

export default function AtlasHeader() {
  const [searchParams] = useSearchParams();
  const geoId = searchParams.get("geo_id") || "";
  const currentYear = searchParams.get("annee_universitaire") || "2022-23";
  const navigate = useNavigate();

  useTitle("dataSupR - Atlas des effectifs étudiant-e-s");

  useEffect(() => {
    if (searchParams.get("geo_id")) {
      setfavoriteIdsInCookie(searchParams.get("geo_id") || "");
    }
  }, [searchParams]);

  const { data: filtersValues, isLoading: isLoadingFiltersValues } = useQuery({
    queryKey: ["atlas/get-filters-values", geoId],
    queryFn: () => getFiltersValues(geoId),
  });

  const { data: dataParents, isLoading: isLoadingParents } = useQuery({
    queryKey: ["atlas/get-parents-from-geoId", geoId],
    queryFn: () => getParentsFromGeoId(geoId),
  });

  let parent;
  if (!isLoadingParents) {
    parent = getParentFromLevel(dataParents, geoId);
  }

  if (isLoadingFiltersValues) {
    return (
      <Container as="main">
        <Breadcrumb>
          <Link href="/">Accueil</Link>
          <Link href="/atlas">Atlas des effectifs étudiant-e-s</Link>
          <Link>Chargement des filtres en cours ...</Link>
        </Breadcrumb>
      </Container>
    );
  }

  const geoLabel = getGeoLabel(geoId, filtersValues?.geo_id);
  const geoLabelFull = (
    <>
      {geoLabel}
      {GetLevelBadgeFromId({ id: geoId })}
    </>
  );

  document.documentElement.setAttribute("data-fr-scheme", "light");

  return (
    <Container as="main" className="atlas-header">
      <Row>
        <Col>
          {geoId && (
            <Button
              className="button"
              color="pink-tuile"
              icon="home-4-line"
              onClick={() => navigate("/atlas")}
              size="sm"
            >
              Revenir à la page de sélection des territoires
            </Button>
          )}
          {geoId && !isLoadingParents && dataParents && parent && (
            <Button
              className="button"
              color="pink-tuile"
              icon="arrow-up-line"
              onClick={() =>
                navigate(
                  `/atlas/general?geo_id=${parent.geo_id}&annee_universitaire=${currentYear}`
                )
              }
              size="sm"
            >
              Revenir au territoire parent ({parent.geo_nom})
            </Button>
          )}
        </Col>
        <Col md={3} style={{ textAlign: "right" }}>
          <YearsModalButton />
        </Col>
      </Row>

      <Breadcrumb>
        <Link href="/">Accueil</Link>
        <Link href="/atlas">Atlas des effectifs étudiant-e-s</Link>
        {geoId && <Link>{geoLabel}</Link>}
      </Breadcrumb>

      {!geoId ? <Search /> : <AtlasSideMenu title={geoLabelFull} />}
    </Container>
  );
}
