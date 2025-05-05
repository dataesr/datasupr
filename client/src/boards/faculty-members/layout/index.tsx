import { Container, Link, Nav } from "@dataesr/dsfr-plus";
import { Outlet, useLocation, useParams } from "react-router-dom";
import "../styles.scss";

export function FacultyLayout() {
  const location = useLocation();
  const path = location.pathname;
  const { geo_id, id, fieldId } = useParams<{
    geo_id?: string;
    id?: string;
    fieldId?: string;
  }>();

  const buildContextualPath = (basePath: string) => {
    const currentPathParts = path.split("/");
    const currentObjectType = currentPathParts[2] || "";

    let paramValue: string | null = null;
    if (currentObjectType === "geo" && geo_id) {
      paramValue = geo_id;
    } else if (currentObjectType === "universite" && id) {
      paramValue = id;
    } else if (currentObjectType === "discipline" && fieldId) {
      paramValue = fieldId;
    }

    return `/personnel-enseignant/${currentObjectType}/${basePath}${
      paramValue ? "/" + paramValue : ""
    }`;
  };

  const currentPathParts = path.split("/");
  const currentObjectType = currentPathParts[2] || "";

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
