import { Container } from "@dataesr/dsfr-plus";
import { useParams } from "react-router-dom";

export function FieldsEvolution() {
  const { id } = useParams<{ id?: string }>();

  return (
    <Container as="main">
      <h3 className="fr-mt-5w">Evolution</h3>
      {id ? (
        <>
          <p>Evolution pour la discipline avec l'ID: {id}</p>
        </>
      ) : (
        <p>Evolution pour toutes les disciplines</p>
      )}
    </Container>
  );
}
