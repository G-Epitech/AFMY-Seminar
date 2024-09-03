import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Coach } from "..";
import { Checkbox } from "@/components/ui/checkbox";

export interface CoachesTableHeaderProps {
  coaches: Coach[];
  selectedCoaches: Coach[];
  handleSelectAllCoaches: () => void;
}

export default function CoachesTableHeader(
  { coaches, selectedCoaches, handleSelectAllCoaches }: CoachesTableHeaderProps
) {
  return <TableHeader>
    <TableRow>
      <TableHead>
        <Checkbox onClick={handleSelectAllCoaches} checked={selectedCoaches.length === coaches.length} />
      </TableHead>
      <TableHead>
        Coach
      </TableHead>
      <TableHead>
        Email
      </TableHead>
      <TableHead>
        Phone
      </TableHead>
      <TableHead>
        Number of Customers
      </TableHead>
      <TableHead>
        Actions
      </TableHead>
    </TableRow>
  </TableHeader>
} 