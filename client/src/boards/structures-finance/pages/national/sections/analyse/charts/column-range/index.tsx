import { useMemo, useState } from "react";
import type Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
import "../../../../styles.scss";
import { Text, Row, Col } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../../../components/chart-wrapper/index.tsx";
import Select from "../../../../../../../../components/select";
import DefaultSkeleton from "../../../../../../../../components/charts-skeletons/default";
import MetricDefinitionsTable from "../../../../../../components/metric-definitions/metric-definitions-table.tsx";
import { useMetricLabel } from "../../../../../../utils/metrics";
import {
  METRICS_CONFIG,
  type MetricKey,
} from "../../../../../../config/metrics-config.ts";
import { createColumnRangeOptions, type ColumnRangePoint } from "./options.tsx";
import { RenderDataVariation } from "./render-data.tsx";


interface ColumnRangeChartProps {
  allYearsData: any[];
  metricKey: MetricKey;
  availableYears: number[];
  isLoading: boolean;
  currentStructureId?: string;
  initialTopN?: number | null;
}

const TOP_N_OPTIONS: (number | null)[] = [10, 20, 30, 50, 100, null];
const getTopNLabel = (n: number | null) =>
  n === null ? "Tous les établissements" : `${n} établissements`;

export default function ColumnRangeChart({
  allYearsData,
  metricKey,
  availableYears,
  isLoading,
  currentStructureId,
  initialTopN = 20,
}: ColumnRangeChartProps) {
  const getMetricLabel = useMetricLabel();
  const metricConfig = METRICS_CONFIG[metricKey];
  const metricLabel = getMetricLabel(metricKey);

  const sortedYears = [...availableYears].sort((a, b) => a - b);
  const defaultYearFrom =
    sortedYears.length >= 2
      ? String(sortedYears[sortedYears.length - 2])
      : String(sortedYears[0] ?? "");
  const defaultYearTo =
    sortedYears.length >= 1 ? String(sortedYears[sortedYears.length - 1]) : "";

  const [yearFrom, setYearFrom] = useState<string>(defaultYearFrom);
  const [yearTo, setYearTo] = useState<string>(defaultYearTo);
  const [topN, setTopN] = useState<number | null>(initialTopN);
  const [sortMode, setSortMode] = useState<"variation" | "alphabetical">(
    "variation"
  );

  const pointsAll = useMemo<ColumnRangePoint[]>(() => {
    const byId = new Map<
      string,
      { name: string; values: Record<string, number>; isHighlighted: boolean }
    >();

    allYearsData.forEach((item: any) => {
      const id =
        item.etablissement_id_paysage_actuel ||
        item.etablissement_id_paysage ||
        item.uai;
      if (!id) return;
      const value = item[metricKey];
      if (value == null || isNaN(value)) return;
      const year = String(item.exercice || item.annee || item.year || "");
      if (!year) return;

      if (!byId.has(id)) {
        byId.set(id, {
          name:
            item.etablissement_actuel_lib ||
            item.etablissement_lib ||
            "Sans nom",
          values: {},
          isHighlighted: !!currentStructureId && id === currentStructureId,
        });
      }
      byId.get(id)!.values[year] = value;
    });

    const result: ColumnRangePoint[] = [];
    byId.forEach(({ name, values, isHighlighted }) => {
      const vFrom = values[yearFrom];
      const vTo = values[yearTo];
      if (vFrom == null || vTo == null) return;
      const variation = vTo - vFrom;
      const variationPct =
        vFrom !== 0 ? (variation / Math.abs(vFrom)) * 100 : 0;
      result.push({
        name,
        low: Math.min(vFrom, vTo),
        high: Math.max(vFrom, vTo),
        valueFrom: vFrom,
        valueTo: vTo,
        variation,
        variationPct,
        isHighlighted,
      });
    });

    return result;
  }, [allYearsData, metricKey, yearFrom, yearTo, currentStructureId]);

  const points = useMemo<ColumnRangePoint[]>(() => {
    const sorted =
      sortMode === "variation"
        ? [...pointsAll].sort((a, b) => b.variation - a.variation)
        : [...pointsAll].sort((a, b) => a.name.localeCompare(b.name, "fr"));
    if (topN == null) return sorted;
    const sliced = sorted.slice(0, topN);
    const highlighted = sorted.find((p) => p.isHighlighted);
    if (highlighted && !sliced.some((p) => p.isHighlighted)) {
      sliced.push(highlighted);
    }
    return sliced;
  }, [pointsAll, topN, sortMode]);

  const chartOptions = useMemo<Highcharts.Options | null>(() => {
    if (!points.length || !metricConfig) return null;
    return createColumnRangeOptions(
      {
        metric: metricKey,
        metricLabel,
        metricConfig,
        yearFrom,
        yearTo,
        topN: points.length,
      },
      points
    );
  }, [points, metricKey, metricLabel, metricConfig, yearFrom, yearTo]);

  const config = {
    id: "national-column-range",
    title: `${metricLabel} — Variation ${yearFrom} → ${yearTo}`,
  };

  const noData = !isLoading && points.length === 0;
  const highlightedName = pointsAll.find((p) => p.isHighlighted)?.name;

  return (
    <div>
      <Row gutters className="fr-mb-3w">
        <Col xs="12" md="3">
          <Text className="fr-text--sm fr-text--bold fr-mb-1w">
            Année de départ
          </Text>
          <Select label={yearFrom} size="sm" fullWidth className="fr-mb-0">
            {sortedYears.map((year) => (
              <Select.Checkbox
                key={String(year)}
                value={String(year)}
                checked={yearFrom === String(year)}
                onChange={() => setYearFrom(String(year))}
              >
                {year}
              </Select.Checkbox>
            ))}
          </Select>
        </Col>

        <Col xs="12" md="3">
          <Text className="fr-text--sm fr-text--bold fr-mb-1w">
            Année d'arrivée
          </Text>
          <Select label={yearTo} size="sm" fullWidth className="fr-mb-0">
            {sortedYears.map((year) => (
              <Select.Checkbox
                key={String(year)}
                value={String(year)}
                checked={yearTo === String(year)}
                onChange={() => setYearTo(String(year))}
              >
                {year}
              </Select.Checkbox>
            ))}
          </Select>
        </Col>



        <Col xs="12" md="3">
          <Text className="fr-text--sm fr-text--bold fr-mb-1w">Tri</Text>
          <Select
            label={sortMode === "variation" ? "Par variation" : "Alphabétique"}
            size="sm"
            fullWidth
            className="fr-mb-0"
          >
            <Select.Checkbox
              value="variation"
              checked={sortMode === "variation"}
              onChange={() => setSortMode("variation")}
            >
              Par variation
            </Select.Checkbox>
            <Select.Checkbox
              value="alphabetical"
              checked={sortMode === "alphabetical"}
              onChange={() => setSortMode("alphabetical")}
            >
              Alphabétique
            </Select.Checkbox>
          </Select>
        </Col>
        <Col xs="12" md="3">
          <Text className="fr-text--sm fr-text--bold fr-mb-1w">
            Nombre d'établissements
          </Text>
          <Select
            label={getTopNLabel(topN)}
            size="sm"
            fullWidth
            className="fr-mb-0"
          >
            {TOP_N_OPTIONS.map((n) => (
              <Select.Checkbox
                key={String(n)}
                value={String(n)}
                checked={topN === n}
                onChange={() => setTopN(n)}
              >
                {getTopNLabel(n)}
              </Select.Checkbox>
            ))}
          </Select>
        </Col>
      </Row>



      <Row gutters className="fr-mb-2w">
        <Col xs="12">
          <div className="column-range-legend">
            <span className="column-range-legend__item">
              <span className="column-range-legend__swatch column-range-legend__swatch--up" />
              Hausse
            </span>
            <span className="column-range-legend__item">
              <span className="column-range-legend__swatch column-range-legend__swatch--down" />
              Baisse
            </span>
            {currentStructureId && highlightedName && (
              <span className="column-range-legend__item">
                <span className="column-range-legend__swatch column-range-legend__swatch--highlight" />
                {highlightedName}
              </span>
            )}
          </div>
        </Col>
      </Row>

      {isLoading ? (
        <DefaultSkeleton />
      ) : noData ? (
        <div className="fr-alert fr-alert--warning">
          <p className="fr-alert__title">Aucune donnée disponible</p>
          <p>
            Aucun établissement ne dispose de données pour les deux années
            sélectionnées avec les filtres actifs.
          </p>
        </div>
      ) : (
        <>
          <ChartWrapper
            config={config}
            options={chartOptions!}
            renderData={() => (
              <RenderDataVariation
                points={points}
                metricLabel={metricLabel}
                metricConfig={metricConfig!}
                yearFrom={yearFrom}
                yearTo={yearTo}
              />
            )}
          />
          <MetricDefinitionsTable metricKeys={[metricKey]} />
        </>
      )}
    </div>
  );
}
