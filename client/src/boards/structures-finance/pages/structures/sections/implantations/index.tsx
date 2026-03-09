import { useMemo, useRef, useEffect } from "react";
import { Title } from "@dataesr/dsfr-plus";
import CardSimple from "../../../../../../components/card-simple";
import Highcharts from "highcharts";
import "highcharts/modules/map";
import regionsTopology from "../../../../../../assets/regions.json";
import { getCssColor } from "../../../../../../utils/colors";
import "../styles.scss";
import MetricDefinitionsTable from "../../../../components/metric-definitions/metric-definitions-table";

type HighchartsOptions = Highcharts.Options;

interface ImplantationsSectionProps {
  data: any;
}

const toNumber = (value: unknown): number | null => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeLatLon = (
  maybeLat: unknown,
  maybeLon: unknown
): { lat: number; lon: number } | null => {
  const lat = toNumber(maybeLat);
  const lon = toNumber(maybeLon);
  if (lat == null || lon == null) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
};

const parseCoordString = (
  value: string
): { lat: number; lon: number } | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    return extractCoordinates(parsed);
  } catch {
    const parts = trimmed
      .split(/[;,\s]+/)
      .map((v) => v.trim())
      .filter(Boolean);

    if (parts.length >= 2) {
      const a = toNumber(parts[0]);
      const b = toNumber(parts[1]);
      if (a != null && b != null) {
        const latLon = normalizeLatLon(a, b);
        if (latLon) return latLon;
        const lonLat = normalizeLatLon(b, a);
        if (lonLat) return lonLat;
      }
    }
  }

  return null;
};

const extractCoordinates = (
  source: any
): { lat: number; lon: number } | null => {
  if (!source) return null;

  if (typeof source === "string") {
    return parseCoordString(source);
  }

  if (Array.isArray(source) && source.length >= 2) {
    const first = toNumber(source[0]);
    const second = toNumber(source[1]);
    if (first != null && second != null) {
      const latLon = normalizeLatLon(first, second);
      if (latLon) return latLon;
      const lonLat = normalizeLatLon(second, first);
      if (lonLat) return lonLat;
    }
  }

  const direct =
    normalizeLatLon(source.lat, source.lon) ||
    normalizeLatLon(source.latitude, source.longitude) ||
    normalizeLatLon(source.y, source.x) ||
    normalizeLatLon(source.geo_lat, source.geo_lon);

  if (direct) return direct;

  if (source.gps) {
    const gpsCoords = parseCoordString(source.gps);
    if (gpsCoords) return gpsCoords;
  }

  if (source.coordonnees) {
    const nested = extractCoordinates(source.coordonnees);
    if (nested) return nested;
  }

  if (source.coordinates) {
    const nested = extractCoordinates(source.coordinates);
    if (nested) return nested;
  }

  return null;
};

const getFilteredTopology = (topology: any, includeOverseas: boolean) => {
  if (includeOverseas) {
    return topology;
  }

  const filtered = {
    ...topology,
    objects: {
      default: {
        ...topology.objects.default,
        geometries: topology.objects.default.geometries.filter((geo: any) => {
          const lat = geo.properties?.["hc-middle-lat"];
          const lon = geo.properties?.["hc-middle-lon"];
          return (
            lat && lon && lat >= 41 && lat <= 51.5 && lon >= -9 && lon <= 9
          );
        }),
      },
    },
  };
  return filtered;
};

