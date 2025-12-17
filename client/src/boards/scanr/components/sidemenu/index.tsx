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
              Nombre de financements par structure
            </a>
          </li>
          <li>
            <a href="#funded-structures-europe-budget" className={`${location.hash === "#funded-structures-europe-budget" ? "selected" : ""}`}>
              Top financeurs par structure
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}


