import { useLocation, useSearchParams } from "react-router-dom";

import { Link } from '@dataesr/dsfr-plus';


export default function Menu() {
  const [searchParams] = useSearchParams();
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  const { pathname } = useLocation();

  return (
    <nav className="fr-nav" id="main-nav" role="navigation" aria-label="Menu principal">
      <ul className="fr-nav__list">
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/european-projects/analyse/synthese?${params}`}
            aria-current={pathname.split('/')[2] === 'synthese' ? 'page' : undefined}
          >
            Synthèse
          </Link>
        </li>
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/european-projects/analyse/positionnement?${params}`}
            aria-current={pathname.split('/')[2] === 'positionnement' ? 'page' : undefined}
          >
            Positionnement
          </Link>
        </li>
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/european-projects/analyse/collaboration?${params}`}
            aria-current={pathname.split('/')[2] === 'collaboration' ? 'page' : undefined}
          >
            Collaboration
          </Link>
        </li>
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/european-projects/analyse/evolution?${params}`}
            aria-current={pathname.split('/')[2] === 'evolution' ? 'page' : undefined}
          >
            Evolution
          </Link>
        </li>
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/european-projects/analyse/appel-a-projets?${params}`}
            aria-current={pathname.split('/')[2] === 'appel-a-projets' ? 'page' : undefined}
          >
            Appel à projets
          </Link>
        </li>
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/european-projects/analyse/beneficiaires?${params}`}
            aria-current={pathname.split('/')[2] === 'beneficiaires' ? 'page' : undefined}
          >
            Bénéficiaires
          </Link>
        </li>
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/european-projects/analyse/erc?${params}`}
            aria-current={pathname.split('/')[2] === 'erc' ? 'page' : undefined}
          >
            ERC
          </Link>
        </li>
        <li className="fr-nav__item">
          <Link
            className="fr-nav__link"
            href={`/european-projects/analyse/msca?${params}`}
            aria-current={pathname.split('/')[2] === 'msca' ? 'page' : undefined}
          >
            MSCA
          </Link>
        </li>
      </ul>
    </nav>
  );
}