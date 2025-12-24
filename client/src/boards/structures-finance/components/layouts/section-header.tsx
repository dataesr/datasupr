import { ReactNode } from "react";
import { Col, Row, Title } from "@dataesr/dsfr-plus";

interface SectionHeaderProps {
  title: string;
  rightSlot?: ReactNode;
}

export default function SectionHeader({
  title,
  rightSlot,
}: SectionHeaderProps) {
  return (
    <Row className="fr-align-items-center fr-mb-2w">
      <Col md="6">
        <Title as="h2" look="h4" className="fr-mb-0">
          {title}
        </Title>
      </Col>
      <Col md="6" className="fr-text--right">
        {rightSlot}
      </Col>
    </Row>
  );
}
