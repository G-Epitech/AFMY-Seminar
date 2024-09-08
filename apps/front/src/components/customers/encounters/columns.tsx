"use client"

import { Encounter } from "@seminar/common";
import { ColumnDef } from "@tanstack/react-table";
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarIconOut } from '@heroicons/react/24/outline'

import dateFormat from "dateformat";

export type EncounterProps = {
    date: Encounter["date"];
    rating: Encounter["rating"];
    comment: Encounter['comment'];
    source: Encounter['source'];
}

const colors: {[key: string]: string} = {
    "dating app": "bg-pink-500",
    "friends": "bg-green-500",
    "social network": "bg-blue-500",
    "concert": "bg-yellow-500",
    "neighborhood": "bg-purple-500",
    "park": "bg-red-500",
    "school": "bg-indigo-500",
    "hobby group": "bg-cyan-500",
    "gym": "bg-rose-500",
}

export const columns: ColumnDef<EncounterProps>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const date = dateFormat(new Date(row.original.date), "dd mmm. yyyy");

            return <p className="font-semibold">{date}</p>
        },
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
            const rating = row.original.rating || 0;
            return (
                <div className="flex gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                        <StarIcon key={i} className="size-4 text-primary"/>
                    ))}
                    {Array.from({ length: 5 - rating }).map((_, i) => (
                        <StarIconOut key={i} className="size-4 text-primary"/>
                    ))}
                </div>
            )
        },
    },
    {
        accessorKey: "comment",
        header: "Report",
    },
    {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => {
            return (
                <div className="flex gap-2 items-center">
                    <div className={"border border-transparent rounded-sm size-3 " + (colors[row.original.source] || "bg-stone-500")}/>
                    <p className="font-medium capitalize">{row.original.source}</p>
                </div>
            )
        }
    }
]
