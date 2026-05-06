import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { type OutcomesFilterField, useOutcomesPlusHautDiplome } from "../../../../api";
import { createBreakdownBarOptions } from "./options";

const FILTER_FIELDS: OutcomesFilterField[] = [
    "groupe_disciplinaire", "sexe", "origine_sociale",
    "bac_type", "bac_mention", "retard_scolaire",
    "devenir_en_un_an", "type_de_trajectoire",
];

const BREAKDOWN_TITLES: Partial<Record<OutcomesFilterField, string>> = {
    groupe_disciplinaire: "Par groupe disciplinaire",
    sexe: "Par sexe",
    origine_sociale: "Par origine sociale",
    bac_type: "Par type de bac",
    retard_scolaire: "Par retard scolaire",
};

interface BreakdownBarProps {
    field?: OutcomesFilterField;
}

export default function BreakdownBar({ field: fieldProp }: BreakdownBarProps = {}) {
    const [searchParams] = useSearchParams();
    const field = (fieldProp || (searchParams.get("field") as OutcomesFilterField) || "groupe_disciplinaire");

    const filters = FILTER_FIELDS.reduce<Partial<Record<OutcomesFilterField, string | null>>>(
        (acc, f) => { acc[f] = searchParams.get(f); return acc; }, {},
    );
    const { data, isLoading } = useOutcomesPlusHautDiplome({
        cohorteAnnee: searchParams.get("cohorte_annee") || "2019-2020",
        cohorteSituation: searchParams.get("cohorte_situation") || "L1",
        filters,
    });

    const title = BREAKDOWN_TITLES[field] || field;

    const filteredOptions = useMemo(() => {
        const opts = data?.filterOptions?.[field] || [];
        const activeKey = filters[field];
        return activeKey ? opts.filter((o) => o.key === activeKey) : opts;
    }, [data, field, filters]);

    const chartOptions = useMemo(() => {
        if (!filteredOptions.some((o) => (o.dipl ?? 0) + (o.ndipl ?? 0) > 0)) return null;
        return createBreakdownBarOptions(filteredOptions, title);
    }, [filteredOptions, title]);

    if (isLoading) return <DefaultSkeleton height="280px" />;
    if (!chartOptions) return null;

    const integrationParams = new URLSearchParams(searchParams);
    integrationParams.set("field", field);

    return (
        <div className="fr-mb-3w">
            <ChartWrapper
                config={{
                    id: `outcomes-phd-breakdown-${field}`,
                    integrationURL: `/integration?chart_id=outcomesPhdBreakdown&${integrationParams.toString()}`,
                    title,
                    sources: [{ label: { fr: <>MESRE-SIES</> }, url: { fr: "https://data.enseignementsup-recherche.gouv.fr" } }],
                }}
                options={chartOptions}
            />
        </div>
    );
}
