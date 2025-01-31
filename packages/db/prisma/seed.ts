import { PrismaClient } from "@prisma/client";

import { passwordService } from "@good-dog/auth/password";

const prisma = new PrismaClient();
async function main() {
  // Alice has a session that expires in the future
  await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {
      sessions: {
        update: {
          where: { sessionId: "23" },
          data: {
            expiresAt: new Date(
              new Date().setFullYear(new Date().getFullYear() + 10),
            ),
          },
        },
      },
    },
    create: {
      userId: "7",
      email: "alice@prisma.io",
      firstName: "Alice",
      lastName: "Smith",
      role: "MEDIA_MAKER",
      hashedPassword: await passwordService.hashPassword("alicePassword"),
      sessions: {
        create: {
          sessionId: "23",
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
            where: { sessionId: "12" },
            data: {
              expiresAt: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1),
              ),
            },
          },
          {
            where: { sessionId: "45" },
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
      userId: "9",
      email: "bob@gmail.com",
      firstName: "Bob",
      lastName: "Jones",
      role: "MUSICIAN",
      hashedPassword: await passwordService.hashPassword("bobPassword"),
      sessions: {
        createMany: {
          data: [
            {
              sessionId: "12",
              expiresAt: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1),
              ),
            },
            {
              sessionId: "45",
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
          where: { sessionId: "78" },
          data: {
            expiresAt: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1),
            ),
          },
        },
      },
    },
    create: {
      userId: "56",
      email: "eve@outlook.com",
      firstName: "Eve",
      lastName: "Brown",
      role: "MEDIA_MAKER",
      hashedPassword: await passwordService.hashPassword("evePassword"),
      sessions: {
        create: {
          sessionId: "78",
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
