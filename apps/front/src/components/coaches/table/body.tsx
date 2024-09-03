import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Coach } from "..";

export interface CoachesTableBodyProps {
  displayedCoaches: Coach[];
  selectedCoaches: Coach[];
  handleSelectCoach: (coach: Coach) => void;
}

export default function CoachesTableBody(
  { displayedCoaches, selectedCoaches, handleSelectCoach }: CoachesTableBodyProps
) {
  return <TableBody>
  {displayedCoaches.map((coach) => (
    <TableRow key={coach.id}>
      <TableCell>
        <Checkbox checked={selectedCoaches.includes(coach)} onClick={() => handleSelectCoach(coach)} />
      </TableCell>
      <TableCell>
        <div className='flex items-center'>
          <Avatar>
            <AvatarImage src={coach.picture} alt={`${coach.firstName} ${coach.lastName}`} />
            <AvatarFallback>
              {coach.firstName[0]}{coach.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <p className='ms-3'>{coach.firstName} {coach.lastName}</p>
        </div>
      </TableCell>
      <TableCell>
        {coach.email}
      </TableCell>
      <TableCell>
        {coach.phone}
      </TableCell>
      <TableCell>
        {coach.numberOfCustomers}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
}