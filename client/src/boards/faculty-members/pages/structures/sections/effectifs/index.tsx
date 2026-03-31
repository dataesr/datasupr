import { useMemo } from "react";
import { Col, Row, Title } from "@dataesr/dsfr-plus";
import { ViewType } from "../../api";
import { getCssColor } from "../../../../../../utils/colors";
import MetricCard from "../../components/metric-card";
import GenderChart from "./charts/genre";
import StatusChart from "./charts/statut";
import CategoryChart from "./charts/categorie";
import EstablishmentTypeChart from "./charts/type-etablissement";

interface EffectifsSectionProps {
    selectedYear: string;
    dashboardData: any;
    evolutionData: any;
    totalCount: number;
    viewType: ViewType;
}

export default function EffectifsSection({
    selectedYear,
    dashboardData,
    evolutionData,
    totalCount,
    viewType,
}: EffectifsSectionProps) {
    const genderDistribution = dashboardData?.gender_distribution || [];
    const statusDistribution = dashboardData?.status_distribution || [];

    const metrics = useMemo(() => {
        const femaleCount = genderDistribution.find((g: any) => g._id === "Féminin")?.count || 0;
        const maleCount = genderDistribution.find((g: any) => g._id === "Masculin")?.count || 0;
        const femalePct = totalCount > 0 ? (femaleCount / totalCount) * 100 : 0;

        const ecCount = statusDistribution.find((s: any) => s._id === "enseignant_chercheur")?.count || 0;
        const permanentCount = ecCount + (statusDistribution.find((s: any) => s._id === "titulaire_non_chercheur")?.count || 0);
        const ecPct = totalCount > 0 ? (ecCount / totalCount) * 100 : 0;
        const permanentPct = totalCount > 0 ? (permanentCount / totalCount) * 100 : 0;

        return { femaleCount, maleCount, femalePct, ecCount, ecPct, permanentCount, permanentPct };
    }, [genderDistribution, statusDistribution, totalCount]);

    const sparklines = useMemo(() => {
        const globalEvo: any[] = evolutionData?.global_evolution || [];
        if (!globalEvo.length) return { total: [], femalePct: [], ecPct: [] };

        const statusEvo: any[] = evolutionData?.status_evolution || [];

        const total = globalEvo.map((e: any) => ({
            year: String(e._id),
            value: e.total || 0,
        }));

        const femalePct = globalEvo.map((e: any) => {
            const f = e.gender_breakdown?.find((g: any) => g.gender === "Féminin")?.count || 0;
            return { year: String(e._id), value: e.total > 0 ? (f / e.total) * 100 : 0 };
        });

        const ecPct = statusEvo.map((e: any) => {
            const ec = e.status_breakdown?.find((s: any) => s.status === "enseignant_chercheur")?.count || 0;
            return { year: String(e._id), value: e.total > 0 ? (ec / e.total) * 100 : 0 };
        });

        return { total, femalePct, ecPct };
    }, [evolutionData]);

    return (
        <>
            <div className="section-header fr-mb-5w">
                <Title
                    as="h2"
                    look="h5"
                    id="section-moyens-humains-title"
                    className="section-header__title"
                >
                    Vue d'ensemble des effectifs
                </Title>
            </div>

            <Row gutters className="fr-mb-3w">
                <Col xs="12" md="4">
                    <MetricCard
                        title="Effectif total"
                        value={totalCount.toLocaleString("fr-FR")}
                        detail={`${metrics.permanentCount.toLocaleString("fr-FR")} permanents (${metrics.permanentPct.toFixed(0)}%)`}
                        color={getCssColor("blue-france-main-525")}
                        evolutionData={sparklines.total}
                    />
                </Col>
                <Col xs="12" md="4">
                    <MetricCard
                        title="Taux de féminisation"
                        value={`${metrics.femalePct.toFixed(1)} %`}
                        detail={`${metrics.femaleCount.toLocaleString("fr-FR")} femmes · ${metrics.maleCount.toLocaleString("fr-FR")} hommes`}
                        color={getCssColor("fm-femmes")}
                        evolutionData={sparklines.femalePct}
                        unit="%"
                    />
                </Col>
                <Col xs="12" md="4">
                    <MetricCard
                        title="Part d'enseignants-chercheurs"
                        value={`${metrics.ecPct.toFixed(1)} %`}
                        detail={`${metrics.ecCount.toLocaleString("fr-FR")} EC sur ${totalCount.toLocaleString("fr-FR")}`}
                        color={getCssColor("fm-statut-ec")}
                        evolutionData={sparklines.ecPct}
                        unit="%"
                    />
                </Col>
            </Row>

            <Row gutters>
                <Col xs="12" md="6">
                    <GenderChart
                        selectedYear={selectedYear}
                        genderDistribution={genderDistribution}
                        totalCount={totalCount}
                    />
                </Col>
                <Col xs="12" md="6">
                    <StatusChart
                        selectedYear={selectedYear}
                        statusDistribution={statusDistribution}
                    />
                </Col>
                <Col xs="12" md="6">
                    <CategoryChart
                        selectedYear={selectedYear}
                        categoryDistribution={dashboardData?.category_distribution || []}
                    />
                </Col>
                {viewType !== "structure" && (
                    <Col xs="12" md="6">
                        <EstablishmentTypeChart
                            selectedYear={selectedYear}
                            establishmentTypeDistribution={dashboardData?.establishment_type_distribution || []}
                        />
                    </Col>
                )}
            </Row>
        </>
    );
}
