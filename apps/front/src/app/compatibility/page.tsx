"use client";

import api from "@/api";
import { CompatibilitySelectUser } from "@/components/compatibility/select";
import { Subtitle } from "@/components/text/subtitle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Compatibility, Customer } from "@seminar/common";
import { useEffect, useState } from "react";
import { OverallChart } from "./overall";

export default function CompatibilityPage() {
    const [customerA, setCustomerA] = useState<Customer | null>(null);
    const [inputA, setInputA] = useState("");
    const [customerB, setCustomerB] = useState<Customer | null>(null);
    const [inputB, setInputB] = useState("");

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isCustomerLoading, setIsCustomerLoading] = useState(true);

    const [compatibility, setCompatibility] = useState<Compatibility | null>(
        null
    );

    const fetchCustomers = async (name?: string) => {
        const customers = await api.customers.get(name);

        if (!customers || !customers.ok) return;

        setCustomers(customers.data.items);
        setIsCustomerLoading(false);
    };

    const fetchCompatibility = async () => {
        if (!customerA || !customerB) return;

        const compatibility = await api.customers.compatibility(
            customerA.id,
            customerB.id
        );

        if (!compatibility || !compatibility.ok) return;

        setCompatibility(compatibility.data.compatibility);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        fetchCustomers(inputA);
    }, [inputA]);

    useEffect(() => {
        fetchCustomers(inputB);
    }, [inputB]);

    useEffect(() => {
        if (!customerA || !customerB) {
            setCompatibility(null);
            return;
        }

        fetchCompatibility();
    }, [customerA, customerB]);

    return (
        <main>
            <Subtitle text="Astrological Compatibility" />

            <Card className="mt-6">
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
                    </div>
                </CardHeader>
                <CardContent>
                    {compatibility && (
                        <>
                            <OverallChart score={compatibility.Overall} />
                        </>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
