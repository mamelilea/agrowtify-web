const { PrismaClient, UserRole, EventType } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Admin Dummy',
      email: 'admin@dummy.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  const category = await prisma.category.create({
    data: {
      name: 'Workshop',
      description: 'Pelatihan dan workshop komunitas',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Pelatihan Budidaya Sayur',
      description: 'Pelatihan gratis budidaya sayur organik di rumah',
      location: 'Kampung Tani, Bandung',
      eventType: EventType.OFFLINE,
      startDate: new Date('2025-05-01T09:00:00Z'),
      endDate: new Date('2025-05-01T15:00:00Z'),
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Event+Image',
      organizer: 'Komunitas Tani Sejahtera',
      contactInfo: '081234567890',
      website: 'https://tani-sejahtera.id',
      isPublished: true,
      categoryId: category.id,
      userId: user.id,
    },
  });

  console.log('✅ Dummy data created successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error('❌ Error seeding data:', err);
    prisma.$disconnect();
    process.exit(1);
  });
