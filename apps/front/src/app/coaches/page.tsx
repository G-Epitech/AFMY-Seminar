'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { AstrologicalSign, Employee, Gender, Page, Permission, PhotoFormat } from '@seminar/common';
import CoachesTable from '@/components/coaches/table';
import { Subtitle } from '@/components/text/subtitle';
import api from '@/api';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useReactTable } from '@tanstack/react-table';
import { credentials } from '@/auth/credentials';
import auth from '@/api/auth';
import { config } from '@/lib/config';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isLastPage, setIsLastPage] = useState<boolean>(true);

  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>();
  const [photo, setPhoto] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const fieldContainerStyle = "flex flex-wrap sm:grid sm:grid-cols-4 items-center gap-4 p-1";

  const handleSaveChanges = async () => {
    if (!newEmployee) return;
    const form = new FormData();

    const tokens = credentials.get();
    if (auth && !tokens.access) return null;

    form.append("photo", photo as Blob);
    for (const key in newEmployee) {
      form.append(key, newEmployee[key as keyof (typeof newEmployee)]! as string);
    }
    form.append("permission", Permission.COACH.toString());
    const response = await fetch(`${config.api.url}/employees`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
      body: form
    })
    if (response && response.ok) {
      setOpenDialog(false);
      toast({
        title: "New coach created",
        description: `${newEmployee.name} ${newEmployee.surname} has been successfully created.`,
      })
    } else {
      console.error(response);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again" onClick={handleSaveChanges}>Try again</ToastAction>,
      })
    }
  }

  const fecthCoaches = async (index: number, size: number) => {
    const nbCoaches = await api.employees.count({
      permission: Permission.COACH,
    });
    if (nbCoaches) {
      setNumberOfCoaches(nbCoaches.data);
    }
    const response = await api.employees.list({
      page: index,
      size,
      permission: Permission.COACH
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
        action: <ToastAction
          altText="Try again"
          onClick={() =>
            fecthCoaches(lastCoachesPage.index, lastCoachesPage.size)
          }
        >
          Try again
        </ToastAction>,
      })
    }
  };

  useEffect(() => {
    fecthCoaches(lastCoachesPage.index, lastCoachesPage.size);
  }, []);

  const handleFilteredNextPage = async (table: ReturnType<typeof useReactTable<Employee>>) => {
    const tableState = table.getState();
    if (filteredPages.includes(tableState.pagination.pageIndex + 1)) {
      if (tableState.pagination.pageIndex + 1 === lastFilteredPage.index && lastFilteredPage.isLast) {
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
      setFilteredEmployees(prev => [...prev, ...response.data.items]);
      table.setPageIndex(response.data.index);
      setFilteredPages(prev => [...prev, response.data.index]);
      setIsLastPage(response.data.isLast);
    }
  };

  const handleNextPage = async (table: ReturnType<typeof useReactTable<Employee>>) => {
    if (searchFilter.length > 0) {
      return handleFilteredNextPage(table);
    }
    const tableState = table.getState();
    if (fetchedPages.includes(tableState.pagination.pageIndex + 1)) {
      if (tableState.pagination.pageIndex + 1 === lastCoachesPage.index && lastCoachesPage.isLast) {
        setIsLastPage(true);
      }
      table.setPageIndex(tableState.pagination.pageIndex + 1);
      return;
    }
    const response = await api.employees.list({
      page: lastCoachesPage.index + 1,
      size: lastCoachesPage.size,
      permission: Permission.COACH
    });
    console.log(response);
    if (response && response.ok) {
      setLastCoachesPage(response.data);
      setAllEmployees(prev => [...prev, ...response.data.items]);
      table.setPageIndex(response.data.index);
      setFetchedPages(prev => [...prev, response.data.index]);
      setIsLastPage(response.data.isLast);
    } else {
      console.error(response);
    }
  };

  const handlePreviousPage = async (table: ReturnType<typeof useReactTable<Employee>>) => {
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
    if (searchFilter === '') {
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
  }

  useEffect(() => {
    handleSearch();
  }, [searchFilter]);

  return (
    <main>
      <div className="flex justify-between items-center">
        <div>
          <Subtitle text="Coaches List" />

          <h3 className="mb-4 text-stone-500">
            You have total {numberOfCoaches} coaches.
          </h3>
        </div>
        <div>
          <Dialog
            open={openDialog}
            onOpenChange={setOpenDialog}
          >
            <DialogTrigger
              asChild
              className="px-2.5"
              onClick={() => setOpenDialog(true)}
            >
              <Button variant="default">
                <PlusIcon className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create a new coach</DialogTitle>
                <DialogDescription>
                  Complete the form below to create a new coach.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className='h-72'>
                <div className="grid gap-4 py-4 sm:pr-6">
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      value={newEmployee?.name ?? ''}
                      onChange={(event) => setNewEmployee(prev => ({ ...prev, name: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="surname" className="text-right">
                      Surname
                    </Label>
                    <Input
                      id="surname"
                      className="col-span-3"
                      value={newEmployee?.surname ?? ''}
                      onChange={(event) => setNewEmployee(prev => ({ ...prev, surname: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      className="col-span-3"
                      value={newEmployee?.email ?? ''}
                      onChange={(event) => setNewEmployee(prev => ({ ...prev, email: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      className="col-span-3"
                      value={newEmployee?.phone ?? ''}
                      onChange={(event) => setNewEmployee(prev => ({ ...prev, phone: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      className="col-span-3"
                      value={newEmployee?.address ?? ''}
                      onChange={(event) => setNewEmployee(prev => ({ ...prev, address: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="birthDate" className="text-right">
                      Birth Date
                    </Label>
                    <DatePicker
                      date={newEmployee?.birthDate ?? null}
                      onSelect={(date) => setNewEmployee(prev => ({ ...prev, birthDate: date }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="Gender" className="text-right">
                      Gender
                    </Label>
                    <Select
                      onValueChange={(value) => setNewEmployee(prev => ({
                        ...prev,
                        gender: value as Gender,
                      }))}
                    >
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder="Select a Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={Gender.FE}>Woman</SelectItem>
                          <SelectItem value={Gender.MA}>Man</SelectItem>
                          <SelectItem value={Gender.OT}>Prefer not to say</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="photo" className="text-right">
                      Photo
                    </Label>
                    <Input
                      id="photo"
                      type="file"
                      className="col-span-3"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setPhoto(file);
                          const format = file.type.split('/')[1] as PhotoFormat;
                          setNewEmployee(prev => ({
                            ...prev,
                            photoFormat: format,
                          }));
                        }
                      }}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Input
                      id="role"
                      className="col-span-3"
                      value={newEmployee?.role ?? ''}
                      onChange={(event) => setNewEmployee(prev => ({ ...prev, role: event.target.value }))}
                    />
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleSaveChanges}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
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
