import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Clothe, ClotheType } from "@seminar/common"
import * as React from "react"

export interface CustomerItemsProps {
  type: ClotheType,
  clothes: Clothe[],
  selectedItemId: Record<ClotheType, number | null>,
  setSelectedItemId: React.Dispatch<React.SetStateAction<Record<ClotheType, number | null>>>
}

export function CustomerClosetItems(
  { type, clothes: items, selectedItemId, setSelectedItemId }: CustomerItemsProps
) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{type}</h2>
      <div className="flex flex-wrap justify-normal">
        {items.length === 0 &&
          <p className="ml-2">No items found</p>
        }
        {items.map(item => (
          <div
            key={item.id}
            className={`w-60 sm:w-48 relative p-1 rounded-md border-4 border-white ${selectedItemId[type] === item.id ? 'border-orange-500' : ''}`}
            onClick={() => setSelectedItemId(prev => ({ ...prev, [type]: prev[type] === item.id ? null : item.id }))}
          >
            <Card>
              <CardContent className="p-0">
                <img src={item.image} alt={item.type} className="w-full rounded-md" />
              </CardContent>
              <Checkbox
                checked={selectedItemId[type] === item.id}
                className="absolute top-2 right-2"
              />
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
