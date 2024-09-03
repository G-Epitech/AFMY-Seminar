"use client";

import { CustomerProfile } from "@/components/customer/profile";
import { Subtitle } from "@/components/text/subtitle";
import {
    AstrologicalSign,
    Customer,
    Employee,
    Encounter,
    EncounterStatus,
    Gender,
    MeetingEvent,
    Payment,
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

    const encounters: Encounter[] = [];
    const payments: Payment[] = [];

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

            <div className="py-6">
                <CustomerProfile
                    customer={customer}
                    coach={coach}
                    totalEncounters={totalEncounters}
                    positiveEncounters={positiveEncounters}
                    inProgressEncounters={inProgressEncounters}
                />
            </div>
        </main>
    );
}
