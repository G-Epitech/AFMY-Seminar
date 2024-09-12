import { Employee } from "@seminar/common";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export const coachColumn: ColumnDef<Employee> = {
  accessorKey: "coach",
  header: "Coach",
  cell: ({ row }) => {
    const firstName = row.original.surname;
    const lastName = row.original.name;
    const picture = row.original.photo || "";

    return (
      <div className="flex items-center">
        <Link
          href={`/coaches/${row.original.id}`}
          passHref
          className="flex items-center"
        >
          <Avatar>
            <AvatarImage src={picture} alt={`${firstName} ${lastName}`} />
            <AvatarFallback>
              {firstName.length ? firstName[0] : ""}
              {lastName.length ? lastName[0] : ""}
            </AvatarFallback>
          </Avatar>
          <div className="capitalize ms-3">{`${firstName} ${lastName}`}</div>
        </Link>
      </div>
    );
  },
};
