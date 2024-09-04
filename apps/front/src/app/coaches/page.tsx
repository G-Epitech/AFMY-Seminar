'use client';
import React, { useState } from 'react';
import { Employee, Gender, Page, Permission } from '@seminar/common';
import CoachesTable from '@/components/coaches/table';
import { Subtitle } from '@/components/text/subtitle';

export default function Coaches() {
  const [employeePage, setEmployeePage] = useState<Page<Employee>>({
    index: 0,
    size: 15,
    isLast: false,
    items: temporaryCoaches,
  });
  const [numberOfCoaches, setNumberOfCoaches] = useState<number>(temporaryCoaches.length);

  return (
    <main>
        <Subtitle text="Coaches List" />

        <h3 className="mb-4 text-stone-500">
            You have total {numberOfCoaches} coaches.
        </h3>
        <CoachesTable coaches={employeePage.items} />
    </main>
);
}

const temporaryCoaches: Employee[] = [
  {
    id: 1,
    email: "john.doe@example.com",
    name: "John",
    surname: "Doe",
    birthDate: new Date("1985-03-15"),
    gender: Gender.MA,
    phone: "123-456-7890",
    photo: null,
    address: "123 Main St, Springfield",
    permission: Permission.MANAGER,
    role: "General Manager"
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    name: "Jane",
    surname: "Smith",
    birthDate: new Date("1990-07-22"),
    gender: Gender.FE,
    phone: "234-567-8901",
    photo: null,
    address: "456 Elm St, Metropolis",
    permission: Permission.COACH,
    role: "Fitness Coach"
  },
  {
    id: 3,
    email: "bob.johnson@example.com",
    name: "Bob",
    surname: "Johnson",
    birthDate: new Date("1978-05-03"),
    gender: Gender.MA,
    phone: "345-678-9012",
    photo: null,
    address: "789 Oak St, Smallville",
    permission: Permission.MANAGER,
    role: "Operations Manager"
  },
  {
    id: 4,
    email: "alice.brown@example.com",
    name: "Alice",
    surname: "Brown",
    birthDate: new Date("1982-11-19"),
    gender: Gender.FE,
    phone: "456-789-0123",
    photo: null,
    address: "101 Maple St, Riverdale",
    permission: Permission.COACH,
    role: "Yoga Instructor"
  },
  {
    id: 5,
    email: "michael.white@example.com",
    name: "Michael",
    surname: "White",
    birthDate: new Date("1995-02-28"),
    gender: Gender.MA,
    phone: "567-890-1234",
    photo: null,
    address: "202 Pine St, Hill Valley",
    permission: Permission.COACH,
    role: "Strength Coach"
  },
  {
    id: 6,
    email: "emma.green@example.com",
    name: "Emma",
    surname: "Green",
    birthDate: new Date("1992-09-05"),
    gender: Gender.FE,
    phone: "678-901-2345",
    photo: null,
    address: "303 Cedar St, Gotham",
    permission: Permission.MANAGER,
    role: "HR Manager"
  },
  {
    id: 7,
    email: "william.thompson@example.com",
    name: "William",
    surname: "Thompson",
    birthDate: new Date("1988-04-14"),
    gender: Gender.MA,
    phone: "789-012-3456",
    photo: null,
    address: "404 Birch St, Star City",
    permission: Permission.COACH,
    role: "Cardio Coach"
  },
  {
    id: 8,
    email: "olivia.jones@example.com",
    name: "Olivia",
    surname: "Jones",
    birthDate: new Date("1987-08-23"),
    gender: Gender.FE,
    phone: "890-123-4567",
    photo: null,
    address: "505 Spruce St, Central City",
    permission: Permission.COACH,
    role: "Pilates Instructor"
  },
  {
    id: 9,
    email: "james.williams@example.com",
    name: "James",
    surname: "Williams",
    birthDate: new Date("1984-12-02"),
    gender: Gender.MA,
    phone: "901-234-5678",
    photo: null,
    address: "606 Redwood St, Coast City",
    permission: Permission.MANAGER,
    role: "Sales Manager"
  },
  {
    id: 10,
    email: "sophia.miller@example.com",
    name: "Sophia",
    surname: "Miller",
    birthDate: new Date("1993-10-11"),
    gender: Gender.FE,
    phone: "012-345-6789",
    photo: null,
    address: "707 Oakwood St, National City",
    permission: Permission.COACH,
    role: "Nutrition Coach"
  },
  {
    id: 11,
    email: "liam.moore@example.com",
    name: "Liam",
    surname: "Moore",
    birthDate: new Date("1980-06-17"),
    gender: Gender.MA,
    phone: "123-456-7890",
    photo: null,
    address: "808 Willow St, Starling City",
    permission: Permission.COACH,
    role: "CrossFit Coach"
  },
  {
    id: 12,
    email: "isabella.davis@example.com",
    name: "Isabella",
    surname: "Davis",
    birthDate: new Date("1994-01-29"),
    gender: Gender.FE,
    phone: "234-567-8901",
    photo: null,
    address: "909 Aspen St, Keystone City",
    permission: Permission.COACH,
    role: "Dance Instructor"
  },
  {
    id: 13,
    email: "noah.clark@example.com",
    name: "Noah",
    surname: "Clark",
    birthDate: new Date("1991-03-08"),
    gender: Gender.MA,
    phone: "345-678-9012",
    photo: null,
    address: "1010 Fir St, Blüdhaven",
    permission: Permission.MANAGER,
    role: "Marketing Manager"
  },
  {
    id: 14,
    email: "mia.martin@example.com",
    name: "Mia",
    surname: "Martin",
    birthDate: new Date("1989-11-06"),
    gender: Gender.FE,
    phone: "456-789-0123",
    photo: null,
    address: "1111 Cypress St, Fawcett City",
    permission: Permission.COACH,
    role: "Aerobics Instructor"
  },
  {
    id: 15,
    email: "ethan.rodriguez@example.com",
    name: "Ethan",
    surname: "Rodriguez",
    birthDate: new Date("1996-07-15"),
    gender: Gender.MA,
    phone: "567-890-1234",
    photo: null,
    address: "1212 Hickory St, Midway City",
    permission: Permission.COACH,
    role: "Personal Trainer"
  },
  {
    id: 16,
    email: "ava.lee@example.com",
    name: "Ava",
    surname: "Lee",
    birthDate: new Date("1997-12-24"),
    gender: Gender.FE,
    phone: "678-901-2345",
    photo: null,
    address: "1313 Sequoia St, Gateway City",
    permission: Permission.COACH,
    role: "Meditation Coach"
  },
  {
    id: 17,
    email: "logan.walker@example.com",
    name: "Logan",
    surname: "Walker",
    birthDate: new Date("1986-09-18"),
    gender: Gender.MA,
    phone: "789-012-3456",
    photo: null,
    address: "1414 Sycamore St, Opal City",
    permission: Permission.MANAGER,
    role: "Finance Manager"
  }
];
