import { useLocation } from 'react-router-dom';

import "./styles.scss";

export default function CustomSideMenu() {
  const location = useLocation();

  return (
    <div title="" className="sidemenu sticky">
      <div>
        <ul>
          <li>
            <a href="#funded-structures" className={`${location.hash === "#funded-structures" ? "selected" : ""}`}>
              Top 25 des structures françaises par nombre de financements
            </a>
          </li>
          <li>
            <a href="#funded-structures-budget" className={`${location.hash === "#funded-structures-budget" ? "selected" : ""}`}>
              Top 25 des structures françaises par montant des financements des projets auxquels elles participent
            </a>
          </li>
          <li>
            <a href="#funded-labs" className={`${location.hash === "#funded-labs" ? "selected" : ""}`}>
              Top 25 des laboratoires français par nombre de financements
            </a>
          </li>
          <li>
            <a href="#funded-labs-budget" className={`${location.hash === "#funded-labs-budget" ? "selected" : ""}`}>
              Top 25 des laboratoires français par montant des financements des projets auxquels elles participent
            </a>
          </li>
          <li>
            <a href="#funded-structures-europe" className={`${location.hash === "#funded-structures-europe" ? "selected" : ""}`}>
              Top 25 des structures NON françaises par nombre de financements
            </a>
          </li>
          <li>
            <a href="#funded-structures-europe-budget" className={`${location.hash === "#funded-structures-europe-budget" ? "selected" : ""}`}>
              Top 25 des structures NON françaises par montant des financements des projets auxquels elles participent
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}


