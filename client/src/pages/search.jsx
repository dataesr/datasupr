import React, { useState } from "react";
import {
  Button, Col, Container, Row,
  TextInput,
  Card, CardTitle, CardDescription,
  TagGroup, Tag,
} from "@dataesr/react-dsfr";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [tableaux, setTableaux] = useState([]);
  const [selected, setSelected] = useState({});

  const search = () => {
    console.log('search: appel API paysage avec query');
    setTableaux([]);
    setResults([
      {
        label: "Université Paris-Saclay",
        active: true,
        id: "G2qA7",
        type: "structure",
      },
      {
        label: "CEA Paris-Saclay - Etablissement de Saclay",
        active: true,
        id: "hg15O",
        type: "structure",
      },
      {
        label: "Campus Paris Saclay",
        active: true,
        id: "APN3L",
        type: "structure",
      },
    ]);
  };

  const onItemSelect = (item) => {
    console.log('onItemSelect: appel APIs sources pour récupérer les ids des tableaux', item);
    setResults([]);
    setSelected(item);
    setTableaux([
      { label: "Projets européens", id: "european-projects", description: "description du tableau de bord desprojets européens", tags: ["Recherche"] },
      { label: "tableau de bord financier", id: "tableau-de-bord-financier", description: "description du tableau de bord financier", tags: ["Enseignement supérieur"] },
    ]);
  };

  return (
    <Container>
      <Row alignItems="bottom" className="fr-mb-5w">
        <Col n="10">
          <TextInput
            label="Rechercher"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Col>
        <Col n="2">
          <Button onClick={() => search()}>Rechercher</Button>
        </Col>
      </Row>
      <Row gutters>
        {results &&
          results.map((result) => (
            <Col n="4">
              <Card onClick={() => onItemSelect(result)}>
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
      {
        selected.id && (
          <Row>
            <Col n="12">
              <h2>{`Liste des tableaux de bord correspondants à "${selected.label}"`}</h2>
            </Col>
          </Row>
        )
      }
      <Row gutters>
        {tableaux &&
          tableaux.map((tableau) => (
            <Col n="6">
              <Card href={`/tableaux/${tableau.id}?structureID=${selected.id}`}>
                <CardTitle>{tableau.label}</CardTitle>
                <CardDescription>
                  <TagGroup>
                    {tableau.tags.map((tag) => (<Tag>{tag}</Tag>))}
                  </TagGroup>
                </CardDescription>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
}
