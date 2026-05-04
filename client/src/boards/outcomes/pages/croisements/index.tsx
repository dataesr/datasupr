import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useState } from "react";

import Callout from "../../../../components/callout.tsx";
import OutcomesDefinitionsTable from "../../components/definitions-table/index.tsx";
import { OUTCOMES_DEFINITIONS } from "../../components/definitions-table/data.tsx";
import { useOutcomesPlusHautDiplome } from "../../api";

import "./styles.scss";
import ProfilesTab from "./profiles";
import HeatmapTab from "./heatmap";

const COHORT_YEAR = "2019-2020";
const COHORT_SITUATION = "L1";

const TABS = [
    { id: "croisements", label: "Croisements", title: "Taux de diplômés selon deux critères croisés" },
    { id: "profils", label: "Comparaison de profils", title: "Comparer les trajectoires de plusieurs profils" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function CroisementsPage() {
    const [activeTab, setActiveTab] = useState<TabId>("croisements");

    const { data: baseData, isLoading: baseLoading } = useOutcomesPlusHautDiplome({
        cohorteAnnee: COHORT_YEAR,
        cohorteSituation: COHORT_SITUATION,
        filters: {},
    });

    return (
        <Container className="outcomes-section-page outcomes-croisements">
            <Row gutters>
                <Col>
                    <Callout className="fr-mb-2w" colorFamily="pink-tuile" icon="fr-icon-alert-line">
                        Version sous embargo à ne pas diffuser
                    </Callout>
                </Col>
            </Row>

            <Row gutters>
                <Col>
                    <Title as="h1" look="h4" className="fr-mb-1w">
                        {TABS.find((t) => t.id === activeTab)?.title}
                    </Title>
                </Col>
            </Row>

            <div className="fr-tabs">
                <ul className="fr-tabs__list" role="tablist" aria-label="Onglets de croisements">
                    {TABS.map((tab) => (
                        <li role="presentation" key={tab.id}>
                            <button
                                id={`tab-${tab.id}`}
                                type="button"
                                className="fr-tabs__tab"
                                tabIndex={activeTab === tab.id ? 0 : -1}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls={`panel-${tab.id}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
                {TABS.map((tab) => (
                    <div
                        key={tab.id}
                        id={`panel-${tab.id}`}
                        className={`fr-tabs__panel${activeTab === tab.id ? " fr-tabs__panel--selected" : ""}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${tab.id}`}
                        tabIndex={0}
                    >
                        {tab.id === "croisements" && activeTab === "croisements" && <HeatmapTab />}
                        {tab.id === "profils" && activeTab === "profils" && (
                            <ProfilesTab
                                axisOptions={baseData?.filterOptions ?? null}
                                isLoadingOptions={baseLoading}
                            />
                        )}
                    </div>
                ))}
            </div>
            <OutcomesDefinitionsTable definitions={OUTCOMES_DEFINITIONS} />
        </Container>
    );
}
