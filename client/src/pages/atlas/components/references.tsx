import { Accordion, AccordionGroup, Link } from 'dsfr-plus';
import { useSearchParams, useLocation } from 'react-router-dom';

type DataProps = {
  geo_id: string,
  geo_nom: string,
};

type ReferenceProps = {
  niveau: string,
  data: DataProps[]
}


function ReferenceList({ data }: { data?: DataProps[] }) {
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const newParams = new URLSearchParams(params);
  newParams.delete('geo_id');

  return (
    <ul>
      {
        data?.map((reference) => (
          <li key={reference.geo_id}>
            <Link href={`${pathname}?${newParams.toString()}&geo_id=${reference.geo_id}`}>
              {reference.geo_nom}
            </Link>
          </li>
        ))
      }
    </ul>
  )
}

export default function References({ data, isLoading }: { data: ReferenceProps[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <div>Loader references</div>
    );
  }

  return (
    <AccordionGroup>
      {
        data.map((reference: ReferenceProps) => (
          <Accordion key={reference.niveau} title={reference.niveau} titleAs="h3">
            <ReferenceList data={reference.data} />
          </Accordion>
        ))
      }
    </AccordionGroup>
  )
}