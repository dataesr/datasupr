import './styles.scss';

export default function MapSkeleton({ height = "400px" }: { height?: string }) {
  return <div style={{ height: height }} className="map-skeleton" />;
}