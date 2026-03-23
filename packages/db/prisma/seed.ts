import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const realUsers = [
  {
    firstName: "Jordan",
    lastName: "Praissman",
    email: "praissman.j@northeastern.edu",
  },
  {
    firstName: "Gavin",
    lastName: "Normand",
    email: "normand.g@northeastern.edu",
  },
  {
    firstName: "Victoria",
    lastName: "Whisnant",
    email: "whisnant.v@northeastern.edu",
  },
  {
    firstName: "Lauren",
    lastName: "Brissette",
    email: "brissette.l@northeastern.edu",
  },
  {
    firstName: "Harini",
    lastName: "Avula",
    email: "avula.ha@northeastern.edu",
  },
  {
    firstName: "Amoli",
    lastName: "Patel",
    email: "patel.amol@northeastern.edu",
  },
  {
    firstName: "Wesley",
    lastName: "Tran",
    email: "tran.we@northeastern.edu",
  },
  {
    firstName: "Mia",
    lastName: "Avni",
    email: "avni.m@northeastern.edu",
  },
  {
    firstName: "Mayah",
    lastName: "Hamaoui",
    email: "hamaoui.m@northeastern.edu",
  },
  {
    firstName: "David",
    lastName: "Herlihy",
    email: "d.herlihy@northeastern.edu",
  },
  {
    firstName: "Liam",
    lastName: "Waters",
    email: "waters.li@northeastern.edu",
  },
];

async function main() {
  // Plaintext: Password1!
  const hashedPassword =
    "$2a$10$ghWIDof5gMFi7D2Deea.C.HptdD0nvsYIqEFpWuQVvoyJ8HdhPtR2";

  // Create real admins and moderators
  const userUpserts = realUsers.flatMap((user) => {
    const [localPart, domainPart] = user.email.split("@");

    return [
      prisma.user.upsert({
        where: { email: user.email },
        update: {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: "1231231234",
          hashedPassword: hashedPassword,
          role: "ADMIN",
        },
        create: {
          email: user.email,
          phoneNumber: "1231231234",
          hashedPassword: hashedPassword,
          firstName: user.firstName,
          lastName: user.lastName,
          role: "ADMIN",
        },
      }),
      prisma.user.upsert({
        where: { email: `${localPart}-pnr@example.com` },
        update: {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: "1231231234",
          hashedPassword: hashedPassword,
          role: "MODERATOR",
        },
        create: {
          email: `${localPart}-pnr@example.com`,
          phoneNumber: "1231231234",
          hashedPassword: hashedPassword,
          firstName: user.firstName,
          lastName: user.lastName,
          role: "MODERATOR",
        },
      }),
    ];
  });

  await prisma.$transaction(userUpserts);
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
