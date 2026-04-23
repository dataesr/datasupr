import { Button, Col, Container, DismissibleTag, Row, TagGroup, Title } from "@dataesr/dsfr-plus";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DefaultSkeleton from "../../../../components/charts-skeletons/default";
import Callout from "../../../../components/callout.tsx";
import { type OutcomesFilterField, useOutcomesPlusHautDiplome } from "../../api";

const DEFAULT_COHORT_YEAR = "2019-2020";
const DEFAULT_COHORT_SITUATION = "L1";

const YEAR_LABELS: Record<number, string> = {
    0: "2019-2020",
    1: "2020-2021",
    2: "2021-2022",
    3: "2022-2023",
    4: "2023-2024",
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

function DiplomaFilter({
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

function formatNumber(n: number): string {
    return n.toLocaleString("fr-FR");
}

function formatPercent(n: number): string {
    return `${n.toLocaleString("fr-FR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })}%`;
}

function formatCsvCell(value: string | number) {
    const stringValue = String(value ?? "").replaceAll('"', '""');
    return `"${stringValue}"`;
}

export default function PlusHautDiplomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [barMode, setBarMode] = useState<"percent" | "effectif">("percent");

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

    const { data, error, isLoading } = useOutcomesPlusHautDiplome({
        cohorteAnnee: cohortYear,
        cohorteSituation: cohortSituation,
        filters,
    });

    const activeFiltersElement = (() => {
        const tags = FILTER_SECTIONS.flatMap(s =>
            s.fields.filter(f => filters[f.field]).map(f => {
                const code = filters[f.field]!;
                const displayLabel = data?.filterOptions?.[f.field]?.find((o) => o.key === code)?.label || code;
                return { field: f.field, label: f.label, value: displayLabel };
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
        setSearchParams(nextParams);
    };

    const lastYearLabel = data ? (YEAR_LABELS[data.lastYear] || `N+${data.lastYear}`) : "2023-2024";
    const diplomaYearLabel = lastYearLabel;

    const visualRows = useMemo(() => {
        if (!data?.rows?.length) {
            return [] as Array<{
                diplome: string;
                effectif: number;
                share: number;
            }>;
        }

        return data.rows
            .map((row) => ({
                diplome: row.diplome,
                effectif: Number(row.effectif) || 0,
                share: Number(row.pourcentage) || 0,
            }))
            .sort((a, b) => b.effectif - a.effectif);
    }, [data?.rows]);

    const maxRowEffectif = useMemo(
        () => visualRows.reduce((max, row) => Math.max(max, row.effectif), 0),
        [visualRows]
    );

    const exportCsv = () => {
        if (!data?.rows?.length) return;

        const header = [
            `Plus haut diplôme obtenu en ${diplomaYearLabel} dont :`,
            "Effectif",
            "Pourcentage",
            `dont inscrits en ${lastYearLabel} (%)`,
            `dont sortants en ${lastYearLabel} (%)`,
        ];

        const rows = data.rows.map((row) => [
            row.diplome,
            formatNumber(row.effectif),
            row.pourcentage,
            row.dontInscrits,
            row.dontSortants,
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

        const csvContent = [
            header.map((value) => formatCsvCell(value)).join(";"),
            ...rows.map((row) => row.map((value) => formatCsvCell(value)).join(";")),
        ].join("\n");

        const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "plus-haut-diplome.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
                        <Title as="h1" look="h3">
                            Le plus haut diplôme obtenu atteint en {diplomaYearLabel}
                        </Title>
                        {!isLoading && !error && data && data.rows.length > 0 && (
                            <div className="fr-mb-2w" style={{ textAlign: "right" }}>
                                <Button icon="file-download-line" onClick={exportCsv}>
                                    Export des données
                                </Button>
                            </div>
                        )}
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
                        {!isLoading && !error && data && data.rows.length > 0 && (
                            <div className="outcomes-plus-diplome-visual fr-mb-3w fr-p-2w">
                                <div className="outcomes-plus-diplome-visual__kpis fr-mb-2w">
                                    <div className="outcomes-plus-diplome-visual__kpi-card fr-p-2w">
                                        <p className="outcomes-plus-diplome-visual__kpi-label">Néo-bacheliers inscrits en L1 en 2019</p>
                                        <p className="outcomes-plus-diplome-visual__kpi-value">{formatNumber(data.totalStudents)}</p>
                                    </div>
                                    <div className="outcomes-plus-diplome-visual__kpi-card fr-p-2w">
                                        <p className="outcomes-plus-diplome-visual__kpi-label">Diplômés en {diplomaYearLabel}</p>
                                        <p className="outcomes-plus-diplome-visual__kpi-value">{formatNumber(data.totals.diplomes.effectif)}</p>
                                    </div>
                                    <div className="outcomes-plus-diplome-visual__kpi-card fr-p-2w">
                                        <p className="outcomes-plus-diplome-visual__kpi-label">Non diplômés en {diplomaYearLabel}</p>
                                        <p className="outcomes-plus-diplome-visual__kpi-value">{formatNumber(data.totals.nonDiplomes.effectif)}</p>
                                    </div>
                                </div>

                                <div className="outcomes-plus-diplome-visual__split fr-mb-3w" aria-label="Répartition diplômés et non diplômés">
                                    <div
                                        className="outcomes-plus-diplome-visual__split-segment outcomes-plus-diplome-visual__split-segment--diplomes fr-p-1w"
                                        style={{ width: `${Math.max(0, Math.min(100, Number(data.totals.diplomes.pourcentage) || 0))}%` }}
                                    >
                                        Diplômés {formatPercent(Number(data.totals.diplomes.pourcentage) || 0)}
                                    </div>
                                    <div
                                        className="outcomes-plus-diplome-visual__split-segment outcomes-plus-diplome-visual__split-segment--non-diplomes fr-p-1w"
                                        style={{ width: `${Math.max(0, Math.min(100, Number(data.totals.nonDiplomes.pourcentage) || 0))}%` }}
                                    >
                                        Non diplômés {formatPercent(Number(data.totals.nonDiplomes.pourcentage) || 0)}
                                    </div>
                                </div>

                                <div className="outcomes-plus-diplome-visual__header fr-mb-1w">
                                    <Title as="h2" look="h6" className="fr-mb-0">Répartition par diplôme</Title>
                                    <div className="outcomes-plus-diplome-visual__toggle" role="group" aria-label="Mode d'affichage des barres">
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

                                <div className="outcomes-plus-diplome-visual__rows">
                                    {visualRows.map((row) => {
                                        const width = barMode === "percent"
                                            ? row.share
                                            : maxRowEffectif > 0
                                                ? (row.effectif / maxRowEffectif) * 100
                                                : 0;
                                        const safeWidth = Math.max(0, Math.min(100, width));
                                        const valueLabel = barMode === "percent"
                                            ? formatPercent(row.share)
                                            : formatNumber(row.effectif);

                                        return (
                                            <div key={row.diplome} className="outcomes-plus-diplome-visual__row">
                                                <div className="outcomes-plus-diplome-visual__row-head">
                                                    <span className="outcomes-plus-diplome-visual__row-title">{row.diplome}</span>
                                                    <span className="outcomes-plus-diplome-visual__row-meta">
                                                        {formatNumber(row.effectif)} ({formatPercent(row.share)})
                                                    </span>
                                                </div>
                                                <div className="outcomes-plus-diplome-visual__bar">
                                                    <div
                                                        className="outcomes-plus-diplome-visual__bar-fill"
                                                        style={{ width: `${safeWidth}%` }}
                                                    >
                                                        {valueLabel}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {!isLoading && !error && data && data.rows.length > 0 && (
                            <div className="fr-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th scope="col">Plus haut diplôme obtenu en {diplomaYearLabel} dont :</th>
                                            <th scope="col" style={{ textAlign: "right" }}>Effectif</th>
                                            <th scope="col" style={{ textAlign: "right" }}>Pourcentage</th>
                                            <th scope="col" style={{ textAlign: "right" }}>dont inscrits en {lastYearLabel} (%)</th>
                                            <th scope="col" style={{ textAlign: "right" }}>dont sortants en {lastYearLabel} (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.rows.map((row) => (
                                            <tr key={row.diplome}>
                                                <td>{row.diplome}</td>
                                                <td style={{ textAlign: "right" }}>{formatNumber(row.effectif)}</td>
                                                <td style={{ textAlign: "right" }}>{row.pourcentage}</td>
                                                <td style={{ textAlign: "right" }}>{row.dontInscrits}</td>
                                                <td style={{ textAlign: "right" }}>{row.dontSortants}</td>
                                            </tr>
                                        ))}
                                        <tr className="fr-text--bold">
                                            <td>Total de diplômés</td>
                                            <td style={{ textAlign: "right" }}>{formatNumber(data.totals.diplomes.effectif)}</td>
                                            <td style={{ textAlign: "right" }}>{data.totals.diplomes.pourcentage}</td>
                                            <td style={{ textAlign: "right" }}>{data.totals.diplomes.dontInscrits}</td>
                                            <td style={{ textAlign: "right" }}>{data.totals.diplomes.dontSortants}</td>
                                        </tr>
                                        <tr className="fr-text--bold">
                                            <td>Total de non diplômés</td>
                                            <td style={{ textAlign: "right" }}>{formatNumber(data.totals.nonDiplomes.effectif)}</td>
                                            <td style={{ textAlign: "right" }}>{data.totals.nonDiplomes.pourcentage}</td>
                                            <td style={{ textAlign: "right" }}>{data.totals.nonDiplomes.dontInscrits}</td>
                                            <td style={{ textAlign: "right" }}>{data.totals.nonDiplomes.dontSortants}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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
