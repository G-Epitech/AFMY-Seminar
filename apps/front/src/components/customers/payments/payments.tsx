"use client"

import { Payment } from "@seminar/common";
import { PaymentProps, columns } from "./columns";
import { DataTable } from "./data-table";
import { CreditCardIcon } from "@heroicons/react/24/solid";

export function PaymentsList({ payments }: { payments: Payment[] }) {
    const data: PaymentProps[] = payments.map((payment) => ({
        date: payment.date,
        method: payment.method,
        amount: payment.amount,
        comment: payment.comment,
    }));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-1 items-center">
                <h3 className="text-sm font-semibold">Payments history</h3>
                <CreditCardIcon className="size-4 text-primary" />
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    );
}
