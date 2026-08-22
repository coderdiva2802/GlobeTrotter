import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  console.log('🌱 Starting database seed for GlobeTrotter auth testing...\n');

  const defaultPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const testAccounts = [
    {
      firstName: 'Aliza',
      lastName: 'Saiyed',
      email: 'traveler@globetrotter.com',
      password: 'Traveler123!',
      phoneNumber: '+91 9876543210',
      city: 'Mumbai',
      country: 'India',
      bio: 'Passionate travel blogger exploring hidden gems and local culinary adventures.',
      role: 'USER',
      preference: {
        language: 'en',
        preferredCurrency: 'INR',
        budgetLevel: 'MEDIUM',
        travelStyle: 'RELAXED',
      },
    },
    {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@globetrotter.com',
      password: 'AdminSecret123!',
      phoneNumber: '+1 5550192834',
      city: 'San Francisco',
      country: 'United States',
      bio: 'GlobeTrotter platform system administrator.',
      role: 'ADMIN',
      preference: {
        language: 'en',
        preferredCurrency: 'USD',
        budgetLevel: 'LUXURY',
        travelStyle: 'CULTURAL',
      },
    },
    {
      firstName: 'Liam',
      lastName: 'Vance',
      email: 'adventurer@globetrotter.com',
      password: 'Explore123!',
      phoneNumber: '+49 3012345678',
      city: 'Berlin',
      country: 'Germany',
      bio: 'Solo backpacker searching for high-altitude treks and wilderness camping.',
      role: 'USER',
      preference: {
        language: 'en',
        preferredCurrency: 'EUR',
        budgetLevel: 'LOW',
        travelStyle: 'ADVENTUROUS',
      },
    },
  ];

  for (const account of testAccounts) {
    const accountPasswordHash = account.password
      ? await bcrypt.hash(account.password, 10)
      : hashedPassword;

    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        firstName: account.firstName,
        lastName: account.lastName,
        passwordHash: accountPasswordHash,
        phoneNumber: account.phoneNumber,
        city: account.city,
        country: account.country,
        bio: account.bio,
        role: account.role,
      },
      create: {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        passwordHash: accountPasswordHash,
        phoneNumber: account.phoneNumber,
        city: account.city,
        country: account.country,
        bio: account.bio,
        role: account.role,
      },
    });

    await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: { ...account.preference },
      create: {
        userId: user.id,
        ...account.preference,
      },
    });

    console.log(`✅ Seeded account: ${account.email} (${account.role})`);
  }

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
