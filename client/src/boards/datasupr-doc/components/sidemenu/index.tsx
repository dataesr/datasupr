import { useLocation } from "react-router-dom";

import "./styles.scss";

export default function CustomSideMenu() {
  const location = useLocation();

  return (
    <div title="" className="sidemenu sticky">
      <div>
        <ul>
          <li>
            <a href="#id1" className={`${location.hash === "#id1" ? "selected" : ""}`}>
              Gestion des URLs
            </a>
          </li>
          <li>
            <a href="#id2" className={`${location.hash === "#id2" ? "selected" : ""}`}>
              Liste des ids
            </a>
          </li>
          <li>
            <a href="#id3" className={`${location.hash === "#id3" ? "selected" : ""}`}>
              Ajout d'un graphique
            </a>
          </li>
          <li>
            <a href="#id4" className={`${location.hash === "#id4" ? "selected" : ""}`}>
              Liste des composants
            </a>
          </li>
          <li>
            <a href="#id5" className={`${location.hash === "#id5" ? "selected" : ""}`}>
              Serveur
            </a>
          </li>
          <li>
            <a href="#id6" className={`${location.hash === "#id6" ? "selected" : ""}`}>
              Gestion des CSS
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
