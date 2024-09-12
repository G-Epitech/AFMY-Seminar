import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Clothe, ClotheType } from "@seminar/common";
import * as React from "react";
import { config } from "@/lib/config";

export interface CustomerItemsProps {
  type: ClotheType;
  clothes: Clothe[];
  selectedItemId: Record<ClotheType, number | null>;
  setSelectedItemId: React.Dispatch<
    React.SetStateAction<Record<ClotheType, number | null>>
  >;
  loading?: boolean;
}

export function CustomerClosetItems({
  type,
  clothes: items,
  selectedItemId,
  setSelectedItemId,
  loading = false,
}: CustomerItemsProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{type}</h2>
      <div className="flex flex-wrap justify-normal">
        {loading && (
          <>
            <Skeleton className="w-60 sm:w-36 h-48 mb-3 mr-3" />
            <Skeleton className="w-60 sm:w-36 h-48 mb-3 mr-3" />
            <Skeleton className="w-60 sm:w-36 h-48 mb-3 mr-3" />
            <Skeleton className="w-60 sm:w-36 h-48 mb-3 mr-3" />
          </>
        )}
        {loading === false && items.length === 0 && (
          <p className="ml-2">No items found</p>
        )}
        {items.map((item) => {
          if (!selectedItemId) {
            return null;
          }
          return (
            <div
              key={item.id}
              className={`w-60 sm:w-48 relative`}
              onClick={() =>
                setSelectedItemId((prev) => ({
                  ...prev,
                  [type]: prev[type] === item.id ? null : item.id,
                }))
              }
            >
              <div
                className={`p-1 rounded-md border-4 ${selectedItemId[type] === item.id ? "border-orange-500" : "border-white"}`}
              >
                <Card>
                  <CardContent className="p-0">
                    <img
                      src={config.api.url + item.image}
                      alt={item.type}
                      className="w-full rounded-md"
                    />
                  </CardContent>
                  <Checkbox
                    checked={selectedItemId[type] === item.id}
                    className="absolute top-4 right-4"
                  />
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
