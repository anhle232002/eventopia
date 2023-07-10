import { Event, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
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

  for (let i = 0; i <= 50; i++) {
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
        city: 'Danang',
        duration: '60m',
        country: 'VietNam',
        isCancelled: false,
        isOnlineEvent: Date.now() % 2 == 0,
        language: 'vi',
        sold: 0,
        timezone: 'Asia/Ho_Chi_Minh',
        startDate: faker.date.between({ from: '2023-07-01T00:00:00.000Z', to: '2023-08-30T00:00:00.000Z' }),
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

async function main() {
  const organizerId = await generateAdmin();
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
