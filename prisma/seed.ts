import { loadEnvFile } from 'node:process';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../src/database/generated/prisma/client';
import bcrypt from 'bcrypt';

loadEnvFile();

const saltRounds = Number(process.env.SALT_ROUNDS ?? 10);
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const main = async () => {
  const users = [
    {
      username: 'superadmin',
      email: 'superadmin@gmail.com',
      password: 'admin123',
      role: Role.SUPER_ADMIN,
    },
    {
      username: 'zuper',
      email: 'zuper@gmail.com',
      password: 'admin123',
      role: Role.SUPER_ADMIN,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        username: user.username,
        password: await bcrypt.hash(user.password, saltRounds),
        role: user.role,
      },
      create: {
        username: user.username,
        email: user.email,
        password: await bcrypt.hash(user.password, saltRounds),
        role: user.role,
      },
    });
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
