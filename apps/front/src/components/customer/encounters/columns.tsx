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
    "Dating App": "bg-pink-500",
    "Friends": "bg-green-500",
    "Social Network": "bg-blue-500",
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
                        <StarIcon key="star" className="size-4 text-primary"/>
                    ))}
                    {Array.from({ length: 5 - rating }).map((_, i) => (
                        <StarIconOut key="star" className="size-4 text-primary"/>
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
                    <p className="font-medium">{row.original.source}</p>
                </div>
            )
        }
    }
]
