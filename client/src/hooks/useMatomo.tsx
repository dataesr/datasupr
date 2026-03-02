import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    _paq: any[];
  }
}

const MATOMO_URL = import.meta.env.VITE_APP_MATOMO_URL;
const GENERAL_ID = import.meta.env.VITE_APP_MATOMO_SITE_ID_GENERAL;

const BOARD_IDS: Record<string, string | undefined> = {
  atlas: import.meta.env.VITE_APP_MATOMO_SITE_ID_ATLAS,
  "structures-finance": import.meta.env
    .VITE_APP_MATOMO_SITE_ID_STRUCTURES_FINANCE,
  "datasupr-doc": import.meta.env.VITE_APP_MATOMO_SITE_ID_DATASUPR_DOC,
  "financements-par-aap": import.meta.env
    .VITE_APP_MATOMO_SITE_ID_FINANCEMENTS_PAR_AAP,
  "european-projects": import.meta.env
    .VITE_APP_MATOMO_SITE_ID_EUROPEAN_PROJECTS,
  graduates: import.meta.env.VITE_APP_MATOMO_SITE_ID_GRADUATES,
  "open-alex": import.meta.env.VITE_APP_MATOMO_SITE_ID_OPEN_ALEX,
  "personnel-enseignant": import.meta.env
    .VITE_APP_MATOMO_SITE_ID_PERSONNEL_ENSEIGNANT,
  teds: import.meta.env.VITE_APP_MATOMO_SITE_ID_TEDS,
  "valorisation-recherche-innovation": import.meta.env
    .VITE_APP_MATOMO_SITE_ID_VALORISATION,
};

const trackTo = (siteId: string, url: string) => {
  window._paq.push(["setTrackerUrl", `${MATOMO_URL}matomo.php`]);
  window._paq.push(["setSiteId", siteId]);
  window._paq.push(["setCustomUrl", url]);
  window._paq.push(["setDocumentTitle", document.title]);
  window._paq.push(["trackPageView"]);
};

export function useMatomo(analyticsConsented: boolean) {
  const { pathname, search } = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (!analyticsConsented || !MATOMO_URL) return;

    if (!initialized.current) {
      initialized.current = true;
      window._paq = window._paq || [];
      window._paq.push(["enableLinkTracking"]);
      const g = document.createElement("script");
      g.async = true;
      g.src = `${MATOMO_URL}matomo.js`;
      document.head.appendChild(g);
    }

    const url = pathname + search;

    // Tracker général (toute l'app)
    if (GENERAL_ID) trackTo(GENERAL_ID, url);

    // Tracker board-spécifique
    const board = pathname.split("/").filter(Boolean)[0];
    const boardId = board ? BOARD_IDS[board] : undefined;
    if (boardId) trackTo(boardId, url);
  }, [pathname, search, analyticsConsented]);
}
