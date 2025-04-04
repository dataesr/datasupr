import { Container, Link, Nav } from "@dataesr/dsfr-plus";
import { Outlet, useLocation } from "react-router-dom";
import "../styles.scss";

export function FacultyLayout() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Container>
      <div className="centered-nav">
        <Nav>
          <Link
            current={path === "/personnel-enseignant"}
            href="/personnel-enseignant/vue-d'ensemble"
          >
            En un coup d'oeil
          </Link>
          <Link
            current={path.includes("/personnel-enseignant/discipline")}
            href="/personnel-enseignant/discipline"
          >
            Discipline
          </Link>
          <Link
            current={path.includes("/personnel-enseignant/topologie")}
            href="/personnel-enseignant/topologie"
          >
            Topologie
          </Link>
          <Link
            current={path.includes("/personnel-enseignant/evolution")}
            href="/personnel-enseignant/evolution"
          >
            Evolution
          </Link>
        </Nav>
      </div>
      <Outlet />
    </Container>
  );
}
