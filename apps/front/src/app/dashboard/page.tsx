import { DashboardChartCustomers } from "@/components/dashboard/charts/customers";
import { DashboardChartEvents } from "@/components/dashboard/charts/events";
import { Subtitle } from "@/components/text/subtitle";

export default function DashboardPage() {
  const dashboards = [
    <DashboardChartCustomers />,
    <DashboardChartEvents />,
    <DashboardChartEvents />,
  ];

  return (
    <main>
      <Subtitle text="Dashboard" />
      <h3 className="mb-4 text-stone-500">
        welcome!
      </h3>
      <div className="flex flex-wrap">
        {dashboards.map((dashboard, index) => (
          <div className="w-1/2 flex p-2">
            {dashboard}
          </div>
        ))}
      </div>
    </main>
  )
} 