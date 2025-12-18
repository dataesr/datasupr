import { SideMenu, Link } from "@dataesr/dsfr-plus";

import "./styles.scss";

export default function CustomSideMenu() {
  return (
    <SideMenu title="" sticky fullHeight className="padded-sidemenu">
      <Link href="#id1">Menu1 (ancre)</Link>
      <Link href="#id2">Menu2 (ancre)</Link>
    </SideMenu>
  );
}
