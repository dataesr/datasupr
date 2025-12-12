import { SideMenu, Link } from "@dataesr/dsfr-plus";

import "./styles.scss";

export default function CustomSideMenu() {
  return (
    <SideMenu title="" sticky fullHeight className="padded-sidemenu">
      <Link href="#funded-structures">
        Nombre de financements par structure
      </Link>
      <Link href="#top-funders-by-structure">
        Top financeurs par structure
      </Link>
    </SideMenu>
  );
}
