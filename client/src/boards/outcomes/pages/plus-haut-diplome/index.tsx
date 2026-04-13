import { Button, Col, Container, DismissibleTag, Row, TagGroup, Title } from "@dataesr/dsfr-plus";
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
    "parcours_type",
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
                { field: "parcours_type", label: "Parcours types" },
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

export default function PlusHautDiplomePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = {
        groupe_disciplinaire: searchParams.get("groupe_disciplinaire"),
        sexe: searchParams.get("sexe"),
        origine_sociale: searchParams.get("origine_sociale"),
        bac_type: searchParams.get("bac_type"),
        bac_mention: searchParams.get("bac_mention"),
        retard_scolaire: searchParams.get("retard_scolaire"),
        devenir_en_un_an: searchParams.get("devenir_en_un_an"),
        parcours_type: searchParams.get("parcours_type"),
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
        setSearchParams(nextParams);
    };

    const lastYearLabel = data ? (YEAR_LABELS[data.lastYear] || `N+${data.lastYear}`) : "2023-2024";
    const diplomaYearLabel = data ? (YEAR_LABELS[data.lastYear - 1] || "2023").split("-")[0] : "2023";

    return (
        <Container className="outcomes-section-page outcomes-flux-page">
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
                            <div className="fr-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th scope="col">Plus haut diplôme obtenu en {diplomaYearLabel} dont :</th>
                                            <th scope="col">Effectif</th>
                                            <th scope="col">Pourcentage</th>
                                            <th scope="col">dont inscrits en {lastYearLabel} (%)</th>
                                            <th scope="col">dont sortants en {lastYearLabel} (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.rows.map((row) => (
                                            <tr key={row.diplome}>
                                                <td>{row.diplome}</td>
                                                <td>{formatNumber(row.effectif)}</td>
                                                <td>{row.pourcentage}</td>
                                                <td>{row.dontInscrits}</td>
                                                <td>{row.dontSortants}</td>
                                            </tr>
                                        ))}
                                        <tr className="fr-text--bold">
                                            <td>Total de diplômés</td>
                                            <td>{formatNumber(data.totals.diplomes.effectif)}</td>
                                            <td>{data.totals.diplomes.pourcentage}</td>
                                            <td>{data.totals.diplomes.dontInscrits}</td>
                                            <td>{data.totals.diplomes.dontSortants}</td>
                                        </tr>
                                        <tr className="fr-text--bold">
                                            <td>Total de non diplômés</td>
                                            <td>{formatNumber(data.totals.nonDiplomes.effectif)}</td>
                                            <td>{data.totals.nonDiplomes.pourcentage}</td>
                                            <td>{data.totals.nonDiplomes.dontInscrits}</td>
                                            <td>{data.totals.nonDiplomes.dontSortants}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
