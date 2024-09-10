import {
  AstrologicalSign,
  ClothesType,
  EncounterStatus,
  Gender,
  PaymentMethod,
  Permission,
  PhotoFormat,
  PrismaClient,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const NUMBER_OF_EMPLOYEES = 150;
const NUMBER_OF_CUSTOMERS = 450;
const NUMBER_OF_COUNTRIES = 10;
const NUMBER_OF_PAYMENTS = 1200;
const NUMBER_OF_EVENTS = 1400;
const NUMBER_OF_ENCOUNTERS = 1100;
const NUMBER_OF_CLOTHES = 1800;
const NUMBER_OF_TIPS = 320;

async function main(): Promise<void> {
  console.log('Seeding database...');

  // Clear all data
  await prisma.tip.deleteMany();
  await prisma.clothe.deleteMany();
  await prisma.encounter.deleteMany();
  await prisma.event.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.employee.deleteMany();

  console.log('Old data cleared');

  const existingEmails = await prisma.employee.findMany({
    select: {
      email: true,
    },
  });
  for (let i = 0; i < NUMBER_OF_EMPLOYEES; i++) {
    let randomEmail = faker.internet.email();
    while (existingEmails.some((e) => e.email === randomEmail)) {
      randomEmail = faker.internet.email();
    }
    await prisma.employee.create({
      data: {
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: randomEmail,
        birthDate: faker.date.past(),
        gender: faker.helpers.arrayElement([Gender.MA, Gender.FE, Gender.OT]),
        permission: faker.helpers.arrayElement([
          Permission.MANAGER,
          Permission.COACH,
        ]),
        role: faker.person.jobTitle(),
      },
    });
    existingEmails.push({ email: randomEmail });
  }

  console.log('Employees created');

  const availableCountries: string[] = [];

  for (let i = 0; i < NUMBER_OF_COUNTRIES; i++) {
    const country = faker.location.country();
    if (!availableCountries.includes(country)) {
      availableCountries.push(country);
    }
  }
  for (let i = 0; i < NUMBER_OF_CUSTOMERS; i++) {
    await prisma.customer.create({
      data: {
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        description: faker.lorem.sentence(),
        birthDate: faker.date.past(),
        gender: faker.helpers.arrayElement([Gender.MA, Gender.FE, Gender.OT]),
        sign: faker.helpers.arrayElement(Object.values(AstrologicalSign)),
        phone: faker.phone.number(),
        photo: faker.image.avatar(),
        photoFormat: faker.helpers.arrayElement([
          PhotoFormat.JPEG,
          PhotoFormat.PNG,
          PhotoFormat.GIF,
        ]),
        country: faker.helpers.arrayElement(availableCountries),
        createdAt: faker.date.recent({ days: 60 }),
      },
    });
  }

  console.log('Customers created');

  const customers = await prisma.customer.findMany({
    select: {
      id: true,
    },
  });

  for (let i = 0; i < NUMBER_OF_PAYMENTS; i++) {
    await prisma.payment.create({
      data: {
        date: faker.date.recent(),
        amount: faker.number.int({ min: 10, max: 100 }),
        method: faker.helpers.arrayElement([
          PaymentMethod.CARD,
          PaymentMethod.BANK_TRANSFER,
          PaymentMethod.PAYPAL,
        ]),
        customerId: faker.helpers.arrayElement(customers).id,
      },
    });
  }

  console.log('Payments created');

  const employees = await prisma.employee.findMany({
    select: {
      id: true,
    },
  });

  for (let i = 0; i < NUMBER_OF_EVENTS; i++) {
    const biggestLegacyId = await prisma.event.findFirst({
      orderBy: { legacyId: 'desc' },
    });
    await prisma.event.create({
      data: {
        legacyId: biggestLegacyId?.legacyId ? biggestLegacyId.legacyId + 1 : 1,
        title: faker.lorem.words(3),
        date: faker.date.recent({ days: 60 }),
        maxParticipants: faker.number.int({ min: 1, max: 10 }),
        location: {
          create: {
            name: faker.location.city(),
            x: faker.location.latitude().toString(),
            y: faker.location.longitude().toString(),
          },
        },
        employee: {
          connect: {
            id: faker.helpers.arrayElement(employees).id,
          },
        },
        type: faker.lorem.word(),
      },
    });
  }

  console.log('Events created');

  for (let i = 0; i < NUMBER_OF_ENCOUNTERS; i++) {
    await prisma.encounter.create({
      data: {
        customerId: faker.helpers.arrayElement(customers).id,
        date: faker.date.recent({ days: 60 }),
        rating: faker.number.int({ min: 0, max: 5 }),
        comment: faker.lorem.sentence(),
        source: faker.helpers.arrayElement([
          'Social media',
          'Dating app',
          'Friends',
          'Family',
          'Other',
        ]),
        status: faker.helpers.arrayElement([
          EncounterStatus.PENDING,
          EncounterStatus.DONE,
          EncounterStatus.CANCELED,
        ]),
        isPositive: faker.datatype.boolean(),
      },
    });
  }

  console.log('Encounters created');

  for (let i = 0; i < NUMBER_OF_CLOTHES; i++) {
    await prisma.clothe.create({
      data: {
        type: faker.helpers.arrayElement(Object.values(ClothesType)),
        image: faker.image.url(),
        customers: {
          connect: [{ id: faker.helpers.arrayElement(customers).id }],
        },
      },
    });
  }

  console.log('Clothes created');

  for (let i = 0; i < NUMBER_OF_TIPS; i++) {
    await prisma.tip.create({
      data: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
      },
    });
  }
}

main()
  .then(() => {
    console.log('Seed completed');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
