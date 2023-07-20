import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { categories } from './seed-data/categories';
import { locations } from './seed-data/location';
const prisma = new PrismaClient();

function slugify(str) {
  // Remove special characters
  const cleanedStr = str.replace(/[^\w\s-]/g, '');

  // Convert spaces to hyphens
  const slug = cleanedStr.replace(/\s+/g, '-');

  // Convert to lowercase
  return slug.toLowerCase();
}

prisma.$use(async (params, next) => {
  let result = await next(params);

  if (params.model === 'Event' && params.action === 'create') {
    result = await prisma.event.update({
      where: { id: result.id },
      data: { slug: slugify(`${result.title} ${result.id}`) },
    });
  }

  return result;
});

const generateEvents = async (organizerId: string) => {
  await prisma.event.deleteMany();

  for (let i = 0; i <= 100; i++) {
    const randomLocation = Math.floor(Math.random() * 3);
    await prisma.event.create({
      data: {
        organizerId,
        title: `Danang ${faker.lorem.word(10)} Festival`,
        shortDescription: faker.lorem.paragraph(3),
        description: faker.lorem.paragraphs(10),
        location: 'Danang, Vietnam',
        images: [{ url: faker.image.urlPicsumPhotos({ width: 950, height: 450 }) }],
        totalTickets: 100,
        ticketPrice: 20,
        city: locations[randomLocation].city,
        duration: '60m',
        country: locations[randomLocation].country,
        isCancelled: false,
        isOnlineEvent: Date.now() % 2 == 0,
        language: 'vi',
        sold: 0,
        latitude: faker.location.latitude({
          min: locations[randomLocation].lat[0],
          max: locations[randomLocation].lat[1],
        }),
        longtitude: faker.location.longitude({
          min: locations[randomLocation].long[0],
          max: locations[randomLocation].long[1],
        }),
        timezone: locations[randomLocation].timezone,
        startDate: faker.date.between({ from: '2023-07-020T00:00:00.000Z', to: '2023-08-30T00:00:00.000Z' }),
        categories: {
          connect: {
            name: categories[Math.floor(Math.random() * 40)].name,
          },
        },
      },
    });
  }

  // await prisma.event.createMany({ data: events });
};

async function generateAdmin() {
  const user = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      familyName: 'admin',
      givenName: 'admin',
      role: 'organizer',
      picture: faker.image.avatar(),
      password: bcrypt.hashSync('123123', 10),
      accounts: {
        create: {
          providerType: 'local',
          verified: false,
          providerAccountId: '',
          locale: 'vi',
        },
      },
    },
  });

  const organizer = await prisma.organizer.create({
    data: {
      email: 'admin@gmail.com',
      description: faker.lorem.paragraph(3),
      phoneNumber: faker.phone.number('+84 ### ### ###'),
      picture: faker.image.avatar(),
      name: faker.lorem.sentence(20),
      userId: user.id,
    },
  });

  return organizer.id;
}

async function generateCategories() {
  await prisma.category.createMany({ data: categories });
}

async function main() {
  // await prisma.$executeRaw`DROP DATABASE IF EXISTS EVENTS_AROUND;`;
  const organizerId = await generateAdmin();
  await generateCategories();
  await generateEvents(organizerId);
}

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
