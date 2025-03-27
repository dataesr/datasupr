import { useState } from "react";
import { SideMenu, Link, Badge, Button } from "@dataesr/dsfr-plus";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getAll, getFiltersValues } from "../../api";

import i18n from "./i18n.json";
import "./styles.scss";

export default function CustomSideMenu() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const filtersParams = searchParams.toString();
  const [showFilters, setShowFilters] = useState(true);

  const { data: allPillars } = useQuery({
    queryKey: ["ep/get-filters-values", "pillars"],
    queryFn: () => getFiltersValues("pillars"),
  });

  const { data: allPrograms } = useQuery({
    queryKey: ["ep/get-all-programs"],
    queryFn: () => getAll("programs"),
  });

  const { data: allThematics } = useQuery({
    queryKey: ["ep/get-all-thematics"],
    queryFn: () => getAll("thematics"),
  });

  const { data: allDestinations } = useQuery({
    queryKey: ["ep/get-all-destinations"],
    queryFn: () => getAll("destinations"),
  });
  if (!pathname) return null;
  const is = (str: string): boolean => pathname?.startsWith(str);

  function getI18nLabel(key) {
    console.log("getI18nLabel", key);
    return i18n[key][currentLang];
  }

  // get cookies from the browser
  const selectedPillars = Cookies.get("selectedPillars");
  const numberOfPillars = Cookies.get("numberOfPillars") || 0;
  const selectedPrograms = Cookies.get("selectedPrograms");
  const numberOfPrograms = Cookies.get("numberOfPrograms") || 0;
  const selectedThematics = Cookies.get("selectedThematics");
  const numberOfThematics = Cookies.get("numberOfThematics") || 0;
  const selectedDestinations = Cookies.get("selectedDestinations");
  const numberOfDestinations = Cookies.get("numberOfDestinations") || 0;

  console.log(allPillars, allPrograms, allThematics, allDestinations);

  const FilterItem = ({ filterKey }) => {
    console.log("FilterItem", filterKey);
    if (!filterKey) return null;
    let sellected: string = "";
    let all: Array<{ id: string; label_fr: string; label_en: string }> = [];
    let numberOf = 0;
    if (filterKey === "pillars") {
      sellected = selectedPillars;
      all = allPillars;
      numberOf = numberOfPillars;
    }
    if (filterKey === "programs") {
      sellected = selectedPrograms;
      all = allPrograms;
      numberOf = numberOfPrograms;
    }
    if (filterKey === "thematics") {
      sellected = selectedThematics;
      all = allThematics;
      numberOf = numberOfThematics;
    }
    if (filterKey === "destinations") {
      sellected = selectedDestinations;
      all = allDestinations;
      numberOf = numberOfDestinations;
    }

    return (
      <>
        <span
          aria-describedby={`tooltip-${filterKey}`}
          style={{ cursor: "help" }}
        >
          {getI18nLabel(filterKey)}
          <Badge className="fr-ml-1w" color="blue-cumulus" size="sm">
            {(sellected?.split("|") || []).length}/{numberOf}
          </Badge>
        </span>
        <span
          className="fr-tooltip fr-placement"
          id={`tooltip-${filterKey}`}
          role="tooltip"
          aria-hidden="true"
        >
          <ul>
            {sellected?.split("|")?.map((pillarId) => (
              <li key={pillarId}>
                {
                  all?.find((el) => el.id === pillarId)?.[
                    `label_${currentLang}`
                  ]
                }
              </li>
            ))}
          </ul>
        </span>
      </>
    );
  };

  return (
    <>
      <nav>
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            border: "1px solid #aaa",
            padding: "0.5rem",
            borderRadius: "5px",
            backgroundColor: "#f5f5f5",
            margin: "0.5rem",
            marginRight: "2rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textTransform: "uppercase" }}>
              {getI18nLabel("active-filters")}
            </span>
            <Button
              icon="menu-fill"
              size="sm"
              variant="text"
              onClick={() => {
                setShowFilters(!showFilters);
              }}
            />
          </div>
          {showFilters && (
            <div>
              <FilterItem filterKey="pillars" />
              <br />
              <FilterItem filterKey="programs" />
              <br />
              <FilterItem filterKey="thematics" />
              <br />
              <FilterItem filterKey="destinations" />
            </div>
          )}
          <hr className="fr-pb-1" />
          <div>
            <span
              className="fr-icon-arrow-go-back-fill fr-icon--sm"
              aria-hidden="true"
            />
            <Link href="/european-projects/search">{getI18nLabel("back")}</Link>
          </div>
        </div>
        <SideMenu title="" sticky fullHeight className="padded-sidemenu">
          <Link
            current={is("/european-projects/synthese")}
            href={`/european-projects/synthese?${filtersParams}`}
          >
            {getI18nLabel("synthesis")}
          </Link>
          <Link
            current={is("/european-projects/positionnement")}
            href={`/european-projects/positionnement?${filtersParams}`}
          >
            {getI18nLabel("positioning")}
          </Link>
          <Link
            current={is("/european-projects/collaborations")}
            href={`/european-projects/collaborations?${filtersParams}`}
          >
            {getI18nLabel("collaborations")}
          </Link>
          {/* 
        <Link
          current={is("/european-projects/objectifs-types-projets")}
          href={`/european-projects/objectifs-types-projets?${filtersParams}`}
        >
          Objectifs & types de projets
        </Link> */}
          <Link
            current={is("/european-projects/beneficiaires")}
            href={`/european-projects/beneficiaires?${filtersParams}`}
          >
            {getI18nLabel("beneficiaries")}
          </Link>
          <Link
            current={is("/european-projects/beneficiaires-types")}
            href={`/european-projects/beneficiaires-types?${filtersParams}`}
          >
            {getI18nLabel("beneficiaries-types")}
          </Link>
          <Link
            current={is("/european-projects/evolution")}
            href={`/european-projects/evolution?${filtersParams}`}
          >
            Evolution
          </Link>

          {/* <Link
          current={is("/european-projects/beneficiaires")}
          href={`/european-projects/beneficiaires?${filtersParams}`}
        >
          Catégories de bénéficiaires
        </Link>
        <Link
          current={is("/european-projects/programme-mires")}
          href={`/european-projects/programme-mires?${filtersParams}`}
        >
          Programme MIRES
        </Link>
        <Link
          current={is("/european-projects/appel-a-projets")}
          href={`/european-projects/appel-a-projets?${filtersParams}`}
          style={{ borderBottom: "1px solid #aaa" }}
        >
          Liste des appels à projets clôturés
        </Link>
        <Link
          current={is("/european-projects/msca")}
          href={`/european-projects/msca?${filtersParams}`}
        >
          MSCA
        </Link>
        <Link
          current={is("/european-projects/erc")}
          href={`/european-projects/erc?${filtersParams}`}
          style={{ borderBottom: "1px solid #aaa" }}
        >
          ERC
        </Link>
        <Link
          current={is("/european-projects/donnees-reference")}
          href={`/european-projects/donnees-reference?${filtersParams}`}
        >
          Données de référence
        </Link>
        <Link
          current={is("/european-projects/informations")}
          href={`/european-projects/informations?${filtersParams}`}
        >
          Informations complémentaires
        </Link> */}
        </SideMenu>
      </nav>
    </>
  );
}
