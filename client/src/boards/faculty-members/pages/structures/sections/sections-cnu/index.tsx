import { useMemo } from "react";
import { Col, Row, Title } from "@dataesr/dsfr-plus";
import { ViewType, useFacultyResearchTeachers } from "../../api";
import TreemapSectionsChart from "./charts/treemap-sections";
import CnuSectionsTable from "./components/cnu-section-table";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

interface SectionsCnuSectionProps {
    viewType: ViewType;
    selectedId: string;
    selectedYear: string;
}

export default function SectionsCnuSection({
    viewType,
    selectedId,
    selectedYear,
}: SectionsCnuSectionProps) {
    const { data: currentData, isLoading } = useFacultyResearchTeachers(
        viewType,
        selectedId,
        selectedYear
    );

    const previousYear = useMemo(() => {
        if (!selectedYear) return undefined;
        const parts = selectedYear.split("-");
        if (parts.length === 2) {
            return `${parseInt(parts[0]) - 1}-${parseInt(parts[1]) - 1}`;
        }
        return undefined;
    }, [selectedYear]);

    const { data: previousData } = useFacultyResearchTeachers(
        viewType,
        selectedId,
        previousYear
    );

    if (isLoading) return <DefaultSkeleton />;
    if (!currentData?.cnuGroups?.length) return null;

    return (
        <>
            <div className="section-header fr-mb-5w">
                <Title
                    as="h2"
                    look="h5"
                    id="section-sections-cnu-title"
                    className="section-header__title"
                >
                    Sections CNU
                </Title>
            </div>

            <Row gutters>
                <Col>
                    <TreemapSectionsChart
                        cnuGroups={currentData.cnuGroups}
                        selectedYear={selectedYear}
                    />
                </Col>
            </Row>
            <Title as="h3" look="h5" className="fr-mt-4w">
                Sections CNU — détail
            </Title>
            <CnuSectionsTable
                cnuGroups={currentData.cnuGroups}
                previousCnuGroups={previousData?.cnuGroups}
            />
        </>
    );
}
