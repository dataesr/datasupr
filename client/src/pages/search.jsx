import React, { useState } from "react";
import { Button, Col, Container, Row, TextInput } from "@dataesr/react-dsfr";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [tableaux, setTableaux] = useState([]);
  const [selected, setSelected] = useState({});

  const search = () => {
    console.log('search');
    setResults([
      { label: 'Université Paris-Saclay', active: true, id: 'G2qA7', type: 'structure' },
      { label: 'CEA Paris-Saclay - Etablissement de Saclay', active: true, id: 'hg15O', type: 'structure' },
      { label: 'Campus Paris Saclay', active: true, id: 'APN3L', type: 'structure' },
    ])
  }

  const onItemSelect = (item) => {
    console.log('onItemSelect', item);
    setSelected(item);
    setTableaux([{ label: 'evolution funding signed', id: 'evolution-funding-signed' }, { label: 'tableau de bord financier', id: 'tableau-de-bord-financier' }]);
  }

  return (
    <Container>
      <Row>
        <Col n="12">
          <TextInput label="Rechercher" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button onClick={() => search()}>Rechercher</Button>
        </Col>
      </Row>
      {
        results && results.map((result) => (
          <Row>
            <Col n="12">
              <Button onClick={() => onItemSelect(result)}>{result.label}</Button>
            </Col>
          </Row>
        ))
      }
      {
        tableaux && tableaux.map((tableau) => (
          <Row>
            <Col n="12">
              <Link to={`/tableaux/${tableau.id}?structureID=${selected.id}`}>{tableau.label}</Link>
            </Col>
          </Row>
        ))
      }
    </Container>
  );
}