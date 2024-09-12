import { Customer, Employee, Page, Permission } from "@seminar/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfiniteTable from "@/components/table/infinite";
import { customersColumns } from "./columns";
import api from "@/api";
import { useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { CoachAssignCustomerDialog } from "@/components/coaches/customers/dialogs";
import { useState } from "react";
import { CoachUnassignCustomerDialog } from "@/components/coaches/customers/dialogs/unassign";

export function CoachCustomers({
  coach,
  onCustomerAssigned,
  onCustomerUnassigned,
}: {
  coach: Employee;
  onCustomerAssigned: (customer: Customer) => void;
  onCustomerUnassigned: (customer: Customer) => void;
}) {
  async function fetchCoachCustomers(
    page: number,
    size: number,
  ): Promise<Page<Customer>> {
    const customers = await api.employees.customers(
      { id: coach.id },
      { page, size },
    );

    return {
      items: [],
      isLast: false,
      size: 0,
      index: 0,
      ...customers?.data,
    };
  }

  async function onCustomerAssignedMiddleware(customer: Customer) {
    setIsDialogAssignOpen(false);
    onCustomerAssigned(customer);
  }

  async function onCustomerUnassignedMiddleware(customer: Customer) {
    setIsDialogUnassignOpen(false);
    onCustomerUnassigned(customer);
  }

  const user = useAppSelector<Employee | null | undefined>(
    (state) => state.auth.user,
  );

  const [isDialogAssignOpen, setIsDialogAssignOpen] = useState(false);
  const [isDialogUnassignOpen, setIsDialogUnassignOpen] = useState(false);
  const [customerToUnassign, setCustomerToUnassign] =
    useState<Customer | null>();
  const columns = customersColumns((c) => {
    setCustomerToUnassign(c);
    setIsDialogUnassignOpen(true);
  });

  return (
    <>
      <CoachAssignCustomerDialog
        open={isDialogAssignOpen}
        onOpenChange={setIsDialogAssignOpen}
        coach={coach}
        onCustomerAssigned={onCustomerAssigned}
      />
      {customerToUnassign ? (
        <CoachUnassignCustomerDialog
          customer={customerToUnassign}
          coach={coach}
          open={isDialogUnassignOpen}
          onCustomerUnassigned={onCustomerUnassignedMiddleware}
          onOpenChange={setIsDialogUnassignOpen}
        />
      ) : null}
      <Card className="w-full" key="coach-customers-card">
        <CardHeader
          className={"flex-row flex-grow items-center justify-between"}
        >
          <CardTitle>Customers</CardTitle>
          {user?.permission === Permission.MANAGER ? (
            <Button size={"sm"} onClick={() => setIsDialogAssignOpen(true)}>
              Assign customer
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          <InfiniteTable
            fetchData={fetchCoachCustomers}
            fetchSize={10}
            columns={columns}
            state={{
              numberOfCustomers: coach.numberOfCustomers,
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
