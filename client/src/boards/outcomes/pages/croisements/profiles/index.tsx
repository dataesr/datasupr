import { Button } from "@dataesr/dsfr-plus";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import ChartWrapper from "../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../components/charts-skeletons/default";
import OutcomesFilterSelect from "../../../components/filter-select";
import type { OutcomesFilterField, OutcomesFilterOption } from "../../../api";
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
    const tauxDipl = total ? (dipl / total) * 100 : 0;

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

    return { tauxDipl, total, series };
}

interface ProfileCardProps {
    badge: typeof PROFILE_BADGES[number];
    profile: Profile;
    axisOptions: AxisOptions;
    canRemove: boolean;
    tauxDipl?: number;
    isLoading: boolean;
    onChange: (next: Profile) => void;
    onRemove: () => void;
}

function ProfileCard({ badge, profile, axisOptions, canRemove, tauxDipl, isLoading, onChange, onRemove }: ProfileCardProps) {
    return (
        <div className={`outcomes-croisements__profile-card outcomes-croisements__profile-card--${badge}`}>
            <div className="outcomes-croisements__profile-card__head">
                <div className="outcomes-croisements__profile-card__heading">
                    <span className={`outcomes-croisements__profile-card__badge outcomes-croisements__profile-card__badge--${badge}`} aria-hidden="true">{badge}</span>
                    <span className="outcomes-croisements__profile-card__title">Profil {badge}</span>
                </div>
                {canRemove && (
                    <button
                        type="button"
                        className="outcomes-croisements__profile-card__remove fr-icon-close-line"
                        aria-label={`Retirer le profil ${badge}`}
                        onClick={onRemove}
                    />
                )}
            </div>
            {PROFILE_FIELDS.map(({ field, label }) => (
                <OutcomesFilterSelect
                    key={field}
                    label={label}
                    options={axisOptions[field] || []}
                    selectedKey={profile[field] ?? null}
                    onSelect={(value) => onChange({ ...profile, [field]: value })}
                />
            ))}
            <div className="outcomes-croisements__profile-card__kpi">
                <span className="outcomes-croisements__profile-card__kpi-label">Taux de diplômés</span>
                <span className={`outcomes-croisements__profile-card__kpi-value outcomes-croisements__profile-card__kpi-value--${badge}`}>
                    {isLoading ? "…" : tauxDipl !== undefined ? `${tauxDipl.toFixed(0)}%` : "n/a"}
                </span>
            </div>
        </div>
    );
}

interface ProfilesTabProps {
    axisOptions: AxisOptions | null;
    isLoadingOptions: boolean;
}

export default function ProfilesTab({ axisOptions, isLoadingOptions }: ProfilesTabProps) {
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

    if (isLoadingOptions || !axisOptions) {
        return <DefaultSkeleton height="320px" />;
    }

    return (
        <div>
            <p className="outcomes-croisements__intro">
                Sélectionnez 2 ou 3 profils pour comparer leurs trajectoires côte à côte.
            </p>

            <div className={`outcomes-croisements__profiles${profiles.length === 3 ? " outcomes-croisements__profiles--three" : ""}`}>
                {profiles.map((p, i) => (
                    <ProfileCard
                        key={i}
                        badge={PROFILE_BADGES[i]}
                        profile={p}
                        axisOptions={axisOptions}
                        canRemove={profiles.length > 2}
                        tauxDipl={queries[i]?.data?.tauxDipl}
                        isLoading={queries[i]?.isLoading ?? false}
                        onChange={(next) => updateProfile(i, next)}
                        onRemove={() => removeProfile(i)}
                    />
                ))}
            </div>

            {profiles.length < 3 && (
                <div className="outcomes-croisements__add-profile">
                    <Button icon="account-circle-fill" variant="secondary" size="sm" onClick={addProfile}>
                        Ajouter un troisième profil
                    </Button>
                </div>
            )}

            <div className="outcomes-croisements__chart-card">
                <div className="outcomes-croisements__chart-card__title">Position au fil des années</div>
                <div className="outcomes-croisements__chart-card__subtitle">Part de chaque profil encore inscrite en formation supérieure</div>
                <ChartWrapper
                    hideTitle
                    config={{ id: "outcomes-profiles-line", title: "Position au fil des années" }}
                    options={lineOptions}
                />
            </div>
        </div>
    );
}
