import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  // getHierarchy,
  getFilters,
  getPrograms,
  getThematics,
  getDestinations,
} from "../../api";

import { Container, Row, Col, Checkbox } from "@dataesr/dsfr-plus";

// import { getI18nLabel } from "../../../../utils";
// import i18nLocal from "./i18n.json";
// import i18nGlobal from "../../i18n-global.json";
// const i18n = { ...i18nGlobal, ...i18nLocal };

import styles from "./styles.module.scss";

interface FilterItem {
  id: string;
  label_fr?: string;
  label_en?: string;
}

export default function EpNavigator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  const [selectedThematics, setSelectedThematics] = useState<Set<string>>(new Set());
  const [isThematicsOpen, setIsThematicsOpen] = useState(false);
  const thematicsDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedDestinations, setSelectedDestinations] = useState<Set<string>>(new Set());
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const destinationsDropdownRef = useRef<HTMLDivElement>(null);

  const pillarId = searchParams.get("pillarId") || undefined;
  const programId = searchParams.get("programId") || undefined;
  const thematicIds = searchParams.get("thematicIds") || undefined;

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
  const { data: destinationsData, isLoading: isLoadingDestinations } = useQuery({
    queryKey: ["ep/destinations", thematicIds],
    queryFn: () => getDestinations(thematicIds!.split(",")),
    enabled: !!thematicIds,
    staleTime: 0, // Forcer la requête à être considérée comme périmée immédiatement
    gcTime: 0, // Ne pas mettre en cache
    refetchOnMount: true, // Toujours refetch au montage
    refetchOnWindowFocus: false, // Éviter les refetch inutiles
  });

  const handleThematicChange = (optionId: string) => {
    setSelectedThematics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(optionId)) {
        newSet.delete(optionId);
      } else {
        newSet.add(optionId);
      }
      return newSet;
    });
  };

  const handleClearThematics = () => {
    setSelectedThematics(new Set());
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("thematicIds");
    setSearchParams(newSearchParams);
    setIsThematicsOpen(false);
  };

  const handleApplyThematics = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (selectedThematics.size > 0) {
      newSearchParams.set("thematicIds", Array.from(selectedThematics).join(","));
    } else {
      newSearchParams.delete("thematicIds");
    }
    setSearchParams(newSearchParams);
    setIsThematicsOpen(false);
  };

  const handleDestinationChange = (optionId: string) => {
    setSelectedDestinations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(optionId)) {
        newSet.delete(optionId);
      } else {
        newSet.add(optionId);
      }
      return newSet;
    });
  };

  const handleClearDestinations = () => {
    setSelectedDestinations(new Set());
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("destinationIds");
    setSearchParams(newSearchParams);
    setIsDestinationsOpen(false);
  };

  const handleApplyDestinations = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (selectedDestinations.size > 0) {
      newSearchParams.set("destinationIds", Array.from(selectedDestinations).join(","));
    } else {
      newSearchParams.delete("destinationIds");
    }
    setSearchParams(newSearchParams);
    setIsDestinationsOpen(false);
  };

  const thematicsLabel = selectedThematics.size > 0 ? `${selectedThematics.size} sélectionnée(s)` : "Pas de sélection";
  const destinationsLabel = selectedDestinations.size > 0 ? `${selectedDestinations.size} sélectionnée(s)` : "Pas de sélection";

  return (
    <Container>
      <Row gutters>
        {/* Piliers */}
        <Col lg={3} sm={12}>
          <label className="fr-label" htmlFor="select-pillar-label">
            Selection des piliers
          </label>
          <select
            aria-describedby="select-pillar-label"
            className="fr-select"
            id="select-pillar"
            name="select-pillar"
            onChange={(e) => {
              const newSearchParams = new URLSearchParams(searchParams);
              if (e.target.value) {
                newSearchParams.set("pillarId", e.target.value);
              } else {
                newSearchParams.delete("pillarId");
              }
              setSearchParams(newSearchParams);
            }}
          >
            <option value="" selected={!pillarId}>
              Pas de selection
            </option>
            {pillarsData &&
              pillarsData.map((pillar: FilterItem) => (
                <option key={pillar.id} value={pillar.id} selected={pillar.id === pillarId}>
                  {`pilier${pillar.id.split(".")[1]}`} - {pillar[`label_${currentLang}`]}
                </option>
              ))}
          </select>
        </Col>
        {/* Programmes dépendants du pilier sélectionné */}
        <Col lg={3} sm={12}>
          <label className="fr-label" htmlFor="select-program-label">
            Selection des programmes
          </label>
          <select
            aria-describedby="select-program-label"
            className="fr-select"
            disabled={isLoadingPrograms || !programsData || programsData.length === 0}
            id="select-program"
            name="select-program"
            onChange={(e) => {
              const newSearchParams = new URLSearchParams(searchParams);
              if (e.target.value) {
                newSearchParams.set("programId", e.target.value);
              } else {
                newSearchParams.delete("programId");
              }
              setSearchParams(newSearchParams);
            }}
          >
            <option value="" selected={!programId}>
              Pas de selection
            </option>
            {programsData &&
              programsData.map((program: FilterItem) => (
                <option key={program.id} value={program.id} selected={program.id === programId}>
                  {program[`label_${currentLang}`]}
                </option>
              ))}
          </select>
        </Col>
        {/* Thématiques dépendantes du programme sélectionné */}
        <Col lg={3} sm={12}>
          <div className={styles.dropdownContainer} ref={thematicsDropdownRef}>
            <label className="fr-label" htmlFor="select-thematics-label">
              Selection des thématiques
            </label>
            <button
              aria-expanded={isThematicsOpen}
              aria-haspopup="listbox"
              className={`fr-select ${styles.dropdownButton}`}
              disabled={isLoadingThematics || !thematicsData || thematicsData.length === 0}
              id="select-thematics-label"
              onClick={() => setIsThematicsOpen(!isThematicsOpen)}
            >
              <span>{thematicsLabel}</span>
            </button>
            {isThematicsOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.checkboxGroup}>
                  {thematicsData.map((thematic) => (
                    <div key={thematic.id} className={styles.checkboxItem}>
                      <Checkbox
                        id={`thematic-${thematic.id}`}
                        label={thematic[`label_${currentLang}`]}
                        checked={selectedThematics.has(thematic.id)}
                        onChange={() => handleThematicChange(thematic.id)}
                      />
                    </div>
                  ))}
                </div>
                {selectedThematics.size > 0 && (
                  <>
                    <button className={styles.bottomButton} onClick={handleApplyThematics}>
                      Appliquer
                    </button>
                    <button className={styles.bottomButton} onClick={handleClearThematics}>
                      Effacer la sélection
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </Col>
        <Col lg={3} sm={12}>
          <div className={styles.dropdownContainer} ref={destinationsDropdownRef}>
            <label className="fr-label" htmlFor="select-destinations-label">
              Selection des destinations
            </label>
            <button
              aria-expanded={isDestinationsOpen}
              aria-haspopup="listbox"
              className={`fr-select ${styles.dropdownButton}`}
              disabled={isLoadingDestinations || !destinationsData || destinationsData.length === 0}
              id="select-destinations-label"
              onClick={() => setIsDestinationsOpen(!isDestinationsOpen)}
            >
              <span>{destinationsLabel}</span>
            </button>
            {isDestinationsOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.checkboxGroup}>
                  {destinationsData.map((destination) => (
                    <div key={destination.id} className={styles.checkboxItem}>
                      <Checkbox
                        id={`destination-${destination.id}`}
                        label={destination[`label_${currentLang}`]}
                        checked={selectedDestinations.has(destination.id)}
                        onChange={() => handleDestinationChange(destination.id)}
                      />
                    </div>
                  ))}
                </div>
                {selectedDestinations.size > 0 && (
                  <>
                    <button className={styles.bottomButton} onClick={handleApplyDestinations}>
                      Appliquer
                    </button>
                    <button className={styles.bottomButton} onClick={handleClearDestinations}>
                      Effacer la sélection
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
