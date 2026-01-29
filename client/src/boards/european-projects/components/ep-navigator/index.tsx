import { Button, Modal, ModalContent, Badge } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHierarchy, getFilters, getPrograms, getThematics, getDestinations } from "../../api";
import { autoCorrectUrl, cleanParams, type UrlParams } from "./url-validation";
import "./styles.scss";
import TreeChart from "./tree-chart";
import i18n from "./i18n.json";

interface FilterItem {
  id: string;
  label_fr?: string;
  label_en?: string;
}

export default function EpNavigator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const viewParam = searchParams.get("view") || "";

  // État pour détecter si le navigateur est en mode minifié (sticky)
  const [isMinified, setIsMinified] = useState(false);
  const navigatorRef = useRef<HTMLDivElement>(null);

  // Extraire le tab et la vue du paramètre composé (ex: "synthesis|program")
  const [activeTab, view] = viewParam.includes("|") ? viewParam.split("|") : ["synthesis", viewParam || "pillar"];

  const pillarId = searchParams.get("pillarId") || undefined;
  const programId = searchParams.get("programId") || undefined;
  const thematicIds = searchParams.get("thematicIds") || undefined;
  const destinationIds = searchParams.get("destinationIds") || undefined;

  // Fonction pour obtenir les traductions
  const getI18nLabel = (key: keyof typeof i18n) => {
    return i18n[key]?.[currentLang as "fr" | "en"] || i18n[key]?.["fr"] || key;
  };

  // Fonction pour obtenir le bon libellé selon la langue
  const getLocalizedLabel = (item: FilterItem) => {
    if (currentLang === "en") {
      return item.label_en || item.label_fr;
    }
    return item.label_fr || item.label_en;
  };

  // récupération de la hiérarchie des projets européens
  const { data: hierarchyData, isLoading } = useQuery({
    queryKey: ["ep/get-hierarchy", pillarId],
    queryFn: () => getHierarchy({ pillarId }),
  });

  // récupération de tous les piliers de la base de données
  const { data: pillarsData } = useQuery({
    queryKey: ["ep/filters", "pillars"],
    queryFn: () => getFilters({ filterKey: "pillars" }),
  });

  // récupération des tous les programmes du pilier sélectionné
  const { data: programsData, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ["ep/programs", pillarId],
    queryFn: () => getPrograms([pillarId!]),
    enabled: !!pillarId,
    staleTime: 0, // Forcer la requête à être considérée comme périmée immédiatement
    gcTime: 0, // Ne pas mettre en cache
    refetchOnMount: true, // Toujours refetch au montage
    refetchOnWindowFocus: false, // Éviter les refetch inutiles
  });

  // récupération des toutes les thématiques du ou des programmes sélectionnés
  const { data: thematicsData, isLoading: isLoadingThematics } = useQuery({
    queryKey: ["ep/thematics", programId],
    queryFn: () => getThematics(programId!.split(",")),
    enabled: !!programId,
    staleTime: 0, // Forcer la requête à être considérée comme périmée immédiatement
    gcTime: 0, // Ne pas mettre en cache
    refetchOnMount: true, // Toujours refetch au montage
    refetchOnWindowFocus: false, // Éviter les refetch inutiles
  });

  // récupération des toutes les destinations des thématiques sélectionnées
  const {
    data: destinationsData,
    isLoading: isLoadingDestinations,
    error: destinationsError,
  } = useQuery({
    queryKey: ["ep/destinations", thematicIds],
    queryFn: () => getDestinations(thematicIds!.split(",")),
    enabled: !!thematicIds,
    staleTime: 0, // Forcer la requête à être considérée comme périmée immédiatement
    gcTime: 0, // Ne pas mettre en cache
    refetchOnMount: true, // Toujours refetch au montage
    refetchOnWindowFocus: false, // Éviter les refetch inutiles
  });

  // États pour les modales
  const [modals, setModals] = useState({
    pillar: false,
    programs: false,
    thematiques: false,
    destinations: false,
    information: false,
  });

  // États pour les sélections temporaires dans les modales
  const [selectedPillar, setSelectedPillar] = useState(pillarId || "");
  const [selectedProgram, setSelectedProgram] = useState(programId || "");
  const [selectedThematics, setSelectedThematics] = useState<string[]>(thematicIds ? thematicIds.split(",") : []);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(destinationIds ? destinationIds.split(",") : []);

  // Validation et correction automatique des paramètres d'URL
  useEffect(() => {
    const currentParams: UrlParams = {
      view,
      pillarId,
      programId,
      thematicIds,
      destinationIds,
    };

    const correctedParams = autoCorrectUrl(currentParams);

    // Vérifier si des corrections sont nécessaires
    const needsCorrection = JSON.stringify(cleanParams(currentParams)) !== JSON.stringify(cleanParams(correctedParams));

    if (needsCorrection) {
      // Appliquer les corrections à l'URL
      const newSearchParams = new URLSearchParams(searchParams);

      // Supprimer tous les paramètres de navigation
      ["view", "pillarId", "programId", "thematicIds", "destinationIds"].forEach((param) => {
        newSearchParams.delete(param);
      });

      // Ajouter les paramètres corrigés avec le format tab|view
      Object.entries(cleanParams(correctedParams)).forEach(([key, value]) => {
        if (value) {
          if (key === "view") {
            // Reconstruire le paramètre view avec le tab actif
            newSearchParams.set(key, buildViewParam(value, activeTab));
          } else {
            newSearchParams.set(key, value);
          }
        }
      });

      // Mettre à jour l'URL sans déclencher une navigation
      setSearchParams(newSearchParams);
    }
  }, [view, pillarId, programId, thematicIds, destinationIds, searchParams, setSearchParams, activeTab]);

  // Synchroniser les états temporaires avec les paramètres d'URL
  useEffect(() => {
    setSelectedPillar(pillarId || "");
    setSelectedProgram(programId || "");
    setSelectedThematics(thematicIds ? thematicIds.split(",") : []);
    setSelectedDestinations(destinationIds ? destinationIds.split(",") : []);
  }, [pillarId, programId, thematicIds, destinationIds]);

  // Gestion du scroll pour le mode sticky minifié
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let initialTop: number | null = null;

    const handleScroll = () => {
      // Debounce léger pour améliorer la performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (navigatorRef.current) {
          // Capturer la position initiale une seule fois
          if (initialTop === null) {
            const rect = navigatorRef.current.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            initialTop = rect.top + scrollTop;
          }

          const epMainMenu = document.querySelector(".ep-main-menu");
          const currentHeaderHeight = epMainMenu ? epMainMenu.clientHeight : 60;
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

          // Devient minifié quand on a scrollé assez pour que le navigateur
          // soit à la position du menu principal
          const scrollThreshold = initialTop - currentHeaderHeight - 10;
          const shouldMinify = scrollTop >= scrollThreshold;

          // Éviter les re-renders inutiles
          setIsMinified((prev) => (prev !== shouldMinify ? shouldMinify : prev));
        }
      }, 10);
    };

    // Vérifier au montage avec un petit délai pour s'assurer que le DOM est rendu
    setTimeout(handleScroll, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Réinitialiser les sélections en cascade quand le pilier change
  useEffect(() => {
    if (pillarId) {
      // Quand le pilier change, réinitialiser les sélections temporaires
      setSelectedProgram("");
      setSelectedThematics([]);
      setSelectedDestinations([]);
    }
  }, [pillarId]);

  // Réinitialiser les sélections en cascade quand le programme change
  useEffect(() => {
    if (programId) {
      // Quand le programme change, réinitialiser les sélections temporaires des niveaux inférieurs
      setSelectedThematics([]);
      setSelectedDestinations([]);
    }
  }, [programId]);

  // Réinitialiser les sélections en cascade quand les thématiques changent
  useEffect(() => {
    if (thematicIds) {
      // Quand les thématiques changent, réinitialiser les sélections temporaires des destinations
      setSelectedDestinations([]);
    }
  }, [thematicIds]);

  // Fonction pour mettre à jour l'URL avec les nouveaux paramètres
  const updateUrlParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  // Fonction helper pour construire le paramètre view composé (tab|view)
  const buildViewParam = (contentView: string, tab: string = "synthesis") => {
    return `${tab}|${contentView}`;
  };

  // Fonctions pour ouvrir/fermer les modales
  const openModal = (modalType: keyof typeof modals) => {
    // Réinitialiser les sélections temporaires avec les valeurs actuelles avant d'ouvrir la modale
    if (modalType === "programs") {
      setSelectedProgram(programId || "");
    } else if (modalType === "thematiques") {
      setSelectedThematics(thematicIds ? thematicIds.split(",") : []);
    } else if (modalType === "destinations") {
      setSelectedDestinations(destinationIds ? destinationIds.split(",") : []);
    }

    setModals((prev) => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalType]: false }));
  };

  // Fonctions de validation des sélections
  const validatePillarSelection = () => {
    if (selectedPillar) {
      // Réinitialiser les états locaux des niveaux inférieurs
      setSelectedProgram("");
      setSelectedThematics([]);
      setSelectedDestinations([]);

      updateUrlParams({
        pillarId: selectedPillar,
        view: buildViewParam("program", activeTab),
        // Reset des paramètres suivants
        programId: undefined,
        thematicIds: undefined,
        destinationIds: undefined,
      });
    }
    closeModal("pillar");
  };

  const validateProgramsSelection = () => {
    if (selectedProgram) {
      // Réinitialiser les états locaux des niveaux inférieurs
      setSelectedThematics([]);
      setSelectedDestinations([]);

      updateUrlParams({
        programId: selectedProgram,
        view: buildViewParam("thematic", activeTab),
        // Reset des paramètres suivants
        thematicIds: undefined,
        destinationIds: undefined,
      });
    }
    closeModal("programs");
  };

  const validateThematicsSelection = () => {
    if (selectedThematics.length > 0) {
      // Réinitialiser les états locaux des niveaux inférieurs
      setSelectedDestinations([]);

      updateUrlParams({
        thematicIds: selectedThematics.join(","),
        view: buildViewParam("destination", activeTab),
        // Reset des paramètres suivants
        destinationIds: undefined,
      });
    }
    closeModal("thematiques");
  };

  const validateDestinationsSelection = () => {
    if (selectedDestinations.length > 0) {
      updateUrlParams({
        destinationIds: selectedDestinations.join(","),
        view: buildViewParam("destination", activeTab),
      });
    }
    closeModal("destinations");
  };

  // Fonctions de suppression des sélections
  const clearPillarSelection = () => {
    setSelectedPillar("");
    setSelectedProgram("");
    setSelectedThematics([]);
    setSelectedDestinations([]);

    updateUrlParams({
      pillarId: undefined,
      programId: undefined,
      thematicIds: undefined,
      destinationIds: undefined,
      view: buildViewParam("pillar", activeTab),
    });
    closeModal("pillar");
  };

  const clearProgramsSelection = () => {
    setSelectedProgram("");
    setSelectedThematics([]);
    setSelectedDestinations([]);

    updateUrlParams({
      programId: undefined,
      thematicIds: undefined,
      destinationIds: undefined,
      view: buildViewParam("program", activeTab),
    });
    closeModal("programs");
  };

  const clearThematicsSelection = () => {
    setSelectedThematics([]);
    setSelectedDestinations([]);

    updateUrlParams({
      thematicIds: undefined,
      destinationIds: undefined,
      view: buildViewParam("thematic", activeTab),
    });
    closeModal("thematiques");
  };

  const clearDestinationsSelection = () => {
    setSelectedDestinations([]);

    updateUrlParams({
      destinationIds: undefined,
    });
    closeModal("destinations");
  };

  // Logique de gestion des états basée sur le paramètre view
  const getNavigationState = () => {
    switch (view) {
      case "pillar":
        return {
          pillar: { linkEnabled: true, buttonEnabled: true },
          programs: { linkEnabled: false, buttonEnabled: true },
          thematiques: { linkEnabled: false, buttonEnabled: false },
          destinations: { linkEnabled: false, buttonEnabled: false },
        };
      case "program":
        return {
          pillar: { linkEnabled: true, buttonEnabled: true },
          programs: { linkEnabled: true, buttonEnabled: true },
          thematiques: { linkEnabled: false, buttonEnabled: true },
          destinations: { linkEnabled: false, buttonEnabled: false },
        };
      case "thematic":
        return {
          pillar: { linkEnabled: true, buttonEnabled: true },
          programs: { linkEnabled: true, buttonEnabled: true },
          thematiques: { linkEnabled: true, buttonEnabled: true },
          destinations: { linkEnabled: false, buttonEnabled: true },
        };
      case "destination":
        return {
          pillar: { linkEnabled: true, buttonEnabled: true },
          programs: { linkEnabled: true, buttonEnabled: true },
          thematiques: { linkEnabled: true, buttonEnabled: true },
          destinations: { linkEnabled: true, buttonEnabled: true },
        };
      default:
        // État par défaut : seul le pilier est accessible
        return {
          pillar: { linkEnabled: true, buttonEnabled: true },
          programs: { linkEnabled: false, buttonEnabled: false },
          thematiques: { linkEnabled: false, buttonEnabled: false },
          destinations: { linkEnabled: false, buttonEnabled: false },
        };
    }
  };

  // Fonctions pour obtenir les noms des éléments sélectionnés
  const getPillarName = () => {
    const { getI18nLabel } = require("../../../../utils");
    const i18n = require("../../i18n-global.json");
    
    if (!pillarId || !pillarsData || !Array.isArray(pillarsData)) return null;
    const pillar = pillarsData.find((p: FilterItem) => p.id === pillarId);
    if (pillar) {
      const localizedLabel = getLocalizedLabel(pillar);
      const pillarLabel = getI18nLabel(i18n, "pillar");
      return localizedLabel + (pillar.id ? ` (${pillarLabel}${pillar.id.split(".")[1]})` : "");
    }
    return null;
  };

  const getProgramName = () => {
    if (!programId || !programsData || !Array.isArray(programsData)) return null;
    const program = programsData.find((p: FilterItem) => p.id === programId);
    return program ? getLocalizedLabel(program) : null;
  };

  const getThematicsNames = () => {
    if (!thematicIds || !thematicsData || !Array.isArray(thematicsData)) return null;
    const selectedThematicIds = thematicIds.split(",");
    return selectedThematicIds
      .map((id) => {
        const thematic = thematicsData.find((t: FilterItem) => t.id === id);
        return thematic ? getLocalizedLabel(thematic) : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const getDestinationsNames = () => {
    if (!destinationIds || !destinationsData || !Array.isArray(destinationsData)) return null;
    const selectedDestinationIds = destinationIds.split(",");
    return selectedDestinationIds
      .map((id) => {
        const destination = destinationsData.find((d: FilterItem) => d.id === id);
        return destination ? getLocalizedLabel(destination) : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  // Fonctions pour obtenir les comptages d'occurrences
  const getPillarsCount = () => {
    return pillarsData && Array.isArray(pillarsData) ? pillarsData.length : 0;
  };

  const getProgramsCount = () => {
    return programsData && Array.isArray(programsData) ? programsData.length : 0;
  };

  const getThematicsCount = () => {
    return thematicsData && Array.isArray(thematicsData) ? thematicsData.length : 0;
  };

  const getDestinationsCount = () => {
    return destinationsData && Array.isArray(destinationsData) ? destinationsData.length : 0;
  };

  // Fonction pour tronquer le texte à 2 lignes maximum
  const truncateText = (text: string | null, maxLines: number = 2): string => {
    if (!text) return "";
    // Approximation: environ 45 caractères par ligne pour la version minifiée
    const maxChars = maxLines * 45;
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars - 3) + "...";
  };

  // Fonction pour obtenir le texte court pour les badges minifiés
  const getShortText = (fullText: string | null | undefined, fallbackKey: keyof typeof i18n): string => {
    if (!fullText) {
      const fallbackText = getI18nLabel(fallbackKey);
      // Raccourcir "Aucun pilier sélectionné" en "Aucun"
      return fallbackText.split(" ")[0]; // Prend juste le premier mot (Aucun/None/etc)
    }
    return truncateText(fullText);
  };

  // // Fonctions pour obtenir les comptages d'éléments sélectionnés
  const getSelectedPillarsCount = () => {
    return pillarId ? 1 : 0;
  };

  const getSelectedProgramsCount = () => {
    return programId ? 1 : 0;
  };

  const getSelectedThematicsCount = () => {
    return thematicIds ? thematicIds.split(",").length : 0;
  };

  const getSelectedDestinationsCount = () => {
    return destinationIds ? destinationIds.split(",").length : 0;
  };

  const navState = getNavigationState();

  return (
    <div id="crumbs" ref={navigatorRef} className={isMinified ? "minified" : ""}>
      {/* Version minifiée sticky */}
      {isMinified && (
        <div className="navigator-minified">
          <div className="minified-badges">
            <div
              className="minified-badge pilier-badge"
              role="button"
              tabIndex={0}
              onClick={() => openModal("pillar")}
              onKeyPress={(e) => e.key === "Enter" && openModal("pillar")}
            >
              <strong>{getI18nLabel("pillar")}:</strong> {getShortText(getPillarName(), "no_pillar_selected")}
            </div>
            <div
              className="minified-badge programmes-badge"
              role="button"
              tabIndex={0}
              onClick={() => navState.programs.buttonEnabled && openModal("programs")}
              onKeyPress={(e) => e.key === "Enter" && navState.programs.buttonEnabled && openModal("programs")}
              style={{ opacity: navState.programs.buttonEnabled ? 1 : 0.6, cursor: navState.programs.buttonEnabled ? "pointer" : "not-allowed" }}
            >
              <strong>{getI18nLabel("program")}:</strong> {getShortText(getProgramName(), "no_program_selected")}
            </div>
            <div
              className="minified-badge thematiques-badge"
              role="button"
              tabIndex={0}
              onClick={() => navState.thematiques.buttonEnabled && openModal("thematiques")}
              onKeyPress={(e) => e.key === "Enter" && navState.thematiques.buttonEnabled && openModal("thematiques")}
              style={{
                opacity: navState.thematiques.buttonEnabled ? 1 : 0.6,
                cursor: navState.thematiques.buttonEnabled ? "pointer" : "not-allowed",
              }}
            >
              <strong>{getI18nLabel("thematics")}:</strong> {getShortText(getThematicsNames(), "no_thematic_selected")}
            </div>
            <div
              className="minified-badge destinations-badge"
              role="button"
              tabIndex={0}
              onClick={() => navState.destinations.buttonEnabled && openModal("destinations")}
              onKeyPress={(e) => e.key === "Enter" && navState.destinations.buttonEnabled && openModal("destinations")}
              style={{
                opacity: navState.destinations.buttonEnabled ? 1 : 0.6,
                cursor: navState.destinations.buttonEnabled ? "pointer" : "not-allowed",
              }}
            >
              <strong>{getI18nLabel("destinations")}:</strong> {getShortText(getDestinationsNames(), "no_destination_selected")}
            </div>
          </div>
        </div>
      )}

      {/* Version complète */}
      <div className={`navigator-full ${isMinified ? "hidden" : ""}`}>
        <div className="info-button-container">
          <Button
            size="sm"
            variant="tertiary"
            title={getI18nLabel("info_button_title")}
            onClick={() => openModal("information")}
            className="info-button"
          >
            <i className="ri-information-line" aria-hidden="true"></i>
          </Button>
        </div>
        <ul>
          <li className={`pilier ${!navState.pillar.linkEnabled ? "section-disabled" : ""}`}>
            <i className="label-pilier">{getI18nLabel("pillar")}</i>
            <div className={`${!navState.pillar.linkEnabled ? "disabled" : ""} ${!pillarId ? "no-selection" : ""}`}>
              <Button
                disabled={!navState.pillar.buttonEnabled}
                onClick={() => openModal("pillar")}
                size="sm"
                title={getI18nLabel("pillar_selection_button_title")}
                variant="text"
              >
                {getSelectedPillarsCount() > 0 ? getPillarName() : getI18nLabel("select")}
              </Button>
            </div>
          </li>
          <li className={`programmes ${!navState.programs.linkEnabled ? "section-disabled" : ""}`}>
            <i className="label-programmes">{getI18nLabel("program")}</i>
            <div className={`${!navState.programs.linkEnabled ? "disabled" : ""} ${!programId ? "no-selection" : ""}`}>
              <Button
                disabled={!navState.programs.buttonEnabled}
                onClick={() => openModal("programs")}
                size="sm"
                title={getI18nLabel("program_selection_button_title")}
                variant="text"
              >
                {getSelectedProgramsCount() > 0 ? getProgramName() : getI18nLabel("select")}
              </Button>
            </div>
          </li>
          <li className={`thematiques ${!navState.thematiques.linkEnabled ? "section-disabled" : ""}`}>
            <i className="label-thematiques">{getI18nLabel("thematics")}</i>
            <div className={`${!navState.thematiques.linkEnabled ? "disabled" : ""} ${!thematicIds ? "no-selection" : ""}`}>
              <Button
                disabled={!navState.thematiques.buttonEnabled}
                onClick={() => openModal("thematiques")}
                size="sm"
                title={getI18nLabel("thematic_selection_button_title")}
                variant="text"
              >
                {getSelectedThematicsCount() > 0 ? getThematicsNames() : getI18nLabel("select")}
              </Button>
            </div>
          </li>
          <li className={`destinations ${!navState.destinations.linkEnabled ? "section-disabled" : ""}`}>
            <i className="label-destinations">{getI18nLabel("destinations")}</i>
            <div className={`${!navState.destinations.linkEnabled ? "disabled" : ""} ${!destinationIds ? "no-selection" : ""}`}>
              <Button
                disabled={!navState.destinations.buttonEnabled}
                onClick={() => openModal("destinations")}
                size="sm"
                title={getI18nLabel("destination_selection_button_title")}
                variant="text"
              >
                {getSelectedDestinationsCount() > 0 ? getDestinationsNames() : getI18nLabel("select")}
              </Button>
            </div>
          </li>
        </ul>
      </div>

      {/* Modales */}
      <Modal isOpen={modals.pillar} hide={() => closeModal("pillar")} title={getI18nLabel("pillar_selection_title")} size="lg">
        <ModalContent>
          <h4>{getI18nLabel("choose_pillar")}</h4>
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="pillar-select">
              {getI18nLabel("available_pillars")} {getPillarsCount() > 0 && <Badge size="sm">{getPillarsCount()}</Badge>}
            </label>
            <select className="fr-select" id="pillar-select" value={selectedPillar} onChange={(e) => setSelectedPillar(e.target.value)}>
              <option value="">{getI18nLabel("select_pillar")}</option>
              {pillarsData &&
                Array.isArray(pillarsData) &&
                pillarsData.map((pillar: FilterItem) => (
                  <option key={pillar.id} value={pillar.id}>
                    {getLocalizedLabel(pillar)}
                  </option>
                ))}
            </select>
          </div>
          <div className="fr-btns-group fr-btns-group--between fr-mt-2w">
            <Button variant="secondary" color="error" onClick={clearPillarSelection} disabled={!pillarId}>
              {getI18nLabel("clear_selection")}
            </Button>
            <div className="fr-btns-group">
              <Button variant="secondary" onClick={() => closeModal("pillar")}>
                {getI18nLabel("cancel")}
              </Button>
              <Button onClick={validatePillarSelection} disabled={!selectedPillar}>
                {getI18nLabel("validate")}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      <Modal isOpen={modals.programs} hide={() => closeModal("programs")} title={getI18nLabel("program_selection_title")} size="lg">
        <ModalContent>
          <h4>
            {getI18nLabel("choose_program")} {getPillarName()}
          </h4>
          <fieldset className="fr-fieldset">
            <legend className="fr-fieldset__legend">
              {getI18nLabel("available_programs")} {getProgramsCount() > 0 && <Badge size="sm">{getProgramsCount()}</Badge>}
            </legend>
            <div className="fr-fieldset__content">
              {isLoadingPrograms && <p>{getI18nLabel("loading_programs")}</p>}
              {programsData &&
                Array.isArray(programsData) &&
                programsData.map((program: FilterItem) => (
                  <div key={program.id} className="fr-radio-group">
                    <input
                      type="radio"
                      id={`program-${program.id}`}
                      name="programs"
                      value={program.id}
                      checked={selectedProgram === program.id}
                      onChange={(e) => {
                        setSelectedProgram(e.target.value);
                      }}
                    />
                    <label className="fr-label" htmlFor={`program-${program.id}`}>
                      {getLocalizedLabel(program)}
                    </label>
                  </div>
                ))}
              {(!programsData || !Array.isArray(programsData)) && !isLoadingPrograms && <p>{getI18nLabel("no_programs_available")}</p>}
            </div>
          </fieldset>
          <div className="fr-btns-group fr-btns-group--between fr-mt-2w">
            <Button variant="secondary" color="error" onClick={clearProgramsSelection} disabled={!programId}>
              {getI18nLabel("clear_selection")}
            </Button>
            <div className="fr-btns-group">
              <Button variant="secondary" onClick={() => closeModal("programs")}>
                {getI18nLabel("cancel")}
              </Button>
              <Button onClick={validateProgramsSelection} disabled={!selectedProgram}>
                {getI18nLabel("validate")}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      <Modal isOpen={modals.thematiques} hide={() => closeModal("thematiques")} title={getI18nLabel("thematic_selection_title")} size="lg">
        <ModalContent>
          <h4>{getI18nLabel("choose_thematics")}</h4>
          <fieldset className="fr-fieldset">
            <legend className="fr-fieldset__legend">
              {getI18nLabel("available_thematics")} {getThematicsCount() > 0 && <Badge size="sm">{getThematicsCount()}</Badge>}
            </legend>
            <div className="fr-fieldset__content">
              {isLoadingThematics && <p>{getI18nLabel("loading_thematics")}</p>}
              {thematicsData &&
                Array.isArray(thematicsData) &&
                thematicsData.map((thematic: FilterItem) => (
                  <div key={thematic.id} className="fr-checkbox-group">
                    <input
                      type="checkbox"
                      id={`thematic-${thematic.id}`}
                      name="thematiques"
                      checked={selectedThematics.includes(thematic.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedThematics([...selectedThematics, thematic.id]);
                        } else {
                          setSelectedThematics(selectedThematics.filter((id) => id !== thematic.id));
                        }
                      }}
                    />
                    <label className="fr-label" htmlFor={`thematic-${thematic.id}`}>
                      {getLocalizedLabel(thematic)}
                    </label>
                  </div>
                ))}
              {(!thematicsData || !Array.isArray(thematicsData)) && !isLoadingThematics && <p>{getI18nLabel("no_thematics_available")}</p>}
            </div>
          </fieldset>
          <div className="fr-btns-group fr-btns-group--between fr-mt-2w">
            <Button variant="secondary" color="error" onClick={clearThematicsSelection} disabled={!thematicIds}>
              {getI18nLabel("clear_selection")}
            </Button>
            <div className="fr-btns-group">
              <Button variant="secondary" onClick={() => closeModal("thematiques")}>
                {getI18nLabel("cancel")}
              </Button>
              <Button onClick={validateThematicsSelection} disabled={selectedThematics.length === 0}>
                {getI18nLabel("validate")}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      <Modal isOpen={modals.destinations} hide={() => closeModal("destinations")} title={getI18nLabel("destination_selection_title")} size="lg">
        <ModalContent>
          <h4>{getI18nLabel("choose_destinations")}</h4>
          <fieldset className="fr-fieldset">
            <legend className="fr-fieldset__legend">
              {getI18nLabel("available_destinations")} {getDestinationsCount() > 0 && <Badge size="sm">{getDestinationsCount()}</Badge>}
            </legend>
            <div className="fr-fieldset__content">
              {isLoadingDestinations && <p>{getI18nLabel("loading_destinations")}</p>}
              {destinationsError && (
                <p style={{ color: "red" }}>
                  {getI18nLabel("loading_error")} {destinationsError.message}
                </p>
              )}
              {destinationsData &&
                Array.isArray(destinationsData) &&
                destinationsData.map((destination: FilterItem) => (
                  <div key={destination.id} className="fr-checkbox-group">
                    <input
                      type="checkbox"
                      id={`destination-${destination.id}`}
                      name="destinations"
                      checked={selectedDestinations.includes(destination.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDestinations([...selectedDestinations, destination.id]);
                        } else {
                          setSelectedDestinations(selectedDestinations.filter((id) => id !== destination.id));
                        }
                      }}
                    />
                    <label className="fr-label" htmlFor={`destination-${destination.id}`}>
                      {getLocalizedLabel(destination)}
                    </label>
                  </div>
                ))}
              {(!destinationsData || !Array.isArray(destinationsData)) && !isLoadingDestinations && (
                <p>{getI18nLabel("no_destinations_available")}</p>
              )}
            </div>
          </fieldset>
          <div className="fr-btns-group fr-btns-group--between fr-mt-2w">
            <Button variant="secondary" color="error" onClick={clearDestinationsSelection} disabled={!destinationIds}>
              {getI18nLabel("clear_selection")}
            </Button>
            <div className="fr-btns-group">
              <Button variant="secondary" onClick={() => closeModal("destinations")}>
                {getI18nLabel("cancel")}
              </Button>
              <Button onClick={validateDestinationsSelection} disabled={selectedDestinations.length === 0}>
                {getI18nLabel("validate")}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      <Modal isOpen={modals.information} hide={() => closeModal("information")} title={getI18nLabel("navigator_info_title")} size="lg">
        <ModalContent>
          <h4>{getI18nLabel("about_navigator")}</h4>
          <p>{getI18nLabel("navigator_description")}</p>
          <div className="fr-mb-2w">
            <h5>{getI18nLabel("hierarchical_organization")}</h5>
            {isLoading ? <p>{getI18nLabel("loading_hierarchy")}</p> : <TreeChart data={hierarchyData} />}
          </div>
          <div className="fr-mb-2w">
            <h5>{getI18nLabel("navigation_title")}</h5>
            <p>{getI18nLabel("navigation_description")}</p>
          </div>
          <div className="fr-btns-group fr-btns-group--right fr-mt-2w">
            <Button onClick={() => closeModal("information")}>{getI18nLabel("close")}</Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
