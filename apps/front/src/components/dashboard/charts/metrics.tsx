import { arrowIcons } from "@/components/icons/events";

export interface DashboardMetricsProps {
  title: string;
  number: number | null;
  performance?: number;
}

export function DashbordMetrics({
  title,
  number,
  performance,
}: DashboardMetricsProps) {
  console.log("DashboardMetricsProps", { title, number, performance });
  return (
    <div className="flex flex-col items-center gap-1 px-4 pb-3 sm:pb-4">
      <div className="text-sm text-text-secondary text-center">{title}</div>
      <div className="text-lg font-semibold">
        {number ? (Number.isInteger(number) ? number : number.toFixed(2)) : "-"}
      </div>
      {performance !== undefined && (
        <div
          className={`text-sm ${performance !== 0 ? (performance >= 0 ? "text-green-500" : "text-red-500") : ""}`}
        >
          {performance !== 0
            ? performance >= 0
              ? arrowIcons["up"]()
              : arrowIcons["down"]()
            : null}
          <span className="ml-1">{performance.toFixed(2)}%</span>
        </div>
      )}
    </div>
  );
}
