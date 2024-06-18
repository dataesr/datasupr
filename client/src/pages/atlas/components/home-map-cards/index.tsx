import { Button, Title, Text, Link } from "@dataesr/dsfr-plus";
import {
  clearAllfavoriteIdsInCookie,
  getSortedfavoriteIdsInCookie,
} from "../../../../utils.tsx";

type TerritoiresListProps = {
  id: string;
  label: string;
  type: string;
};

import { GetLevelBadgeFromId } from "../../utils/badges.tsx";

function getRandomElementsFromArray(
  territoiresList: TerritoiresListProps[],
  numberOfElements: number
) {
  if (numberOfElements <= 0) {
    return [];
  }
  const shuffled = territoiresList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numberOfElements);
}

function getTerritoiresList(
  territoiresList: TerritoiresListProps[],
  favorites: string[]
) {
  const nbmax = 7;
  if (favorites.length === 0) {
    return getRandomElementsFromArray(territoiresList, nbmax);
  }
  const territoiresInFavorites = territoiresList
    .filter((territoire) => favorites.includes(territoire?.id))
    .slice(0, nbmax);
  const territoiresNotInFavorites = territoiresList.filter(
    (territoire) => !favorites.includes(territoire?.id)
  );

  const territoiresNotInFavoritesShuffled = getRandomElementsFromArray(
    territoiresNotInFavorites,
    nbmax - territoiresInFavorites.length
  );
  return [...territoiresInFavorites, ...territoiresNotInFavoritesShuffled];
}

export default function HomeMapCards({
  territoiresList = [],
}: {
  territoiresList: TerritoiresListProps[];
}) {
  // get favorites from cookie
  const favorites = getSortedfavoriteIdsInCookie();
  const territoires = getTerritoiresList(territoiresList, favorites);

  return (
    <div className="fr-p-2w" style={{ backgroundColor: "#f3f3f3" }}>
      <Title as="h2" look="h5" className="fr-mb-0 text-center">
        Accès rapide
      </Title>
      <Text as="p" className="fr-mb-1w">
        <i>Vos territoires favoris apparaissent en premiers dans cette liste</i>
        <Button onClick={() => clearAllfavoriteIdsInCookie()} variant="text">
          Réinitialiser cette liste
        </Button>
      </Text>
      <ul>
        <li className="fr-py-1w" style={{ borderBottom: "solid 1px #ddd" }}>
          <Link href="/atlas/general?geo_id=PAYS_100&annee_universitaire=2022-23">
            France
          </Link>
          {GetLevelBadgeFromId({ id: "PAYS_100" })}
        </li>

        {territoires.map((territoire) => (
          <li
            className="fr-py-1w"
            key={territoire.id}
            style={{ borderBottom: "solid 1px #ddd" }}
          >
            <Link
              href={`/atlas/general?geo_id=${territoire.id}&annee_universitaire=2022-23`}
            >
              {territoire.label}
            </Link>
            {GetLevelBadgeFromId({ id: territoire.id })}
          </li>
        ))}
      </ul>
    </div>
  );
}
