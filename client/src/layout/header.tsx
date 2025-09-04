import { Button, Header, Logo, Service, FastAccess } from "@dataesr/dsfr-plus";

export default function HeaderDatasupR() {
  return (
    <Header>
      <Logo text="Ministère|chargé|de l'enseignement|supérieur|et de la recherche" />
      <Service name="DataSupR" tagline="Ensemble de tableaux de bord de l'enseignement supérieur, de la recherche et de l'innovation" />
      <FastAccess>
        <Button
          as="a"
          href="https://github.com/dataesr/react-dsfr"
          target="_blank"
          rel="noreferer noopener"
          icon="github-fill"
          size="sm"
          variant="text"
        >
          Github
        </Button>
      </FastAccess>
    </Header>
  );
}
