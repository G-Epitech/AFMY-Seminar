import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@seminar/common"
import { paymentIcons } from "@/components/icons/payments";

export const paymentColumn: ColumnDef<Customer> = {
  accessorKey: "payment",
  header: "Payment Methods",
  cell: ({ row }) => {
    const paymentMethods = row.original.paymentMethods;
    if (!paymentMethods) return <div>Unknown</div>;
    return <div className="flex space-x-3">
      {paymentMethods.map((method) => (
        paymentIcons[method]()
      ))}
    </div>
  },
}
