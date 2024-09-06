import { arrowIcons } from "@/components/icons/events";

export interface DashboardMetricsProps {
  title: string;
  number: number;
  performance?: number;
}

export function DashbordMetrics(
  { title, number, performance }: DashboardMetricsProps
) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 pb-3 sm:pb-4">
      <div className="text-sm text-text-secondary">{title}</div>
      <div className="text-lg font-semibold">{number}</div>
      {performance !== undefined && <div className={`text-sm ${performance >= 0 ? "text-green-500" : "text-red-500"}`}>
        {performance >= 0 ? arrowIcons["up"]() : arrowIcons["down"]()}
        <span className="ml-1">
          {performance.toFixed(2)}%
        </span>
      </div>}
    </div>
  )
}

