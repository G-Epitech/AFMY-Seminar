"use client";

import api from "@/api";
import DashboardChartCustomers from "@/components/dashboard/charts/customers";
import DashboardChartEvents from "@/components/dashboard/charts/events";
import DashboardChartMap from "@/components/dashboard/charts/map";
import DashboardChartMeetings from "@/components/dashboard/charts/meetings";
import { Subtitle } from "@/components/text/subtitle";
import { Statistics } from "@seminar/common";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const dashboardsLeft = (statistics: Statistics) => [
    <DashboardChartCustomers statistics={statistics} />,
    <DashboardChartMap statistics={statistics} />,
  ];
  const dashboardsRight = (statistics: Statistics) => [
    <DashboardChartEvents statistics={statistics} />,
    <DashboardChartMeetings statistics={statistics} />,
  ];

  const fetchStatistics = async () => {
    const today = new Date();
    const response = await api.statistics.get({
      from: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 30,
      ),
      to: today,
    });
    if (response && response.data) {
      setStatistics(response.data);
    } else {
      console.error("Failed to fetch");
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <main>
      <Subtitle text="Dashboard" />
      <h3 className="mb-4 text-stone-500">welcome!</h3>
      <div className="flex flex-wrap sm:flex-nowrap">
        {statistics && (
          <>
            <div className="w-full">
              {dashboardsLeft(statistics).map((dashboard, index) => (
                <div className="p-2" key={index}>
                  {dashboard}
                </div>
              ))}
            </div>
            <div className="w-full">
              {dashboardsRight(statistics).map((dashboard, index) => (
                <div className="p-2" key={index}>
                  {dashboard}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
