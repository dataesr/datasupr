import { SideMenu, Link } from "@dataesr/dsfr-plus";

import "./styles.scss";

export default function CustomSideMenu() {
  return (
    <SideMenu title="" sticky fullHeight className="padded-sidemenu">
      <Link href="#id1">Gestion des URLs</Link>
      <Link href="#id2">Liste des ids</Link>
      <Link href="#id3">Ajout d'un graphique</Link>
      <Link href="#id4">Liste des composants</Link>
      <Link href="#id5">Serveur</Link>
      <Link href="#id6">Gestion des CSS</Link>
    </SideMenu>
  );
}
