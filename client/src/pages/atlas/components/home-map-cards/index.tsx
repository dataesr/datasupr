import {
  Badge,
  Button,
  Title, Text,
} from '@dataesr/dsfr-plus';
import GenericCard from '../../../../components/cards/generic-card/index.tsx';
import { clearAllfavoriteIdsInCookie, getSortedfavoriteIdsInCookie } from '../../../../utils.tsx';

type TerritoiresListProps = {
  id: string,
  label: string,
  type: string,
};

import MapWithPolygon from '../../charts/map-with-polygon.tsx';
import { GetLevelBadgeFromId } from '../../utils/badges.tsx';

function getRandomElementsFromArray(territoiresList: TerritoiresListProps[], numberOfElements: number) {
  if (numberOfElements <= 0) {
    return [];
  }
  const shuffled = territoiresList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numberOfElements);
}

function getTerritoiresList(territoiresList: TerritoiresListProps[], favorites: string[]) {
  const nbmax = 3;
  if (favorites.length === 0) {
    return getRandomElementsFromArray(territoiresList, nbmax);
  }
  const territoiresInFavorites = territoiresList.filter((territoire) => favorites.includes(territoire?.id)).slice(0, nbmax);
  const territoiresNotInFavorites = territoiresList.filter((territoire) => !favorites.includes(territoire?.id));

  const territoiresNotInFavoritesShuffled = getRandomElementsFromArray(territoiresNotInFavorites, nbmax - territoiresInFavorites.length);
  return [...territoiresInFavorites, ...territoiresNotInFavoritesShuffled];
}

export default function HomeMapCards({ territoiresList = [] }: { territoiresList: TerritoiresListProps[] }) {
  // get favorites from cookie
  const favorites = getSortedfavoriteIdsInCookie();
  const territoires = getTerritoiresList(territoiresList, favorites);

  return (
    <>
      <Title as="h2" look="h5" className="fr-mb-0">
        Accès rapide
      </Title>
      <Text as="p" className="fr-mb-1w">
        <i>
          Vos territoires favoris apparaissent en premiers dans cette liste
        </i>
        <Button onClick={() => clearAllfavoriteIdsInCookie()} variant="text">Réinitialiser cette liste</Button>
      </Text>

      <GenericCard
        title="France"
        to='/atlas/general?geo_id=PAYS_100&annee_universitaire=2022-23'
        description={<Badge color="blue-ecume">Pays</Badge>}
        image={<MapWithPolygon id="FRA" height='100px' zoomControl={false} autoCenter={false} />}
      />
      {
        territoires.map((territoire) => (
          <div className='fr-py-1w'>
            <GenericCard
              title={territoire.label}
              to={`/atlas/general?geo_id=${territoire.id}&annee_universitaire=2022-23`}
              description={GetLevelBadgeFromId({ id: territoire.id })}
              image={<MapWithPolygon id={territoire.id} height='100px' zoomControl={false} autoCenter={true} />}
            />
          </div>
        ))}
    </>
  );
}