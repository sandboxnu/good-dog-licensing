import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      password: "alicePasswod",
    },
  });
  const aliceSession = await prisma.session.upsert({
    where: { token: "aliceToken" },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: alice.id,
      token: "aliceToken",
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@gmail.com" },
    update: {},
    create: {
      email: "bob@gmail.com",
      name: "Bob Jones",
      password: "bobPassword",
    },
  });
  const bobSession1 = await prisma.session.upsert({
    where: { token: "bobToken1" },
    update: {
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
    create: {
      userId: bob.id,
      token: "bobToken1",
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
  });
  const bobSession2 = await prisma.session.upsert({
    where: { token: "bobToken2" },
    update: {
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
    create: {
      userId: bob.id,
      token: "bobToken2",
      expiresAt: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10),
      ),
    },
  });

  const eve = await prisma.user.upsert({
    where: { email: "eve@outlook.com" },
    update: {},
    create: {
      email: "eve@outlook.com",
      name: "Eve Smith",
      password: "evePassword",
    },
  });
  const eveSession = await prisma.session.upsert({
    where: { token: "eveToken" },
    update: {
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
    create: {
      userId: eve.id,
      token: "eveToken",
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
