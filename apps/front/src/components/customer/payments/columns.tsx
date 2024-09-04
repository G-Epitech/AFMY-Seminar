"use client";

import { Payment, PaymentMethod } from "@seminar/common";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";

export type PaymentProps = {
    date: Payment["date"];
    method: Payment["method"];
    amount: Payment["amount"];
    comment: Payment["comment"];
};

const paymentIcon: { [key: string]: any } = {
    "Paypal": () => <i className="fa-brands fa-paypal fa-lg" />,
    "Credit Card": () => <i className="fa-brands fa-cc-visa fa-lg" />,
    "Bank Transfer": () => <i className="fa-solid fa-building-columns fa-lg" />,
};

export const columns: ColumnDef<PaymentProps>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const date = dateFormat(
                new Date(row.original.date),
                "dd mmm. yyyy"
            );

            return <p className="font-semibold">{date}</p>;
        },
    },
    {
        accessorKey: "method",
        header: "Payment Mathod",
        cell: ({ row }) => {
            return paymentIcon[row.original.method]();
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            return (
                <p className="font-semibold text-primary">
                    - ${row.original.amount.toFixed(2)}
                </p>
            );
        },
    },
    {
        accessorKey: "comment",
        header: "Comment",
    },
];
