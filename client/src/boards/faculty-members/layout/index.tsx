import { Container, Link, Nav } from "@dataesr/dsfr-plus";
import { Outlet, useLocation, useParams } from "react-router-dom";
import "../styles.scss";
import "../styles.scss";

export function FacultyLayout() {
  const location = useLocation();
  const path = location.pathname;
  const { objectType, geo_id } = useParams<{
    objectType?: string;
    geo_id?: string;
  }>();

  const buildContextualPath = (basePath: string) => {
    const currentPathParts = path.split("/");
    const currentObjectType = objectType || currentPathParts[2] || "";

    return `/personnel-enseignant/${currentObjectType}/${basePath}${
      geo_id ? "/" + geo_id : ""
    }`;
  };

  const currentPathParts = path.split("/");
  const currentObjectType = objectType || currentPathParts[2] || "";

  const showDisciplineLink = currentObjectType !== "discipline";

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
            current={path.includes(`topologie`)}
            href={buildContextualPath("topologie")}
          >
            Topologie
          </Link>
          <Link
            current={path.includes(`evolution`)}
            href={buildContextualPath("evolution")}
          >
            Evolution
          </Link>
          {showDisciplineLink && (
            <Link
              current={path.includes(`discipline`)}
              href={buildContextualPath("discipline")}
            >
              Discipline
            </Link>
          )}
        </Nav>
      </div>
      <Outlet />
    </Container>
  );
}
