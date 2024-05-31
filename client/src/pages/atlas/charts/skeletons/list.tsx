
import './styles.scss';

export default function ListSkeleton({ nb = 5 }: { nb?: number }) {
  return (
    <>
      {[...Array(nb)].map((_, i) => (
        <div key={i} className='filieres-list-skeleton'>
          <div className='filieres-list-skeleton__title' />
          <div className='filieres-list-skeleton__item' />
        </div>
      ))}
    </>
  );
}