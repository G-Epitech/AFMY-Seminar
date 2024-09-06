"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DashboardChartProps } from "./utils"
import { DashbordMetrics } from "./metrics"

const chartConfig = {
  count: {
    label: "Number of Events",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function DashboardChartEvents(
  { statistics }: DashboardChartProps
) {
  console.log(statistics.events.history)
  return (
    <Card className="w-full">
      <CardHeader className="flex border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Events</CardTitle>
          <CardDescription>
            Showing total events for the last 30 days
          </CardDescription>
        </div>
        <div>
          <div className="flex justify-around">
            <DashbordMetrics
              title="Monthly"
              number={statistics.events.countMonth}
              performance={statistics.events.evolutionCountMonth}
            />
            <DashbordMetrics
              title="Weekly"
              number={statistics.events.countWeek}
              performance={statistics.events.evolutionCountWeek}
            />
            <DashbordMetrics
              title="Dayly (avg)"
              number={statistics.events.dailyAverage}
              performance={statistics.events.evolutionDailyAverage}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={statistics.events.history}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              padding={{ left: 15, right: 15 }}
              tickMargin={10}
              interval={0}
              tickFormatter={(value, index) => {
                const date = new Date(value);
                const allowedDates = [
                  0,
                  statistics.events.history.length / 2,
                  statistics.events.history.length - 1,
                ];

                if (allowedDates.includes(index)) {
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
                return ""
              }}
            />
            <YAxis
              domain={['auto', 'dataMax + 10']}
              tickLine={false}
              axisLine={false}
              width={0}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="count"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey="count" fill={`var(--color-count)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
