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
  const [lastCustomersPage, setLastCustomersPage] = useState<Page<Customer>>({
    index: 0,
    size: 10,
    isLast: false,
    items: [],
  });
  const [numberOfCustomers, setNumberOfCustomers] = useState<number>(0);
  const [isLastPage, setIsLastPage] = useState<boolean>(true);

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
      setLastCustomersPage(response.data);
      setAllCustomers(response.data.items);
      setIsLastPage(response.data.isLast);
    }
  };

  useEffect(() => {
    fetchCustomers(lastCustomersPage.index, lastCustomersPage.size);
  }, []);

  const handleNextPage = async (table: ReturnType<typeof useReactTable<Customer>>) => {
    const tableState = table.getState();
    if (fetchedPages.includes(tableState.pagination.pageIndex + 1)) {
      if (tableState.pagination.pageIndex + 1 === lastCustomersPage.index && lastCustomersPage.isLast) {
        setIsLastPage(true);
      }
      table.setPageIndex(tableState.pagination.pageIndex + 1);
      return;
    }
    const response = await api.customers.list({
      page: lastCustomersPage.index + 1,
      size: lastCustomersPage.size,
    });
    if (response && response.ok) {
      setLastCustomersPage(response.data);
      setAllCustomers(prev => [...prev, ...response.data.items]);
      table.setPageIndex(response.data.index);
      setFetchedPages(prev => [...prev, response.data.index]);
      setIsLastPage(response.data.isLast);
    }
  };

  const handlePreviousPage = async (table: ReturnType<typeof useReactTable<Customer>>) => {
    const tableState = table.getState();
    table.setPageIndex(tableState.pagination.pageIndex - 1);
    setIsLastPage(false);
  };

  useEffect(() => {
    if (allCustomers.length > numberOfCustomers) {
      setNumberOfCustomers(allCustomers.length);
    }
  }, [allCustomers]);

  return (
    <main>
      <Subtitle text="Customers List" />

      <h3 className="mb-4 text-stone-500">
        You have total {numberOfCustomers} customers.
      </h3>
      <CustomersTable
        customers={allCustomers}
        isLastPage={isLastPage}
        handleNextPage={handleNextPage}
        maxRows={numberOfCustomers}
        handlePreviousPage={handlePreviousPage}
      />
    </main>
  );
}
