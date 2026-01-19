import { Row, Col } from "@dataesr/dsfr-plus";
import StructureCard from "../../../../../../components/structure-card";

interface EtablissementOption {
  id: string;
  label: string;
  searchableText: string;
  subtitle?: string;
  data: any;
}

interface EtablissementCardsProps {
  options: EtablissementOption[];
  onSelect: (id: string) => void;
}

export default function EtablissementCards({
  options,
  onSelect,
}: EtablissementCardsProps) {
  return (
    <Row gutters>
      {options.map((option) => {
        const etab = option.data;
        return (
          <Col xs="12" md="6" lg="4" key={option.id}>
            <StructureCard
              title={
                etab.etablissement_actuel_lib ||
                etab.etablissement_lib ||
                etab.nom
              }
              region={etab.etablissement_actuel_region || etab.region}
              category={etab.etablissement_actuel_categorie}
              studentCount={etab.effectif_sans_cpge}
              onClick={() => onSelect(option.id)}
            />
          </Col>
        );
      })}
    </Row>
  );
}
