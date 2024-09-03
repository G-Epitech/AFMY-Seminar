"use client";
import React, { useState } from 'react';
import { Page } from '@seminar/common';
import CoachesTableHeader from './table/header';
import CoachesTable from './table';

export type Coach = {
    id: number;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    picture?: string;
    numberOfCustomers?: number;
};

export default function Coaches() {
    const [coachesPage, setCoachesPage] = useState<Page<Coach>>({
      index: 0,
      size: 15,
      isLast: false,
      items: temporaryCoaches,
    });
    const [numberOfCoaches, setNumberOfCoaches] = useState<number>(temporaryCoaches.length);

    return <div>
      <div className='p-8'>
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl mb-1">
          Coaches List
        </h1>
        <h3 className="text-lg font-bold mb-4">
          You have total {numberOfCoaches} coaches.
        </h3>
        <CoachesTable coaches={coachesPage.items} />
      </div>
    </div>;
}

const temporaryCoaches: Coach[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1234567890', numberOfCustomers: 12 },
  { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '+0987654321', numberOfCustomers: 7 },
  { id: 3, firstName: 'Alice', lastName: 'Smith', email: 'alice.smith@example.com', phone: '+1122334455', numberOfCustomers: 20 },
  { id: 4, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', phone: '+2233445566', numberOfCustomers: 15 },
  { id: 5, firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', phone: '+3344556677', numberOfCustomers: 9 },
  { id: 6, firstName: 'Diana', lastName: 'Prince', email: 'diana.prince@example.com', phone: '+4455667788', numberOfCustomers: 22 },
  { id: 7, firstName: 'Edward', lastName: 'Norton', email: 'edward.norton@example.com', phone: '+5566778899', numberOfCustomers: 18 },
  { id: 8, firstName: 'Fiona', lastName: 'Apple', email: 'fiona.apple@example.com', phone: '+6677889900', numberOfCustomers: 5 },
  { id: 9, firstName: 'George', lastName: 'Martin', email: 'george.martin@example.com', phone: '+7788990011', numberOfCustomers: 13 },
  { id: 10, firstName: 'Hannah', lastName: 'Davis', email: 'hannah.davis@example.com', phone: '+8899001122', numberOfCustomers: 17 },
  { id: 11, firstName: 'Ian', lastName: 'McKellen', email: 'ian.mckellen@example.com', phone: '+9900112233', numberOfCustomers: 8 },
  { id: 12, firstName: 'Julia', lastName: 'Roberts', email: 'julia.roberts@example.com', phone: '+1011223344', numberOfCustomers: 16 },
  { id: 13, firstName: 'Kevin', lastName: 'Spacey', email: 'kevin.spacey@example.com', phone: '+1122334456', numberOfCustomers: 10 },
  { id: 14, firstName: 'Laura', lastName: 'Palmer', email: 'laura.palmer@example.com', phone: '+1223344556', numberOfCustomers: 14 },
  { id: 15, firstName: 'Michael', lastName: 'Jordan', email: 'michael.jordan@example.com', phone: '+1334455667', numberOfCustomers: 19 },
];
