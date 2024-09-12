"use client";

import api from "@/api";
import { Subtitle } from "@/components/text/subtitle";
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Tip } from "@seminar/common";
import { useEffect, useState } from "react";

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);

  const [selected, setSelected] = useState<number>(-1);

  const getTips = async () => {
    const tips = await api.tips.list();

    if (!tips || !tips.ok) return;

    setTips(tips.data.tips);
  };

  useEffect(() => {
    getTips();
  }, []);

  return (
    <main>
      <Subtitle text="Tips Coaches" />

      <div className="flex flex-col gap-1 mt-2">
        {tips.map((tip) => (
          <div className="w-full border rounded-sm" key={tip.id}>
            <div
              className="p-4 flex items-center"
              onClick={() => setSelected(selected === tip.id ? -1 : tip.id)}
            >
              <h3 className="text-md">{tip.title}</h3>
              <div className="ml-auto">
                {selected !== tip.id ? (
                  <ChevronDownIcon className="size-5 text-primary" />
                ) : (
                  <ChevronDownIcon className="size-5 text-primary transform rotate-180" />
                )}
              </div>
            </div>
            {selected === tip.id && (
              <div>
                <Separator />
                <div className="p-4">
                  <p className="text-sm">{tip.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
