import { Row, Col } from "@dataesr/dsfr-plus";
import StructureCard from "../../../../../../components/structure-card";
import "../styles.scss";

interface ImplantationsSectionProps {
  data: any;
}

export function ImplantationsSection({ data }: ImplantationsSectionProps) {
  if (!data?.implantations || data.implantations.length === 0) {
    return null;
  }

  return (
    <div
      id="section-implantations"
      role="region"
      aria-labelledby="section-implantations"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <h3 className="fr-h5 section-header__title">
          Implantations géographiques
        </h3>
      </div>

      <Row gutters>
        {data.implantations.map((implantation: any, index: number) => (
          <Col
            key={implantation.implantation_id || index}
            xs="12"
            md="6"
            lg="4"
          >
            <StructureCard
              title={`${implantation.implantation}${implantation.siege ? " (Siège)" : ""}`}
              region={implantation.siege ? "Site principal" : ""}
              studentCount={implantation.effectif_sans_cpge}
              year={data.anuniv}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
