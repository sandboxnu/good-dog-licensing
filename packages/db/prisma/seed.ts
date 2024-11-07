import { PrismaClient } from "@prisma/client";

import { hashPassword } from "@good-dog/auth/password";

const prisma = new PrismaClient();
async function main() {
  // Alice has a session that expires in the future
  await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {
      sessions: {
        update: {
          where: { id: "23" },
          data: {
            expiresAt: new Date(
              new Date().setFullYear(new Date().getFullYear() + 10),
            ),
          },
        },
      },
    },
    create: {
      id: "7",
      email: "alice@prisma.io",
      name: "Alice",
      hashedPassword: await hashPassword("alicePassword"),
      sessions: {
        create: {
          id: "23",
          expiresAt: new Date(
            new Date().setFullYear(new Date().getFullYear() + 10),
          ),
        },
      },
    },
  });

  // Bob has a session that expired in the past and another that expires in the future
  await prisma.user.upsert({
    where: { email: "bob@gmail.com" },
    update: {
      sessions: {
        updateMany: [
          {
            where: { id: "12" },
            data: {
              expiresAt: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1),
              ),
            },
          },
          {
            where: { id: "45" },
            data: {
              expiresAt: new Date(
                new Date().setFullYear(new Date().getFullYear() + 10),
              ),
            },
          },
        ],
      },
    },
    create: {
      id: "9",
      email: "bob@gmail.com",
      name: "Bob Jones",
      hashedPassword: await hashPassword("bobPassword"),
      sessions: {
        createMany: {
          data: [
            {
              id: "12",
              expiresAt: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1),
              ),
            },
            {
              id: "45",
              expiresAt: new Date(
                new Date().setFullYear(new Date().getFullYear() + 10),
              ),
            },
          ],
        },
      },
    },
  });

  // Eve has a session that expired in the past
  await prisma.user.upsert({
    where: { email: "eve@outlook.com" },
    update: {
      sessions: {
        update: {
          where: { id: "78" },
          data: {
            expiresAt: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1),
            ),
          },
        },
      },
    },
    create: {
      id: "56",
      email: "eve@outlook.com",
      name: "Eve Smith",
      hashedPassword: await hashPassword("evePassword"),
      sessions: {
        create: {
          id: "78",
          expiresAt: new Date(
            new Date().setFullYear(new Date().getFullYear() - 1),
          ),
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
