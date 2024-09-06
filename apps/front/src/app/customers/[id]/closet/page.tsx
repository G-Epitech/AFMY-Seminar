"use client";

import api from "@/api";
import { CustomerClosetCombination } from "@/components/customers/closet/combination";
import { CustomerClosetItems } from "@/components/customers/closet/items";
import { Subtitle } from "@/components/text/subtitle";
import { Clothe, ClotheType, Customer } from "@seminar/common";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClosetPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [clothes, setClothes] = useState<Clothe[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Record<ClotheType, number | null>>({
    [ClotheType.HAT_CAP]: null,
    [ClotheType.TOP]: null,
    [ClotheType.BOTTOM]: null,
    [ClotheType.SHOES]: null,
  });

  const fetchCustomers = async () => {
    const response = await api.customers.list();
    console.log(response);
    fetchCustomerClothes();
  }

  const fetchCustomerClothes = async () => {
    const response = await api.customers.clothes({ id: parseInt(id) });
    console.log(response);
    if (response) {
      setClothes(response.data.items);
      setSelectedItemIds(response.data.items.reduce((acc, c) => {
              acc[c.type] = null;
              return acc;
            }, {} as Record<ClotheType, number | null>));
    }
  }

  useEffect(() => {
    // const updatedUrlsClothes = temporaryClothes.map(c => {
    //   c.image = `https://picsum.photos/400/534?random=${c.id}`;
    //   return c;
    // });
    // setClothes(updatedUrlsClothes);
    fetchCustomers();
    // fetchCustomerClothes();
  }, []);

  useEffect(() => {
    console.log(selectedItemIds);
  }, [selectedItemIds]);

  return (
    <main>
      <Subtitle text={`${customer ? customer.surname : "Customer"} Closet`} />
      <div>
        <CustomerClosetItems
          type={ClotheType.HAT_CAP}
          clothes={clothes.filter(c => c.type === ClotheType.HAT_CAP)}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
        />
        <CustomerClosetItems
          type={ClotheType.TOP}
          clothes={clothes.filter(c => c.type === ClotheType.TOP)}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
        />
        <CustomerClosetItems
          type={ClotheType.BOTTOM}
          clothes={clothes.filter(c => c.type === ClotheType.BOTTOM)}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
        />
        <CustomerClosetItems
          type={ClotheType.SHOES}
          clothes={clothes.filter(c => c.type === ClotheType.SHOES)}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
        />
      </div>
      <div className="flex w-full justify-center">
        <CustomerClosetCombination
          clothes={clothes}
          selectedItemId={selectedItemIds}
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
