import { Row, Col } from "@dataesr/dsfr-plus";
import "./legend.scss";

export default function Legend() {
  const rootStyles = getComputedStyle(document.documentElement);

  const frameworks = [
    {
      name: "FP6",
      color: rootStyles.getPropertyValue("--framework-fp6-color").trim() || "#28a745",
    },
    {
      name: "FP7",
      color: rootStyles.getPropertyValue("--framework-fp7-color").trim() || "#5cb85c",
    },
    {
      name: "Horizon 2020",
      color: rootStyles.getPropertyValue("--framework-horizon2020-color").trim() || "#dc3545",
    },
    {
      name: "Horizon Europe",
      color: rootStyles.getPropertyValue("--framework-horizoneurope-color").trim() || "#ffc107",
    },
  ];

  return (
    <Row className="funding-legend fr-mb-2w">
      <Col>
        <div className="legend-items">
          {frameworks.map((framework) => (
            <div key={framework.name} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: framework.color }} />
              <span className="legend-label">{framework.name}</span>
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
}
