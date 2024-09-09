'use client';
import React, { useEffect, useState } from 'react';
import { AstrologicalSign, Customer, Gender, Page, PaymentMethod } from '@seminar/common';
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

export default function CustomersPage() {
  const sortedCountries = mapData.objects.world.geometries.sort((a, b) => a.properties.name.localeCompare(b.properties.name));
  const [customersPage, setCustomersPage] = useState<Page<Customer>>({
    index: 0,
    size: 15,
    isLast: false,
    items: temporaryCustomers,
  });
  const [numberOfCustomers, setNumberOfCustomers] = useState<number>(temporaryCustomers.length);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>();

  const fieldContainerStyle = "flex flex-wrap sm:grid sm:grid-cols-4 items-center gap-4 p-1";

  useEffect(() => {
    console.log(newCustomer);
  }, [newCustomer]);

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
          <Dialog>
            <DialogTrigger asChild className="px-2.5">
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
                      value={newCustomer?.name}
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
                      value={newCustomer?.surname}
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
                      value={newCustomer?.email}
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
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <CustomersTable customers={customersPage.items} />
    </main>
  );
}

const temporaryCustomers: Customer[] = [
  {
    id: 1,
    email: "john.doe@example.com",
    name: "John",
    surname: "Doe",
    description: "Avid runner and fitness enthusiast.",
    birthDate: new Date("1990-03-25"),
    gender: Gender.MA,
    sign: AstrologicalSign.ARIES,
    phone: "123-456-7890",
    photo: null,
    address: "123 Main St, Cityville",
    coachId: 1,
    createdAt: new Date("2021-01-01"),
    paymentMethods: [
      PaymentMethod.CREDIT_CARD,
    ]
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    name: "Jane",
    surname: "Smith",
    description: "Yoga instructor and nutritionist.",
    birthDate: new Date("1985-04-14"),
    gender: Gender.FE,
    sign: AstrologicalSign.TAURUS,
    phone: "234-567-8901",
    photo: null,
    address: "456 Elm St, Townsville",
    coachId: 2,
    createdAt: new Date("2021-02-01"),
    paymentMethods: [
      PaymentMethod.PAYPAL,
      PaymentMethod.CREDIT_CARD,
    ]
  },
  {
    id: 3,
    email: "alex.jones@example.com",
    name: "Alex",
    surname: "Jones",
    description: "Cycling enthusiast and amateur chef.",
    birthDate: new Date("1992-05-10"),
    gender: Gender.OT,
    sign: AstrologicalSign.GEMINI,
    phone: "345-678-9012",
    photo: null,
    address: "789 Oak St, Villageville",
    coachId: 3,
    createdAt: new Date("2021-03-01"),
    paymentMethods: [
      PaymentMethod.BANK_TRANSFER,
    ]
  },
  {
    id: 4,
    email: "sarah.lee@example.com",
    name: "Sarah",
    surname: "Lee",
    description: "Pilates enthusiast and book lover.",
    birthDate: new Date("1987-06-22"),
    gender: Gender.FE,
    sign: AstrologicalSign.CANCER,
    phone: "456-789-0123",
    photo: null,
    address: "101 Pine St, Hamlet",
    coachId: 4,
    createdAt: new Date("2021-04-01"),
    paymentMethods: [
      PaymentMethod.CREDIT_CARD,
      PaymentMethod.BANK_TRANSFER,
    ]
  },
  {
    id: 5,
    email: "michael.brown@example.com",
    name: "Michael",
    surname: "Brown",
    description: "Weightlifter and tech enthusiast.",
    birthDate: new Date("1988-07-30"),
    gender: Gender.MA,
    sign: AstrologicalSign.LEO,
    phone: "567-890-1234",
    photo: null,
    address: "202 Cedar St, Metropolis",
    coachId: 5,
    createdAt: new Date("2021-05-01")
  },
  {
    id: 6,
    email: "emily.white@example.com",
    name: "Emily",
    surname: "White",
    description: "Marathon runner and vegan cook.",
    birthDate: new Date("1991-08-19"),
    gender: Gender.FE,
    sign: AstrologicalSign.VIRGO,
    phone: "678-901-2345",
    photo: null,
    address: "303 Birch St, Urbanville",
    coachId: 6,
    createdAt: new Date("2021-06-01")
  },
  {
    id: 7,
    email: "daniel.green@example.com",
    name: "Daniel",
    surname: "Green",
    description: "CrossFit enthusiast and guitar player.",
    birthDate: new Date("1986-09-28"),
    gender: Gender.MA,
    sign: AstrologicalSign.LIBRA,
    phone: "789-012-3456",
    photo: null,
    address: "404 Maple St, Countryside",
    coachId: 7,
    createdAt: new Date("2021-07-01")
  },
  {
    id: 8,
    email: "olivia.black@example.com",
    name: "Olivia",
    surname: "Black",
    description: "Swimmer and outdoor adventurer.",
    birthDate: new Date("1993-10-17"),
    gender: Gender.FE,
    sign: AstrologicalSign.SCORPIO,
    phone: "890-123-4567",
    photo: null,
    address: "505 Willow St, Seaside",
    coachId: 8,
    createdAt: new Date("2021-08-01")
  },
  {
    id: 9,
    email: "liam.johnson@example.com",
    name: "Liam",
    surname: "Johnson",
    description: "Basketball player and movie buff.",
    birthDate: new Date("1989-11-25"),
    gender: Gender.MA,
    sign: AstrologicalSign.SAGITTARIUS,
    phone: "901-234-5678",
    photo: null,
    address: "606 Spruce St, Mountainview",
    coachId: 9,
    createdAt: new Date("2021-09-01")
  },
  {
    id: 10,
    email: "emma.davis@example.com",
    name: "Emma",
    surname: "Davis",
    description: "Hiker and wildlife photographer.",
    birthDate: new Date("1994-12-12"),
    gender: Gender.FE,
    sign: AstrologicalSign.CAPRICORN,
    phone: "012-345-6789",
    photo: null,
    address: "707 Redwood St, Lakeside",
    coachId: 10,
    createdAt: new Date("2021-10-01")
  },
  {
    id: 11,
    email: "noah.clark@example.com",
    name: "Noah",
    surname: "Clark",
    description: "Rock climber and traveler.",
    birthDate: new Date("1991-01-21"),
    gender: Gender.MA,
    sign: AstrologicalSign.AQUARIUS,
    phone: "123-456-7890",
    photo: null,
    address: "808 Aspen St, Hilltown",
    coachId: 11,
    createdAt: new Date("2021-11-01")
  },
  {
    id: 12,
    email: "sophia.martin@example.com",
    name: "Sophia",
    surname: "Martin",
    description: "Dancer and painter.",
    birthDate: new Date("1988-02-15"),
    gender: Gender.FE,
    sign: AstrologicalSign.PISCES,
    phone: "234-567-8901",
    photo: null,
    address: "909 Chestnut St, Rivertown",
    coachId: 12,
    createdAt: new Date("2021-12-01")
  },
  {
    id: 13,
    email: "jack.moore@example.com",
    name: "Jack",
    surname: "Moore",
    description: "Surfer and environmentalist.",
    birthDate: new Date("1992-03-10"),
    gender: Gender.MA,
    sign: AstrologicalSign.ARIES,
    phone: "345-678-9012",
    photo: null,
    address: "1010 Oak St, Beachville",
    coachId: 13,
    createdAt: new Date("2022-01-01")
  },
  {
    id: 14,
    email: "mia.thompson@example.com",
    name: "Mia",
    surname: "Thompson",
    description: "Gymnast and fitness trainer.",
    birthDate: new Date("1995-04-05"),
    gender: Gender.FE,
    sign: AstrologicalSign.TAURUS,
    phone: "456-789-0123",
    photo: null,
    address: "1111 Cedar St, Plainsville",
    coachId: 14,
    createdAt: new Date("2022-02-01")
  },
  {
    id: 15,
    email: "ethan.jackson@example.com",
    name: "Ethan",
    surname: "Jackson",
    description: "Runner and tech innovator.",
    birthDate: new Date("1990-05-20"),
    gender: Gender.MA,
    sign: AstrologicalSign.GEMINI,
    phone: "567-890-1234",
    photo: null,
    address: "1212 Birch St, Meadows",
    coachId: 15,
    createdAt: new Date("2022-03-01")
  },
  {
    id: 16,
    email: "isabella.lee@example.com",
    name: "Isabella",
    surname: "Lee",
    description: "Photographer and cyclist.",
    birthDate: new Date("1993-06-16"),
    gender: Gender.FE,
    sign: AstrologicalSign.CANCER,
    phone: "678-901-2345",
    photo: null,
    address: "1313 Maple St, Forestville",
    coachId: 16,
    createdAt: new Date("2022-04-01")
  },
  {
    id: 17,
    email: "logan.perez@example.com",
    name: "Logan",
    surname: "Perez",
    description: "Mountain biker and engineer.",
    birthDate: new Date("1989-07-12"),
    gender: Gender.MA,
    sign: AstrologicalSign.LEO,
    phone: "789-012-3456",
    photo: null,
    address: "1414 Pine St, Cliffton",
    coachId: 17,
    createdAt: new Date("2022-05-01")
  },
  {
    id: 18,
    email: "ava.young@example.com",
    name: "Ava",
    surname: "Young",
    description: "Weightlifter and writer.",
    birthDate: new Date("1996-08-08"),
    gender: Gender.FE,
    sign: AstrologicalSign.VIRGO,
    phone: "890-123-4567",
    photo: null,
    address: "1515 Willow St, Shoreline",
    coachId: 18,
    createdAt: new Date("2022-06-01")
  },
  {
    id: 19,
    email: "lucas.harris@example.com",
    name: "Lucas",
    surname: "Harris",
    description: "Soccer player and coach.",
    birthDate: new Date("1991-09-04"),
    gender: Gender.MA,
    sign: AstrologicalSign.LIBRA,
    phone: "901-234-5678",
    photo: null,
    address: "1616 Spruce St, Bayview",
    coachId: 19,
    createdAt: new Date("2022-07-01")
  },
  {
    id: 20,
    email: "mia.robinson@example.com",
    name: "Mia",
    surname: "Robinson",
    description: "Rock climber and researcher.",
    birthDate: new Date("1994-10-30"),
    gender: Gender.FE,
    sign: AstrologicalSign.SCORPIO,
    phone: "012-345-6789",
    photo: null,
    address: "1717 Redwood St, Hillcrest",
    coachId: 20,
    createdAt: new Date("2022-08-01")
  },
  {
    id: 21,
    email: "oliver.wilson@example.com",
    name: "Oliver",
    surname: "Wilson",
    description: "Runner and startup founder.",
    birthDate: new Date("1988-11-26"),
    gender: Gender.MA,
    sign: AstrologicalSign.SAGITTARIUS,
    phone: "123-456-7890",
    photo: null,
    address: "1818 Aspen St, Riverside",
    coachId: 21,
    createdAt: new Date("2022-09-01")
  },
  {
    id: 22,
    email: "amelia.wright@example.com",
    name: "Amelia",
    surname: "Wright",
    description: "Yoga teacher and chef.",
    birthDate: new Date("1997-12-14"),
    gender: Gender.FE,
    sign: AstrologicalSign.CAPRICORN,
    phone: "234-567-8901",
    photo: null,
    address: "1919 Chestnut St, Countryside",
    coachId: 22,
    createdAt: new Date("2022-10-01")
  },
  {
    id: 23,
    email: "elijah.baker@example.com",
    name: "Elijah",
    surname: "Baker",
    description: "Triathlete and app developer.",
    birthDate: new Date("1990-01-18"),
    gender: Gender.MA,
    sign: AstrologicalSign.AQUARIUS,
    phone: "345-678-9012",
    photo: null,
    address: "2020 Oak St, Valley",
    coachId: 23,
    createdAt: new Date("2022-11-01")
  },
  {
    id: 24,
    email: "ella.king@example.com",
    name: "Ella",
    surname: "King",
    description: "Dancer and choreographer.",
    birthDate: new Date("1987-02-13"),
    gender: Gender.FE,
    sign: AstrologicalSign.PISCES,
    phone: "456-789-0123",
    photo: null,
    address: "2121 Cedar St, Cliffside",
    coachId: 24,
    createdAt: new Date("2022-12-01")
  },
  {
    id: 25,
    email: "james.scott@example.com",
    name: "James",
    surname: "Scott",
    description: "Hiker and teacher.",
    birthDate: new Date("1993-03-02"),
    gender: Gender.MA,
    sign: AstrologicalSign.ARIES,
    phone: "567-890-1234",
    photo: null,
    address: "2222 Birch St, Woods",
    coachId: 25,
    createdAt: new Date("2023-01-01")
  },
  {
    id: 26,
    email: "lily.walker@example.com",
    name: "Lily",
    surname: "Walker",
    description: "Runner and graphic designer.",
    birthDate: new Date("1985-04-21"),
    gender: Gender.FE,
    sign: AstrologicalSign.TAURUS,
    phone: "678-901-2345",
    photo: null,
    address: "2323 Maple St, Urban",
    coachId: 26,
    createdAt: new Date("2023-02-01")
  },
  {
    id: 27,
    email: "henry.hall@example.com",
    name: "Henry",
    surname: "Hall",
    description: "Gym rat and marketer.",
    birthDate: new Date("1992-05-13"),
    gender: Gender.MA,
    sign: AstrologicalSign.GEMINI,
    phone: "789-012-3456",
    photo: null,
    address: "2424 Pine St, Suburban",
    coachId: 27,
    createdAt: new Date("2023-03-01")
  },
  {
    id: 28,
    email: "zoe.allen@example.com",
    name: "Zoe",
    surname: "Allen",
    description: "Cyclist and entrepreneur.",
    birthDate: new Date("1994-06-07"),
    gender: Gender.FE,
    sign: AstrologicalSign.CANCER,
    phone: "890-123-4567",
    photo: null,
    address: "2525 Willow St, Rural",
    coachId: 28,
    createdAt: new Date("2023-04-01")
  },
  {
    id: 29,
    email: "jackson.young@example.com",
    name: "Jackson",
    surname: "Young",
    description: "Soccer player and coach.",
    birthDate: new Date("1989-07-16"),
    gender: Gender.MA,
    sign: AstrologicalSign.LEO,
    phone: "901-234-5678",
    photo: null,
    address: "2626 Spruce St, Town",
    coachId: 29,
    createdAt: new Date("2023-05-01")
  },
  {
    id: 30,
    email: "chloe.harris@example.com",
    name: "Chloe",
    surname: "Harris",
    description: "Yoga instructor and baker.",
    birthDate: new Date("1991-08-23"),
    gender: Gender.FE,
    sign: AstrologicalSign.VIRGO,
    phone: "012-345-6789",
    photo: null,
    address: "2727 Redwood St, City",
    coachId: 30,
    createdAt: new Date("2023-06-01")
  },
  {
    id: 31,
    email: "aiden.carter@example.com",
    name: "Aiden",
    surname: "Carter",
    description: "Bodybuilder and tech enthusiast.",
    birthDate: new Date("1988-09-11"),
    gender: Gender.MA,
    sign: AstrologicalSign.LIBRA,
    phone: "123-456-7890",
    photo: null,
    address: "2828 Aspen St, County",
    coachId: 31,
    createdAt: new Date("2023-07-01")
  },
  {
    id: 32,
    email: "grace.brooks@example.com",
    name: "Grace",
    surname: "Brooks",
    description: "Runner and researcher.",
    birthDate: new Date("1996-10-29"),
    gender: Gender.FE,
    sign: AstrologicalSign.SCORPIO,
    phone: "234-567-8901",
    photo: null,
    address: "2929 Chestnut St, City",
    coachId: 32,
    createdAt: new Date("2023-08-01")
  },
  {
    id: 33,
    email: "nathan.evans@example.com",
    name: "Nathan",
    surname: "Evans",
    description: "Cyclist and data analyst.",
    birthDate: new Date("1993-11-04"),
    gender: Gender.MA,
    sign: AstrologicalSign.SAGITTARIUS,
    phone: "345-678-9012",
    photo: null,
    address: "3030 Oak St, Valley",
    coachId: 33,
    createdAt: new Date("2023-09-01")
  },
  {
    id: 34,
    email: "hannah.bell@example.com",
    name: "Hannah",
    surname: "Bell",
    description: "Swimmer and fashion designer.",
    birthDate: new Date("1997-12-17"),
    gender: Gender.FE,
    sign: AstrologicalSign.CAPRICORN,
    phone: "456-789-0123",
    photo: null,
    address: "3131 Cedar St, Seaside",
    coachId: 34,
    createdAt: new Date("2023-10-01")
  },
  {
    id: 35,
    email: "david.morgan@example.com",
    name: "David",
    surname: "Morgan",
    description: "Runner and writer.",
    birthDate: new Date("1990-01-25"),
    gender: Gender.MA,
    sign: AstrologicalSign.AQUARIUS,
    phone: "567-890-1234",
    photo: null,
    address: "3232 Birch St, Highland",
    coachId: 35,
    createdAt: new Date("2023-11-01")
  },
  {
    id: 36,
    email: "zoey.murphy@example.com",
    name: "Zoey",
    surname: "Murphy",
    description: "CrossFit enthusiast and photographer.",
    birthDate: new Date("1992-02-11"),
    gender: Gender.FE,
    sign: AstrologicalSign.PISCES,
    phone: "678-901-2345",
    photo: null,
    address: "3333 Maple St, Parkview",
    coachId: 36,
    createdAt: new Date("2023-12-01")
  },
  {
    id: 37,
    email: "jackson.bailey@example.com",
    name: "Jackson",
    surname: "Bailey",
    description: "Triathlete and researcher.",
    birthDate: new Date("1991-03-19"),
    gender: Gender.MA,
    sign: AstrologicalSign.ARIES,
    phone: "789-012-3456",
    photo: null,
    address: "3434 Pine St, Woodside",
    coachId: 37,
    createdAt: new Date("2024-01-01")
  },
  {
    id: 38,
    email: "scarlett.james@example.com",
    name: "Scarlett",
    surname: "James",
    description: "Hiker and digital nomad.",
    birthDate: new Date("1987-04-08"),
    gender: Gender.FE,
    sign: AstrologicalSign.TAURUS,
    phone: "890-123-4567",
    photo: null,
    address: "3535 Willow St, Riverbank",
    coachId: 38,
    createdAt: new Date("2024-02-01")
  },
  {
    id: 39,
    email: "levi.cook@example.com",
    name: "Levi",
    surname: "Cook",
    description: "Climber and app developer.",
    birthDate: new Date("1993-05-14"),
    gender: Gender.MA,
    sign: AstrologicalSign.GEMINI,
    phone: "901-234-5678",
    photo: null,
    address: "3636 Spruce St, Cliffside",
    coachId: 39,
    createdAt: new Date("2024-03-01")
  },
  {
    id: 40,
    email: "ellie.watson@example.com",
    name: "Ellie",
    surname: "Watson",
    description: "Dancer and creative director.",
    birthDate: new Date("1995-06-09"),
    gender: Gender.FE,
    sign: AstrologicalSign.CANCER,
    phone: "012-345-6789",
    photo: null,
    address: "3737 Redwood St, Meadowbrook",
    coachId: 40,
    createdAt: new Date("2024-04-01")
  },
  {
    id: 41,
    email: "grayson.flores@example.com",
    name: "Grayson",
    surname: "Flores",
    description: "Runner and web designer.",
    birthDate: new Date("1989-07-25"),
    gender: Gender.MA,
    sign: AstrologicalSign.LEO,
    phone: "123-456-7890",
    photo: null,
    address: "3838 Aspen St, Canyonview",
    coachId: 41,
    createdAt: new Date("2024-05-01")
  },
  {
    id: 42,
    email: "zoe.morris@example.com",
    name: "Zoe",
    surname: "Morris",
    description: "Gymnast and tech entrepreneur.",
    birthDate: new Date("1997-08-11"),
    gender: Gender.FE,
    sign: AstrologicalSign.VIRGO,
    phone: "234-567-8901",
    photo: null,
    address: "3939 Chestnut St, Ridgefield",
    coachId: 42,
    createdAt: new Date("2024-06-01")
  },
  {
    id: 43,
    email: "hunter.bryant@example.com",
    name: "Hunter",
    surname: "Bryant",
    description: "Weightlifter and programmer.",
    birthDate: new Date("1992-09-07"),
    gender: Gender.MA,
    sign: AstrologicalSign.LIBRA,
    phone: "345-678-9012",
    photo: null,
    address: "4040 Oak St, Creekside",
    coachId: 43,
    createdAt: new Date("2024-07-01")
  },
  {
    id: 44,
    email: "layla.reed@example.com",
    name: "Layla",
    surname: "Reed",
    description: "CrossFit trainer and artist.",
    birthDate: new Date("1996-10-22"),
    gender: Gender.FE,
    sign: AstrologicalSign.SCORPIO,
    phone: "456-789-0123",
    photo: null,
    address: "4141 Cedar St, Riverside",
    coachId: 44,
    createdAt: new Date("2024-08-01")
  },
  {
    id: 45,
    email: "benjamin.wood@example.com",
    name: "Benjamin",
    surname: "Wood",
    description: "Swimmer and software engineer.",
    birthDate: new Date("1994-11-09"),
    gender: Gender.MA,
    sign: AstrologicalSign.SAGITTARIUS,
    phone: "567-890-1234",
    photo: null,
    address: "4242 Birch St, Greenwood",
    coachId: 45,
    createdAt: new Date("2024-09-01")
  },
  {
    id: 46,
    email: "aria.cooper@example.com",
    name: "Aria",
    surname: "Cooper",
    description: "Rock climber and photographer.",
    birthDate: new Date("1991-12-18"),
    gender: Gender.FE,
    sign: AstrologicalSign.CAPRICORN,
    phone: "678-901-2345",
    photo: null,
    address: "4343 Maple St, Seaview",
    coachId: 46,
    createdAt: new Date("2024-10-01")
  },
  {
    id: 47,
    email: "ryan.perez@example.com",
    name: "Ryan",
    surname: "Perez",
    description: "Triathlete and data scientist.",
    birthDate: new Date("1987-01-17"),
    gender: Gender.MA,
    sign: AstrologicalSign.AQUARIUS,
    phone: "789-012-3456",
    photo: null,
    address: "4444 Pine St, Hillside",
    coachId: 47,
    createdAt: new Date("2024-11-01")
  },
  {
    id: 48,
    email: "sophie.wright@example.com",
    name: "Sophie",
    surname: "Wright",
    description: "Dancer and marketing specialist.",
    birthDate: new Date("1990-02-09"),
    gender: Gender.FE,
    sign: AstrologicalSign.PISCES,
    phone: "890-123-4567",
    photo: null,
    address: "4545 Willow St, Bayside",
    coachId: 48,
    createdAt: new Date("2024-12-01")
  },
  {
    id: 49,
    email: "gabriel.baker@example.com",
    name: "Gabriel",
    surname: "Baker",
    description: "Hiker and historian.",
    birthDate: new Date("1989-03-14"),
    gender: Gender.MA,
    sign: AstrologicalSign.ARIES,
    phone: "901-234-5678",
    photo: null,
    address: "4646 Spruce St, Valleyview",
    coachId: 49,
    createdAt: new Date("2025-01-01")
  },
  {
    id: 50,
    email: "lucy.scott@example.com",
    name: "Lucy",
    surname: "Scott",
    description: "Gymnast and UX designer.",
    birthDate: new Date("1992-04-03"),
    gender: Gender.FE,
    sign: AstrologicalSign.TAURUS,
    phone: "012-345-6789",
    photo: null,
    address: "4747 Oak St, Hillview",
    coachId: 50,
    createdAt: new Date("2025-02-01")
  },
];
