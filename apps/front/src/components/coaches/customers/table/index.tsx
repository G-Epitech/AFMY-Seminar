import { Customer, Employee, Page, Permission } from "@seminar/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfiniteTable from "@/components/table/infinite";
import { customersColumns } from "./columns";
import api from "@/api";
import { useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";

export function CoachCustomers({ coach }: { coach: Employee }) {
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

  return (
    <Card className="w-full">
      <CardHeader className={"flex-row flex-grow items-center justify-between"}>
        <CardTitle>Customers</CardTitle>
        {user?.permission === Permission.MANAGER ? (
          <Button size={"sm"}>Assign customer</Button>
        ) : null}
      </CardHeader>
      <CardContent>
        <InfiniteTable
          fetchData={fetchCoachCustomers}
          fetchSize={10}
          columns={customersColumns}
        />
      </CardContent>
    </Card>
  );
}
