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
const MIN_MIN_VALUE = 10;
const ALL_RELATIVE_YEARS = [0, 1, 2, 3, 4];
const DEFAULT_YEAR_END = 4;
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

function buildContiguousYears(endYear: number) {
    const safeEnd = Math.max(1, Math.min(DEFAULT_YEAR_END, endYear));
    return ALL_RELATIVE_YEARS.filter((year) => year <= safeEnd);
}

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

    const parsedMinValue = Number.parseInt(searchParams.get("min_value") || "", 10);
    const minValue = Number.isInteger(parsedMinValue)
        ? Math.max(MIN_MIN_VALUE, parsedMinValue)
        : DEFAULT_MIN_VALUE;
    const [sliderValue, setSliderValue] = useState(minValue);
    const yearEnd = useMemo(() => {
        const raw = searchParams.get("annee_rel");
        if (!raw) return DEFAULT_YEAR_END;
        const parsed = raw.split(",").map(Number).filter((n) => ALL_RELATIVE_YEARS.includes(n));
        if (parsed.length < 2) return DEFAULT_YEAR_END;
        return Math.max(1, Math.min(DEFAULT_YEAR_END, Math.max(...parsed)));
    }, [searchParams]);
    const relativeYears = useMemo(() => buildContiguousYears(yearEnd), [yearEnd]);

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

    const updateYearEnd = (value: number) => {
        const safeEnd = Math.max(1, Math.min(DEFAULT_YEAR_END, value));
        const next = buildContiguousYears(safeEnd);
        const nextParams = new URLSearchParams(searchParams);
        const isAll = safeEnd === DEFAULT_YEAR_END;
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
                                <SankeyChart hideTitle links={data.links} totalStudents={data.totalStudents} />
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
                            <SankeyChart hideTitle links={data!.links} totalStudents={data!.totalStudents} />
                        )}

                        <div className="outcomes-flux-page__params fr-mt-3w fr-mb-3w">
                            <Title as="h2" look="h5" className="fr-mb-2w">Paramètres pour les flux</Title>
                            <Row gutters>
                                <Col md={6}>
                                    <div className="fr-range-group fr-range--sm">
                                        <label className="fr-label" id="flux-year-range-label">
                                            Année à analyser
                                            <span className="fr-hint-text">
                                                Sélection continue obligatoire: de {YEAR_LABELS[0]} jusqu'à l'horizon choisi.
                                            </span>
                                        </label>
                                        <div className="fr-range">
                                            <span className="fr-range__output">{YEAR_LABELS[yearEnd]}</span>
                                            <input
                                                aria-describedby="flux-year-range-messages"
                                                aria-labelledby="flux-year-range-label"
                                                max={DEFAULT_YEAR_END}
                                                min={1}
                                                name="flux-year-range"
                                                onChange={(e) => updateYearEnd(Number(e.target.value))}
                                                step={1}
                                                type="range"
                                                value={yearEnd}
                                            />
                                            <span className="fr-range__min" aria-hidden="true">{YEAR_LABELS[1]}</span>
                                            <span className="fr-range__max" aria-hidden="true">{YEAR_LABELS[DEFAULT_YEAR_END]}</span>
                                        </div>
                                        <div className="fr-messages-group" id="flux-year-range-messages" aria-live="polite">
                                            <p className="fr-message">Période active: {YEAR_LABELS[0]} → {YEAR_LABELS[yearEnd]}</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="fr-range-group">
                                        <label className="fr-label" id="flux-min-value-range-label">
                                            Affichage des flux
                                            <span className="fr-hint-text">
                                                Afficher les flux regroupant au minimum {sliderValue} étudiants. Ajustez le seuil pour filtrer les flux les plus faibles et mieux visualiser les parcours majoritaires.
                                            </span>
                                        </label>
                                        <div className="fr-range">
                                            <span className="fr-range__output">{sliderValue}</span>
                                            <input
                                                aria-describedby="flux-min-value-range-messages"
                                                aria-labelledby="flux-min-value-range-label"
                                                max={1000}
                                                min={MIN_MIN_VALUE}
                                                name="flux-min-value-range"
                                                onChange={(e) => setSliderValue(Number(e.target.value))}
                                                onMouseUp={() => updateMinValue(sliderValue)}
                                                onTouchEnd={() => updateMinValue(sliderValue)}
                                                step={10}
                                                type="range"
                                                value={sliderValue}
                                            />
                                            <span className="fr-range__min" aria-hidden="true">{MIN_MIN_VALUE}</span>
                                            <span className="fr-range__max" aria-hidden="true">1 000</span>
                                        </div>
                                        <div className="fr-messages-group" id="flux-min-value-range-messages" aria-live="polite" />
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div className="outcomes-flux-page__params fr-mt-3w fr-mb-3w">
                            <Title as="h2" look="h5" className="fr-mb-2w">Commentaires</Title>
                            <p>
                                <b>Note : </b>
                                ce graphique représente les flux de néo-bacheliers inscrits en licence en 2019, d'une année à l'année suivante jusqu'à l'année universitaire 2023-2024.
                            </p>
                            <p>
                                Pour des raisons de confidentialité, certaines données ont été bruitées. Les taux d'inscription présentés peuvent différer des valeurs réelles ; pour consulter les données exactes, veuillez vous référer au second onglet (l'histogramme sur la répartition des inscriptions).
                            </p>
                            <p>
                                <b>Source : </b>
                                MESRE-SIES, système d'information SISE, enquêtes menées par le SIES auprès des établissements de l'enseignement supérieur. MEN-DEPP, systèmes d'informations SCOLARITE et SIFA, enquêtes menées par la DEPP auprès d'établissements du secondaire et de centres de formation d'apprentis (CFA).
                            </p>
                            <p>
                                <b>Champ : </b>
                                les néo-bacheliers inscrits en licence en université à la rentrée 2019 en France.
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
