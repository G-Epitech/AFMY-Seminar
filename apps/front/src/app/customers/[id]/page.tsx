"use client";

import { EncountersList } from "@/components/customers/encounters/encounters";
import { PaymentsList } from "@/components/customers/payments/payments";
import { CustomerProfile } from "@/components/customers/profile";
import { Subtitle } from "@/components/text/subtitle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    AstrologicalSign,
    Customer,
    Employee,
    Encounter,
    EncounterStatus,
    Gender,
    MeetingEvent,
    Payment,
    PaymentMethod,
    Permission,
} from "@seminar/common";
import { useParams } from "next/navigation";

export default function CustomerPage() {
    const id = useParams().id;

    const customer: Customer = {
        id: Number(id),
        email: "francis.mitcham@tmail.com",
        name: "Francis Mitcham",
        surname: "Francis",
        description: "Sexy and attractive 😏",
        birthDate: new Date("1990-01-01"),
        gender: Gender.MA,
        sign: AstrologicalSign.CAPRICORN,
        phone: "+1 234 567 890",
        photo: "https://media.discordapp.net/attachments/1126062012456243201/1280542247812731014/508aa1a0-923b-49b1-a38b-1b05a7c1571d.png?ex=66d87567&is=66d723e7&hm=a313bd00ddf8d799f6c561f5ba67335a50ab2657180eb0517ee4bc12ec0773be&=",
        address: "551 Swanson Street, Melbourne, Victoria 3053 Australia",
        coachId: 2,
        createdAt: new Date("2022-01-01"),
    };

    const coach: Employee = {
        id: 2,
        email: "nicolas.latourne@soul.com",
        name: "Nicolas Latourne",
        surname: "Nico",
        birthDate: new Date("1990-01-01"),
        gender: Gender.MA,
        phone: "+1 234 567 890",
        photo: "https://cdn.discordapp.com/attachments/1126062012456243201/1280544189242937376/bdc2a41d-eb9b-4976-8492-b9aebdec396e.png?ex=66d87736&is=66d725b6&hm=3dfdb46deb0a4c9362dfbb905e244e56c9b80c32e7e7684974a293802e4f10c8&",
        address: "551 Swanson Street, Melbourne, Victoria 3053 Australia",
        permission: Permission.COACH,
        role: "Coach",
    };

    const encounters: Encounter[] = [
        {
            id: 1,
            rating: 4,
            comment: "Great session, very insightful",
            customerId: customer.id,
            date: new Date("2024-07-23"),
            status: EncounterStatus.DONE,
            source: "Dating App",
            isPositive: true,
        },
        {
            id: 2,
            rating: 3,
            comment: "Not bad, but could be better",
            customerId: customer.id,
            date: new Date("2024-07-21"),
            status: EncounterStatus.DONE,
            source: "Friends",
            isPositive: false,
        },
        {
            id: 3,
            rating: 0,
            comment: "I don't know what to say, it was very awkward",
            customerId: customer.id,
            date: new Date("2024-06-19"),
            status: EncounterStatus.DONE,
            source: "Dating App",
            isPositive: false,
        },
        {
            id: 4,
            rating: 2,
            comment: "Not a good match",
            customerId: customer.id,
            date: new Date("2024-06-02"),
            status: EncounterStatus.DONE,
            source: "Dating App",
            isPositive: false,
        },
        {
            id: 5,
            rating: 3,
            comment: "Not bad, but could be better",
            customerId: customer.id,
            date: new Date("2024-05-12"),
            status: EncounterStatus.DONE,
            source: "Social Network",
            isPositive: true,
        },
        {
            id: 5,
            rating: 1,
            comment: "Not bad, but could be better",
            customerId: customer.id,
            date: new Date("2024-05-12"),
            status: EncounterStatus.DONE,
            source: "Other",
            isPositive: true,
        },
    ];

    const payments: Payment[] = [
        {
            id: 1,
            customerId: customer.id,
            date: new Date("2024-07-20"),
            method: PaymentMethod.CREDIT_CARD,
            amount: 49,
            comment: "Monthly Subscription",
        },
        {
            id: 2,
            customerId: customer.id,
            date: new Date("2024-06-20"),
            method: PaymentMethod.CREDIT_CARD,
            amount: 49,
            comment: "Monthly Subscription",
        },
        {
            id: 2,
            customerId: customer.id,
            date: new Date("2024-06-12"),
            method: PaymentMethod.BANK_TRANSFER,
            amount: 15.99,
            comment: "Training bonus",
        },
        {
            id: 3,
            customerId: customer.id,
            date: new Date("2024-05-20"),
            method: PaymentMethod.CREDIT_CARD,
            amount: 49,
            comment: "Monthly Subscription",
        },
        {
            id: 4,
            customerId: customer.id,
            date: new Date("2024-04-20"),
            method: PaymentMethod.PAYPAL,
            amount: 49,
            comment: "Monthly Subscription",
        },
        {
            id: 5,
            customerId: customer.id,
            date: new Date("2024-03-20"),
            method: PaymentMethod.PAYPAL,
            amount: 49,
            comment: "Monthly Subscription",
        },
    ];

    const totalEncounters = encounters.length;
    const positiveEncounters = encounters.filter(
        (e) => e.rating && e.rating > 3
    ).length;
    const inProgressEncounters = encounters.filter(
        (e) => e.status === EncounterStatus.PENDING
    ).length;

    return (
        <main>
            <Subtitle text="Customer Details" />

            <div className="py-6 flex lg:flex-row flex-col gap-5">
                <CustomerProfile
                    customer={customer}
                    coach={coach}
                    totalEncounters={totalEncounters}
                    positiveEncounters={positiveEncounters}
                    inProgressEncounters={inProgressEncounters}
                />

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
