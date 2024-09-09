"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
import { DashbordMetrics } from "./metrics"
import { colors, DashboardChartProps } from "./utils"

export const description = "A simple area chart"

const chartConfig = {
  count: {
    label: "Customers",
    color: colors[0],
  },
} satisfies ChartConfig

export default function DashboardChartCustomers(
  { statistics }: DashboardChartProps
) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Customers Overview</CardTitle>
          <CardDescription>
            When the customers have joined in the time.
          </CardDescription>
        </div>
        <div>
          <div className="flex justify-around items-center">
            <DashbordMetrics
              title="Customers"
              number={statistics.customers.count}
              performance={statistics.customers.evolutionCount}
            />
            <DashbordMetrics
              title="Doing Meetings"
              number={statistics.customers.doingMeetings}
              performance={statistics.customers.evolutionDoingMeetings}
            />
            <DashbordMetrics
              title="Customers by Coach"
              number={statistics.customers.customersByCoach}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={statistics.customers.history}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
              horizontal={true}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
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
                  statistics.customers.history.length / 2,
                  statistics.customers.history.length - 1,
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
            <Line
              dataKey="count"
              type={"monotone"}
              fillOpacity={0.5}
              strokeWidth={2}
              fill="var(--color-count)"
              stroke="var(--color-count)"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
