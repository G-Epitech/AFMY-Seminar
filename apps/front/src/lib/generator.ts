import { Customer } from "@seminar/common";

export const generator = {
    customers: () => {
        const file: Customer[] = require('../templates/customers.json');
        return file;
    }
}
