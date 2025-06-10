import { Container, Link, Nav } from "@dataesr/dsfr-plus";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import "../styles.scss";

export function FacultyLayout() {
  const location = useLocation();
  const path = location.pathname;
  const [searchParams] = useSearchParams();

  const buildContextualPath = (basePath: string) => {
    const currentPathParts = path.split("/");
    const currentObjectType = currentPathParts[2] || "";

    const baseUrl = `/personnel-enseignant/${currentObjectType}/${basePath}`;

    const existingParams = new URLSearchParams(searchParams);

    if (!existingParams.get("annee_universitaire")) {
      existingParams.set("annee_universitaire", "2023-24");
    }

    const queryString = existingParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  return (
    <Container>
      <div className="centered-nav">
        <Nav>
          <Link
            current={path.includes(`vue-d'ensemble`)}
            href={buildContextualPath("vue-d'ensemble")}
          >
            En un coup d'oeil
          </Link>
          <Link
            current={path.includes(`typologie`)}
            href={buildContextualPath("typologie")}
          >
            Typologie
          </Link>
          <Link
            current={path.includes(`evolution`)}
            href={buildContextualPath("evolution")}
          >
            Evolution
          </Link>
          <Link
            current={path.includes(`enseignants-chercheurs`)}
            href={buildContextualPath("enseignants-chercheurs")}
          >
            Enseignants chercheurs
          </Link>
        </Nav>
      </div>
      <Outlet />
    </Container>
  );
}
