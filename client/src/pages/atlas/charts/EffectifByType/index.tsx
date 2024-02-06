import {
  Container, Row, Col,
  Text,
} from '../../../../../../musical-octo-waddle/dist/index.js';
import ColumnsChart from '../columns';
import './style.css';

import type { DataByYear } from '../../../../types/atlas';
import StudentsCard from '../../../../components/cards/students-card';

export default function EffectifByType({ currentYear, data = [], label }: { currentYear: string, data?: DataByYear[], label: string }) {
  const currentValue = data?.find((item) => item.annee_universitaire === currentYear)?.[label] || 0;
  return (
    <Container>
      <Row>
        <Col>
          <StudentsCard
            number={currentValue}
            descriptionNode={
              <Text size="sm">
                <div className="selected-year-color-point" />
                année universitaire {currentYear}
              </Text>
            }
          />
        </Col>
        <Col md={6}>
          <ColumnsChart data={data || []} label={label} currentYear={currentYear} />
        </Col>
      </Row>
    </Container>
  );
}