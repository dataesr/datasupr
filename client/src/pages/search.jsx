import React, { useState } from "react";
import { Button, Col, Container, Row, TextInput } from "@dataesr/react-dsfr";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = () => {
    console.log('search');
    setResults([{ label: 'evolution funding signed', id: 'evolution-funding-signed' }, { label: 'tableau de bord financier', id: 'tableau-de-bord-financier' }]);
  }
  return (
    <Container>
      <Row>
        <Col n="12">
          <TextInput label="Rechercher" onChange={(e) => setQuery(e.target.value)} />
          <Button onClick={() => search()}>Rechercher</Button>
        </Col>
      </Row>
      {
        results && results.map((result) => (
          <Row>
            <Col n="12">
              <Link to={`/tableaux/${result.id}`}>{result.label}</Link>
            </Col>
          </Row>
        ))
      }
    </Container>
  );
}