"use client";

import { paymentIcons } from "@/components/icons/payments";
import { Payment } from "@seminar/common";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";

export type PaymentProps = {
  date: Payment["date"];
  method: Payment["method"];
  amount: Payment["amount"];
  comment: Payment["comment"];
};

export const columns: ColumnDef<PaymentProps>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = dateFormat(new Date(row.original.date), "dd mmm. yyyy");

      return <p className="font-semibold">{date}</p>;
    },
  },
  {
    accessorKey: "method",
    header: "Payment Method",
    cell: ({ row }) => {
      return paymentIcons[row.original.method]();
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <p
          className={
            (row.original.amount > 0 ? "text-primary" : "text-teal-400") +
            " font-semibold"
          }
        >
          {row.original.amount > 0
            ? `- \$${row.original.amount.toFixed(2)}`
            : `+ \$${Math.abs(row.original.amount).toFixed(2)}`}
        </p>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
  },
];
