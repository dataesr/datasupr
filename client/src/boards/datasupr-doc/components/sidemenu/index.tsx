import { SideMenu, Link } from "@dataesr/dsfr-plus";

import "./styles.scss";

export default function CustomSideMenu() {
  return (
    <SideMenu title="" sticky fullHeight className="padded-sidemenu">
      <Link href="#id1">Gestion des URLs</Link>
      <Link href="#id2">Liste des ids</Link>
      <Link href="#id2">Ajout d'un graphique</Link>
      <Link href="#id2">Liste des composants</Link>
      <Link href="#id2">Serveur</Link>
    </SideMenu>
  );
}
