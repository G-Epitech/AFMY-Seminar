"use client";

import { TrendingUp } from "lucide-react";
import {
    PolarAngleAxis,
    PolarGrid,
    Radar as SRadar,
    RadarChart,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
    desktop: {
        label: "Radar",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function Radar({ data }: { data: { label: string; score: number }[] }) {
    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square min-h-[250px] min-w-[250px]"
        >
            <RadarChart data={data}>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <PolarGrid gridType="circle" />
                <PolarAngleAxis dataKey="label" />
                <SRadar
                    dataKey="score"
                    fill="var(--color-desktop)"
                    fillOpacity={0.6}
                    dot={{
                        r: 4,
                        fillOpacity: 1,
                    }}
                />
            </RadarChart>
        </ChartContainer>
    );
}
