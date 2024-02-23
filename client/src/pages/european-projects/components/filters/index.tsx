import { Tag, TagGroup } from '@dataesr/dsfr-plus';
import { useSearchParams } from 'react-router-dom';
import { getFilterLabel } from '../../utils';

export default function Filters() {
  const [searchParams] = useSearchParams();
  const params = [...searchParams];

  return (
    <TagGroup>
      {
        params.map(([key, value]) => (
          <Tag key={key} color='purple-glycine'>
            {getFilterLabel(key)} : {value}
          </Tag>
        ))
      }
    </TagGroup>
  );
}