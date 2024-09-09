'use client';
import React, { useEffect, useState } from 'react';
import { Employee, Gender, Page, Permission } from '@seminar/common';
import CoachesTable from '@/components/coaches/table';
import { Subtitle } from '@/components/text/subtitle';
import api from '@/api';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function Coaches() {
  const { toast } = useToast();
  const [coachesPage, setCoachesPage] = useState<Page<Employee>>({
    index: 0,
    size: 15,
    isLast: false,
    items: [],
  });
  const [numberOfCoaches, setNumberOfCoaches] = useState<number>(0);

  const fecthCoaches = async (index: number, size: number) => {
    const response = await api.employees.list({
      page: index,
      size,
      permission: Permission.COACH
    });
    console.log(response);
    if (response && response.data) {
      setCoachesPage(response.data);
    } else {
      console.error("Failed to fetch coaches");
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction
          altText="Try again"
          onClick={() =>
            fecthCoaches(coachesPage.index, coachesPage.size)
          }
        >
          Try again
        </ToastAction>,
      })
    }
  };

  useEffect(() => {
    fecthCoaches(coachesPage.index, coachesPage.size);
  }, []);

  return (
    <main>
      <Subtitle text="Coaches List" />

      <h3 className="mb-4 text-stone-500">
        You have total {numberOfCoaches} coaches.
      </h3>
      <CoachesTable coaches={coachesPage.items} />
    </main>
  );
}
