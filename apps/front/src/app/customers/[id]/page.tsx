"use client";

import api from "@/api";
import { EncountersList } from "@/components/customers/encounters/encounters";
import { PaymentsList } from "@/components/customers/payments/payments";
import { CustomerProfile } from "@/components/customers/profile";
import { Subtitle } from "@/components/text/subtitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import {
  Customer,
  Employee,
  Encounter,
  EncounterStatus,
  Gender,
  Payment,
  Permission,
  PhotoFormat,
} from "@seminar/common";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerPage() {
  const id = useParams().id;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchCustomer = async () => {
    const response = await api.customers.get(Number(id));
    if (response && response.data) {
      setCustomer(response.data);
    }
  }

  const fetchEncounters = async () => {
    const response = await api.customers.encounters.list(Number(id));
    if (response && response.data) {
      setEncounters(response.data.items);
    }
  }

  const fetchPayments = async () => {
    const response = await api.customers.payments.list(Number(id));
    if (response && response.data) {
      setPayments(response.data.items);
    }
  }

  useEffect(() => {
    fetchCustomer();
    fetchEncounters();
    fetchPayments();
  }, []);

  const coach: Employee = {
    id: 2,
    email: "nicolas.latourne@soul.com",
    name: "Nicolas Latourne",
    surname: "Nico",
    birthDate: new Date("1990-01-01"),
    gender: Gender.MA,
    phone: "+1 234 567 890",
    photo: "/customers/1/photo",
    address: "551 Swanson Street, Melbourne, Victoria 3053 Australia",
    permission: Permission.COACH,
    role: "Coach",
    legacyId: 1,
    photoFormat: PhotoFormat.PNG,
  };

  const totalEncounters = encounters.length;
  const positiveEncounters = encounters.filter(
    (e) => e.rating && e.rating > 3
  ).length;
  const inProgressEncounters = encounters.filter(
    (e) => e.status === EncounterStatus.PENDING
  ).length;

  return (
    <main>
      <div className="flex">
        <Subtitle text="Customer Details" />
        <Link href="/customers" className="ml-auto">
          <Button className="gap-2" variant="secondary">
            <ArrowLongLeftIcon className="size-5" />
            Back
          </Button>
        </Link>
      </div>

      <div className="py-6 flex lg:flex-row flex-col gap-5">
        {customer &&
          <CustomerProfile
            customer={customer}
            coach={coach}
            totalEncounters={totalEncounters}
            positiveEncounters={positiveEncounters}
            inProgressEncounters={inProgressEncounters}
          />
        }

        <Card className="lg:basis-3/4 pt-4">
          <CardContent className="flex flex-col gap-5">
            <EncountersList encounters={encounters} />
            <PaymentsList payments={payments} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
