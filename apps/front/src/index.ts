import {User, MyClass} from "common";


const E: User = {
    name: 'E',
    age: 25,
    email: 'fla',
    birthdate: new Date()
};

let V = new MyClass();

export type Group = {
    name: string;
    users: User[];
};
