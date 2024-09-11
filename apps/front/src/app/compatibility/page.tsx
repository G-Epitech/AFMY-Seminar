"use client";

import api from "@/api";
import { CompatibilitySelectUser } from "@/components/compatibility/select";
import { Subtitle } from "@/components/text/subtitle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AstrologicalSign, Compatibility, Customer } from "@seminar/common";
import { useEffect, useState } from "react";
import { RoundChart } from "./round";
import { Radar } from "./radar";
import { ZodiacSign } from "@/components/compatibility/zodiac-sign";

export default function CompatibilityPage() {
  const [customerA, setCustomerA] = useState<Customer | null>(null);
  const [inputA, setInputA] = useState("");
  const [customerB, setCustomerB] = useState<Customer | null>(null);
  const [inputB, setInputB] = useState("");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomerLoading, setIsCustomerLoading] = useState(true);

  const [compatibility, setCompatibility] = useState<Compatibility | null>(
    null,
  );

  const fetchCustomers = async (name?: string) => {
    const customers = await api.customers.list({
      page: 1,
      size: 10,
      name: name || undefined,
    });

    if (!customers || !customers.ok) return;

    setCustomers(customers.data.items);
    setIsCustomerLoading(false);
  };

  const fetchCompatibility = async () => {
    if (!customerA || !customerB) return;

    const compatibility = await api.customers.compatibility(
      customerA.id,
      customerB.id,
    );

    if (!compatibility || !compatibility.ok) return;

    setCompatibility(compatibility.data.compatibility);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (isCustomerLoading) return;
    setIsCustomerLoading(true);
    fetchCustomers(inputA);
  }, [inputA]);

  useEffect(() => {
    if (isCustomerLoading) return;
    setIsCustomerLoading(true);
    fetchCustomers(inputB);
  }, [inputB]);

  useEffect(() => {
    setIsCustomerLoading(true);
    fetchCustomers();

    if (!customerA || !customerB) {
      setCompatibility(null);
      return;
    }

    fetchCompatibility();
  }, [customerA, customerB]);

  return (
    <main>
      <Subtitle text="Astrological Compatibility" />

      <Card className="mt-6 overflow-hidden relative">
        <CardHeader>
          <div className="flex gap-10 items-center justify-center md:flex-row flex-col">
            <CompatibilitySelectUser
              customer={customerA}
              setCustomer={setCustomerA}
              customers={customers}
              isCustomerLoading={isCustomerLoading}
              input={inputA}
              setInput={setInputA}
            />
            <div className="absolute scale-[1000%] left-0 top-0 transform translate-x-36 translate-y-64 opacity-5">
              <ZodiacSign sign={customerA?.sign || AstrologicalSign.ARIES} />
            </div>
            <i
              className="fa-sharp fa-solid fa-wave-pulse fa-2xl"
              style={{ color: "#f97316" }}
            />
            <CompatibilitySelectUser
              customer={customerB}
              setCustomer={setCustomerB}
              customers={customers}
              isCustomerLoading={isCustomerLoading}
              input={inputB}
              setInput={setInputB}
            />
            <div className="absolute scale-x-[1000%] z-0 scale-y-[1000%] right-0 top-0 transform -translate-x-36 translate-y-64 opacity-5">
              <ZodiacSign sign={customerB?.sign || AstrologicalSign.ARIES} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <RoundChart
              score={compatibility?.score || 0}
              title="Global score"
            />
            <Radar
              data={[
                {
                  label: "Communication",
                  score: compatibility?.Communication || 0,
                },
                {
                  label: "Sex",
                  score: compatibility?.Sex || 0,
                },
                {
                  label: "Overall",
                  score: compatibility?.Overall || 0,
                },
                {
                  label: "Mariage",
                  score: compatibility?.["Love & Mariage"] || 0,
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
