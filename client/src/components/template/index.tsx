import './styles.scss';

export default function Template({ height = '400px' }: { height?: string }) {
  return (
    <div style={{ height: height }} className='filieres-sectors-template' />
  );
}