import { Customer, Employee, Page, Permission } from "@seminar/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfiniteTable from "@/components/table/infinite";
import { customersColumns } from "./columns";
import api from "@/api";
import { useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { CoachAssignCustomerDialog } from "@/components/coaches/customers/dialogs";
import { useState } from "react";

export function CoachCustomers({
  coach,
  onCustomerAssigned,
}: {
  coach: Employee;
  onCustomerAssigned: (customer: Customer) => void;
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

  const user = useAppSelector<Employee | null | undefined>(
    (state) => state.auth.user,
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <CoachAssignCustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        coach={coach}
        onCustomerAssigned={onCustomerAssigned}
      />
      <Card className="w-full" key="coach-customers-card">
        <CardHeader
          className={"flex-row flex-grow items-center justify-between"}
        >
          <CardTitle>Customers</CardTitle>
          {user?.permission === Permission.MANAGER ? (
            <Button size={"sm"} onClick={() => setIsDialogOpen(true)}>
              Assign customer
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          <InfiniteTable
            fetchData={fetchCoachCustomers}
            fetchSize={10}
            columns={customersColumns}
            state={{
              numberOfCustomers: coach.numberOfCustomers,
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
