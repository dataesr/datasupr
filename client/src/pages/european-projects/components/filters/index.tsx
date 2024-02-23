import { Tag, TagGroup } from '@dataesr/dsfr-plus';
import { useSearchParams } from 'react-router-dom';
import { getFilterLabel, getIso2Label } from '../../utils';

export default function Filters() {
  const [searchParams] = useSearchParams();
  const params = [...searchParams];

  return (
    <TagGroup>
      {
        params.map(([key, value]) => (
          <Tag key={key} color='purple-glycine'>
            {getFilterLabel(key)} : {(key === 'country_code') ? getIso2Label(value) : value}
          </Tag>
        ))
      }
    </TagGroup>
  );
}