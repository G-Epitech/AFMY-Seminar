"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { arrowIcons } from "@/components/icons/events"
import { title } from "process"

export const description = "A simple area chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 173 },
  { month: "May", desktop: 209 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "June", desktop: 214 },
  { month: "March", desktop: 237 },
  { month: "June", desktop: 214 },
  { month: "May", desktop: 209 },
  { month: "February", desktop: 305 },
  { month: "April", desktop: 173 },
  { month: "January", desktop: 186 },
  { month: "March", desktop: 237 },
  { month: "May", desktop: 209 },
  { month: "April", desktop: 173 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const summary = {
  customers: {
    total: 932,
    performance: 12.37,
    title: "Customers",
  },
  meeting: {
    total: 28.49,
    performance: -12.37,
    title: "Doing Meeting",
  },
  coach: {
    total: 34,
    performance: 1.2,
    title: "Customer by coach",
  },
};

export default function DashboardChartCustomers() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Customers Overview</CardTitle>
          <CardDescription>
            When the customers have joined in the time
          </CardDescription>
        </div>
        <div>
          <div className="flex justify-around">
            {Object.entries(summary).map(([key, { total, performance, title }]) => (
              <div key={key} className="flex flex-col items-center gap-1 px-4 pb-3 sm:pb-4">
                <div className="text-sm text-text-secondary">{title}</div>
                <div className="text-lg font-semibold">{total}</div>
                <div className={`text-sm ${performance >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {performance >= 0 ? arrowIcons["up"]() : arrowIcons["down"]()}
                  <span className="ml-1">
                    {performance.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
