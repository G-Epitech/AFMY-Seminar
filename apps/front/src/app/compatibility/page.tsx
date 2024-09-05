"use client";

import { CompatibilitySelectUser } from "@/components/compatibility/select";
import { Subtitle } from "@/components/text/subtitle";
import { Card, CardHeader } from "@/components/ui/card";
import { Customer } from "@seminar/common";
import { useState } from "react";

export default function CompatibilityPage() {
    const [customerA, setCustomerA] = useState<Customer | null>(null);
    const [customerB, setCustomerB] = useState<Customer | null>(null);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isCustomerLoading, setIsCustomerLoading] = useState(true);

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
                            isCustomerLoading
                        />
                        <i
                            className="fa-sharp fa-solid fa-wave-pulse fa-2xl"
                            style={{ color: "#f97316" }}
                        />
                        <CompatibilitySelectUser
                            customer={customerB}
                            setCustomer={setCustomerB}
                            customers={customers}
                            isCustomerLoading
                        />
                    </div>
                </CardHeader>
            </Card>
        </main>
    );
}
