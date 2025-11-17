import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge, Container, Row, Col, Text, Title, Link } from "@dataesr/dsfr-plus";
import "./styles.scss";

const { VITE_APP_SERVER_URL } = import.meta.env;

interface CrossBoardMatch {
  field: string;
  value: string;
  collectionId: string;
}

interface CrossBoardResult {
  boardId: string;
  associatedRoute: string;
  matches: CrossBoardMatch[];
}

export default function BoardsSuggestComponent() {
  const [searchParams] = useSearchParams();

  // Convertir les paramètres d'URL en objet
  const params = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  // Créer la query string pour l'API
  const queryString = useMemo(() => {
    if (Object.keys(params).length === 0) return null;
    return new URLSearchParams(params).toString();
  }, [params]);

  // Rechercher dans cross-boards
  const { data: suggestions, isLoading } = useQuery<CrossBoardResult[]>({
    queryKey: ["search-cross-boards", queryString],
    queryFn: () => fetch(`${VITE_APP_SERVER_URL}/admin/search-cross-boards?${queryString}`).then((response) => response.json()),
    enabled: !!queryString, // Ne faire la requête que si on a des paramètres
  });

  // Si pas de paramètres d'URL
  if (!queryString) {
    return null;
  }

  // Si en chargement
  if (isLoading) {
    return (
      <aside className="inline-suggest">
        <Container fluid>
          <Row>
            <Col>
              <Text size="sm">⏳ Recherche de tableaux de bord associés...</Text>
            </Col>
          </Row>
        </Container>
      </aside>
    );
  }

  // Si aucune suggestion trouvée
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <aside className="inline-suggest">
      <Container fluid>
        <Row gutters>
          <Col xs="12">
            <Title as="h6" look="h6">
              💡 Tableaux de bord suggérés
            </Title>
          </Col>
          <Col xs="12">
            <Text size="sm" bold className="fr-mb-1w">
              Paramètres détectés :
            </Text>
            <div className="fr-mb-2w">
              {Object.entries(params).map(([key, value]) => (
                <Badge key={key} color="blue-ecume" size="sm" className="fr-mr-1v fr-mb-1v">
                  {key} = {value}
                </Badge>
              ))}
            </div>
          </Col>
          <Col xs="12">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="fr-card fr-card--sm fr-mb-2w">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <Title as="h6" look="h6" className="fr-card__title">
                      <Link href={suggestion.associatedRoute}>{suggestion.boardId.toUpperCase()}</Link>
                    </Title>
                    <div className="fr-card__desc">
                      <Badge color="green-menthe" size="sm" className="fr-mr-1v">
                        {suggestion.matches.length} correspondance{suggestion.matches.length > 1 ? "s" : ""}
                      </Badge>
                      {suggestion.matches.map((match, matchIndex) => (
                        <Badge key={matchIndex} color="purple-glycine" size="sm" className="fr-mr-1v fr-mb-1v">
                          {match.field}: {match.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </aside>
  );
}
