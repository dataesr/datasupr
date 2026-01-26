import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import i18n from "./i18n.json";
import Footer from "./footer";
import { Logo } from "@dataesr/dsfr-plus";

export default function GlobalLayout() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const filtersParams = searchParams.toString();
  const { VITE_MINISTER_NAME } = import.meta.env;

  if (!pathname) return null;
  const is = (str: string): boolean => pathname?.startsWith(str);

  function getI18nLabel(key: string): string {
    return i18n[key]?.fr || "";
  }
  return (
    <>
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <Logo splitCharacter="<br>" text={VITE_MINISTER_NAME} />
                  <div className="fr-header__navbar">
                    <button
                      data-fr-opened="false"
                      aria-controls="modal-header"
                      title="Menu"
                      type="button"
                      id="button-header"
                      className="fr-btn--menu fr-btn"
                    >
                      Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="fr-header__menu fr-modal"
          id="modal-header"
          aria-labelledby="button-header"
        >
          <div className="fr-container">
            <button
              aria-controls="modal-header"
              title="Fermer"
              type="button"
              id="button-2168"
              className="fr-btn--close fr-btn"
            >
              {getI18nLabel("close")}
            </button>
            <div className="fr-header__menu-links"></div>
            <nav
              className="fr-nav"
              role="navigation"
              aria-label="Menu principal"
            >
              <ul className="fr-nav__list">
                <li className="fr-nav__item">
                  <Link
                    to="/structures-finance/accueil"
                    target="_self"
                    {...(pathname === "/structures-finance/accueil" && {
                      "aria-current": "page",
                    })}
                    className="fr-nav__link"
                  >
                    <span
                      className="fr-icon-home-4-line fr-mr-1w"
                      aria-hidden="true"
                    />
                    {getI18nLabel("home")}
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    to={`/structures-finance/etablissements?${filtersParams}${
                      filtersParams ? "&" : ""
                    }section=ressources`}
                    target="_self"
                    {...(is("/structures-finance/etablissements") && {
                      "aria-current": "page",
                    })}
                    className="fr-nav__link"
                  >
                    Vue par établissements
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    to={`/structures-finance/national?}`}
                    target="_self"
                    {...(is("/structures-finance/national") && {
                      "aria-current": "page",
                    })}
                    className="fr-nav__link"
                  >
                    Vue nationale
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    to={`/structures-finance/faq?`}
                    target="_self"
                    {...(is("/structures-finance/faq") && {
                      "aria-current": "page",
                    })}
                    className="fr-nav__link"
                  >
                    FAQ
                  </Link>
                </li>
                <li className="fr-nav__item">
                  <Link
                    to={`/structures-finance/definitions`}
                    target="_self"
                    {...(is("/structures-finance/definitions") && {
                      "aria-current": "page",
                    })}
                    className="fr-nav__link"
                  >
                    Définitions
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* <Container className="fr-my-3w">
        <Row>
          <Col n="12">
            <CustomBreadcrumb />
          </Col>
        </Row>
      </Container> */}

      <Outlet />
      <Footer />
    </>
  );
}