export function ImplantationsSection({ data }: ImplantationsSectionProps) {
  if (
    !data?.implantations ||
    !Array.isArray(data.implantations) ||
    data.implantations.length === 0
  ) {
    return null;
  }

  const mapOptions = useMemo<HighchartsOptions | null>(() => {
    const pointsFromImplantations = (data.implantations || [])
      .map((implantation: any, index: number) => {
        const coords = extractCoordinates(implantation);
        if (!coords) {
          return null;
        }

        return {
          id: String(implantation.implantation_id || index),
          name: implantation.implantation || `Implantation ${index + 1}`,
          lat: coords.lat,
          lon: coords.lon,
          effectif: implantation.effectif_sans_cpge,
          partEffectif: implantation.part_effectif_sans_cpge,
          siege: Boolean(implantation.siege),
        };
      })
      .filter(Boolean);

    const uniquePoints = Array.from(
      new Map(
        pointsFromImplantations.map((p: any) => [
          `${p.name}-${p.lat.toFixed(6)}-${p.lon.toFixed(6)}`,
          p,
        ])
      ).values()
    );

    const fallbackCoords = extractCoordinates(data);

    const points =
      uniquePoints.length > 0
        ? uniquePoints
        : fallbackCoords
          ? [
              {
                id: "main",
                name: data?.etablissement_lib || "Établissement",
                lat: fallbackCoords.lat,
                lon: fallbackCoords.lon,
                effectif: data?.effectif_sans_cpge,
                siege: true,
              },
            ]
          : [];

    if (points.length === 0) {
      return null;
    }

    const isMetropole = points.every(
      (p: any) => p.lat >= 41 && p.lat <= 51.5 && p.lon >= -5 && p.lon <= 10
    );

    // Filtre la topologie pour exclure les DOM-TOM si tous les points sont en métropole
    const filteredTopology = getFilteredTopology(regionsTopology, !isMetropole);

    const regionColor = "white";
    const regionBorderColor = getCssColor("beige-gris-galet");
    const markerMainColor = getCssColor("blue-france");
    const markerSiegeColor = getCssColor("yellow-tournesol");

    return {
      chart: {
        map: filteredTopology as any,
        backgroundColor: "transparent",
      },
      title: { text: "" },
      credits: { enabled: false },
      legend: { enabled: false },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom",
        },
      },
      mapView: {
        projection: {
          name: "WebMercator",
        },
        fitToGeometry: {
          type: "MultiPoint",
          coordinates: points.map((p: any) => [p.lon, p.lat]),
        },
        padding: [50, 50, 70, 50],
      },
      tooltip: {
        useHTML: true,
        headerFormat: "",
        pointFormatter: function () {
          const point = this as any;
          const effectifText =
            point.effectif != null
              ? `${Number(point.effectif).toLocaleString("fr-FR")} étudiants`
              : "Effectif non renseigné";

          const partText =
            point.partEffectif != null
              ? `<br/><strong>${point.partEffectif.toFixed(1)} %</strong> des étudiants`
              : "";

          return `<strong>${point.name}</strong><br/>${effectifText}${partText}${
            point.siege
              ? `<br/><span style='color: ${markerSiegeColor};'>★</span> Site principal`
              : ""
          }`;
        },
      },
      series: [
        {
          type: "map",
          name: "Régions françaises",
          showInLegend: false,
          enableMouseTracking: false,
          color: regionColor,
          borderColor: regionBorderColor,
          borderWidth: 1.5,
          states: {
            inactive: {
              enabled: false,
            },
            hover: {
              enabled: false,
            },
          },
        },
        {
          type: "mappoint",
          name: "Implantations",
          data: points.map((p: any) => ({
            ...p,
            marker: {
              radius: p.partEffectif
                ? Math.max(5, Math.min(15, 5 + p.partEffectif / 5))
                : p.siege
                  ? 8
                  : 6,
              fillColor: p.siege ? markerSiegeColor : markerMainColor,
              lineColor: "white",
              lineWidth: 2,
            },
          })),
          color: markerMainColor,
          dataLabels: {
            enabled: points.length <= 8,
            format: "{point.name}",
            style: {
              fontSize: "11px",
              fontWeight: "500",
              textOutline: "3px white",
              color: "#161616",
            },
          },
        },
      ],
    };
  }, [data]);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapOptions && mapContainerRef.current) {
      Highcharts.mapChart(mapContainerRef.current, mapOptions);
    }
  }, [mapOptions]);

  return (
    <section
      id="section-implantations"
      aria-labelledby="section-implantations-title"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <Title
          as="h2"
          look="h5"
          id="section-implantations-title"
          className="section-header__title"
        >
          Implantations géographiques
        </Title>
      </div>

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className={mapOptions ? "fr-col-12 fr-col-lg-6" : "fr-col-12"}>
          <ul className="fr-grid-row fr-grid-row--gutters" role="list">
            {data.implantations.map((implantation: any, index: number) => {
              const partEffectif = implantation.part_effectif_sans_cpge;
              const description = implantation.siege ? "Site principal" : "";
              const bottomText = partEffectif
                ? `${partEffectif.toFixed(1)} % de l'ensemble des étudiants inscrits`
                : undefined;

              return (
                <li
                  key={implantation.implantation_id || index}
                  className="fr-col-12 fr-col-md-6"
                >
                  <CardSimple
                    bottomText={bottomText}
                    description={description}
                    stat={implantation.effectif_sans_cpge}
                    title={implantation.implantation}
                    year={data.anuniv}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        {mapOptions && (
          <div className="fr-col-12 fr-col-lg-6">
            <div ref={mapContainerRef} style={{ height: "420px" }} />
          </div>
        )}
      </div>
      <MetricDefinitionsTable metricKeys={["nb_sites"]} />
    </section>
  );
}
