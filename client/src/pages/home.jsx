import { Container, Text } from '@dataesr/react-dsfr';
import { useQuery } from '@tanstack/react-query';
import Title from '../components/title/index.jsx';
import FinanceGraph from '../components/chart/chart.jsx';
import Prototype from '../components/graphs/prototype';
import EvolutionFundingSigned from '../components/graphs/evolution-funding-signed.jsx';

async function getInitialOptions() {
  return fetch('/api/init').then((response) => {
    if (response.ok) return response.json();
    return "Oops... La requète d'initialiation n'a pas fonctionné";
  });
}

export default function Home() {
  const { data, isLoading } = useQuery({ queryKey: ['init'], queryFn: getInitialOptions });
  return (
    <Container className="fr-my-15w">
      <Title
        as='h1'
        look='h1'
        title='Doadify'
        subTitle='Ceci est un sous-titre'
      />
      <Title
        as='h2'
        look='h2'
        title='Premier Graph'
      />
      <FinanceGraph />
      <Prototype />
      <EvolutionFundingSigned />
      <Title as="h1">Doadify</Title>
      {/* <Text>{isLoading ? 'Chargement...' : data?.options.description}</Text> */}
    </Container>
  );
}
