import {
  Badge,
  Breadcrumb,
  Col,
  Container,
  Link,
  Row,
} from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

function DashboardCard({ dashboard }) {
  return (
    <div className="fr-card fr-enlarge-link">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <h2 className="fr-card__title">
            <Link href={`/admin/${dashboard.id}`}>{dashboard.name}</Link>
            <br />
            <Badge color="green-emeraude">{`${dashboard?.data?.length} collections`}</Badge>
          </h2>
          <p>{dashboard.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["list-dashboards"],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/admin/list-dashboards`).then((response) =>
        response.json()
      ),
  });

  if (isLoading || !data) return <>Loading ...</>;

  return (
    <Container>
      <Row className="fr-mb-5w">
        <Col>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/">Accueil</Link>
            <Link>
              <strong>Administration de dataSupR</strong>
            </Link>
          </Breadcrumb>
        </Col>
      </Row>

      <Row gutters>
        {data.map((dashboard) => (
          <Col md={3} key={dashboard.id}>
            <DashboardCard dashboard={dashboard} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
