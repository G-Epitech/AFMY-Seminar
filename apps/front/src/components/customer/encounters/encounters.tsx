"use client"

import { Encounter } from "@seminar/common";
import { EncounterProps, columns } from "./columns";
import { DataTable } from "./data-table";
import { HeartIcon } from "@heroicons/react/24/solid";

export function EncountersList({ encounters }: { encounters: Encounter[] }) {
    const data: EncounterProps[] = encounters.map((encounter) => ({
        date: encounter.date,
        rating: encounter.rating,
        comment: encounter.comment,
        source: encounter.source,
    }));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-1 items-center">
                <h3 className="text-sm font-semibold">Recent Meetings</h3>
                <HeartIcon className="size-4 text-primary" />
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
