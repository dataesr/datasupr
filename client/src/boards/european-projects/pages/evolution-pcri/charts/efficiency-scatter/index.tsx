import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@dataesr/dsfr-plus";

import { getData } from "./query.js";
import options, { FRAMEWORKS_ORDER, FRAMEWORK_LABELS } from "./options.js";
import { useGetParams, readingKey, renderDataTable } from "./utils.js";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useChartColor } from "../../../../../../hooks/useChartColor";
import { EPChartsSources } from "../../../../config.js";

import i18n from "./i18n.json";

export default function EfficiencyScatter() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = useGetParams();
  const color = useChartColor();

  // États pour l'animation
  const [currentFrameworkIndex, setCurrentFrameworkIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["efficiencyScatter", params],
    queryFn: () => getData(params),
  });

  // Nettoyer l'intervalle au démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Fonction pour avancer au framework suivant
  const nextFramework = useCallback(() => {
    setCurrentFrameworkIndex((prev) => {
      if (prev === null) return 0;
      const next = prev + 1;
      if (next >= FRAMEWORKS_ORDER.length) {
        // Animation terminée, arrêter et revenir à "tous"
        setIsPlaying(false);
        return null;
      }
      return next;
    });
  }, []);

  // Gérer le play/pause
  useEffect(() => {
    if (isPlaying) {
      // Commencer l'animation
      if (currentFrameworkIndex === null) {
        setCurrentFrameworkIndex(0);
      }
      intervalRef.current = setInterval(nextFramework, 2500);
    } else {
      // Arrêter l'animation
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, nextFramework]);

  const handlePlay = () => {
    setCurrentFrameworkIndex(0);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrameworkIndex(null);
  };

  // Sélection manuelle d'un framework
  const handleSelectFramework = (index: number | null) => {
    setIsPlaying(false);
    setCurrentFrameworkIndex(index);
  };

  if (isLoading || !data) return <DefaultSkeleton />;

  const currentFramework = currentFrameworkIndex !== null ? FRAMEWORKS_ORDER[currentFrameworkIndex] : null;

  const chartId = "efficiencyScatter";
  const config = {
    id: chartId,
    title: {
      fr: i18n.title.fr,
      en: i18n.title.en,
    },
    comment: {
      fr: <>{i18n.comment.fr}</>,
      en: <>{i18n.comment.en}</>,
    },
    readingKey: readingKey(data, isLoading),
    sources: EPChartsSources,
    integrationURL: `/integration?chart_id=${chartId}&${params}`,
  };

  return (
    <div className={`chart-container chart-container--${color}`}>
      <span className="chart-badge">Top 15</span>

      {/* Contrôles d'animation */}
      <div className="fr-mb-2w" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {!isPlaying ? (
            <Button
              onClick={handlePlay}
              size="sm"
              variant="secondary"
              icon="play-fill"
              title={currentLang === "fr" ? "Lancer l'animation" : "Play animation"}
            >
              {currentLang === "fr" ? "Lecture" : "Play"}
            </Button>
          ) : (
            <Button onClick={handlePause} size="sm" variant="secondary" icon="pause-fill" title={currentLang === "fr" ? "Pause" : "Pause"}>
              {currentLang === "fr" ? "Pause" : "Pause"}
            </Button>
          )}
          <Button
            onClick={handleReset}
            size="sm"
            variant="tertiary"
            icon="refresh-line"
            title={currentLang === "fr" ? "Réinitialiser (tous les frameworks)" : "Reset (all frameworks)"}
            disabled={currentFrameworkIndex === null && !isPlaying}
          >
            {currentLang === "fr" ? "Tous" : "All"}
          </Button>
        </div>

        {/* Indicateurs de framework */}
        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          {FRAMEWORKS_ORDER.map((fw, index) => (
            <button
              key={fw}
              onClick={() => handleSelectFramework(index)}
              style={{
                padding: "0.25rem 0.75rem",
                fontSize: "0.75rem",
                border: currentFrameworkIndex === index ? "2px solid var(--text-active-blue-france)" : "1px solid var(--border-default-grey)",
                borderRadius: "4px",
                background: currentFrameworkIndex === index ? "var(--background-action-low-blue-france)" : "var(--background-default-grey)",
                cursor: "pointer",
                fontWeight: currentFrameworkIndex === index ? "bold" : "normal",
                transition: "all 0.2s ease",
              }}
              title={FRAMEWORK_LABELS[fw]}
            >
              {fw === "HORIZON EUROPE" ? "HE" : fw}
            </button>
          ))}
        </div>

        {/* Indicateur de progression */}
        {isPlaying && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "var(--text-default-success)",
                animation: "pulse 1s infinite",
              }}
            />
            <span style={{ fontSize: "0.875rem", color: "var(--text-mention-grey)" }}>
              {currentLang === "fr" ? "Animation en cours..." : "Animation playing..."}
            </span>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
      </style>

      <ChartWrapper config={config} options={options(data, currentLang, currentFramework)} renderData={() => renderDataTable(data, currentLang)} />
    </div>
  );
}
