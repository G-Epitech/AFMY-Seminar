"use client";

import api from "@/api";
import { CustomerClosetCombination } from "@/components/customers/closet/combination";
import { CustomerClosetItems } from "@/components/customers/closet/items";
import { Subtitle } from "@/components/text/subtitle";
import { Clothe, ClotheType, Customer } from "@seminar/common";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClosetPage() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [clothes, setClothes] = useState<Clothe[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Record<ClotheType, number | null>>({
    [ClotheType.HAT_CAP]: null,
    [ClotheType.TOP]: null,
    [ClotheType.BOTTOM]: null,
    [ClotheType.SHOES]: null,
  });

  // This function must be updated in the future, after a talk with the backend team.
  const fetchCustomerClothes = async () => {
    await api.customers.list();
    const response = await api.customers.clothes({ id: parseInt(id) });
    console.log(response);
    if (response) {
      setClothes(response.data.items);
      setSelectedItemIds(response.data.items.reduce((acc, c) => {
        acc[c.type] = null;
        return acc;
      }, {} as Record<ClotheType, number | null>));
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCustomerClothes();
  }, []);

  return (
    <main>
      <Subtitle text={`${customer ? customer.surname : "Customer"} Closet`} />
      <div>
        <CustomerClosetItems
          type={ClotheType.HAT_CAP}
          clothes={clothes.filter(c => c.type === ClotheType.HAT_CAP)}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
          loading={loading}
        />
        <CustomerClosetItems
          type={ClotheType.TOP}
          clothes={clothes.filter(c => c.type === ClotheType.TOP)}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
          loading={loading}
        />
        <CustomerClosetItems
          type={ClotheType.BOTTOM}
          clothes={clothes.filter(c => c.type === ClotheType.BOTTOM)}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
          loading={loading}
        />
        <CustomerClosetItems
          type={ClotheType.SHOES}
          clothes={clothes.filter(c => c.type === ClotheType.SHOES)}
          selectedItemId={selectedItemIds}
          setSelectedItemId={setSelectedItemIds}
          loading={loading}
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
