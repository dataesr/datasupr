import { useLocation, useSearchParams } from "react-router-dom";

import { Link } from '@dataesr/dsfr-plus';


export default function Menu() {
  const [searchParams] = useSearchParams();
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  const { pathname } = useLocation();

  return (
    <nav className="fr-nav fr-mt-1w" id="main-nav" role="navigation" aria-label="Menu principal">
      <ul className="fr-nav__list">
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/atlas/general?${params}`}
            aria-current={pathname.split('/')[2] === 'general' ? 'page' : undefined}
          >
            Général
          </Link>
        </li>
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/atlas/effectifs-par-filiere?${params}`}
            aria-current={pathname.split('/')[2] === 'effectifs-par-filiere' ? 'page' : undefined}
          >
            Effectifs par filière
          </Link>
        </li>
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/atlas/effectifs-par-secteur?${params}`}
            aria-current={pathname.split('/')[2] === 'effectifs-par-secteur' ? 'page' : undefined}
          >
            Effectifs par secteur
          </Link>
        </li>
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/atlas/effectifs-par-genre?${params}`}
            aria-current={pathname.split('/')[2] === 'effectifs-par-genre' ? 'page' : undefined}
          >
            Effectifs par genre
          </Link>
        </li>
      </ul>
    </nav>
  );
}