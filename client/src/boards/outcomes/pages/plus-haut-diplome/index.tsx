import { Button, Col, Container, DismissibleTag, Row, TagGroup, Title } from "@dataesr/dsfr-plus";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import Callout from "../../../../components/callout.tsx";
import {
    type OutcomesFilterField,
    type OutcomesFilterOption,
    useOutcomesPlusHautDiplome,
} from "../../api";
import DiplomaDonut from "./charts/diploma-donut";

const DEFAULT_COHORT_YEAR = "2019-2020";
const DEFAULT_COHORT_SITUATION = "L1";

const YEAR_LABELS: Record<number, string> = {
    0: "2019-2020",
    1: "2020-2021",
    2: "2021-2022",
    3: "2022-2023",
    4: "2023-2024",
};

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
                { field: "bac_type", label: "Type de baccalauréat" },
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

const FILTER_FIELDS: OutcomesFilterField[] = FILTER_SECTIONS.flatMap((s) => s.fields.map((f) => f.field));

const BREAKDOWN_SECTIONS: Array<{ title: string; field: OutcomesFilterField }> = [
    { title: "Par groupe disciplinaire", field: "groupe_disciplinaire" },
    { title: "Par sexe", field: "sexe" },
    { title: "Par origine sociale", field: "origine_sociale" },
    { title: "Par type de bac", field: "bac_type" },
    { title: "Par retard scolaire", field: "retard_scolaire" },
];

function formatNumber(n: number): string {
    return Math.round(n).toLocaleString("fr-FR");
}

