import "./styles.scss";


interface TimelinePeriod {
  id: string;
  period: string;
  years: string;
  program: string;
  description: string;
}

interface TimelineProps {
  currentLang: string;
}

export default function Timeline({ currentLang }: TimelineProps) {
  const timelinePeriods: TimelinePeriod[] = [
    {
      id: "fp6",
      period: "2002-2006",
      years: "5 ans",
      program: "FP6",
      description:
        currentLang === "fr"
          ? "6 Programme-cadre de recherche et développement technologique"
          : "6th Framework Programme for Research and Technological Development",
    },
    {
      id: "fp7",
      period: "2007-2013",
      years: "7 ans",
      program: "FP7",
      description:
        currentLang === "fr"
          ? "7e Programme-cadre de recherche et développement technologique"
          : "7th Framework Programme for Research and Technological Development",
    },
    {
      id: "h2020",
      period: "2014-2020",
      years: "7 ans",
      program: "Horizon 2020",
      description:
        currentLang === "fr"
          ? "Programme de recherche et d'innovation de l'Union européenne"
          : "Research and Innovation programme of the European Union",
    },
    {
      id: "he",
      period: "2021-2027",
      years: "7 ans",
      program: "Horizon Europe",
      description:
        currentLang === "fr"
          ? "En cours : Programme de recherche et d'innovation de l'UE pour 2021-2027"
          : "In progress : EU's research and innovation programme for 2021-2027",
    },
  ];

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h3 className="timeline-title">
          {currentLang === "fr" ? "Évolution des programmes européens de recherche" : "Evolution of European research programmes"}
        </h3>
        <p className="timeline-subtitle">
          {currentLang === "fr" ? "De 2002 à aujourd'hui : quatre générations de programmes" : "From 2002 to today: four generations of programmes"}
        </p>
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
