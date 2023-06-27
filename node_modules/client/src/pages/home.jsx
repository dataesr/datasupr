import { Container, Text } from '@dataesr/react-dsfr';
import { useQuery } from '@tanstack/react-query';
import Title from '../components/title/index.jsx';
import FinanceGraph from '../components/chart/chart.jsx';

async function getHello() {
  return fetch('/api/hello').then((response) => {
    if (response.ok) return response.json();
    return "Oops... La requète à l'API n'a pas fonctionné";
  });
}

export default function Home() {
  const { data, isLoading } = useQuery({ queryKey: ['hello'], queryFn: getHello });
  return (
    <Container className="fr-my-15w">
      <Title
        as='h1'
        look='h1'
        title='Doadify'
        subTitle= 'Ceci est un sous-titre'
      />
      <Text>{isLoading ? 'Chargement...' : data?.hello}</Text>
      <Title
        as='h2'
        look='h2'
        title='Premier Graph'
      />
      <FinanceGraph/>
    </Container>
  );
}
