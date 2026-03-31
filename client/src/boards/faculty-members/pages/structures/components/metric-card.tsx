import { useEffect, useRef } from "react";
import Highcharts from "highcharts";

interface MetricCardProps {
    title: string;
    value: string | React.ReactNode;
    detail?: string;
    color?: string;
    evolutionData?: Array<{ year: string; value: number }>;
    unit?: string;
}

export default function MetricCard({
    title,
    value,
    detail,
    color = "var(--blue-france-main-525)",
    evolutionData,
    unit = "",
}: MetricCardProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<Highcharts.Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current || !evolutionData || evolutionData.length < 2) return;

        const years = evolutionData.map((d) => d.year);
        const values = evolutionData.map((d) => d.value);

        const resolvedColor = color.startsWith("var(")
            ? getComputedStyle(document.documentElement)
                .getPropertyValue(color.slice(4, -1))
                .trim()
            : color;

        chartInstance.current = Highcharts.chart({
            chart: {
                renderTo: chartRef.current,
                type: "areaspline",
                height: 70,
                backgroundColor: "transparent",
                margin: [2, -45, 2, -45],
                spacing: [0, 0, 0, 0],
            },
            title: { text: undefined },
            credits: { enabled: false },
            exporting: { enabled: false },
            accessibility: { enabled: false },
            xAxis: {
                categories: years,
                visible: false,
                startOnTick: false,
                endOnTick: false,
                tickmarkPlacement: "on",
            },
            yAxis: { visible: false, gridLineWidth: 0 },
            legend: { enabled: false },
            plotOptions: {
                areaspline: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, Highcharts.color(resolvedColor).setOpacity(0.7).get("rgba") as string],
                            [0.5, Highcharts.color(resolvedColor).setOpacity(0.12).get("rgba") as string],
                            [1, Highcharts.color(resolvedColor).setOpacity(0.02).get("rgba") as string],
                        ],
                    },
                    marker: {
                        enabled: false,
                        states: {
                            hover: { enabled: true, radius: 3, fillColor: resolvedColor, lineWidth: 2, lineColor: "#fff" },
                        },
                    },
                    lineWidth: 2.5,
                    lineColor: resolvedColor,
                    states: { hover: { lineWidth: 2.5 } },
                    threshold: null,
                    enableMouseTracking: true,
                },
            },
            tooltip: {
                useHTML: true,
                outside: true,
                backgroundColor: "var(--background-contrast-grey)",
                borderColor: "var(--border-default-grey)",
                style: { color: "var(--text-default-grey)", zIndex: 9999 },
                formatter: function () {
                    const val = this.y as number;
                    const year = years[(this as any).point?.index ?? this.x];
                    let formatted: string;
                    if (unit === "%") {
                        formatted = val.toFixed(1) + " %";
                    } else {
                        formatted = val.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
                        if (unit) formatted += ` ${unit}`;
                    }
                    return `<b>${year}</b><br/>${formatted}`;
                },
            },
            series: [{ type: "areaspline", name: title, data: values }],
        });

        return () => {
            chartInstance.current?.destroy();
            chartInstance.current = null;
        };
    }, [evolutionData, color, title, unit]);

    const hasChart = evolutionData && evolutionData.length >= 2;

    return (
        <div
            className="fr-card"
            role="article"
            aria-label={`${title}: ${value}${detail ? `, ${detail}` : ""}`}
            style={{
                height: "100%",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "none",
                backgroundColor: "var(--background-alt-grey)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                paddingBottom: 0,
            }}
        >
            <div className="fr-card__body fr-p-2w" style={{ flex: "1 1 auto", order: 1 }}>
                <div className="fr-card__content">
                    <p
                        className="fr-text--sm fr-text--bold fr-mb-1v"
                        style={{ color: "var(--text-default-grey)", textTransform: "uppercase", letterSpacing: "0.5px" }}
                    >
                        {title}
                    </p>
                    <p className="fr-h5 fr-mb-1v">{value}</p>
                    {detail && (
                        <p className="fr-text--sm" style={{ color: "var(--text-default-grey)", margin: 0 }}>
                            {detail}
                        </p>
                    )}
                </div>
            </div>
            {hasChart && (
                <div style={{ position: "relative", flex: "0 0 auto", order: 2 }}>
                    <div ref={chartRef} aria-hidden="true" style={{ width: "100%" }} />
                    {evolutionData && evolutionData.length >= 2 && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: 2,
                                left: 8,
                                right: 8,
                                display: "flex",
                                justifyContent: "space-between",
                                pointerEvents: "none",
                            }}
                        >
                            <span style={{ fontWeight: "bold", fontSize: "10px", color: "var(--text-mention-grey)" }}>
                                {evolutionData[0].year}
                            </span>
                            <span style={{ fontWeight: "bold", fontSize: "10px", color: "var(--text-mention-grey)" }}>
                                {evolutionData[evolutionData.length - 1].year}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
