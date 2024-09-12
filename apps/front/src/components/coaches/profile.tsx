import { Customer, Employee, Gender } from "@seminar/common";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

function getGenderLabel(gender: Gender): string {
  switch (gender) {
    case "FE":
      return "Woman";
    case "MA":
      return "Man";
    default:
      return "Other";
  }
}

function ShortDetail({
  label,
  value,
  link,
}: {
  label: string;
  value: string;
  link?: string;
}) {
  return (
    <div className="flex flex-col text-sm py-2">
      <p className="text-stone-500">{label}:</p>

      <div className="flex items-center gap-1">
        <p>{value}</p>
        {link && (
          <a href={link}>
            <ArrowTopRightOnSquareIcon className="size-4 stroke-[2px] stroke-primary" />
          </a>
        )}
      </div>
    </div>
  );
}

export function CoachProfile({
  coach,
  className,
}: {
  coach: Employee;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-2 items-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={coach.photo || undefined} />
          <AvatarFallback>{coach.name[0]}</AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h3 className="font-semibold text-lg">{coach.name}</h3>
          <p className="text-sm font-light text-stone-500">{coach.role}</p>
        </div>
      </CardHeader>

      <CardContent>
        <Separator className="mb-6" />

        <div className="grid grid-cols-1 justify-center text-center">
          <div className="flex flex-col gap-1 items-center">
            <h3 className="font-semibold text-lg">
              {!Number.isNaN(coach.numberOfCustomers)
                ? coach.numberOfCustomers
                : "-"}
            </h3>
            <p className="text-stone-500 text-sm">Total of customers</p>
          </div>
        </div>

        <Separator className="my-6" />
        <h3 className="text-sm font-semibold mb-2">Short details</h3>
        <ShortDetail label="User ID" value={coach.id.toString()} />
        <ShortDetail
          label="Email"
          value={coach.email}
          link={"mailto:" + coach.email}
        />
        <ShortDetail label="Gender" value={getGenderLabel(coach.gender)} />
        <ShortDetail
          label="Birth Date"
          value={new Date(coach.birthDate).toLocaleDateString()}
        />
        {coach.address && <ShortDetail label="Address" value={coach.address} />}
        {coach.phone && (
          <ShortDetail
            label="Phone"
            value={coach.phone}
            link={`tel:${coach.phone}`}
          />
        )}
      </CardContent>
    </Card>
  );
}
