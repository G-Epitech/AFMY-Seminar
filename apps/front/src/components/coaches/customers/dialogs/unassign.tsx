import { Customer, Employee } from "@seminar/common";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import api from "@/api";
import { useToast } from "@/hooks/use-toast";

interface CoachUnassignCustomerDialogProps {
  customer: Customer;
  coach: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerUnassigned: (customer: Customer) => void;
}

export function CoachUnassignCustomerDialog({
  customer,
  coach,
  open,
  onOpenChange,
  onCustomerUnassigned,
}: CoachUnassignCustomerDialogProps) {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { toast } = useToast();

  const unassignCustomer = async () => {
    if (isFetching) return;
    setIsFetching(true);
    const res = await api.customers.update(customer.id, {
      coachId: null,
    });
    if (res && res.ok) {
      onCustomerUnassigned(res.data);
      toast({
        variant: "default",
        title: "Customer unassigned",
        description: `${customer.name} ${customer.surname} has been unassigned from ${coach.name}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed to unassign customer",
        description: "An error occurred while trying to unassign the customer.",
      });
    }
    setIsFetching(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You will unassign {customer.name} {customer.surname} from{" "}
            {coach.name} {coach.surname}'s customers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isFetching}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isFetching} onClick={unassignCustomer}>
            {isFetching ? "Unassigning..." : "Unassign"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
