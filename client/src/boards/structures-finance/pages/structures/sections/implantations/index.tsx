import { Row, Col, Title } from "@dataesr/dsfr-plus";
import CardSimple from "../../../../../../components/card-simple";
import "../styles.scss";

interface ImplantationsSectionProps {
  data: any;
}

export function ImplantationsSection({ data }: ImplantationsSectionProps) {
  if (
    !data?.implantations ||
    !Array.isArray(data.implantations) ||
    data.implantations.length === 0
  ) {
    return null;
  }

  return (
    <div id="section-implantations" className="section-container">
      <div className="section-header fr-mb-4w">
        <Title as="h3" look="h5" className="section-header__title">
          Implantations géographiques
        </Title>
      </div>

      <Row gutters>
        {data.implantations.map((implantation: any, index: number) => (
          <Col
            key={implantation.implantation_id || index}
            xs="12"
            md="6"
            lg="4"
          >
            <CardSimple
              description={implantation.siege ? "Site principal" : ""}
              stat={implantation.effectif_sans_cpge}
              title={`${implantation.implantation}`}
              year={data.anuniv}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
