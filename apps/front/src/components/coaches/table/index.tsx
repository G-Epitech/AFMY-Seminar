"use client";
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from '../../ui/checkbox';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Coach } from '..';
import CoachesTableHeader from './header';
import CoachesTableBody from './body';

export interface CoachesListProps {
  coaches: Coach[];
}

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

  return (
    <div>
      <MagnifyingGlassIcon className="w-6 h-6" />
      <Table>
        <TableCaption>{coaches.length} coaches are displayed</TableCaption>
        <CoachesTableHeader
          coaches={coaches}
          selectedCoaches={selectedCoaches}
          handleSelectAllCoaches={handleSelectAllCoaches}
        />
        <CoachesTableBody
          displayedCoaches={displayedCoaches}
          selectedCoaches={selectedCoaches}
          handleSelectCoach={handleSelectCoach}
        />
      </Table>
    </div>
  );
}
