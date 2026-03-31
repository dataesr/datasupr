import { useMemo } from "react";
import { Col, Row, Title } from "@dataesr/dsfr-plus";
import { getCssColor } from "../../../../../../utils/colors";
import MetricCard from "../../components/metric-card";
import GenderEvolutionChart from "./charts/gender-evolution";
import StatusEvolutionChart from "./charts/status-evolution";
import AgeEvolutionChart from "./charts/age-evolution";
import CategoryEvolutionChart from "./charts/category-evolution";

interface EvolutionsSectionProps {
    evolutionData: any;
}

export default function EvolutionsSection({
    evolutionData,
}: EvolutionsSectionProps) {
    const metrics = useMemo(() => {
        const globalEvo: any[] = evolutionData?.global_evolution || [];
        const statusEvo: any[] = evolutionData?.status_evolution || [];
        if (!globalEvo.length) return null;

        const first = globalEvo[0];
        const last = globalEvo[globalEvo.length - 1];
        const diff = (last?.total || 0) - (first?.total || 0);
        const diffPct = first?.total > 0 ? (diff / first.total) * 100 : 0;

        const firstFemale = first?.gender_breakdown?.find((g: any) => g.gender === "Féminin")?.count || 0;
        const lastFemale = last?.gender_breakdown?.find((g: any) => g.gender === "Féminin")?.count || 0;
        const firstFemalePct = first?.total > 0 ? (firstFemale / first.total) * 100 : 0;
        const lastFemalePct = last?.total > 0 ? (lastFemale / last.total) * 100 : 0;
        const femalePctDiff = lastFemalePct - firstFemalePct;

        const firstStatus = statusEvo[0];
        const lastStatus = statusEvo[statusEvo.length - 1];
        const firstEC = firstStatus?.status_breakdown?.find((s: any) => s.status === "enseignant_chercheur")?.count || 0;
        const lastEC = lastStatus?.status_breakdown?.find((s: any) => s.status === "enseignant_chercheur")?.count || 0;
        const ecDiff = lastEC - firstEC;
        const ecDiffPct = firstEC > 0 ? (ecDiff / firstEC) * 100 : 0;

        const totalSparkline = globalEvo.map((e: any) => ({ year: String(e._id), value: e.total || 0 }));
        const femalePctSparkline = globalEvo.map((e: any) => {
            const f = e.gender_breakdown?.find((g: any) => g.gender === "Féminin")?.count || 0;
            return { year: String(e._id), value: e.total > 0 ? (f / e.total) * 100 : 0 };
        });
        const ecSparkline = statusEvo.map((e: any) => {
            const ec = e.status_breakdown?.find((s: any) => s.status === "enseignant_chercheur")?.count || 0;
            return { year: String(e._id), value: ec };
        });

        return {
            from: first._id, to: last._id,
            diff, diffPct, lastTotal: last.total || 0,
            femalePctDiff, lastFemalePct,
            ecDiff, ecDiffPct, lastEC,
            totalSparkline, femalePctSparkline, ecSparkline,
        };
    }, [evolutionData]);

    return (
        <>
            <div className="section-header fr-mb-5w">
                <Title
                    as="h2"
                    look="h5"
                    id="section-evolutions-title"
                    className="section-header__title"
                >
                    Évolutions temporelles
                </Title>
            </div>

            {metrics && (
                <Row gutters className="fr-mb-3w">
                    <Col xs="12" md="4">
                        <MetricCard
                            title="Évolution des effectifs"
                            value={`${metrics.diff >= 0 ? "+" : ""}${metrics.diffPct.toFixed(1)} %`}
                            detail={`${metrics.diff >= 0 ? "+" : ""}${metrics.diff.toLocaleString("fr-FR")} de ${metrics.from} à ${metrics.to}`}
                            color={getCssColor("blue-france-main-525")}
                            evolutionData={metrics.totalSparkline}
                        />
                    </Col>
                    <Col xs="12" md="4">
                        <MetricCard
                            title="Progression féminisation"
                            value={`${metrics.femalePctDiff >= 0 ? "+" : ""}${metrics.femalePctDiff.toFixed(1)} pts`}
                            detail={`${metrics.lastFemalePct.toFixed(1)} % de femmes en ${metrics.to}`}
                            color={getCssColor("fm-femmes")}
                            evolutionData={metrics.femalePctSparkline}
                            unit="%"
                        />
                    </Col>
                    <Col xs="12" md="4">
                        <MetricCard
                            title="Évolution des EC"
                            value={`${metrics.ecDiff >= 0 ? "+" : ""}${metrics.ecDiffPct.toFixed(1)} %`}
                            detail={`${metrics.lastEC.toLocaleString("fr-FR")} EC en ${metrics.to}`}
                            color={getCssColor("fm-statut-ec")}
                            evolutionData={metrics.ecSparkline}
                        />
                    </Col>
                </Row>
            )}

            <Row gutters>
                <Col xs="12">
                    <GenderEvolutionChart
                        globalEvolution={evolutionData?.global_evolution}
                    />
                </Col>
                <Col xs="12" md="6">
                    <StatusEvolutionChart
                        statusEvolution={evolutionData?.status_evolution}
                    />
                </Col>
                <Col xs="12" md="6">
                    <AgeEvolutionChart
                        ageEvolution={evolutionData?.age_evolution}
                    />
                </Col>
                <Col xs="12">
                    <CategoryEvolutionChart
                        categoryEvolution={evolutionData?.category_evolution}
                    />
                </Col>
            </Row>
        </>
    );
}
