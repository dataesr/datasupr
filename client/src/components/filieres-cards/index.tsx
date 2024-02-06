import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, TagGroup, Tag, Badge } from '@dataesr/dsfr-plus';

import StudentsCard from "../cards/students-card/index.tsx";

type DataProps = {
  effectif_PR: number,
  effectif_PU: number,
  label: string,
  id: string
}

export default function FilieresCards({ data, isLoading }: { data: DataProps[], isLoading: boolean }) {
  const [searchParams] = useSearchParams();
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  const currentYear = searchParams.get('annee_universitaire') || '2022-23';
  if (isLoading || !data || !data.length) {
    return (
      <div>Loader</div>
    );
  }

  return (
    <Container fluid className="fr-my-1w">
      <Row gutters>
        {
          data.map((filiere) => {
            if ((filiere.effectif_PR || 0) + (filiere.effectif_PU || 0) !== 0) {
              return (
                <Col md={6}>
                  <StudentsCard
                    descriptionNode={<>{filiere.label}</>}
                    number={(filiere.effectif_PR || 0) + (filiere.effectif_PU || 0)}
                    tagsNode={
                      <TagGroup>
                        {filiere.effectif_PU > 0 && <Tag color="blue-cumulus">Secteur public</Tag>}
                        {filiere.effectif_PR > 0 && <Tag color="yellow-moutarde">Secteur privé</Tag>}
                      </TagGroup>
                    }
                    to={`/atlas/effectifs-par-filiere/${filiere.id}?${params}`}
                    year={currentYear}
                  />
                </Col>
              )
            }
            return null;
          })
        }
      </Row>
    </Container>
  )
}