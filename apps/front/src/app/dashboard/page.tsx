import { DashboardChartCustomers } from "@/components/dashboard/charts/customers";
import { DashboardChartEvents } from "@/components/dashboard/charts/events";
import { Subtitle } from "@/components/text/subtitle";

export default function DashboardPage() {
  const dashboardsLeft = [
    <DashboardChartCustomers />,
    <DashboardChartEvents />,
  ];
  const dashboardsRight = [
    <DashboardChartEvents />,
  ];

  return (
    <main>
      <Subtitle text="Dashboard" />
      <h3 className="mb-4 text-stone-500">
        welcome!
      </h3>
      <div className="flex flex-wrap sm:flex-nowrap">
        <div className="w-full">
          {dashboardsLeft.map((dashboard, index) => (
            <div className="p-2" key={index}>
              {dashboard}
            </div>
          ))}
        </div>
        <div className="w-full">
          {dashboardsRight.map((dashboard, index) => (
            <div className="p-2" key={index}>
              {dashboard}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
} 