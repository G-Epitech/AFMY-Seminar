import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Clothe, ClotheType } from "@seminar/common"

export interface CustomerClosetItemsProps {
  clothes: Clothe[],
  selectedItemId: Record<string, number | null>,
}

export function CustomerClosetCombination(
  { clothes, selectedItemId }: CustomerClosetItemsProps
) {
  const selectedClothes = clothes.filter(clothe => clothe.id === selectedItemId[clothe.type])
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">View combination</Button>
      </SheetTrigger>
      <SheetContent className="overflow-auto">
        <SheetHeader className="mb-3">
          <SheetTitle>Clothe combination</SheetTitle>
          <SheetDescription>
            Here you can see the combination of customer clothes.
          </SheetDescription>
        </SheetHeader>
        <SheetDescription>
          <div className="flex flex-col space-y-2">
            {[ClotheType.HAT_CAP, ClotheType.TOP, ClotheType.BOTTOM, ClotheType.SHOES].map(type => {
              const clothe = selectedClothes.find(c => c.type === type)
              if (!clothe) return null;
              return (
                <div key={type} className="flex flex-col items-center space-x-2">
                  <Label>{type}</Label>
                  <img src={clothe.image} alt={clothe.type} className="w-24 h-32 rounded-md" />
                </div>
              )
            })}
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  )
}
