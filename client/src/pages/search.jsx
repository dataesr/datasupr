import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Button,
  Col,
  Container,
  Row,
  TextInput,
  Card,
  CardTitle,
  CardDescription,
  TagGroup,
  Tag,
} from "@dataesr/react-dsfr";

async function searchFromPaysageAPI(query) {
  return fetch(`/api/search?q=${query}`).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return "Oops... La requète de récupération des objets Paysage n'a pas fonctionné";
  });
}

async function searchFromTableauxAPI(idPaysage) {
  return fetch(`/api/tableaux?q=${idPaysage}`).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return "Oops... La requète de récupération des tableaux associés n'a pas fonctionné";
  });
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState({});

  const { data: results, refetch: refetchPaysageAPI } = useQuery({
    queryKey: ["paysageQuery", query],
    queryFn: () => searchFromPaysageAPI(query),
    enabled: false,
  });

  const { data: tableaux, refetch: refetchTableau } = useQuery({
    queryKey: ["tableauxQuery", selected.id],
    queryFn: () => searchFromTableauxAPI(selected.id),
    enabled: false,
  });

  const onItemSelect = (item) => {
    setSelected(item);
    refetchTableau();
  };

  const getParams = () => {
    if (!selected) return ('');

    if (selected.type === 'structure') {
      return `structureId=${selected.id}`
    }
    if (selected.type === 'country') {
      return `countryCode=${selected.iso2}`
    }
    return '';
  }

  return (
    <Container>
      <Row alignItems="bottom" className="fr-mb-5w">
        <Col n="10">
          <TextInput
            label="Rechercher"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                refetchPaysageAPI();
              }
            }}
          />
        </Col>
        <Col n="2">
          <Button onClick={() => refetchPaysageAPI()} icon="ri-search-line">Rechercher</Button>
        </Col>
      </Row>
      <Row gutters>
        {results &&
          results.map((result) => (
            <Col n="4">
              <Card onClick={() => onItemSelect(result)} href="#">
                <CardTitle>{result.label}</CardTitle>
                <CardDescription>
                  <TagGroup>
                    <Tag>{result.type}</Tag>
                  </TagGroup>
                </CardDescription>
              </Card>
            </Col>
          ))}
      </Row>
      {selected?.id && tableaux && tableaux.length > 0 && (
        <Row className="fr-mt-5w">
          <Col n="12">
            <h2>{`Liste des tableaux de bord correspondants à "${selected.label}"`}</h2>
          </Col>
        </Row>
      )}
      {tableaux && tableaux.length > 0 && (
        <Row gutters>
          {tableaux.map((tableau) => (
            <Col n="6">
              <Card href={`/tableaux/${tableau.id}?${getParams()}`}>
                <CardTitle>{tableau.label}</CardTitle>
                <CardDescription>
                  <TagGroup>
                    {tableau.tags.map((tag) => (
                      <Tag>{tag}</Tag>
                    ))}
                  </TagGroup>
                </CardDescription>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
