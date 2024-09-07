'use client';
import React, { useEffect, useState } from 'react';
import { Customer, Page } from '@seminar/common';
import CustomersTable from '@/components/customers/table';
import { Subtitle } from '@/components/text/subtitle';
import api from '@/api';
import { useReactTable } from '@tanstack/react-table';

export default function CustomersPage() {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [fetchedPages, setFetchedPages] = useState<number[]>([]);
  const [currentCustomersPage, setCurrentCustomersPage] = useState<Page<Customer>>({
    index: 0,
    size: 10,
    isLast: false,
    items: [],
  });
  const [numberOfCustomers, setNumberOfCustomers] = useState<number>(0);

  const fetchCustomers = async (index: number, size: number) => {
    const nbOfCustomers = await api.customers.count();
    console.log(nbOfCustomers);
    if (nbOfCustomers && nbOfCustomers.ok) {
      setNumberOfCustomers(nbOfCustomers.data);
    }
    const response = await api.customers.list({
      page: index,
      size: size,
    });
    console.log(response);
    if (response && response.ok) {
      setCurrentCustomersPage(response.data);
      setAllCustomers(response.data.items);
    }
  };

  useEffect(() => {
    fetchCustomers(currentCustomersPage.index, currentCustomersPage.size);
  }, []);

  const handleNextPage = async (table: ReturnType<typeof useReactTable<Customer>>) => {
    const tableState = table.getState();
    if (fetchedPages.includes(tableState.pagination.pageIndex + 1)) {
      table.setPageIndex(tableState.pagination.pageIndex + 1);
      return;
    }
    const response = await api.customers.list({
      page: currentCustomersPage.index + 1,
      size: currentCustomersPage.size,
    });
    if (response && response.ok) {
      setCurrentCustomersPage(response.data);
      setAllCustomers(prev => [...prev, ...response.data.items]);
      table.setPageIndex(response.data.index);
      setFetchedPages(prev => [...prev, response.data.index]);
    }
  };

  return (
    <main>
      <Subtitle text="Customers List" />

      <h3 className="mb-4 text-stone-500">
        You have total {numberOfCustomers} customers.
      </h3>
      <CustomersTable
        customers={allCustomers}
        isLastPage={currentCustomersPage.isLast}
        handleNextPage={handleNextPage}
        pageIndex={currentCustomersPage.index}
      />
    </main>
  );
}
