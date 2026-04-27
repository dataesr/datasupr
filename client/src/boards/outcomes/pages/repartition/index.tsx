import { Button, Col, Container, DismissibleTag, Row, TagGroup, Title } from "@dataesr/dsfr-plus";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import ChartWrapper from "../../../../components/chart-wrapper";
import Callout from "../../../../components/callout.tsx";
import { type OutcomesFilterField, useOutcomesRepartition } from "../../api";
import OutcomesFilterSelect from "../../components/filter-select";
import RepartitionChart from "./charts/repartition-column";

const DEFAULT_COHORT_YEAR = "2019-2020";
const DEFAULT_COHORT_SITUATION = "SIT01";
const ALL_RELATIVE_YEARS = [0, 1, 2, 3, 4];
const YEAR_LABELS: Record<number, string> = {
    0: "2019-2020 (N+0)",
    1: "2020-2021 (N+1)",
    2: "2021-2022 (N+2)",
    3: "2022-2023 (N+3)",
    4: "2023-2024 (N+4)",
};

const FILTER_FIELDS: OutcomesFilterField[] = [
    "groupe_disciplinaire",
    "sexe",
    "origine_sociale",
    "bac_type",
    "bac_mention",
    "retard_scolaire",
    "devenir_en_un_an",
    "type_de_trajectoire",
];

const FILTER_SECTIONS: Array<{
    title: string;
    fields: Array<{ field: OutcomesFilterField; label: string }>;
}> = [
        {
            title: "Discipline d'inscription",
            fields: [{ field: "groupe_disciplinaire", label: "Groupe disciplinaire" }],
        },
        {
            title: "Caractéristiques de l'étudiant",
            fields: [
                { field: "sexe", label: "Sexe" },
                { field: "origine_sociale", label: "Origine sociale" },
            ],
        },
        {
            title: "Informations sur le baccalauréat",
            fields: [
                { field: "bac_type", label: "Type" },
                { field: "bac_mention", label: "Mention obtenue" },
                { field: "retard_scolaire", label: "Retard scolaire" },
            ],
        },
        {
            title: "Parcours spécifiques",
            fields: [
                { field: "devenir_en_un_an", label: "Devenir en un an" },
                { field: "type_de_trajectoire", label: "Parcours types" },
            ],
        },
    ];

