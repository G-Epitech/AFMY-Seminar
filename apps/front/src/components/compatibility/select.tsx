import { Customer } from "@seminar/common";
import { AutoComplete } from "../ui/autocomplete";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function CompatibilitySelectUser({
  customer,
  setCustomer,
  customers,
  isCustomerLoading,
  input,
  setInput,
}: {
  customer: Customer | null;
  setCustomer: (c: Customer | null) => void;
  customers: Customer[];
  isCustomerLoading: boolean;
  input: string;
  setInput: (value: string) => void;
}) {
  return (
    <div className="w-72 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar>
          {customer && <AvatarImage src={customer.photo || ""} />}
          <AvatarFallback>
            {customer ? `${customer.name[0]}${customer.surname[0]}` : ""}
          </AvatarFallback>
        </Avatar>
        <h2>
          {customer ? `${customer.name} ${customer.surname}` : "Not selected"}
        </h2>
      </div>
      <AutoComplete
        options={customers.map((c) => ({
          value: c.id.toString(),
          label: `${c.name} ${c.surname}`,
        }))}
        emptyMessage="No customers availables."
        placeholder="Select customer"
        isLoading={isCustomerLoading}
        onValueChange={(o) =>
          setCustomer(
            customers.find((c) => c.id.toString() === o.value) || null,
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
      />
    </div>
  );
}