function formatPercent(n: number): string {
    return `${Number(n).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

function formatCsvCell(value: string | number): string {
    return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function DiplomaFilter({
    label,
    options,
    selectedKey,
    onSelect,
}: {
    label: string;
    options: OutcomesFilterOption[];
    selectedKey: string | null;
    onSelect: (value: string | null) => void;
}) {
    const id = `filter-${label}`;
    return (
        <div className="fr-select-group fr-mb-2w">
            <label className="fr-label" htmlFor={id}>{label}</label>
            <select
                className="fr-select"
                id={id}
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

function BreakdownRow({
    option,
    sectionTotal,
    mode,
}: {
    option: OutcomesFilterOption;
    sectionTotal: number;
    mode: "percent" | "effectif";
}) {
    const dipl = option.dipl ?? 0;
    const ndipl = option.ndipl ?? 0;
    const total = dipl + ndipl;
    if (total <= 0) return null;

    const diplShare = (dipl / total) * 100;
    const ndiplShare = (ndipl / total) * 100;
    const populationShare = sectionTotal > 0 ? (total / sectionTotal) * 100 : 0;

    const leftLabel = mode === "percent" ? formatPercent(diplShare) : formatNumber(dipl);
    const rightLabel = mode === "percent" ? formatPercent(ndiplShare) : formatNumber(ndipl);

    return (
        <div className="outcomes-phd__row fr-mb-2w">
            <p className="fr-text--sm fr-mb-1v">
                <b>{option.label}</b> — {formatNumber(total)} ({formatPercent(populationShare)} de la population observée)
            </p>
            <div
                className="outcomes-phd__bar"
                role="img"
                aria-label={`${option.label} : ${formatNumber(dipl)} diplômés, ${formatNumber(ndipl)} non diplômés`}
            >
                <div className="outcomes-phd__bar-fill outcomes-phd__bar-fill--dipl" style={{ width: `${diplShare}%` }}>
                    <span>{leftLabel}</span>
                </div>
                <div className="outcomes-phd__bar-fill outcomes-phd__bar-fill--ndipl" style={{ width: `${ndiplShare}%` }}>
                    <span>{rightLabel}</span>
                </div>
            </div>
            <div className="outcomes-phd__row-footer fr-text--xs fr-mt-1v">
                <span>{formatNumber(dipl)} diplômés</span>
                <span>{formatNumber(ndipl)} non diplômés</span>
            </div>
        </div>
    );
}

export default function PlusHautDiplomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [barMode, setBarMode] = useState<"percent" | "effectif">("percent");

    const filters = FILTER_FIELDS.reduce<Partial<Record<OutcomesFilterField, string | null>>>((acc, field) => {
        acc[field] = searchParams.get(field);
        return acc;
    }, {});

    const cohortYear = searchParams.get("cohorte_annee") || DEFAULT_COHORT_YEAR;
    const cohortSituation = searchParams.get("cohorte_situation") || DEFAULT_COHORT_SITUATION;

    const { data, error, isLoading } = useOutcomesPlusHautDiplome({
        cohorteAnnee: cohortYear,
        cohorteSituation: cohortSituation,
        filters,
    });

    const updateFilter = (field: OutcomesFilterField, value: string | null) => {
        const nextParams = new URLSearchParams(searchParams);
        if (value) nextParams.set(field, value);
        else nextParams.delete(field);
        setSearchParams(nextParams);
    };

    const resetFilters = () => {
        const nextParams = new URLSearchParams(searchParams);
        FILTER_FIELDS.forEach((field) => nextParams.delete(field));
        setSearchParams(nextParams);
    };

    const lastYearLabel = data ? YEAR_LABELS[data.lastYear] || `N+${data.lastYear}` : "2023-2024";

    const activeFiltersElement = (() => {
        const tags = FILTER_SECTIONS.flatMap((s) =>
            s.fields
                .filter((f) => !!filters[f.field])
                .map((f) => {
                    const code = filters[f.field]!;
                    const label = data?.filterOptions?.[f.field]?.find((o) => o.key === code)?.label || code;
                    return { field: f.field, label: f.label, value: label };
                })
        );
        if (!tags.length) return null;
        return (
            <TagGroup className="fr-mt-1w fr-mb-1w">
                {tags.map(({ field, label, value }) => (
                    <DismissibleTag key={field} size="sm" onClick={() => updateFilter(field, null)}>
                        {label} : {value}
                    </DismissibleTag>
                ))}
            </TagGroup>
        );
    })();

    const exportCsv = () => {
        if (!data?.rows?.length) return;
        const header = [
            `Plus haut diplôme obtenu en ${lastYearLabel} dont :`,
            "Effectif",
            "Pourcentage",
            `dont inscrits en ${lastYearLabel} (%)`,
            `dont sortants en ${lastYearLabel} (%)`,
        ];
        const rows: Array<Array<string | number>> = data.rows.map((r) => [
            r.diplome, formatNumber(r.effectif), r.pourcentage, r.dontInscrits, r.dontSortants,
        ]);
        rows.push([
            "Total de diplômés",
            formatNumber(data.totals.diplomes.effectif),
            data.totals.diplomes.pourcentage,
            data.totals.diplomes.dontInscrits,
            data.totals.diplomes.dontSortants,
        ]);
        rows.push([
            "Total de non diplômés",
            formatNumber(data.totals.nonDiplomes.effectif),
            data.totals.nonDiplomes.pourcentage,
            data.totals.nonDiplomes.dontInscrits,
            data.totals.nonDiplomes.dontSortants,
        ]);
        const csv = [header, ...rows].map((line) => line.map(formatCsvCell).join(";")).join("\n");
        const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "plus-haut-diplome.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    const hasData = !isLoading && !error && data && data.rows.length > 0;

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
                    <aside className="outcomes-flux-page__filters" aria-label="Filtres du tableau plus haut diplôme">
                        <Title as="h1" look="h3" className="fr-mb-3w">Filtres à sélectionner</Title>
                        {FILTER_SECTIONS.map((section) => (
                            <section key={section.title} className="outcomes-flux-page__filters-section">
                                <Title as="h2" look="h5" className="fr-mb-2w">{section.title}</Title>
                                {section.fields.map(({ field, label }) => (
                                    <DiplomaFilter
                                        key={field}
                                        label={label}
                                        options={data?.filterOptions?.[field] || []}
                                        selectedKey={filters[field] ?? null}
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
                        <Title as="h1" look="h3">
                            Le plus haut diplôme obtenu atteint en {lastYearLabel}
                        </Title>
                        {activeFiltersElement}

                        {isLoading && <DefaultSkeleton height="400px" />}
                        {!isLoading && error && (
                            <Callout colorFamily="pink-macaron" icon="fr-icon-error-warning-line" title="Erreur de chargement">
                                Impossible de récupérer les données pour cette cohorte.
                            </Callout>
                        )}
                        {!isLoading && !error && data && !data.rows.length && (
                            <Callout title="Aucune donnée" icon="fr-icon-information-line">
                                Aucune donnée disponible avec les filtres actuellement sélectionnés.
                            </Callout>
                        )}

                        {hasData && (
                            <>
                                <div className="outcomes-phd__kpis fr-mb-2w">
                                    <div className="outcomes-phd__kpi fr-p-2w">
                                        <p className="fr-text--sm fr-mb-1v">Néo-bacheliers inscrits en L1 en 2019</p>
                                        <p className="fr-h4 fr-mb-0">{formatNumber(data.totalStudents)}</p>
                                    </div>
                                    <div className="outcomes-phd__kpi fr-p-2w">
                                        <p className="fr-text--sm fr-mb-1v">Diplômés en {lastYearLabel}</p>
                                        <p className="fr-h4 fr-mb-0">{formatNumber(data.totals.diplomes.effectif)}</p>
                                    </div>
                                    <div className="outcomes-phd__kpi fr-p-2w">
                                        <p className="fr-text--sm fr-mb-1v">Non diplômés en {lastYearLabel}</p>
                                        <p className="fr-h4 fr-mb-0">{formatNumber(data.totals.nonDiplomes.effectif)}</p>
                                    </div>
                                </div>

                                <DiplomaDonut
                                    rows={data.rows}
                                    nonDiplomes={data.totals.nonDiplomes}
                                    lastYearLabel={lastYearLabel}
                                />

                                <div className="outcomes-phd__header fr-mt-3w fr-mb-2w">
                                    <Title as="h2" look="h5" className="fr-mb-0">Diplômés vs non diplômés</Title>
                                    <div className="outcomes-phd__toggle" role="group" aria-label="Mode d'affichage des barres">
                                        <button
                                            type="button"
                                            className={`fr-btn fr-btn--sm ${barMode === "percent" ? "" : "fr-btn--tertiary"}`}
                                            aria-pressed={barMode === "percent"}
                                            onClick={() => setBarMode("percent")}
                                        >
                                            En %
                                        </button>
                                        <button
                                            type="button"
                                            className={`fr-btn fr-btn--sm ${barMode === "effectif" ? "" : "fr-btn--tertiary"}`}
                                            aria-pressed={barMode === "effectif"}
                                            onClick={() => setBarMode("effectif")}
                                        >
                                            En effectifs
                                        </button>
                                    </div>
                                </div>

                                {BREAKDOWN_SECTIONS.map(({ title, field }) => {
                                    const options = data.filterOptions?.[field] || [];
                                    const withData = options.filter((o) => (o.dipl ?? 0) + (o.ndipl ?? 0) > 0);
                                    if (!withData.length) return null;
                                    const sectionTotal = withData.reduce((sum, o) => sum + (o.dipl ?? 0) + (o.ndipl ?? 0), 0);
                                    return (
                                        <section key={field} className="fr-mb-3w">
                                            <Title as="h3" look="h6" className="fr-mb-2w">{title}</Title>
                                            {withData.map((opt) => (
                                                <BreakdownRow key={opt.key} option={opt} sectionTotal={sectionTotal} mode={barMode} />
                                            ))}
                                        </section>
                                    );
                                })}

                                <div className="outcomes-phd__legend fr-text--xs fr-mb-2w">
                                    <span className="outcomes-phd__legend-dot outcomes-phd__legend-dot--dipl" aria-hidden="true" /> Diplômés
                                    <span className="outcomes-phd__legend-dot outcomes-phd__legend-dot--ndipl" aria-hidden="true" /> Non diplômés
                                </div>

                                <div className="outcomes-phd__table-actions fr-mb-1w">
                                    <Button icon="file-download-line" onClick={exportCsv} size="sm">
                                        Export des données
                                    </Button>
                                </div>
                                <div className="fr-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th scope="col">Plus haut diplôme obtenu en {lastYearLabel} dont :</th>
                                                <th scope="col" className="outcomes-phd__cell--right">Effectif</th>
                                                <th scope="col" className="outcomes-phd__cell--right">Pourcentage</th>
                                                <th scope="col" className="outcomes-phd__cell--right">dont inscrits en {lastYearLabel} (%)</th>
                                                <th scope="col" className="outcomes-phd__cell--right">dont sortants en {lastYearLabel} (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.rows.map((row) => (
                                                <tr key={row.diplome}>
                                                    <td>{row.diplome}</td>
                                                    <td className="outcomes-phd__cell--right">{formatNumber(row.effectif)}</td>
                                                    <td className="outcomes-phd__cell--right">{row.pourcentage}</td>
                                                    <td className="outcomes-phd__cell--right">{row.dontInscrits}</td>
                                                    <td className="outcomes-phd__cell--right">{row.dontSortants}</td>
                                                </tr>
                                            ))}
                                            <tr className="fr-text--bold">
                                                <td>Total de diplômés</td>
                                                <td className="outcomes-phd__cell--right">{formatNumber(data.totals.diplomes.effectif)}</td>
                                                <td className="outcomes-phd__cell--right">{data.totals.diplomes.pourcentage}</td>
                                                <td className="outcomes-phd__cell--right">{data.totals.diplomes.dontInscrits}</td>
                                                <td className="outcomes-phd__cell--right">{data.totals.diplomes.dontSortants}</td>
                                            </tr>
                                            <tr className="fr-text--bold">
                                                <td>Total de non diplômés</td>
                                                <td className="outcomes-phd__cell--right">{formatNumber(data.totals.nonDiplomes.effectif)}</td>
                                                <td className="outcomes-phd__cell--right">{data.totals.nonDiplomes.pourcentage}</td>
                                                <td className="outcomes-phd__cell--right">{data.totals.nonDiplomes.dontInscrits}</td>
                                                <td className="outcomes-phd__cell--right">{data.totals.nonDiplomes.dontSortants}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        <div className="outcomes-flux-page__params fr-mt-3w fr-mb-3w">
                            <p>
                                <b>Source : </b>
                                MESRE-SIES, système d’information SISE, enquêtes menées par le SIES auprès des établissements de l'enseignement supérieur. MEN-DEPP, systèmes d’informations SCOLARITE et SIFA, enquêtes menées par la DEPP auprès d'établissements du secondaire et de centres de formation d'apprentis (CFA).
                            </p>
                            <p>
                                <b>Champ : </b>
                                Les néo-bacheliers inscrits en licence en université à la rentrée 2019 en France.
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
