import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import { Button } from "@dataesr/dsfr-plus";
import {
  createEffectifsNiveauChartOptions,
  createEffectifsSpecifiquesChartOptions,
  createEffectifsDisciplinesChartOptions,
} from "./options";
import {
  RenderDataNiveau,
  RenderDataSpecifiques,
  RenderDataDisciplines,
} from "./render-data";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { CHART_COLORS } from "../../../../constants/colors";

const num = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";
const pct = (n?: number) => (n != null ? `${n.toFixed(2)} %` : "—");

interface EffectifsChartProps {
  data: any;
  selectedYear?: string | number;
  etablissementName?: string;
}

export default function EffectifsChart({
  data,
  selectedYear,
  etablissementName,
}: EffectifsChartProps) {
  const hasCursusData = useMemo(() => {
    return data?.has_effectif_l || data?.has_effectif_m || data?.has_effectif_d;
  }, [data]);

  const hasSpecifiquesData = useMemo(() => {
    return (
      (data?.has_effectif_iut && data?.effectif_sans_cpge_iut > 0) ||
      (data?.has_effectif_ing && data?.effectif_sans_cpge_ing > 0) ||
      (data?.has_effectif_sante && data?.effectif_sans_cpge_sante > 0)
    );
  }, [data]);

  const hasDisciplinesData = useMemo(() => {
    return (
      (data?.has_effectif_dsa && data?.effectif_sans_cpge_dsa > 0) ||
      (data?.has_effectif_llsh && data?.effectif_sans_cpge_llsh > 0) ||
      (data?.has_effectif_theo && data?.effectif_sans_cpge_theo > 0) ||
      (data?.has_effectif_si && data?.effectif_sans_cpge_si > 0) ||
      (data?.has_effectif_staps && data?.effectif_sans_cpge_staps > 0) ||
      (data?.has_effectif_sante && data?.effectif_sans_cpge_sante > 0) ||
      (data?.has_effectif_veto && data?.effectif_sans_cpge_veto > 0) ||
      (data?.has_effectif_interd && data?.effectif_sans_cpge_interd > 0)
    );
  }, [data]);

  const defaultViewMode = useMemo(() => {
    if (hasCursusData) return "cursus";
    if (hasSpecifiquesData) return "specifiques";
    if (hasDisciplinesData) return "disciplines";
    return "cursus";
  }, [hasCursusData, hasSpecifiquesData, hasDisciplinesData]);

  const [viewMode, setViewMode] = useState<
    "cursus" | "specifiques" | "disciplines"
  >(defaultViewMode);

  const cursusOptions = useMemo(() => {
    if (!data) return {} as Highcharts.Options;
    return createEffectifsNiveauChartOptions(data);
  }, [data]);

  const specifiquesOptions = useMemo(() => {
    if (!data) return {} as Highcharts.Options;
    return createEffectifsSpecifiquesChartOptions(data);
  }, [data]);

  const disciplinesOptions = useMemo(() => {
    if (!data) return {} as Highcharts.Options;
    return createEffectifsDisciplinesChartOptions(data);
  }, [data]);

  if (!data) return null;

  const renderNiveauChart = () => (
    <ChartWrapper
      config={{
        id: "effectifs-niveau-chart",
        idQuery: "effectifs-niveau",
        title: {
          className: "fr-mt-0w",
          look: "h5",
          size: "h3",
          fr: (
            <>
              Répartition des effectifs par niveau
              {etablissementName && ` — ${etablissementName}`}
              {`${data.anuniv ? ` — ${data.anuniv}` : ""}`}
            </>
          ),
        },
        comment: {
          fr: (
            <>
              Ce graphique présente la répartition des étudiants par niveau de
              formation (Licence, Master, Doctorat) pour l'exercice{" "}
              {selectedYear}. Ces données ne prennent pas en compte les
              étudiants inscrits en parallèle dans une classe préparatoire aux
              grandes écoles et une prépa intégrées dans un autre
              établissement..
            </>
          ),
        },
        readingKey: {
          fr: (
            <>
              En {selectedYear}, l'établissement compte{" "}
              <strong>{num(data.effectif_sans_cpge)} étudiants</strong> au
              total.
              {data.has_effectif_m && data.effectif_sans_cpge_m && (
                <>
                  {" "}
                  Le niveau Master représente la plus grande part avec{" "}
                  <strong>{num(data.effectif_sans_cpge_m)} étudiants</strong> (
                  {pct(data.part_effectif_sans_cpge_m)}).
                </>
              )}
            </>
          ),
        },
        updateDate: new Date(),
        integrationURL: "/integration-url",
      }}
      options={cursusOptions}
      renderData={() => <RenderDataNiveau data={data} />}
    />
  );

  const renderSpecifiquesChart = () => (
    <ChartWrapper
      config={{
        id: "effectifs-specifiques-chart",
        idQuery: "effectifs-specifiques",
        title: {
          className: "fr-mt-0w",
          look: "h5",
          size: "h3",
          fr: (
            <>
              Répartition par filières spécifiques
              {etablissementName && ` — ${etablissementName}`}
              {`${data.anuniv ? ` — ${data.anuniv}` : ""}`}
            </>
          ),
        },
        comment: {
          fr: (
            <>
              Ce graphique présente les effectifs des filières spécifiques (IUT,
              Ingénieur, Santé) pour l'exercice {selectedYear}. Ces filières ne
              sont pas calculées en pourcentage car elles peuvent se superposer
              avec les autres catégories.
            </>
          ),
        },
        readingKey: {
          fr: (
            <>
              Les filières spécifiques totalisent{" "}
              <strong>
                {num(
                  (data.effectif_sans_cpge_iut || 0) +
                    (data.effectif_sans_cpge_ing || 0) +
                    (data.effectif_sans_cpge_sante || 0)
                )}{" "}
                étudiants
              </strong>
              .
            </>
          ),
        },
        updateDate: new Date(),
        integrationURL: "/integration-url",
      }}
      options={specifiquesOptions}
      renderData={() => <RenderDataSpecifiques data={data} />}
    />
  );

  const renderDisciplinesChart = () => (
    <ChartWrapper
      config={{
        id: "effectifs-disciplines-chart",
        idQuery: "effectifs-disciplines",
        title: {
          className: "fr-mt-0w",
          look: "h5",
          size: "h3",
          fr: (
            <>
              Répartition par disciplines
              {etablissementName && ` — ${etablissementName}`}
              {`${data.anuniv ? ` — ${data.anuniv}` : ""}`}
            </>
          ),
        },
        comment: {
          fr: (
            <>
              Ce graphique détaille la répartition des étudiants par discipline
              (Droit Sciences Éco AES, Lettres Langues SHS, Théologie, Sciences
              et Ingénierie, STAPS, Vétérinaire, Interdisciplinaire) pour
              l'exercice {selectedYear}.
            </>
          ),
        },
        readingKey: {
          fr: (() => {
            const nbDisciplines = [
              data.has_effectif_dsa,
              data.has_effectif_llsh,
              data.has_effectif_theo,
              data.has_effectif_si,
              data.has_effectif_staps,
              data.has_effectif_veto,
              data.has_effectif_interd,
            ].filter(Boolean).length;
            return (
              <>
                L'établissement propose {nbDisciplines} discipline
                {nbDisciplines > 1 ? "s" : ""} différente
                {nbDisciplines > 1 ? "s" : ""}.
              </>
            );
          })(),
        },
        updateDate: new Date(),
        integrationURL: "/integration-url",
      }}
      options={disciplinesOptions}
      renderData={() => <RenderDataDisciplines data={data} />}
    />
  );

  return (
    <div>
      <div
        className="fr-mb-2w"
        style={{ display: "flex", gap: "1rem", alignItems: "center" }}
      >
        <h3
          className="fr-h5 fr-mb-0"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.tertiary}`,
            paddingLeft: "1rem",
            flex: 1,
          }}
        ></h3>
        <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
          {hasCursusData && (
            <Button
              size="sm"
              variant={viewMode === "cursus" ? "primary" : "secondary"}
              onClick={() => setViewMode("cursus")}
            >
              Par cursus
            </Button>
          )}
          {hasSpecifiquesData && (
            <Button
              size="sm"
              variant={viewMode === "specifiques" ? "primary" : "secondary"}
              onClick={() => setViewMode("specifiques")}
            >
              Filières spécifiques
            </Button>
          )}
          {hasDisciplinesData && (
            <Button
              size="sm"
              variant={viewMode === "disciplines" ? "primary" : "secondary"}
              onClick={() => setViewMode("disciplines")}
            >
              Par disciplines
            </Button>
          )}
        </div>
      </div>

      {viewMode === "cursus" && renderNiveauChart()}
      {viewMode === "specifiques" && renderSpecifiquesChart()}
      {viewMode === "disciplines" && renderDisciplinesChart()}
    </div>
  );
}
