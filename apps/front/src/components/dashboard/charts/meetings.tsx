"use client"

import { Pie, PieChart } from "recharts"

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
import { colors, DashboardChartProps } from "./utils"
import { Statistics } from "@seminar/common"
import { useEffect, useState } from "react"

function generateChartConfig(statistics: Statistics): ChartConfig {
  const meetings = statistics.meetings;

  const chartConfig = meetings.reduce((config, meeting, index) => {
    config[meeting.source] = {
      label: meeting.source,
      color: colors[index % colors.length],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  return chartConfig satisfies ChartConfig;
}

export default function DashboardChartMeetings(
  { statistics }: DashboardChartProps
) {
  const [meetings, setMeetings] = useState<{
    source: string;
    count: number;
    percentage: number;
    fill: string;
  }[]>([]);

  useEffect(() => {
    if (statistics.meetings.length > 0) {
      const filledMeetings = statistics.meetings.map((meeting, index) => ({
        ...meeting,
        fill: colors[index % colors.length],
      }));
      setMeetings(filledMeetings);
    }
  }, [statistics]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Meetings top sources</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {meetings.length > 0 ? (
          <>
            <ChartContainer
              config={generateChartConfig(statistics)}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={meetings}
                  dataKey="count"
                  nameKey="source"
                  innerRadius={60}
                />
              </PieChart>
            </ChartContainer>
          </>
        ) : (
          <div className="flex items-center justify-center h-[250px]">
            <CardDescription>No data available</CardDescription>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {meetings.map((meeting) => (
            <div key={meeting.source} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: meeting.fill }}
              />
              <div>
                {meeting.source} - {meeting.count} ({meeting.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
