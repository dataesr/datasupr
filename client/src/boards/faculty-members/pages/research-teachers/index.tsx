import { Container } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useContextDetection } from "../../utils";
import CnuGroupsTable from "./table/cnu-group-table";
import CnuSectionsTable from "./table/cnu-section-table";
import ResearchTeachersOverviewTable from "./table/overview";
import YearSelector from "../../components/filters";
import SubtitleWithContext from "./utils/get-title";

export function ResearchTeachers() {
  const [searchParams] = useSearchParams();
  const selectedYear = searchParams.get("annee_universitaire") || "";
  const { context, contextId } = useContextDetection();

  return (
    <Container as="main">
      <div className="fr-grid-row fr-grid-row--gutters ">
        <div className="fr-col-md-9">
          <SubtitleWithContext classText="fr-text--lg fr-text--bold fr-mb-0" />
        </div>
        <div className="fr-col-md-3" style={{ textAlign: "right" }}>
          <YearSelector />
        </div>
      </div>

      {!contextId && (
        <div>
          <h2 className="fr-h4 ">
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
      )}

      {contextId && (
        <>
          <div className="text-center">
            <h5 className="fr-h5 fr-mb-1w">Répartition par groupes CNU</h5>
            <CnuGroupsTable
              context={context}
              contextId={contextId}
              annee_universitaire={selectedYear}
              showAgeDemographics={true}
            />
          </div>
          <div className="text-center">
            <h5 className="fr-h5 fr-mb-1w">Répartition par sections CNU</h5>
            <CnuSectionsTable
              context={context}
              contextId={contextId}
              annee_universitaire={selectedYear}
              showDiscipline={false}
              showGroup={true}
              showAgeDemographics={true}
            />
          </div>
        </>
      )}
    </Container>
  );
}

export default ResearchTeachers;
