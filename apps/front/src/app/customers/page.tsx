'use client';
import { AstrologicalSign, Customer, Gender, Page, PhotoFormat } from '@seminar/common';
import React, { ChangeEvent, useEffect, useState } from 'react';
import CustomersTable from '@/components/customers/table';
import { Subtitle } from '@/components/text/subtitle';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import mapData from '../../../public/world-map.json';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { config } from "@/lib/config";
import auth from '@/api/auth';
import { credentials } from '@/auth/credentials';
import api from '@/api';
import { useReactTable } from '@tanstack/react-table';

export default function CustomersPage() {
  const { toast } = useToast();
  const sortedCountries = mapData.objects.world.geometries.sort((a, b) => a.properties.name.localeCompare(b.properties.name));

  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [fetchedPages, setFetchedPages] = useState<number[]>([]);
  const [lastCustomersPage, setLastCustomersPage] = useState<Page<Customer>>({
    index: 0,
    size: 10,
    isLast: false,
    items: [],
  });
  const [numberOfCustomers, setNumberOfCustomers] = useState<number>(0);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>();
  const [photo, setPhoto] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(true);

  const fieldContainerStyle = "flex flex-wrap sm:grid sm:grid-cols-4 items-center gap-4 p-1";

  const handleSaveChanges = async () => {
    if (!newCustomer) return;
    const form = new FormData();

    const tokens = credentials.get();
    if (auth && !tokens.access) return null;

    form.append("photo", photo as Blob);
    for (const key in newCustomer) {
      form.append(key, newCustomer[key as keyof(typeof newCustomer) ]! as string);
    }
    const response = await fetch(`${config.api.url}/customers`, {
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
        title: "New customer created",
        description: `${newCustomer.name} ${newCustomer.surname} has been successfully created.`,
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

  const fetchCustomers = async (index: number, size: number) => {
    const nbOfCustomers = await api.customers.count();
    if (nbOfCustomers && nbOfCustomers.ok) {
      setNumberOfCustomers(nbOfCustomers.data);
    }
    const response = await api.customers.list({
      page: index,
      size: size,
    });
    if (response && response.ok) {
      setLastCustomersPage(response.data);
      setAllCustomers(response.data.items);
      setIsLastPage(response.data.isLast);
    } else {
      console.error(response);
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
      <div className="flex justify-between items-center">
        <div>
          <Subtitle text="Customers List" />

          <h3 className="mb-4 text-stone-500">
            You have total {numberOfCustomers} customers.
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
                <DialogTitle>Create a new customer</DialogTitle>
                <DialogDescription>
                  Complete the form below to create a new customer.
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
                      value={newCustomer?.name ?? ''}
                      onChange={(event) => setNewCustomer(prev => ({ ...prev, name: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="surname" className="text-right">
                      Surname
                    </Label>
                    <Input
                      id="surname"
                      className="col-span-3"
                      value={newCustomer?.surname ?? ''}
                      onChange={(event) => setNewCustomer(prev => ({ ...prev, surname: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      className="col-span-3"
                      value={newCustomer?.email ?? ''}
                      onChange={(event) => setNewCustomer(prev => ({ ...prev, email: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      className="col-span-3"
                      value={newCustomer?.phone ?? ''}
                      onChange={(event) => setNewCustomer(prev => ({ ...prev, phone: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      className="col-span-3"
                      value={newCustomer?.address ?? ''}
                      onChange={(event) => setNewCustomer(prev => ({ ...prev, address: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      className="col-span-3"
                      value={newCustomer?.description ?? ''}
                      onChange={(event) => setNewCustomer(prev => ({ ...prev, description: event.target.value }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="birthDate" className="text-right">
                      Birth Date
                    </Label>
                    <DatePicker
                      date={newCustomer?.birthDate ?? null}
                      onSelect={(date) => setNewCustomer(prev => ({ ...prev, birthDate: date }))}
                    />
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="Gender" className="text-right">
                      Gender
                    </Label>
                    <Select
                      onValueChange={(value) => setNewCustomer(prev => ({
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
                    <Label htmlFor="sign" className="text-right">
                      Astrological
                    </Label>
                    <Select
                      onValueChange={(value) => setNewCustomer(prev => ({
                        ...prev,
                        sign: value as AstrologicalSign,
                      }))}
                    >
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder="Select an Astrological Sign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={AstrologicalSign.ARIES}>Aries</SelectItem>
                          <SelectItem value={AstrologicalSign.TAURUS}>Taurus</SelectItem>
                          <SelectItem value={AstrologicalSign.GEMINI}>Gemini</SelectItem>
                          <SelectItem value={AstrologicalSign.CANCER}>Cancer</SelectItem>
                          <SelectItem value={AstrologicalSign.LEO}>Leo</SelectItem>
                          <SelectItem value={AstrologicalSign.VIRGO}>Virgo</SelectItem>
                          <SelectItem value={AstrologicalSign.LIBRA}>Libra</SelectItem>
                          <SelectItem value={AstrologicalSign.SCORPIO}>Scorpio</SelectItem>
                          <SelectItem value={AstrologicalSign.SAGITTARIUS}>Sagittarius</SelectItem>
                          <SelectItem value={AstrologicalSign.CAPRICORN}>Capricorn</SelectItem>
                          <SelectItem value={AstrologicalSign.AQUARIUS}>Aquarius</SelectItem>
                          <SelectItem value={AstrologicalSign.PISCES}>Pisces</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={fieldContainerStyle}>
                    <Label htmlFor="Country" className="text-right">
                      Country
                    </Label>
                    <Select
                      onValueChange={(value) => setNewCustomer(prev => ({
                        ...prev,
                        country: value,
                      }))}
                    >
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sortedCountries.map((country) => (
                            <SelectItem key={country.id} value={country.properties.name}>
                              {country.properties.name}
                            </SelectItem>
                          ))}
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
                          setNewCustomer(prev => ({
                            ...prev,
                            photoFormat: format,
                          }));
                        }
                      }}
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
