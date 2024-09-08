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
  Gender,
  Permission,
  PhotoFormat,
} from "@seminar/common";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerPage() {
  const id = useParams().id;
  const [customer, setCustomer] = useState<Customer | null>(null);

  const fetchCustomer = async () => {
    const response = await api.customers.get(Number(id));
    console.log(response);
    if (response && response.data) {
      setCustomer(response.data);
    }
  }

  useEffect(() => {
    fetchCustomer();
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

  // const encounters: Encounter[] = [
  //   {
  //     id: 1,
  //     rating: 4,
  //     comment: "Great session, very insightful",
  //     customerId: customer.id,
  //     date: new Date("2024-07-23"),
  //     status: EncounterStatus.DONE,
  //     source: "Dating App",
  //     isPositive: true,
  //   },
  //   {
  //     id: 2,
  //     rating: 3,
  //     comment: "Not bad, but could be better",
  //     customerId: customer.id,
  //     date: new Date("2024-07-21"),
  //     status: EncounterStatus.DONE,
  //     source: "Friends",
  //     isPositive: false,
  //   },
  //   {
  //     id: 3,
  //     rating: 0,
  //     comment: "I don't know what to say, it was very awkward",
  //     customerId: customer.id,
  //     date: new Date("2024-06-19"),
  //     status: EncounterStatus.DONE,
  //     source: "Dating App",
  //     isPositive: false,
  //   },
  //   {
  //     id: 4,
  //     rating: 2,
  //     comment: "Not a good match",
  //     customerId: customer.id,
  //     date: new Date("2024-06-02"),
  //     status: EncounterStatus.DONE,
  //     source: "Dating App",
  //     isPositive: false,
  //   },
  //   {
  //     id: 5,
  //     rating: 3,
  //     comment: "Not bad, but could be better",
  //     customerId: customer.id,
  //     date: new Date("2024-05-12"),
  //     status: EncounterStatus.DONE,
  //     source: "Social Network",
  //     isPositive: true,
  //   },
  //   {
  //     id: 5,
  //     rating: 1,
  //     comment: "Not bad, but could be better",
  //     customerId: customer.id,
  //     date: new Date("2024-05-12"),
  //     status: EncounterStatus.DONE,
  //     source: "Other",
  //     isPositive: true,
  //   },
  // ];

  // const payments: Payment[] = [
  //   {
  //     id: 1,
  //     customerId: customer.id,
  //     date: new Date("2024-07-20"),
  //     method: PaymentMethod.CREDIT_CARD,
  //     amount: 49,
  //     comment: "Monthly Subscription",
  //   },
  //   {
  //     id: 2,
  //     customerId: customer.id,
  //     date: new Date("2024-06-20"),
  //     method: PaymentMethod.CREDIT_CARD,
  //     amount: 49,
  //     comment: "Monthly Subscription",
  //   },
  //   {
  //     id: 2,
  //     customerId: customer.id,
  //     date: new Date("2024-06-12"),
  //     method: PaymentMethod.BANK_TRANSFER,
  //     amount: 15.99,
  //     comment: "Training bonus",
  //   },
  //   {
  //     id: 3,
  //     customerId: customer.id,
  //     date: new Date("2024-05-20"),
  //     method: PaymentMethod.CREDIT_CARD,
  //     amount: 49,
  //     comment: "Monthly Subscription",
  //   },
  //   {
  //     id: 4,
  //     customerId: customer.id,
  //     date: new Date("2024-04-20"),
  //     method: PaymentMethod.PAYPAL,
  //     amount: 49,
  //     comment: "Monthly Subscription",
  //   },
  //   {
  //     id: 5,
  //     customerId: customer.id,
  //     date: new Date("2024-03-20"),
  //     method: PaymentMethod.PAYPAL,
  //     amount: 49,
  //     comment: "Monthly Subscription",
  //   },
  // ];

  // const totalEncounters = encounters.length;
  // const positiveEncounters = encounters.filter(
  //   (e) => e.rating && e.rating > 3
  // ).length;
  // const inProgressEncounters = encounters.filter(
  //   (e) => e.status === EncounterStatus.PENDING
  // ).length;

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
            totalEncounters={0}
            positiveEncounters={0}
            inProgressEncounters={0}
          />
        }

        <Card className="lg:basis-3/4 pt-4">
          <CardContent className="flex flex-col gap-5">
            <EncountersList encounters={[]} />
            <PaymentsList payments={[]} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
