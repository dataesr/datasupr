import { Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../utils";
import CnuGroupsTable from "./table/cnu-group-table";
import CnuSectionsTable from "./table/cnu-section-table";
import ResearchTeachersOverviewTable from "./table/overview";
import YearSelector from "../../components/filters";

export function ResearchTeachers() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";

  const field_id = searchParams.get("field_id");
  const geo_id = searchParams.get("geo_id");
  const structure_id = searchParams.get("structure_id");

  const { context, contextId, contextName } = useContextDetection();

  const getBreadcrumbData = () => {
    switch (context) {
      case "fields":
        return {
          overviewUrl: "/personnel-enseignant/discipline/vue-d'ensemble/",
          currentContext:
            field_id && contextName
              ? `Les enseignants chercheurs en ${contextName}`
              : null,
        };
      case "geo":
        return {
          overviewUrl: "/personnel-enseignant/geo/vue-d'ensemble/",
          currentContext:
            geo_id && contextName
              ? `Les enseignants chercheurs en ${contextName}`
              : null,
        };
      case "structures":
        return {
          overviewUrl: "/personnel-enseignant/universite/vue-d'ensemble/",
          currentContext:
            structure_id && contextName
              ? `Les enseignants chercheurs de ${contextName}`
              : null,
        };
      default:
        return {
          overviewUrl: "/personnel-enseignant/",
          currentContext: null,
        };
    }
  };

  const { currentContext } = getBreadcrumbData();

  const getContextTitle = () => {
    switch (context) {
      case "fields":
        return contextId
          ? "Répartition par groupes CNU"
          : "Répartition par disciplines";
      case "geo":
        return contextId
          ? "Répartition par groupes CNU"
          : "Répartition par régions";
      case "structures":
        return contextId
          ? "Répartition par groupes CNU"
          : "Répartition par établissements";
      default:
        return "Répartition des enseignants-chercheurs";
    }
  };

  return (
    <Container as="main">
      <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
        <div className="fr-col-md-9">
          <div className="fr-mb-2w">
            <h1 className="fr-h2 fr-mb-1w">{getContextTitle()}</h1>
            {currentContext && (
              <p className="fr-text--lg fr-text--bold fr-mb-0">
                {currentContext}
              </p>
            )}
          </div>
        </div>
        <div className="fr-col-md-3" style={{ textAlign: "right" }}>
          <YearSelector />
        </div>
      </div>

      {!contextId && (
        <div className="fr-card fr-card--shadow fr-mb-4w">
          <div className="fr-card__body">
            <div className="fr-card__content">
              <h2 className="fr-card__title fr-h4 fr-mb-3w">
                <span
                  className="fr-icon-chart-line-fill fr-icon--sm fr-mr-1w"
                  aria-hidden="true"
                ></span>
                Vue d'ensemble
              </h2>
              <ResearchTeachersOverviewTable
                context={context}
                annee_universitaire={selectedYear}
                contextId={contextId}
              />
            </div>
          </div>
        </div>
      )}

      {contextId && (
        <>
          <div className="fr-card fr-card--shadow fr-mb-4w">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <CnuGroupsTable
                  context={context}
                  contextId={contextId}
                  annee_universitaire={selectedYear}
                  showAgeDemographics={true}
                />
              </div>
            </div>
          </div>

          <div className="fr-card fr-card--shadow">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <CnuSectionsTable
                  context={context}
                  contextId={contextId}
                  annee_universitaire={selectedYear}
                  showDiscipline={false}
                  showGroup={true}
                  showAgeDemographics={true}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

export default ResearchTeachers;
