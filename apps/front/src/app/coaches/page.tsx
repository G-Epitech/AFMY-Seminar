"use client";
import React, { useEffect, useState } from "react";
import { Employee, Gender, Page, Permission } from "@seminar/common";
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
    isLast: false,
    items: [],
  });
  const [numberOfCoaches, setNumberOfCoaches] = useState<number>(0);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [fetchedPages, setFetchedPages] = useState<number[]>([]);
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

  useEffect(() => {
    console.log(allEmployees);
  }, [allEmployees]);

  const handleNextPage = async (
    table: ReturnType<typeof useReactTable<Employee>>,
  ) => {
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

  return (
    <main>
      <Subtitle text="Coaches List" />

      <h3 className="mb-4 text-stone-500">
        You have total {numberOfCoaches} coaches.
      </h3>
      <CoachesTable
        coaches={allEmployees}
        isLastPage={isLastPage}
        handleNextPage={handleNextPage}
        maxRows={numberOfCoaches}
        handlePreviousPage={handlePreviousPage}
      />
    </main>
  );
}
