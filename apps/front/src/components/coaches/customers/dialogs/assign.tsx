import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useMemo, useState } from "react";
import { Customer, Employee } from "@seminar/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/api";
import { useToast } from "@/hooks/use-toast";

interface CoachAssignCustomerDialogProps {
  coach: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerAssigned: (customer: Customer) => void;
}

function SelectedCustomerDetails({ customer }: { customer: Customer | null }) {
  const avatar = customer ? (
    <Avatar>
      <AvatarImage src={customer.photo || ""} />
      <AvatarFallback>
        {customer ? `${customer.name[0]}${customer.surname[0]}` : ""}
      </AvatarFallback>
    </Avatar>
  ) : (
    <Skeleton className="w-12 h-12 rounded-full animate-none" />
  );
  const name = customer ? (
    <h2 className="font-semibold">{`${customer.name} ${customer.surname}`}</h2>
  ) : (
    <Skeleton className="w-56 h-4 animate-none" />
  );
  const email = customer ? (
    <p className={"text-sm"}>{customer.email}</p>
  ) : (
    <Skeleton className="max-w-48 h-3 animate-none" />
  );
  return (
    <div className={"flex flex-row gap-4 items-center"}>
      {avatar}
      <div className={"flex flex-col gap-1 justify-center"}>
        {name}
        {email}
      </div>
    </div>
  );
}

export function CoachAssignCustomerDialog({
  coach,
  open,
  onOpenChange,
  onCustomerAssigned,
}: CoachAssignCustomerDialogProps) {
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [customers, setCustomers] = React.useState<{ [id: number]: Customer }>(
    [],
  );
  const [areCustomersLoading, setAreCustomersLoading] = React.useState(true);
  const [input, setInput] = React.useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const fetchCustomers = async (name?: string) => {
    const res = await api.customers.list({ name, page: 0, size: 1000 });
    if (res && res.ok) {
      const newCustomers = { ...customers };
      for (const newCustomer of res.data.items) {
        newCustomers[newCustomer.id] = newCustomer;
      }
      setCustomers(newCustomers);
    }
    setAreCustomersLoading(false);
  };

  const assignCustomer = async () => {
    if (!customer) return;
    setIsAssigning(true);
    const res = await api.customers.update(customer.id, {
      coachId: coach.id,
    });
    if (!res || !res.ok) {
      toast({
        variant: "destructive",
        title: "Failed to assign customer",
        description: "An error occurred while trying to assign the customer.",
      });
      setIsAssigning(false);
      return;
    }

    const newCustomers = { ...customers };

    newCustomers[customer.id] = res.data;

    onOpenChange(false);
    toast({
      variant: "default",
      title: "Customer assigned",
      description: `${customer.name} ${customer.surname} has been assigned to ${coach.name}`,
    });
    setCustomers(newCustomers);
    setIsAssigning(false);
    onCustomerAssigned(newCustomers[customer.id]);
  };

  const memoizedCustomers = useMemo(() => {
    const nonAlreadyAssigned = Object.entries(customers).filter(
      ([, c]) => c.coachId !== coach.id,
    );
    return Object.fromEntries(nonAlreadyAssigned);
  }, [customers]);

  useEffect(() => {
    if (open) {
      setCustomer(null);
      setInput("");
    }
  }, [open]);

  useEffect(() => {
    setAreCustomersLoading(true);
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (areCustomersLoading || !input || !input.trim().length) return;
    setAreCustomersLoading(true);
    fetchCustomers(input);
  }, [input]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader className={"px-1"}>
          <DialogTitle>Assign a new customer</DialogTitle>
          <DialogDescription>
            Choose a new customer to assign to {coach.name}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="min-h-42">
          <div className="w-full flex flex-col gap-2 items-center px-1">
            <AutoComplete
              options={Object.values(memoizedCustomers).map((c) => ({
                value: c.id.toString(),
                label: `${c.name} ${c.surname}`,
              }))}
              emptyMessage="No customers availables."
              placeholder="Select customer"
              isLoading={areCustomersLoading}
              onValueChange={(o) =>
                !areCustomersLoading &&
                setCustomer(
                  Object.values(memoizedCustomers).find(
                    (c) => c.id.toString() === o.value,
                  ) || null,
                )
              }
              value={
                customer
                  ? {
                      value: customer.id.toString(),
                      label: `${customer.name} ${customer.surname}`,
                    }
                  : undefined
              }
              inputValue={input}
              setInputValue={setInput}
              className="w-full"
              disabled={isAssigning}
            />
            <Card className={"w-[80%] p-4 flex-shrink my-8"}>
              <SelectedCustomerDetails customer={customer} />
            </Card>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!customer || isAssigning}
            onClick={assignCustomer}
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
