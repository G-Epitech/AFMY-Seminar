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
  };

  const fetchEncounters = async () => {
    const response = await api.customers.encounters.list(Number(id));
    if (response && response.data) {
      setEncounters(response.data.items);
    }
  };

  const fetchPayments = async () => {
    const response = await api.customers.payments.list(Number(id));
    if (response && response.data) {
      setPayments(response.data.items);
    }
  };

  const fetchCoach = async () => {
    if (customer && customer.coachId) {
      const response = await api.employees.get(customer.coachId);
      if (response && response.data) {
        setCoach(response.data);
      }
    } else {
      setCoach(null);
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchEncounters();
    fetchPayments();
  }, []);

  useEffect(() => {
    if (customer) fetchCoach();
  }, [customer]);

  const [coach, setCoach] = useState<Employee | null | "pending">("pending");

  const totalEncounters = encounters.length;
  const positiveEncounters = encounters.filter(
    (e) => e.rating && e.rating > 3,
  ).length;
  const inProgressEncounters = encounters.filter(
    (e) => e.status === EncounterStatus.PENDING,
  ).length;

  return (
    <main>
      <div className="flex justify-between">
        <Subtitle text="Customer Details" />
        <div className="flex gap-2">
          <Link href="/customers" className="ml-auto">
            <Button className="gap-2" variant="secondary">
              <ArrowLongLeftIcon className="size-5" />
              Back
            </Button>
          </Link>
          <Link
            href={"/customers/" + customer?.id + "/closet"}
            className="ml-auto"
          >
            <Button className="gap-2" variant="default">
              <i className="fas fa-clothes-hanger" />
              Closet
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-6 flex lg:flex-row flex-col gap-5">
        {customer && (
          <CustomerProfile
            customer={customer}
            coach={coach}
            totalEncounters={totalEncounters}
            positiveEncounters={positiveEncounters}
            inProgressEncounters={inProgressEncounters}
          />
        )}

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
