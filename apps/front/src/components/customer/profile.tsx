import { Customer, Employee } from "@seminar/common";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

function ShortDetail({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col text-sm py-2 w-[70%]">
            <p className="text-gray-500">{label}:</p>
            <p>{value}</p>
        </div>
    )
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
        <Card className="lg:w-[30%]">
            <CardHeader className="flex flex-col gap-2 items-center">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={customer.photo || undefined} />
                    <AvatarFallback>{customer.name[0]}</AvatarFallback>
                </Avatar>

                <h3 className="font-semibold text-lg">{customer.name}</h3>
            </CardHeader>

            <CardContent>
                <Separator className="mb-6" />

                <div className="grid grid-cols-3 justify-center text-center">
                    <div className="flex flex-col gap-1 items-center">
                        <h3 className="font-semibold text-lg">
                            {totalEncounters}
                        </h3>
                        <p className="text-gray-500 text-sm">Total Encounters</p>
                    </div>

                    <div className="flex flex-col gap-1 items-center">
                        <h3 className="font-semibold text-lg">
                            {positiveEncounters}
                        </h3>
                        <p className="text-gray-500 text-sm">Positives</p>
                    </div>

                    <div className="flex flex-col gap-1 items-center">
                        <h3 className="font-semibold text-lg">
                            {inProgressEncounters}
                        </h3>
                        <p className="text-gray-500 text-sm">In Progress</p>
                    </div>
                </div>

                <Separator className="my-6" />

                <h3 className="text-sm font-semibold mb-2">Short details</h3>
                <ShortDetail label="User ID" value={customer.id.toString()} />
                <ShortDetail label="Email" value={customer.email} />
                <ShortDetail label="Address" value={customer.address || "Info unavailable"} />
                <ShortDetail label="Last Activity" value={"Info unavailable"} />
                <ShortDetail label="Coach" value={coach.name} />
            </CardContent>
        </Card>
    );
}
