"use client";

import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export function RoundChart({ score, title }: { score: number, title: string }) {
    const chartData = [{ score, fill: "var(--color-safari)" }];

    const chartConfig = {
        score: {
            label: title,
        },
        safari: {
            label: "Safari",
            color: "hsl(var(--primary))",
        },
    } satisfies ChartConfig;

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square min-h-[250px] min-w-[250px]"
        >
            <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={score * 360 / 100}
                innerRadius={80}
                outerRadius={110}
            >
                <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[86, 74]}
                />
                <RadialBar dataKey="score" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-4xl font-bold"
                                        >
                                            {chartData[0].score.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            {title}
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                </PolarRadiusAxis>
            </RadialBarChart>
        </ChartContainer>
    );
}
