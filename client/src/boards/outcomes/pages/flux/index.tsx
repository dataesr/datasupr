import { Button, Col, Container, DismissibleTag, Row, TagGroup, Title } from "@dataesr/dsfr-plus";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import ChartWrapper from "../../../../components/chart-wrapper";
import Callout from "../../../../components/callout.tsx";
import { type OutcomesFilterField, useOutcomesFlux } from "../../api";
import SankeyChart from "./charts/sankey";

const DEFAULT_COHORT_YEAR = "2019-2020";
const DEFAULT_COHORT_SITUATION = "L1";
const DEFAULT_MIN_VALUE = 100;
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

function FluxFilter({
    label,
    options,
    selectedKey,
    onSelect,
}: {
    label: string;
    options: Array<{ count: number; key: string; label: string }>;
    selectedKey: string | null;
    onSelect: (value: string | null) => void;
}) {
    return (
        <div className="fr-select-group fr-mb-2w">
            <label className="fr-label" htmlFor={`filter-${label}`}>{label}</label>
            <select
                className="fr-select"
                id={`filter-${label}`}
                value={selectedKey || ""}
                onChange={(e) => onSelect(e.target.value || null)}
            >
                <option value="">Ensemble</option>
                {options.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                        {opt.label} ({opt.count})
                    </option>
                ))}
            </select>
        </div>
    );
}

export default function FluxPage() {
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

    const minValue = Number.parseInt(searchParams.get("min_value") || "", 10) || DEFAULT_MIN_VALUE;
    const [sliderValue, setSliderValue] = useState(minValue);
    const relativeYears = useMemo(() => {
        const raw = searchParams.get("annee_rel");
        if (!raw) return ALL_RELATIVE_YEARS;
        const parsed = raw.split(",").map(Number).filter((n) => ALL_RELATIVE_YEARS.includes(n));
        return parsed.length >= 2 ? parsed : ALL_RELATIVE_YEARS;
    }, [searchParams]);

    const { data, error, isFetching, isLoading } = useOutcomesFlux({
        cohorteAnnee: cohortYear,
        cohorteSituation: cohortSituation,
        filters,
        minValue,
        relativeYears,
    });

    const activeFiltersElement = (() => {
        const tags = FILTER_SECTIONS.flatMap(s =>
            s.fields.filter(f => filters[f.field]).map(f => {
                const code = filters[f.field]!;
                const option = data?.filterOptions?.[f.field]?.find((o: { key: string }) => o.key === code);
                return { field: f.field, label: f.label, value: option?.label || code };
            })
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
        nextParams.delete("min_value");
        nextParams.delete("annee_rel");
        setSearchParams(nextParams);
    };

    const updateMinValue = (value: number) => {
        const nextParams = new URLSearchParams(searchParams);
        if (value === DEFAULT_MIN_VALUE) {
            nextParams.delete("min_value");
        } else {
            nextParams.set("min_value", String(value));
        }
        setSearchParams(nextParams);
    };

    const toggleYear = (year: number) => {
        const next = relativeYears.includes(year)
            ? relativeYears.filter((y) => y !== year)
            : [...relativeYears, year].sort();
        if (next.length < 2) return;
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
                <Col lg={4}>
                    <aside className="outcomes-flux-page__filters" aria-label="Filtres du graphique de flux">
                        <Title as="h1" look="h3" className="fr-mb-3w">Filtres à sélectionner</Title>
                        {FILTER_SECTIONS.map((section) => (
                            <section key={section.title} className="outcomes-flux-page__filters-section">
                                <Title as="h2" look="h5" className="fr-mb-2w">{section.title}</Title>
                                {section.fields.map(({ field, label }) => (
                                    <FluxFilter
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
                        <ChartWrapper.Title config={{ id: "outcomes-flux-sankey", title: { fr: "Parcours des néo-bacheliers inscrits en L1 en 2019", look: "h4" as const } }} />
                        {activeFiltersElement}
                        {(isLoading || (isFetching && !data)) && <DefaultSkeleton height="540px" />}
                        {!isLoading && isFetching && data && (
                            <div style={{ opacity: 0.5, transition: "opacity 0.2s" }}>
                                <SankeyChart hideTitle links={data.links} />
                            </div>
                        )}
                        {!isLoading && !isFetching && error && (
                            <Callout colorFamily="pink-macaron" icon="fr-icon-error-warning-line" title="Erreur de chargement">
                                Impossible de récupérer les flux pour cette cohorte.
                            </Callout>
                        )}
                        {!isLoading && !isFetching && data && !data.links?.length && (
                            <Callout title="Aucune transition visible" icon="fr-icon-information-line">
                                Aucun flux ne dépasse le seuil d'affichage avec les filtres actuellement sélectionnés.
                            </Callout>
                        )}
                        {!isLoading && !isFetching && (data?.links?.length ?? 0) > 0 && (
                            <SankeyChart hideTitle links={data!.links} />
                        )}

                        <div className="outcomes-flux-page__params fr-mt-3w fr-mb-3w">
                            <Title as="h2" look="h5" className="fr-mb-2w">Paramètres pour les flux</Title>
                            <Row gutters>
                                <Col md={6}>
                                    <Title as="h3" look="h6" className="fr-mb-1w">Année à analyser</Title>
                                    <p className="fr-text--xs fr-mb-1w">Sélectionner au moins 2 items</p>
                                    <fieldset className="fr-fieldset">
                                        {ALL_RELATIVE_YEARS.map((year) => (
                                            <div className="fr-fieldset__element fr-fieldset__element--inline" key={year}>
                                                <div className="fr-checkbox-group fr-checkbox-group--sm">
                                                    <input
                                                        checked={relativeYears.includes(year)}
                                                        disabled={relativeYears.includes(year) && relativeYears.length <= 2}
                                                        id={`year-${year}`}
                                                        onChange={() => toggleYear(year)}
                                                        type="checkbox"
                                                    />
                                                    <label className="fr-label" htmlFor={`year-${year}`}>
                                                        {YEAR_LABELS[year]}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </fieldset>
                                </Col>
                                <Col md={6}>
                                    <Title as="h3" look="h6" className="fr-mb-1w">Affichage des flux</Title>
                                    <p className="fr-text--xs fr-mb-1w">
                                        Afficher les flux regroupant au minimum {sliderValue} étudiants.
                                    </p>
                                    <div className="fr-range-group">
                                        <div className="outcomes-flux-page__slider-labels">
                                            <span className="fr-text--xs">0</span>
                                            <span className="fr-text--sm fr-text--bold">{sliderValue}</span>
                                            <span className="fr-text--xs">1 000</span>
                                        </div>
                                        <input
                                            aria-label="Seuil minimum d'étudiants"
                                            max={1000}
                                            min={0}
                                            onChange={(e) => setSliderValue(Number(e.target.value))}
                                            onMouseUp={() => updateMinValue(sliderValue)}
                                            onTouchEnd={() => updateMinValue(sliderValue)}
                                            step={10}
                                            type="range"
                                            value={sliderValue}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
