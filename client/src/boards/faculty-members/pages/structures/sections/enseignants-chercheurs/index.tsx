import { useMemo } from "react";
import { Col, Row, Title } from "@dataesr/dsfr-plus";
import { ViewType, useFacultyResearchTeachers } from "../../api";
import { getCssColor } from "../../../../../../utils/colors";
import MetricCard from "../../components/metric-card";
import CategoryDistributionChart from "./charts/category-distribution";
import CategoryEvolutionChart from "./charts/category-evolution";
import GenderEvolutionChart from "./charts/gender-evolution";
import AgeDistributionChart from "./charts/age-distribution";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

interface EnseignantsChercheursSectionProps {
    viewType: ViewType;
    selectedId: string;
    selectedYear: string;
}

export default function EnseignantsChercheurSection({
    viewType,
    selectedId,
    selectedYear,
}: EnseignantsChercheursSectionProps) {
    const { data: currentData, isLoading } = useFacultyResearchTeachers(
        viewType,
        selectedId,
        selectedYear
    );

    const metrics = useMemo(() => {
        if (!currentData) return null;
        const catDist = currentData.categoryDistribution || [];
        const total = catDist.reduce((s: number, c: any) => s + (c.totalCount || 0), 0);
        const femaleTotal = catDist.reduce((s: number, c: any) => s + (c.femaleCount || 0), 0);
        const femalePct = total > 0 ? (femaleTotal / total) * 100 : 0;

        const prCount = catDist.find((c: any) => /professeur/i.test(c.categoryName || ""))?.totalCount || 0;
        const mcfCount = catDist.find((c: any) => /maître/i.test(c.categoryName || ""))?.totalCount || 0;
        const prMcfRatio = mcfCount > 0 ? (prCount / mcfCount) : 0;

        return { total, femaleTotal, femalePct, prCount, mcfCount, prMcfRatio };
    }, [currentData]);

    const sparklines = useMemo(() => {
        const genderEvo: any[] = currentData?.genderEvolution || [];
        if (!genderEvo.length) return { total: [], femalePct: [] };

        const total = genderEvo.map((e: any) => ({
            year: String(e._id),
            value: e.total || 0,
        }));

        const femalePct = genderEvo.map((e: any) => {
            const f = e.gender_breakdown?.find((g: any) => g.gender === "Féminin")?.count || 0;
            return { year: String(e._id), value: e.total > 0 ? (f / e.total) * 100 : 0 };
        });

        return { total, femalePct };
    }, [currentData]);

    if (isLoading) return <DefaultSkeleton />;
    if (!currentData) return null;

    return (
        <>
            <div className="section-header fr-mb-5w">
                <Title
                    as="h2"
                    look="h5"
                    id="section-ec-title"
                    className="section-header__title"
                >
                    Les enseignants-chercheurs en détail
                </Title>
            </div>

            {metrics && (
                <Row gutters className="fr-mb-3w">
                    <Col xs="12" md="4">
                        <MetricCard
                            title="Enseignants-chercheurs"
                            value={metrics.total.toLocaleString("fr-FR")}
                            detail={`${metrics.prCount.toLocaleString("fr-FR")} PR · ${metrics.mcfCount.toLocaleString("fr-FR")} MCF`}
                            color={getCssColor("fm-statut-ec")}
                            evolutionData={sparklines.total}
                        />
                    </Col>
                    <Col xs="12" md="4">
                        <MetricCard
                            title="Taux de féminisation EC"
                            value={`${metrics.femalePct.toFixed(1)} %`}
                            detail={`${metrics.femaleTotal.toLocaleString("fr-FR")} femmes sur ${metrics.total.toLocaleString("fr-FR")}`}
                            color={getCssColor("fm-femmes")}
                            evolutionData={sparklines.femalePct}
                            unit="%"
                        />
                    </Col>
                    <Col xs="12" md="4">
                        <MetricCard
                            title="Ratio PR / MCF"
                            value={metrics.prMcfRatio.toFixed(2)}
                            detail={`1 PR pour ${metrics.prMcfRatio > 0 ? (1 / metrics.prMcfRatio).toFixed(1) : "—"} MCF`}
                            color={getCssColor("fm-cat-pr")}
                        />
                    </Col>
                </Row>
            )}

            <Row gutters>
                <Col xs="12" md="6">
                    <CategoryDistributionChart
                        categoryDistribution={currentData?.categoryDistribution}
                        selectedYear={selectedYear}
                    />
                </Col>
                <Col xs="12" md="6">
                    <AgeDistributionChart
                        ageDistribution={currentData?.ageDistribution}
                        selectedYear={selectedYear}
                    />
                </Col>
                <Col xs="12" md="6">
                    <CategoryEvolutionChart
                        categoryEvolution={currentData?.categoryEvolution}
                    />
                </Col>
                <Col xs="12" md="6">
                    <GenderEvolutionChart
                        genderEvolution={currentData?.genderEvolution}
                    />
                </Col>
            </Row>
        </>
    );
}
