
export default function MapSkeleton({ height = '500px' }: { height?: string }) {
  return (
    <div style={{ height: height }} className='map-skeleton' />
  );
}