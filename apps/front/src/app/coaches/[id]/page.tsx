"use client";

import api from "@/api";
import { Subtitle } from "@/components/text/subtitle";
import { Button } from "@/components/ui/button";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { Employee } from "@seminar/common";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CoachProfile } from "@/components/coaches/profile";
import { CoachCustomers } from "@/components/coaches/customers";

export default function CustomerPage() {
  const id = useParams().id;
  const [coach, setCoach] = useState<Employee | null>(null);

  const fetchCoach = async () => {
    const response = await api.employees.get(Number(id));
    if (response && response.data) {
      setCoach(response.data);
    }
  };

  useEffect(() => {
    fetchCoach();
  }, []);

  return (
    <main>
      <div className="flex">
        <Subtitle text="Coach Details" />
        <Link href="/coaches" className="ml-auto">
          <Button className="gap-2" variant="secondary">
            <ArrowLongLeftIcon className="size-5" />
            Back
          </Button>
        </Link>
      </div>

      <div className="py-6 flex lg:flex-row flex-col gap-5">
        {coach && <CoachProfile coach={coach} className="lg:basis-1/4" />}
        <div className="lg:basis/3-4 flex flex-col gap-3 grow ">
          {coach && <CoachCustomers coach={coach} />}
        </div>
      </div>
    </main>
  );
}
