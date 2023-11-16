import { Button, Header, Logo, Service, FastAccess, Container, Row, Col, Title } from 'dsfr-plus';
import { Outlet } from 'react-router-dom';
import FiltersFromUrl from '../components/filters';

export function Layout() {

  return (
    <>
      <Header>
        <Logo text="Ministère de | l'enseignement supérieur | et de la recherche" />
        <Service name="DataSupR" tagline="Ensemble de tableaux de bord de l'enseignement supérieur et de la recherche" />
        <FastAccess>
          <Button as="a" href="https://github.com/dataesr/react-dsfr" target="_blank" rel="noreferer noopener" icon="github-fill" size="sm" variant="text">Github</Button>
          <Button as="a" href="https://www.systeme-de-design.gouv.fr" target="_blank" rel="noreferer noopener" icon="code-s-slash-line" size="sm" variant="text">Jeux de données</Button>
        </FastAccess>
      </Header>
      <Container>
        <Row>
          <Col>
            <h2>Nom du tableau de bord</h2>
            <FiltersFromUrl />
          </Col>
        </Row >
      </Container >
      <Outlet />
    </>
  )
}

