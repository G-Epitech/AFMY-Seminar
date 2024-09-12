import { Customer, Employee } from "@seminar/common";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

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
    <div className="flex flex-col text-sm py-2 w-[70%]">
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

export function CustomerProfile({
  customer,
  coach,
  totalEncounters,
  positiveEncounters,
  inProgressEncounters,
}: {
  customer: Customer;
  coach: Employee;
  totalEncounters: number;
  positiveEncounters: number;
  inProgressEncounters: number;
}) {
  return (
    <Card className="lg:basis-1/4">
      <CardHeader className="flex flex-col gap-2 items-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={customer.photo || undefined} />
          <AvatarFallback>{customer.name[0]}</AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h3 className="font-semibold text-lg">{customer.name}</h3>
          <p className="text-sm font-light text-stone-500">
            {customer.description}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <Separator className="mb-6" />

        <div className="grid grid-cols-3 justify-center text-center">
          <div className="flex flex-col gap-1 items-center">
            <h3 className="font-semibold text-lg">{totalEncounters}</h3>
            <p className="text-stone-500 text-sm">Total Encounters</p>
          </div>

          <div className="flex flex-col gap-1 items-center">
            <h3 className="font-semibold text-lg">{positiveEncounters}</h3>
            <p className="text-stone-500 text-sm">Positives</p>
          </div>

          <div className="flex flex-col gap-1 items-center">
            <h3 className="font-semibold text-lg">{inProgressEncounters}</h3>
            <p className="text-stone-500 text-sm">In Progress</p>
          </div>
        </div>

        <Separator className="my-6" />

        <h3 className="text-sm font-semibold mb-2">Short details</h3>
        <ShortDetail label="User ID" value={customer.id.toString()} />
        <ShortDetail
          label="Email"
          value={customer.email}
          link={"mailto:" + customer.email}
        />
        <ShortDetail
          label="Address"
          value={customer.address || "Info unavailable"}
        />
        <ShortDetail label="Last Activity" value={"Info unavailable"} />
        <ShortDetail
          label="Coach"
          value={coach.name}
          link={"/coachs/" + coach.id}
        />
      </CardContent>
    </Card>
  );
}
