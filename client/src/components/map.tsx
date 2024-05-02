import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as turf from '@turf/turf';

type PolygonCoordinatesProps = {
  type: string,
  coordinates: [number, number] | [number, number][]
}[]

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
  let poly;
  let calculateCenter = {};
  let bbox = [];

  if (polygonCoordinates) {
    if (polygonCoordinates[0]?.type === 'MultiPolygon') {
      poly = turf.multiPolygon(polygonCoordinates[0]?.coordinates);
    } else if (polygonCoordinates[0]?.type === 'Polygon') {
      poly = turf.polygon(polygonCoordinates[0]?.coordinates);
    }

    calculateCenter = turf.centerOfMass(poly);
    bbox = turf.bbox(poly);
  }

  let center = [46.71109, 1.719103] as [number, number];
  if (autoCenter) {
    center = (calculateCenter as turf.Feature<turf.Point>)?.geometry?.coordinates?.reverse();
  }
  if (center === undefined) {
    center = [46.71109, 1.719103];
  }

  // union of polygons
  if (polygonCoordinates.length > 1) {
    const union = polygonCoordinates.reduce((a, b) => turf.union(a, b), polygonCoordinates[0])
    bbox = turf.bbox(union);
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

