import { useMemo } from "react";
import { Col, Row, Title } from "@dataesr/dsfr-plus";
import { ViewType, useFacultyResearchTeachers } from "../../api";
import { getCssColor } from "../../../../../../utils/colors";
import MetricCard from "../../components/metric-card";
import CnuTreemapChart from "./charts/cnu-treemap";
import CnuBubbleChart from "./charts/cnu-bubble";
import CnuGroupsTable from "./components/cnu-group-table";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

interface GroupesCnuSectionProps {
    viewType: ViewType;
    selectedId: string;
    selectedYear: string;
}

const SCALE_COLORS = Array.from({ length: 14 }, (_, i) => `scale-${i + 1}`);

export default function GroupesCnuSection({
    viewType,
    selectedId,
    selectedYear,
}: GroupesCnuSectionProps) {
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

    const groupCards = useMemo(() => {
        const groups = currentData?.cnuGroups || [];
        const groupEvo: any[] = currentData?.cnuGroupEvolution || [];
        const totalEC = groups.reduce((s: number, g: any) => s + (g.totalCount || 0), 0);

        return [...groups]
            .sort((a: any, b: any) => (b.totalCount || 0) - (a.totalCount || 0))
            .map((g: any, i: number) => {
                const total = g.totalCount || 0;
                const pct = totalEC > 0 ? (total / totalEC) * 100 : 0;
                const femalePct = total > 0 ? ((g.femaleCount || 0) / total) * 100 : 0;
                const nbSections = g.cnuSections?.length || 0;
                const color = getCssColor(SCALE_COLORS[i % SCALE_COLORS.length]);

                const evo = groupEvo.find((e: any) => e._id?.group_code === g.cnuGroupId);
                const sparkline = evo?.yearly
                    ?.sort((a: any, b: any) => String(a.year).localeCompare(String(b.year)))
                    .map((y: any) => ({ year: String(y.year), value: y.count || 0 })) || [];

                return {
                    id: g.cnuGroupId,
                    label: g.cnuGroupLabel || `Groupe ${g.cnuGroupId}`,
                    total,
                    pct,
                    femalePct,
                    nbSections,
                    color,
                    sparkline,
                };
            });
    }, [currentData]);

    if (isLoading) return <DefaultSkeleton />;
    if (!currentData?.cnuGroups?.length) return null;

    return (
        <>
            <div className="section-header fr-mb-5w">
                <Title
                    as="h2"
                    look="h5"
                    id="section-groupes-cnu-title"
                    className="section-header__title"
                >
                    Groupes CNU — vue d'ensemble
                </Title>
            </div>

            <Row gutters className="fr-mb-3w">
                {groupCards.map((g) => (
                    <Col xs="12" md="4" lg="3" key={g.id}>
                        <MetricCard
                            title={g.label}
                            value={g.total.toLocaleString("fr-FR")}
                            detail={`${g.pct.toFixed(1)} % · ${g.femalePct.toFixed(0)} % femmes · ${g.nbSections} sections`}
                            color={g.color}
                            evolutionData={g.sparkline}
                        />
                    </Col>
                ))}
            </Row>

            <Row gutters>
                <Col xs="12" md="6">
                    <CnuTreemapChart
                        selectedYear={selectedYear}
                        cnuGroups={currentData.cnuGroups}
                    />
                </Col>
                <Col xs="12" md="6">
                    <CnuBubbleChart
                        selectedYear={selectedYear}
                        cnuGroups={currentData.cnuGroups}
                    />
                </Col>
            </Row>
            <Title as="h3" look="h5" className="fr-mt-4w">
                Groupes CNU — détail
            </Title>
            <CnuGroupsTable
                cnuGroups={currentData.cnuGroups}
                previousCnuGroups={previousData?.cnuGroups}
                showAgeDemographics
            />
        </>
    );
}
