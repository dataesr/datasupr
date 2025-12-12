import { SideMenu, Link } from "@dataesr/dsfr-plus";

import "./styles.scss";

export default function CustomSideMenu() {
  return (
    <SideMenu title="" sticky fullHeight className="padded-sidemenu">
      <Link href="#funded-structures">
        Nombre de financements par structure
      </Link>
      <Link href="#funded-structures-amount">
        Montants de financement par structure
      </Link>
    </SideMenu>
  );
}
