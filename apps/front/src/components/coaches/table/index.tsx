"use client";
import React, { useState } from 'react';
import {
  Table,
  TableCaption,
} from "@/components/ui/table"
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Coach } from '..';

export interface CoachesListProps {
  coaches: Coach[];
}

export type Action = 'delete' | 'promote' | 'demote';

export default function CoachesTable({ coaches }: CoachesListProps) {
  const [displayedCoaches, setDisplayedCoaches] = useState<Coach[]>(coaches);
  const [selectedCoaches, setSelectedCoaches] = useState<Coach[]>([]);

  const handleSelectAllCoaches = () => {
    if (selectedCoaches.length === coaches.length) {
      setSelectedCoaches([]);
    } else {
      setSelectedCoaches(coaches);
    }
  }

  const handleSelectCoach = (coach: Coach) => {
    if (selectedCoaches.includes(coach)) {
      setSelectedCoaches(selectedCoaches.filter((selectedCoach) => selectedCoach !== coach));
    } else {
      setSelectedCoaches([...selectedCoaches, coach]);
    }
  }

  const handleSearch = (search: string) => {
    if (search === '') {
      setDisplayedCoaches(coaches);
    } else {
      setDisplayedCoaches(coaches.filter((coach) => (
        coach.firstName.toLowerCase().includes(search.toLowerCase()) ||
        coach.lastName.toLowerCase().includes(search.toLowerCase()) ||
        coach.email.toLowerCase().includes(search.toLowerCase()) ||
        coach.phone.toLowerCase().includes(search.toLowerCase())
      )));
    }
  }

  const handleAction = (action: Action) => {
    if (action === 'delete') {
      console.log('Delete', selectedCoaches);
    } else if (action === 'promote') {
      console.log('Promote', selectedCoaches);
    } else if (action === 'demote') {
      console.log('Demote', selectedCoaches);
    }
  }

  return (
    <div>
      <div>
        <MagnifyingGlassIcon className="w-6 h-6" />
      </div>
      <Table>
        <TableCaption>{coaches.length} coaches are displayed</TableCaption>
      </Table>
    </div>
  );
}
