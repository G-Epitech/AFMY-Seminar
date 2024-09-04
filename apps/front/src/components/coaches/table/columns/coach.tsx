import { Coach } from "@/types/coach";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const coachColumn: ColumnDef<Coach> = {
  accessorKey: "coach",
  header: "Coach",
  cell: ({ row }) => {
    const firstName = row.original.firstName || ""
    const lastName = row.original.lastName || ""
    const picture = row.original.picture

    return <div className="flex items-center">
      <Avatar>
        <AvatarImage src={picture} alt={`${firstName} ${lastName}`} />
        <AvatarFallback>
          {firstName.length ? firstName[0] : ''}
          {lastName.length ? lastName[0] : ''}
        </AvatarFallback>
      </Avatar>
      <div className="capitalize ms-3">{`${firstName} ${lastName}`}</div>
    </div>
  },
}
