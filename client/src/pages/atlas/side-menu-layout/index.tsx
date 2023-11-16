import { SideMenu, Link, Container, Row, Col } from 'dsfr-plus';
import { Outlet, useLocation } from 'react-router-dom';
import './styles.scss';

export function AtlasSideMenu() {
    const { pathname } = useLocation();
    if (!pathname) return null;

    const is = (str: string): boolean => pathname?.startsWith(str)
    return (
        <Container>
            <Row>
                <Col xs={12} md={3}>
                    <SideMenu title="" sticky fullHeight className="padded-sidemenu">
                        <Link current={is('/atlas/en-un-coup-d-oeil')} href="/atlas/en-un-coup-d-oeil">En un coup d'oeil</Link>

                        {/* <SideMenuItem
                            defaultExpanded={is('/utilisation')}
                            title="Utilisation"
                        >
                            <Link current={is('/utilisation/demarrage-rapide')} href="/utilisation/demarrage-rapide">Démarrage rapide</Link>
                        </SideMenuItem> */}

                    </SideMenu>
                </Col>
                <Col xs={12} md={8} className="fr-pt-6w">
                    <Outlet />
                </Col>
            </Row>
        </Container>
    )
}

