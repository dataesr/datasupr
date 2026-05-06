import { Button, Col, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import ChartWrapper from "../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../components/charts-skeletons/default";
import OutcomesFilterSelect from "../../../components/filter-select";
import type { OutcomesFilterField, OutcomesFilterOption } from "../../../api";
import { createDiplomaDonutOptions } from "../../plus-haut-diplome/charts/diploma-donut/options";
import { createProfilesDiplomaStackOptions } from "./options";
import { createProfilesLineOptions, PROFILE_BADGES } from "./options";

const { VITE_APP_SERVER_URL } = import.meta.env;

const COHORT_YEAR = "2019-2020";
const COHORT_SITUATION = "L1";

const PROFILE_FIELDS: Array<{ field: OutcomesFilterField; label: string }> = [
    { field: "sexe", label: "Sexe" },
    { field: "origine_sociale", label: "Origine sociale" },
    { field: "bac_type", label: "Type de baccalauréat" },
    { field: "bac_mention", label: "Mention obtenue" },
    { field: "retard_scolaire", label: "Retard scolaire" },
];

const RELATIVE_YEARS = [0, 1, 2, 3, 4];

type Profile = Partial<Record<OutcomesFilterField, string | null>>;
type AxisOptions = Record<OutcomesFilterField, OutcomesFilterOption[]>;

async function fetchProfileData(profile: Profile) {
    const params = new URLSearchParams({
        cohorte_annee: COHORT_YEAR,
        cohorte_situation: COHORT_SITUATION,
    });
    Object.entries(profile).forEach(([k, v]) => { if (v) params.append(k, v); });
    const [phdRes, repRes] = await Promise.all([
        fetch(`${VITE_APP_SERVER_URL}/outcomes/plus-haut-diplome?${params.toString()}`),
        fetch(`${VITE_APP_SERVER_URL}/outcomes/repartition?${params.toString()}&annee_rel=0,1,2,3,4`),
    ]);
    if (!phdRes.ok || !repRes.ok) throw new Error("Erreur récupération profil");
    const phd = await phdRes.json();
    const rep = await repRes.json();

    const total = phd?.totalStudents || 0;
    const dipl = phd?.totals?.diplomes?.effectif || 0;
    const nonDipl = phd?.totals?.nonDiplomes?.effectif || 0;
    const tauxDipl = total ? (dipl / total) * 100 : 0;
    const rows: Array<{ diplome: string; effectif: number }> = phd?.rows ?? [];

    const counts = new Map<number, { stillEnrolled: number; total: number }>();
    (rep.distribution || []).forEach((d: { annee_rel: number; situation: string; count: number }) => {
        const cur = counts.get(d.annee_rel) || { stillEnrolled: 0, total: 0 };
        cur.total += d.count;
        if (d.situation !== "SIT_DIPL" && d.situation !== "SIT13") cur.stillEnrolled += d.count;
        counts.set(d.annee_rel, cur);
    });

    const series = RELATIVE_YEARS.map((y) => {
        const c = counts.get(y);
        if (!c || !c.total) return null;
        return (c.stillEnrolled / c.total) * 100;
    });

    return { tauxDipl, total, dipl, nonDipl, rows, series };
}

interface ProfileCardProps {
    badge: typeof PROFILE_BADGES[number];
    profile: Profile;
    axisOptions: AxisOptions;
    canRemove: boolean;
    tauxDipl?: number;
    total?: number;
    cohortTotal: number;
    isLoading: boolean;
    onChange: (next: Profile) => void;
    onRemove: () => void;
}

function ProfileCard({ badge, profile, axisOptions, canRemove, tauxDipl, total, cohortTotal, isLoading, onChange, onRemove }: ProfileCardProps) {
    const sharePct = total !== undefined && cohortTotal ? (total / cohortTotal) * 100 : null;
    return (
        <div className={`outcomes-croisements__card outcomes-croisements__card--${badge} fr-p-2w`}>
            <Row verticalAlign="middle">
                <Col>
                    <Title as="h3" look="h6" className="fr-mb-0">Profil {badge}</Title>
                </Col>
                {canRemove && (
                    <Col className="text-right">
                        <Button
                            icon="close-line"
                            variant="text"
                            size="sm"
                            onClick={onRemove}
                            title={`Retirer le profil ${badge}`}
                        >
                            Retirer
                        </Button>
                    </Col>
                )}
            </Row>
            {PROFILE_FIELDS.map(({ field, label }) => (
                <OutcomesFilterSelect
                    key={field}
                    label={label}
                    options={axisOptions[field] || []}
                    selectedKey={profile[field] ?? null}
                    onSelect={(value) => onChange({ ...profile, [field]: value })}
                />
            ))}
            <Text size="sm" className="fr-mb-0" bold>Taux de diplômés du supérieur</Text>
            <Title as="h4" look="h3" className={`fr-mb-0 outcomes-croisements__value--${badge}`}>
                {isLoading ? "…" : tauxDipl !== undefined ? `${tauxDipl.toFixed(0)}%` : "n/a"}
            </Title>
            {!isLoading && total !== undefined && (
                <>
                    <Text size="sm" className="fr-mb-0">
                        Part de la cohorte : <strong>{sharePct !== null ? `${sharePct.toFixed(1)}%` : "—"}</strong>
                    </Text>
                    <Text size="sm" className="fr-mb-0">
                        Effectif : <strong>{total.toLocaleString("fr-FR")}</strong> étudiants
                    </Text>
                </>
            )}
        </div>
    );
}

interface ProfilesTabProps {
    axisOptions: AxisOptions | null;
    isLoadingOptions: boolean;
    cohortTotal: number;
}

export default function ProfilesTab({ axisOptions, isLoadingOptions, cohortTotal }: ProfilesTabProps) {
    const [profiles, setProfiles] = useState<Profile[]>([{}, {}]);

    const queries = useQueries({
        queries: profiles.map((p, i) => ({
            queryKey: ["outcomes", "profile-compare", i, p],
            queryFn: () => fetchProfileData(p),
        })),
    });
    const updateProfile = (i: number, next: Profile) => {
        setProfiles((arr) => arr.map((p, idx) => (idx === i ? next : p)));
    };
    const removeProfile = (i: number) => {
        setProfiles((arr) => arr.filter((_, idx) => idx !== i));
    };
    const addProfile = () => {
        if (profiles.length >= 3) return;
        setProfiles((arr) => [...arr, {}]);
    };

    const lineOptions = useMemo(
        () =>
            createProfilesLineOptions(
                profiles.map((_, i) => ({
                    badge: PROFILE_BADGES[i],
                    series: queries[i]?.data?.series,
                })),
            ),
        [profiles, queries],
    );

    const stackOptions = useMemo(
        () =>
            createProfilesDiplomaStackOptions(
                profiles.map((_, i) => ({
                    badge: PROFILE_BADGES[i],
                    dipl: queries[i]?.data?.dipl,
                    nonDipl: queries[i]?.data?.nonDipl,
                })),
            ),
        [profiles, queries],
    );

    if (isLoadingOptions || !axisOptions) {
        return <DefaultSkeleton height="320px" />;
    }

    return (
        <>
            <Text className="fr-mb-2w">
                Sélectionnez 2 ou 3 profils pour comparer leurs trajectoires côte à côte.
            </Text>

            <Row gutters>
                {profiles.map((p, i) => {
                    const colSize = profiles.length === 3 ? 4 : 6;
                    return (
                        <Col key={i} xs={12} md={colSize}>
                            <ProfileCard
                                badge={PROFILE_BADGES[i]}
                                profile={p}
                                axisOptions={axisOptions}
                                canRemove={profiles.length > 2}
                                tauxDipl={queries[i]?.data?.tauxDipl}
                                total={queries[i]?.data?.total}
                                cohortTotal={cohortTotal}
                                isLoading={queries[i]?.isLoading ?? false}
                                onChange={(next) => updateProfile(i, next)}
                                onRemove={() => removeProfile(i)}
                            />
                        </Col>
                    );
                })}
            </Row>

            {profiles.length < 3 && (
                <Row className="fr-mt-2w">
                    <Col>
                        <Button icon="account-circle-fill" variant="secondary" size="sm" onClick={addProfile}>
                            Ajouter un troisième profil
                        </Button>
                    </Col>
                </Row>
            )}

            <Title as="h3" look="h5" className="fr-mt-3w fr-mb-1w">Position au fil des années</Title>
            <Text size="sm" className="fr-mb-1w">Part de chaque profil encore inscrite en formation supérieure</Text>
            <ChartWrapper
                hideTitle
                config={{ id: "outcomes-profiles-line", title: "Position au fil des années" }}
                options={lineOptions}
            />

            <Title as="h3" look="h5" className="fr-mt-3w fr-mb-1w">Diplômés du supérieur vs sortants sans diplôme</Title>
            <Text size="sm" className="fr-mb-1w">Répartition à 5 ans par profil</Text>
            <ChartWrapper
                hideTitle
                config={{ id: "outcomes-profiles-stack", title: "Diplômés du supérieur vs sortants sans diplôme" }}
                options={stackOptions}
            />

            <Title as="h3" look="h5" className="fr-mt-3w fr-mb-1w">Plus haut diplôme obtenu en 2023-2024</Title>
            <Text size="sm" className="fr-mb-1w">Répartition par type de diplôme pour chaque profil</Text>
            <Row gutters>
                {profiles.map((_, i) => {
                    const d = queries[i]?.data;
                    const badge = PROFILE_BADGES[i];
                    const colSize = profiles.length === 3 ? 4 : 6;
                    return (
                        <Col key={i} xs={12} md={colSize}>
                            <div className={`outcomes-croisements__card outcomes-croisements__card--${badge} fr-p-2w`}>
                                <Title as="h4" look="h6" className="fr-mb-1w">Profil {badge}</Title>
                                {!d || !d.rows?.length ? (
                                    <Text size="sm" className="fr-mb-0">{queries[i]?.isLoading ? "Chargement…" : "Sélectionnez des critères"}</Text>
                                ) : (
                                    <ChartWrapper
                                        hideTitle
                                        config={{ id: `outcomes-profiles-donut-${badge}`, title: `Plus haut diplôme — Profil ${badge}` }}
                                        options={createDiplomaDonutOptions(d.rows, { effectif: d.nonDipl }, `Profil ${badge}`)}
                                    />
                                )}
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
}
