import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      id: 7,
      email: "alice@prisma.io",
      name: "Alice",
      password: "alicePasswod",
    },
  });
  const aliceSession = await prisma.session.upsert({
    where: { id: 23 },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: alice.id,
      id: 23,
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@gmail.com" },
    update: {},
    create: {
      id: 9,
      email: "bob@gmail.com",
      name: "Bob Jones",
      password: "bobPassword",
    },
  });
  const bobSession1 = await prisma.session.upsert({
    where: { id: 12 },
    update: {
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
    create: {
      userId: bob.id,
      id: 12,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
  });
  const bobSession2 = await prisma.session.upsert({
    where: { id: 45 },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: bob.id,
      id: 45,
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });

  const eve = await prisma.user.upsert({
    where: { email: "eve@outlook.com" },
    update: {},
    create: {
      id: 56,
      email: "eve@outlook.com",
      name: "Eve Smith",
      password: "evePassword",
    },
  });
  const eveSession = await prisma.session.upsert({
    where: { id: 78 },
    update: {
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
    create: {
      userId: eve.id,
      id: 78,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
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
