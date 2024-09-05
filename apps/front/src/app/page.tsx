import { DashboardChartEvents } from "@/components/dashboard/charts/events";
import { Subtitle } from "@/components/text/subtitle";

export default function Home() {
  return (
    <main>
      <Subtitle text="Dashboard" />
      <h3 className="mb-4 text-stone-500">
        welcome!
      </h3>
      <div className="flex flex-wrap">
        <DashboardChartEvents />
        <DashboardChartEvents />
        <DashboardChartEvents />
      </div>
    </main>
  );
}
