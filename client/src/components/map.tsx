import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as turf from '@turf/turf';
import type { Feature, Point, Polygon, MultiPolygon, Position, BBox } from "geojson";

type PolygonCoordinatesProps = {
  type: string;
  coordinates: Position[][] | Position[][][];
}[];

export default function Map({
  autoCenter = false,
  height,
  polygonCoordinates,
  width,
  zoomControl = true,
}: {
  autoCenter: boolean,
  height: string,
  polygonCoordinates: PolygonCoordinatesProps,
  width: string,
  zoomControl: boolean,
}) {
  let poly: Feature<Polygon | MultiPolygon> | undefined;
  let calculateCenter: Feature<Point> | undefined;
  let bbox: BBox = [0, 0, 0, 0];

  if (polygonCoordinates) {
    if (polygonCoordinates[0]?.type === "MultiPolygon") {
      poly = turf.multiPolygon(polygonCoordinates[0]?.coordinates as Position[][][]);
    } else if (polygonCoordinates[0]?.type === "Polygon") {
      poly = turf.polygon(polygonCoordinates[0]?.coordinates as Position[][]);
    }

    if (poly) {
      calculateCenter = turf.centerOfMass(poly);
      bbox = turf.bbox(poly);
    }
  }

  let center = [46.71109, 1.719103] as [number, number];
  if (autoCenter && calculateCenter) {
    center = [...calculateCenter.geometry.coordinates].reverse() as [number, number];
  }
  if (center === undefined) {
    center = [46.71109, 1.719103];
  }

  // union of polygons
  if (polygonCoordinates.length > 1) {
    let union: Feature<Polygon | MultiPolygon> | null = poly || null;
    for (let i = 1; i < polygonCoordinates.length; i++) {
      const curr = polygonCoordinates[i];
      if (curr) {
        let currFeature: Feature<Polygon | MultiPolygon>;
        if (curr.type === "MultiPolygon") {
          currFeature = turf.multiPolygon(curr.coordinates as Position[][][]);
        } else {
          currFeature = turf.polygon(curr.coordinates as Position[][]);
        }
        if (union) {
          union = turf.union(turf.featureCollection([union, currFeature]));
        } else {
          union = currFeature;
        }
      }
    }
    if (union) {
      bbox = turf.bbox(union);
    }
  }

  const conditionalAttributes = {};
  if (!autoCenter) {
    conditionalAttributes['zoom'] = 4;
  }

  return (
    <MapContainer
      attributionControl={false}
      bounds={[[bbox[1], bbox[0]], [bbox[3], bbox[2]]]}
      center={autoCenter ? [center[0], center[1]] : center}
      scrollWheelZoom={false}
      style={{ height, width }}
      zoomControl={zoomControl}
      {...conditionalAttributes}
    >
      <TileLayer
        attribution="<a href='https://www.jawg.io' target='_blank'>&copy; Jawg</a>"
        url={`https://tile.jawg.io/jawg-light/{z}/{x}/{y}.png?lang=fr&access-token=5V4ER9yrsLxoHQrAGQuYNu4yWqXNqKAM6iaX5D1LGpRNTBxvQL3enWXpxMQqTrY8`}
      />
      <GeoJSON
        style={{ color: 'var(--brown-caramel-sun-425-moon-901-active)' }}
        // @ts-expect-error description
        data={polygonCoordinates}
      />
    </MapContainer >
  );
}