export default function RepartitionPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = {
        groupe_disciplinaire: searchParams.get("groupe_disciplinaire"),
        sexe: searchParams.get("sexe"),
        origine_sociale: searchParams.get("origine_sociale"),
        bac_type: searchParams.get("bac_type"),
        bac_mention: searchParams.get("bac_mention"),
        retard_scolaire: searchParams.get("retard_scolaire"),
        devenir_en_un_an: searchParams.get("devenir_en_un_an"),
        type_de_trajectoire: searchParams.get("type_de_trajectoire"),
    };

    const cohortYear = searchParams.get("cohorte_annee") || DEFAULT_COHORT_YEAR;
    const cohortSituation = searchParams.get("cohorte_situation") || DEFAULT_COHORT_SITUATION;

    const relativeYears = useMemo(() => {
        const raw = searchParams.get("annee_rel");
        if (!raw) return ALL_RELATIVE_YEARS;
        const parsed = raw.split(",").map(Number).filter((n) => ALL_RELATIVE_YEARS.includes(n));
        return parsed.length >= 1 ? parsed : ALL_RELATIVE_YEARS;
    }, [searchParams]);

    const { data, error, isLoading } = useOutcomesRepartition({
        cohorteAnnee: cohortYear,
        cohorteSituation: cohortSituation,
        filters,
        relativeYears,
    });

    const activeFiltersElement = (() => {
        const tags = FILTER_SECTIONS.flatMap(s =>
            s.fields.filter(f => filters[f.field]).map(f => ({ field: f.field, label: f.label, value: filters[f.field]! }))
        );
        if (!tags.length) return null;
        return (
            <TagGroup className="fr-mt-1w fr-mb-1w">
                {tags.map(({ field, label, value }) => (
                    <DismissibleTag key={field} size="sm" onClick={() => updateFilter(field, null)}>{label} : {value}</DismissibleTag>
                ))}
            </TagGroup>
        );
    })();

    const updateFilter = (field: OutcomesFilterField, value: string | null) => {
        const nextParams = new URLSearchParams(searchParams);
        if (value) {
            nextParams.set(field, value);
        } else {
            nextParams.delete(field);
        }
        setSearchParams(nextParams);
    };

    const resetFilters = () => {
        const nextParams = new URLSearchParams(searchParams);
        FILTER_FIELDS.forEach((field) => nextParams.delete(field));
        nextParams.delete("annee_rel");
        setSearchParams(nextParams);
    };

    const toggleYear = (year: number) => {
        const next = relativeYears.includes(year)
            ? relativeYears.filter((y) => y !== year)
            : [...relativeYears, year].sort();
        if (next.length < 1) return;
        const nextParams = new URLSearchParams(searchParams);
        const isAll = next.length === ALL_RELATIVE_YEARS.length && ALL_RELATIVE_YEARS.every((y) => next.includes(y));
        if (isAll) {
            nextParams.delete("annee_rel");
        } else {
            nextParams.set("annee_rel", next.join(","));
        }
        setSearchParams(nextParams);
    };

    return (
        <Container className="outcomes-section-page outcomes-flux-page">
            <Row gutters>
                <Col>
                    <Callout className="fr-mb-2w" colorFamily="pink-tuile" icon="fr-icon-alert-line" title="Avertissement">
                        Version sous embargo à ne pas diffuser
                    </Callout>
                </Col>
            </Row>
            <Row gutters>
                <Col lg={4}>
                    <aside className="outcomes-flux-page__filters" aria-label="Filtres du graphique de répartition">
                        <Title as="h1" look="h3" className="fr-mb-3w">Filtres à sélectionner</Title>
                        {FILTER_SECTIONS.map((section) => (
                            <section key={section.title} className="outcomes-flux-page__filters-section">
                                <Title as="h2" look="h5" className="fr-mb-2w">{section.title}</Title>
                                {section.fields.map(({ field, label }) => (
                                    <OutcomesFilterSelect
                                        key={field}
                                        label={label}
                                        options={data?.filterOptions?.[field] || []}
                                        selectedKey={filters[field]}
                                        onSelect={(value) => updateFilter(field, value)}
                                    />
                                ))}
                            </section>
                        ))}
                        <Button className="fr-mt-3w" onClick={resetFilters}>Réinitialiser les filtres</Button>
                    </aside>
                </Col>
                <Col lg={8}>
                    <div className="outcomes-flux-page__content">
                        <ChartWrapper.Title config={{ id: "outcomes-repartition", title: { fr: "Répartition selon les inscriptions (en %)", look: "h4" as const } }} />
                        {isLoading && <DefaultSkeleton height="540px" />}
                        {!isLoading && error && (
                            <Callout colorFamily="pink-macaron" icon="fr-icon-error-warning-line" title="Erreur de chargement">
                                Impossible de récupérer les données de répartition pour cette cohorte.
                            </Callout>
                        )}
                        {!isLoading && !error && data && !data.distribution?.length && (
                            <Callout title="Aucune donnée" icon="fr-icon-information-line">
                                Aucune donnée disponible avec les filtres actuellement sélectionnés.
                            </Callout>
                        )}
                        {activeFiltersElement}
                        {!isLoading && !error && (data?.distribution?.length ?? 0) > 0 && (
                            <RepartitionChart
                                hideTitle
                                distribution={data!.distribution}
                                relativeYears={relativeYears}
                                yearLabels={YEAR_LABELS}
                            />
                        )}

                        <div className="outcomes-flux-page__params fr-mb-3w">
                            <Title as="h2" look="h5" className="fr-mb-2w">Paramètres pour la répartition</Title>
                            <Row gutters>
                                <Col>
                                    <Title as="h3" look="h6" className="fr-mb-1w">Année à analyser</Title>
                                    <p className="fr-text--xs fr-mb-1w">Sélectionner au moins 1 item</p>
                                    <fieldset className="fr-fieldset">
                                        {ALL_RELATIVE_YEARS.map((year) => (
                                            <div className="fr-fieldset__element fr-fieldset__element--inline" key={year}>
                                                <div className="fr-checkbox-group fr-checkbox-group--sm">
                                                    <input
                                                        checked={relativeYears.includes(year)}
                                                        disabled={relativeYears.includes(year) && relativeYears.length <= 1}
                                                        id={`rep-year-${year}`}
                                                        onChange={() => toggleYear(year)}
                                                        type="checkbox"
                                                    />
                                                    <label className="fr-label" htmlFor={`rep-year-${year}`}>
                                                        {YEAR_LABELS[year]}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </fieldset>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
