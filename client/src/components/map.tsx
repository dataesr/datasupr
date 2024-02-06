import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as turf from '@turf/turf';

type PolygonCoordinatesProps = {
  type: string,
  coordinates: []
}
const zoomLevel = 8;

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
  let polygons = [];

  let calculateCenter = {}

  if (polygonCoordinates) {
    if (polygonCoordinates?.type === 'MultiPolygon') {
      polygons = polygonCoordinates.coordinates[0];
    } else if (polygonCoordinates?.type === 'Polygon') {
      polygons = polygonCoordinates.coordinates;
    }
    const poly = turf.polygon(polygons);
    calculateCenter = turf.centerOfMass(poly);
  }

  let zoomLevel = 4;
  let center = [46.71109, 1.719103];
  if (autoCenter) {
    zoomLevel = 8;
    center = calculateCenter?.geometry?.coordinates?.reverse();
  }

  return (
    <MapContainer
      center={center}
      scrollWheelZoom={false}
      style={{ height, width }}
      zoom={zoomLevel}
      zoomControl={zoomControl}
    >
      <TileLayer
        attribution="<a href='https://www.jawg.io' target='_blank'>&copy; Jawg</a>"
        url={`https://tile.jawg.io/jawg-light/{z}/{x}/{y}.png?lang=fr&access-token=5V4ER9yrsLxoHQrAGQuYNu4yWqXNqKAM6iaX5D1LGpRNTBxvQL3enWXpxMQqTrY8`}
      />
      <GeoJSON
        style={{ color: 'var(--brown-caramel-sun-425-moon-901-active)' }}
        data={polygonCoordinates}
      />
    </MapContainer>
  );
}

