import { useMemo } from "react";
import { Title } from "@dataesr/dsfr-plus";
import CardSimple from "../../../../../../components/card-simple";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCssColor } from "../../../../../../utils/colors";
import "../styles.scss";
import MetricDefinitionsTable from "../../../../components/metric-definitions/metric-definitions-table";

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

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  return null;
}

export function ImplantationsSection({ data }: ImplantationsSectionProps) {
  if (
    !data?.implantations ||
    !Array.isArray(data.implantations) ||
    data.implantations.length === 0
  ) {
    return null;
  }

  const points = useMemo(() => {
    const fromImplantations = (data.implantations as any[])
      .map((implantation: any, index: number) => {
        const coords = extractCoordinates(implantation);
        if (!coords) return null;
        return {
          id: String(implantation.implantation_id || index),
          name: implantation.implantation || `Implantation ${index + 1}`,
          lat: coords.lat,
          lon: coords.lon,
          effectif: implantation.effectif_sans_cpge as number | null,
          partEffectif: implantation.part_effectif_sans_cpge as number | null,
          siege: Boolean(implantation.siege),
        };
      })
      .filter(Boolean) as {
      id: string;
      name: string;
      lat: number;
      lon: number;
      effectif: number | null;
      partEffectif: number | null;
      siege: boolean;
    }[];

    // Deduplicate by name + coordinates
    const unique = Array.from(
      new Map(
        fromImplantations.map((p) => [
          `${p.name}-${p.lat.toFixed(6)}-${p.lon.toFixed(6)}`,
          p,
        ])
      ).values()
    );

    if (unique.length > 0) return unique;

    const fallback = extractCoordinates(data);
    if (fallback) {
      return [
        {
          id: "main",
          name: data?.etablissement_lib || "Établissement",
          lat: fallback.lat,
          lon: fallback.lon,
          effectif: data?.effectif_sans_cpge ?? null,
          partEffectif: null,
          siege: true,
        },
      ];
    }

    return [];
  }, [data]);

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (points.length === 0) return null;
    return points.map(
      (p) => [p.lat, p.lon] as LatLngTuple
    ) as LatLngBoundsExpression;
  }, [points]);

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
        <div
          className={points.length > 0 ? "fr-col-12 fr-col-lg-6" : "fr-col-12"}
        >
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

        {points.length > 0 && bounds && (
          <div className="fr-col-12 fr-col-lg-6">
            <MapContainer
              style={{ height: "420px", width: "100%" }}
              bounds={bounds}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitBounds bounds={bounds} />
              {points.map((point) => (
                <CircleMarker
                  key={point.id}
                  center={[point.lat, point.lon]}
                  radius={point.siege ? 10 : 7}
                  pathOptions={{
                    fillColor: point.siege
                      ? getCssColor("yellow-moutarde-dark")
                      : getCssColor("blue-france"),
                    fillOpacity: 0.9,
                    color: getCssColor("beige-gris-galet"),
                    weight: 2,
                  }}
                >
                  <Popup>
                    <strong>{point.name}</strong>
                    <br />
                    {point.effectif != null
                      ? `${Number(point.effectif).toLocaleString("fr-FR")} étudiants`
                      : "Effectif non renseigné"}
                    {point.partEffectif != null && (
                      <>
                        <br />
                        <strong>{point.partEffectif.toFixed(1)} %</strong> des
                        étudiants
                      </>
                    )}
                    {point.siege && (
                      <>
                        <br />★ Site principal
                      </>
                    )}
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
      <MetricDefinitionsTable metricKeys={["nb_sites"]} />
    </section>
  );
}
