"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
import { useEffect, useState } from "react"
import { arrowIcons } from "@/components/icons/events"


const chartConfig = {
  events: {
    label: "Number of Events",
  },
  number: {
    label: "Number of Events",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type ChartData = {
  date: string;
  number: number;
}

export function DashboardChartEvents() {
  const [activeMonthData, setActiveMonthData] = useState<ChartData[]>([]);
  const [previousMonthData, setPreviousMonthData] = useState<ChartData[]>([]);

  const [summary, setSummary] = useState({
    monthly: {
      total: 0,
      performance: 0,
    },
    weekly: {
      total: 0,
      performance: 0,
    },
    dayly: {
      total: 0,
      performance: 0,
    },
  });

  useEffect(() => {
    const today = new Date("2024-06-22");
    const endDateActiveMonth = today;
    const startDateActiveMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
    const endDatePreviousMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    const startDatePreviousMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30 - 29);

    console.log("endDateActiveMonth", endDateActiveMonth);
    console.log("startDateActiveMonth", startDateActiveMonth);
    console.log("endDatePreviousMonth", endDatePreviousMonth);
    console.log("startDatePreviousMonth", startDatePreviousMonth);

    setActiveMonthData(tempChartDataActiveMonth);
    setPreviousMonthData(tempchartDataPreviousMonth);
  }, []);

  useEffect(() => {
    const totalActiveMonth = activeMonthData.reduce((acc, { number }) => acc + number, 0);
    const totalPreviousMonth = previousMonthData.reduce((acc, { number }) => acc + number, 0);

    const totalActiveWeek = activeMonthData.slice(-7).reduce((acc, { number }) => acc + number, 0);
    const totalPreviousWeek = activeMonthData.slice(-14, -7).reduce((acc, { number }) => acc + number, 0);

    const averageActiveDay = Math.round(totalActiveMonth / 30);
    const averagePreviousDay = Math.round(totalPreviousMonth / 30);

    setSummary({
      monthly: {
        total: totalActiveMonth,
        performance: (totalActiveMonth / totalPreviousMonth) * 100 - 100,
      },
      weekly: {
        total: totalActiveWeek,
        performance: (totalActiveWeek / totalPreviousWeek) * 100 - 100,
      },
      dayly: {
        total: averageActiveDay,
        performance: (averageActiveDay / averagePreviousDay) * 100 - 100,
      },
    });
  }, [activeMonthData, previousMonthData]);

  return (
    <div className="w-1/2 p-2">
      <Card>
        <CardHeader className="flex border-b p-0">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Events</CardTitle>
            <CardDescription>
              Showing total events for the last 30 days
            </CardDescription>
          </div>
          <div>
            <div className="flex justify-around">
              {Object.entries(summary).map(([key, { total, performance }]) => (
                <div key={key} className="flex flex-col items-center gap-1 px-4 pb-3 sm:pb-4">
                  <div className="text-sm text-text-secondary">{key}</div>
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
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={activeMonthData}
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
                  const allowedDates = [0, 15, 29];

                  if (allowedDates.includes(index)) {
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  return ""
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="events"
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
              <Bar dataKey="number" fill={`var(--color-number)`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

const tempChartDataActiveMonth = [
  { date: "2024-05-24", number: 294 },
  { date: "2024-05-25", number: 201 },
  { date: "2024-05-26", number: 213 },
  { date: "2024-05-27", number: 420 },
  { date: "2024-05-28", number: 233 },
  { date: "2024-05-29", number: 78 },
  { date: "2024-05-30", number: 340 },
  { date: "2024-05-31", number: 178 },
  { date: "2024-06-01", number: 178 },
  { date: "2024-06-02", number: 470 },
  { date: "2024-06-03", number: 103 },
  { date: "2024-06-04", number: 439 },
  { date: "2024-06-05", number: 88 },
  { date: "2024-06-06", number: 294 },
  { date: "2024-06-07", number: 323 },
  { date: "2024-06-08", number: 385 },
  { date: "2024-06-09", number: 438 },
  { date: "2024-06-10", number: 155 },
  { date: "2024-06-11", number: 92 },
  { date: "2024-06-12", number: 492 },
  { date: "2024-06-13", number: 81 },
  { date: "2024-06-14", number: 426 },
  { date: "2024-06-15", number: 307 },
  { date: "2024-06-16", number: 371 },
  { date: "2024-06-17", number: 475 },
  { date: "2024-06-18", number: 107 },
  { date: "2024-06-19", number: 341 },
  { date: "2024-06-20", number: 408 },
  { date: "2024-06-21", number: 169 },
  { date: "2024-06-22", number: 317 },
]

const tempchartDataPreviousMonth = [
  { date: "2024-04-24", number: 387 },
  { date: "2024-04-25", number: 215 },
  { date: "2024-04-26", number: 75 },
  { date: "2024-04-27", number: 383 },
  { date: "2024-04-28", number: 122 },
  { date: "2024-04-29", number: 315 },
  { date: "2024-04-30", number: 454 },
  { date: "2024-05-01", number: 165 },
  { date: "2024-05-02", number: 293 },
  { date: "2024-05-03", number: 247 },
  { date: "2024-05-04", number: 385 },
  { date: "2024-05-05", number: 481 },
  { date: "2024-05-06", number: 498 },
  { date: "2024-05-07", number: 388 },
  { date: "2024-05-08", number: 149 },
  { date: "2024-05-09", number: 227 },
  { date: "2024-05-10", number: 293 },
  { date: "2024-05-11", number: 335 },
  { date: "2024-05-12", number: 197 },
  { date: "2024-05-13", number: 197 },
  { date: "2024-05-14", number: 448 },
  { date: "2024-05-15", number: 473 },
  { date: "2024-05-16", number: 338 },
  { date: "2024-05-17", number: 499 },
  { date: "2024-05-18", number: 315 },
  { date: "2024-05-19", number: 235 },
  { date: "2024-05-20", number: 177 },
  { date: "2024-05-21", number: 82 },
  { date: "2024-05-22", number: 81 },
  { date: "2024-05-23", number: 252 },
]
