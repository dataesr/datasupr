import { Container, Link, Nav } from "@dataesr/dsfr-plus";
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "../styles.scss";

export function FacultyLayout() {
  const location = useLocation();
  const path = location.pathname;
  const [searchParams] = useSearchParams();
  const { geo_id, id, field_id } = useParams<{
    geo_id?: string;
    id?: string;
    field_id?: string;
  }>();

  const buildContextualPath = (basePath: string) => {
    const currentPathParts = path.split("/");
    const currentObjectType = currentPathParts[2] || "";

    let paramValue: string | null = null;
    if (currentObjectType === "geo" && geo_id) {
      paramValue = geo_id;
    } else if (currentObjectType === "universite" && id) {
      paramValue = id;
    } else if (currentObjectType === "discipline" && field_id) {
      paramValue = field_id;
    }

    const baseUrl = `/personnel-enseignant/${currentObjectType}/${basePath}${
      paramValue ? "/" + paramValue : ""
    }`;

    // Récupérer les paramètres existants
    const existingParams = new URLSearchParams(searchParams);

    // Gérer les paramètres selon le contexte
    if (currentObjectType === "discipline") {
      const currentFieldId = searchParams.get("field_id") || field_id;
      if (currentFieldId) {
        existingParams.set("field_id", currentFieldId);
      }
    } else if (currentObjectType === "geo") {
      const currentGeoId = searchParams.get("geo_id") || geo_id;
      if (currentGeoId) {
        existingParams.set("geo_id", currentGeoId);
      }
    } else if (currentObjectType === "universite") {
      const currentStructureId = searchParams.get("structure_id") || id;
      if (currentStructureId) {
        existingParams.set("structure_id", currentStructureId);
      }
    }

    // Construire l'URL finale avec paramètres
    const queryString = existingParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const currentPathParts = path.split("/");
  const currentObjectType = currentPathParts[2] || "";

  const showDisciplineLink = currentObjectType !== "discipline";
  const showReasearchTeachersLink = currentObjectType === "discipline";

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
          {showReasearchTeachersLink && (
            <Link
              current={path.includes(`enseignants-chercheurs`)}
              href={buildContextualPath("enseignants-chercheurs")}
            >
              Enseignants chercheurs
            </Link>
          )}
        </Nav>
      </div>
      <Outlet />
    </Container>
  );
}
