"use client";

import { CustomerItems } from "@/components/customers/closet/items";
import { Subtitle } from "@/components/text/subtitle";
import { Clothe, ClotheType, Customer } from "@seminar/common";
import { useEffect, useState } from "react";

export default function ClosetPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bottoms, setBottoms] = useState<Clothe[]>([]);
  const [tops, setTops] = useState<Clothe[]>([]);
  const [hatCaps, setHatCaps] = useState<Clothe[]>([]);
  const [shoes, setShoes] = useState<Clothe[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState(
    temporaryClothes.reduce((acc, c) => {
      acc[c.type] = null;
      return acc;
    }, {} as Record<ClotheType, number | null>)
  );

  useEffect(() => {
    console.log(selectedItemIds);
  }, [selectedItemIds]);

  useEffect(() => {
    const updatedUrlsClothes = temporaryClothes.map(c => {
      c.image = `https://picsum.photos/400/534?random=${c.id}`;
      return c;
    });
    setBottoms(updatedUrlsClothes.filter(c => c.type === ClotheType.BOTTOM));
    setTops(updatedUrlsClothes.filter(c => c.type === ClotheType.TOP));
    setHatCaps(updatedUrlsClothes.filter(c => c.type === ClotheType.HAT_CAP));
    setShoes(updatedUrlsClothes.filter(c => c.type === ClotheType.SHOES)); 
  }, []);
  return (
    <main className="">
      <Subtitle text={`${customer ? customer.surname : "Customer"} Closet`} />
      <div>
        <CustomerItems
          type={ClotheType.HAT_CAP}
          items={hatCaps}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
        />
        <CustomerItems
          type={ClotheType.TOP}
          items={tops}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
        />
        <CustomerItems
          type={ClotheType.BOTTOM}
          items={bottoms}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
        />
        <CustomerItems
          type={ClotheType.SHOES}
          items={shoes}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
        />
      </div>
    </main>
  );
}

const temporaryClothes: Clothe[] = [
  {
    id: 1,
    legacyId: 1,
    type: ClotheType.BOTTOM,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 2,
    legacyId: 2,
    type: ClotheType.TOP,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 3,
    legacyId: 3,
    type: ClotheType.HAT_CAP,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 4,
    legacyId: 4,
    type: ClotheType.SHOES,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 5,
    legacyId: 5,
    type: ClotheType.BOTTOM,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 6,
    legacyId: 6,
    type: ClotheType.TOP,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 7,
    legacyId: 7,
    type: ClotheType.HAT_CAP,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 8,
    legacyId: 8,
    type: ClotheType.SHOES,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 9,
    legacyId: 9,
    type: ClotheType.BOTTOM,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 10,
    legacyId: 10,
    type: ClotheType.TOP,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 11,
    legacyId: 12,
    type: ClotheType.BOTTOM,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 12,
    legacyId: 12,
    type: ClotheType.BOTTOM,
    image: "https://picsum.photos/400/534",
  },
  {
    id: 13,
    legacyId: 13,
    type: ClotheType.BOTTOM,
    image: "https://picsum.photos/400/534",
  },
];
