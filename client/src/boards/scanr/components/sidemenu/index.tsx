// import { useState } from "react";
// import { SideMenu, Link, Badge, Tabs, Tab, Button, SideMenuItem } from "@dataesr/dsfr-plus";
import { SideMenu, Link } from "@dataesr/dsfr-plus";
// import { useLocation, useSearchParams } from "react-router-dom";ks
// import { useQuery } from "@tanstack/react-query";
// import Cookies from "js-cookie";
// import { getAll, getFiltersValues } from "../../api";

// import i18n from "./i18n.json";
import "./styles.scss";

export default function CustomSideMenu() {
  // const { pathname } = useLocation();
  // const [searchParams] = useSearchParams();
  // const currentLang = searchParams.get("language") || "fr";
  // const filtersParams = searchParams.toString();

  // const { data: allPillars } = useQuery({
  //   queryKey: ["ep/get-filters-values", "pillars"],
  //   queryFn: () => getFiltersValues("pillars"),
  // });

  // const { data: allPrograms } = useQuery({
  //   queryKey: ["ep/get-all-programs"],
  //   queryFn: () => getAll("programs"),
  // });

  // const { data: allThematics } = useQuery({
  //   queryKey: ["ep/get-all-thematics"],
  //   queryFn: () => getAll("thematics"),
  // });

  // const { data: allDestinations } = useQuery({
  //   queryKey: ["ep/get-all-destinations"],
  //   queryFn: () => getAll("destinations"),
  // });
  // if (!pathname) return null;

  // const is = (str: string): boolean => {
  //   if (str === "/european-projects/beneficiaires") {
  //     // fait la distinction entre beneficiaries et beneficiaries-types
  //     return pathname === str;
  //   }
  //   if (str === "/european-projects/collaborations") {
  //     // fait la distinction entre la page principale des collaborations et les pages détaillées
  //     return pathname === str || pathname === str + "/";
  //   }
  //   return pathname?.startsWith(str);
  // };

  // function getI18nLabel(key) {
  //   return i18n[key][currentLang];
  // }

  // // get cookies from the browser
  // const selectedPillars = Cookies.get("selectedPillars");
  // const numberOfPillars = Number(Cookies.get("numberOfPillars")) || 0;
  // const selectedPrograms = Cookies.get("selectedPrograms");
  // const numberOfPrograms = Number(Cookies.get("numberOfPrograms")) || 0;
  // const selectedThematics = Cookies.get("selectedThematics");
  // const numberOfThematics = Number(Cookies.get("numberOfThematics")) || 0;
  // const selectedDestinations = Cookies.get("selectedDestinations");
  // const numberOfDestinations = Number(Cookies.get("numberOfDestinations")) || 0;

  // const numberOfActiveFilters =
  //   (selectedPillars ? selectedPillars.split("|").filter(Boolean).length : 0) +
  //   (selectedPrograms ? selectedPrograms.split("|").filter(Boolean).length : 0) +
  //   (selectedThematics ? selectedThematics.split("|").filter(Boolean).length : 0) +
  //   (selectedDestinations ? selectedDestinations.split("|").filter(Boolean).length : 0);

  // const FilterItem = ({ filterKey }) => {
  //   const [showAll, setShowAll] = useState(false);
  //   if (!filterKey) return null;
  //   let sellected: string = "";
  //   let all: Array<{ id: string; label_fr: string; label_en: string }> = [];
  //   let numberOf = 0;
  //   if (filterKey === "pillars") {
  //     sellected = selectedPillars || "";
  //     all = allPillars;
  //     numberOf = numberOfPillars;
  //   }
  //   if (filterKey === "programs") {
  //     sellected = selectedPrograms || "";
  //     all = allPrograms;
  //     numberOf = numberOfPrograms;
  //   }
  //   if (filterKey === "thematics") {
  //     sellected = selectedThematics || "";
  //     all = allThematics;
  //     numberOf = numberOfThematics;
  //   }
  //   if (filterKey === "destinations") {
  //     sellected = selectedDestinations || "";
  //     all = allDestinations;
  //     numberOf = numberOfDestinations;
  //   }

  //   const items = sellected?.split("|").filter(Boolean) || 0;
  //   const displayedItems = showAll ? items : items.slice(0, 10);
  //   const hasMore = items.length > 10;

  //   return (
  //     <div>
  //       <span>
  //         <strong>
  //           <u>{getI18nLabel(`${filterKey}`)}</u>
  //         </strong>
  //         <Badge className="fr-ml-1w" color="blue-cumulus" size="sm">
  //           {items.length}/{numberOf}
  //         </Badge>
  //       </span>
  //       <span>
  //         <ul style={{ listStyle: "initial", paddingLeft: "15px" }}>
  //           {displayedItems.map((pillarId) => (
  //             <li key={pillarId}>{all?.find((el) => el.id === pillarId)?.[`label_${currentLang}`]}</li>
  //           ))}
  //         </ul>
  //         {hasMore && (
  //           <Button onClick={() => setShowAll(!showAll)} size="sm" variant="tertiary">
  //             {showAll ? getI18nLabel("show-less") : `${getI18nLabel("show")} ${items.length - 10} ${getI18nLabel("others")}`}
  //           </Button>
  //         )}
  //       </span>
  //     </div>
  //   );
  // };

  return (
    // <Tabs className="fr-mt-1w scanr-side-menu">
      // <Tab label="Menu">
        <SideMenu title="" sticky fullHeight className="padded-sidemenu">
          <Link href="#graph1">
            Graph 1
          </Link>
          <Link href="#graph2">
            Graph 2
          </Link>
          <Link href="#graph3">
            Graph 3
          </Link>
          {/* <Link current={is("/european-projects/synthese")} href={`/european-projects/synthese?${filtersParams}`}>
            {getI18nLabel("synthesis")}
          </Link>
          <Link current={is("/european-projects/positionnement")} href={`/european-projects/positionnement?${filtersParams}`}>
            {getI18nLabel("positioning")}
          </Link>
          <SideMenuItem defaultExpanded title={getI18nLabel("collaborations")}>
            <Link current={is("/european-projects/collaborations")} href={`/european-projects/collaborations?${filtersParams}`}>
              {getI18nLabel("by-country")}
            </Link>
            <Link current={is("/european-projects/collaborations/")} href={`/european-projects/collaborations/entityId?${filtersParams}`}>
              {getI18nLabel("by-entity")}
            </Link>
          </SideMenuItem>
          <Link current={is("/european-projects/beneficiaires")} href={`/european-projects/beneficiaires?${filtersParams}`}>
            {getI18nLabel("beneficiaries")}
          </Link>
          <Link current={is("/european-projects/beneficiaires-types")} href={`/european-projects/beneficiaires-types?${filtersParams}`}>
            {getI18nLabel("beneficiaries-types")}
          </Link>
          <Link current={is("/european-projects/evolution")} href={`/european-projects/evolution?${filtersParams}`}>
            Evolution
          </Link> */}
        </SideMenu>
      // </Tab>
      //  <Tab label={`${getI18nLabel("active-filters")} (${numberOfActiveFilters})`}>
      //   <div>
      //     <span className="fr-icon-arrow-go-back-fill fr-icon--sm" aria-hidden="true" />
      //     <Link href="/european-projects/search">{getI18nLabel("back")}</Link>
      //   </div>
      //   <div className="fr-mt-2w">
      //     <FilterItem filterKey="pillars" />
      //     <FilterItem filterKey="programs" />
      //     <FilterItem filterKey="thematics" />
      //     <FilterItem filterKey="destinations" />
      //   </div>
      // </Tab>
    // </Tabs>
  );
}
