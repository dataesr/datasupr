import { useSearchParams } from "react-router-dom";
import { getI18nLabel } from "../../../../../utils";
import i18n from "../../../../i18n-global.json";
import "./styles.scss";

interface TimelinePeriod {
  id: string;
  period: string;
  years: string;
  program: string;
  description: string;
}

export default function Timeline() {
  const [searchParams] = useSearchParams();

  const timelinePeriods: TimelinePeriod[] = [
    {
      id: "fp6",
      period: "2002-2006",
      years: "5 ans",
      program: "FP6",
      description: getI18nLabel(i18n, "fp6-description"),
    },
    {
      id: "fp7",
      period: "2007-2013",
      years: "7 ans",
      program: "FP7",
      description: getI18nLabel(i18n, "fp7-description"),
    },
    {
      id: "h2020",
      period: "2014-2020",
      years: "7 ans",
      program: "Horizon 2020",
      description: getI18nLabel(i18n, "h2020-description"),
    },
    {
      id: "he",
      period: "2021-2027",
      years: "7 ans",
      program: "Horizon Europe",
      description: getI18nLabel(i18n, "he-description"),
    },
  ];

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h3 className="timeline-title">{getI18nLabel(i18n, "timeline-title")}</h3>
        <p className="timeline-subtitle">{getI18nLabel(i18n, "timeline-subtitle")}</p>
      </div>

      <div className="timeline">
        <div className="timeline-line"></div>

        {timelinePeriods.map((period) => (
          <div key={period.id} className={`timeline-item timeline-item--${period.id}`}>
            <div className="timeline-chevron">
              <div className="chevron-inner"></div>
            </div>

            <div className="timeline-content">
              <div className="timeline-badge">
                <span className="timeline-years">{period.period}</span>
                <span className="timeline-duration">{period.years}</span>
              </div>

              <div className="timeline-info">
                <h4 className="timeline-program">{period.program}</h4>
                <p className="timeline-description">{period.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
