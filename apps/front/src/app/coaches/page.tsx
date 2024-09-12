"use client";
import React, { useEffect, useState } from "react";
import { Employee, Page, Permission } from "@seminar/common";
import CoachesTable from "@/components/coaches/table";
import { Subtitle } from "@/components/text/subtitle";
import api from "@/api";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useReactTable } from "@tanstack/react-table";

export default function Coaches() {
  const { toast } = useToast();
  const [lastCoachesPage, setLastCoachesPage] = useState<Page<Employee>>({
    index: 0,
    size: 10,
    isLast: true,
    items: [],
  });
  const [lastFilteredPage, setLastFilteredPage] = useState<Page<Employee>>({
    index: 0,
    size: 10,
    isLast: true,
    items: [],
  });
  const [numberOfCoaches, setNumberOfCoaches] = useState<number>(0);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [fetchedPages, setFetchedPages] = useState<number[]>([]);
  const [filteredPages, setFilteredPages] = useState<number[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [isLastPage, setIsLastPage] = useState<boolean>(true);

  const fetchCoaches = async (index: number, size: number) => {
    const nbCoaches = await api.employees.count({
      permission: Permission.COACH,
    });
    if (nbCoaches) {
      setNumberOfCoaches(nbCoaches.data);
    }
    const response = await api.employees.list({
      page: index,
      size,
      permission: Permission.COACH,
    });
    if (response && response.data) {
      setLastCoachesPage(response.data);
      setAllEmployees(response.data.items);
      setIsLastPage(response.data.isLast);
    } else {
      console.error(response);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() =>
              fetchCoaches(lastCoachesPage.index, lastCoachesPage.size)
            }
          >
            Try again
          </ToastAction>
        ),
      });
    }
  };

  useEffect(() => {
    fetchCoaches(lastCoachesPage.index, lastCoachesPage.size);
  }, []);

  const handleFilteredNextPage = async (
    table: ReturnType<typeof useReactTable<Employee>>,
  ) => {
    const tableState = table.getState();
    if (filteredPages.includes(tableState.pagination.pageIndex + 1)) {
      if (
        tableState.pagination.pageIndex + 1 === lastFilteredPage.index &&
        lastFilteredPage.isLast
      ) {
        setIsLastPage(true);
      }
      table.setPageIndex(tableState.pagination.pageIndex + 1);
      return;
    }
    const response = await api.employees.list({
      page: lastFilteredPage.index + 1,
      size: lastFilteredPage.size,
      permission: Permission.COACH,
      email: searchFilter,
    });
    if (response && response.ok) {
      setLastFilteredPage(response.data);
      setFilteredEmployees((prev) => [...prev, ...response.data.items]);
      table.setPageIndex(response.data.index);
      setFilteredPages((prev) => [...prev, response.data.index]);
      setIsLastPage(response.data.isLast);
    }
  };

  const handleNextPage = async (
    table: ReturnType<typeof useReactTable<Employee>>,
  ) => {
    if (searchFilter.length > 0) {
      return handleFilteredNextPage(table);
    }
    const tableState = table.getState();
    if (fetchedPages.includes(tableState.pagination.pageIndex + 1)) {
      if (
        tableState.pagination.pageIndex + 1 === lastCoachesPage.index &&
        lastCoachesPage.isLast
      ) {
        setIsLastPage(true);
      }
      table.setPageIndex(tableState.pagination.pageIndex + 1);
      return;
    }
    const response = await api.employees.list({
      page: lastCoachesPage.index + 1,
      size: lastCoachesPage.size,
      permission: Permission.COACH,
    });
    console.log(response);
    if (response && response.ok) {
      setLastCoachesPage(response.data);
      setAllEmployees((prev) => [...prev, ...response.data.items]);
      table.setPageIndex(response.data.index);
      setFetchedPages((prev) => [...prev, response.data.index]);
      setIsLastPage(response.data.isLast);
    } else {
      console.error(response);
    }
  };

  const handlePreviousPage = async (
    table: ReturnType<typeof useReactTable<Employee>>,
  ) => {
    const tableState = table.getState();
    table.setPageIndex(tableState.pagination.pageIndex - 1);
    setIsLastPage(false);
  };

  useEffect(() => {
    if (allEmployees.length > numberOfCoaches) {
      setAllEmployees(allEmployees.slice(0, numberOfCoaches));
    }
  }, [allEmployees]);

  const handleSearch = async () => {
    if (searchFilter === "") {
      setFilteredEmployees([]);
      return;
    }
    setFilteredPages([]);
    const response = await api.employees.list({
      page: 0,
      size: 10,
      permission: Permission.COACH,
      email: searchFilter,
    });
    if (response && response.ok) {
      setFilteredEmployees(response.data.items);
      setLastFilteredPage(response.data);
      setFilteredPages([response.data.index]);
      setIsLastPage(response.data.isLast);
    } else {
      console.error(response);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchFilter]);

  return (
    <main>
      <Subtitle text="Coaches List" />

      <h3 className="mb-4 text-stone-500">
        You have total {numberOfCoaches} coaches.
      </h3>
      <CoachesTable
        coaches={searchFilter.length > 0 ? filteredEmployees : allEmployees}
        setFilter={setSearchFilter}
        setCoaches={setAllEmployees}
        isLastPage={isLastPage}
        handleNextPage={handleNextPage}
        maxRows={numberOfCoaches}
        handlePreviousPage={handlePreviousPage}
      />
    </main>
  );
}
