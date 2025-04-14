const { PrismaClient, UserRole, EventType, ContentType } = require('@prisma/client');
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

  const workshopCategory = await prisma.category.create({
    data: {
      name: 'Workshop',
      description: 'Pelatihan dan workshop komunitas',
    },
  });

  const riceFarmingCategory = await prisma.category.create({
    data: {
      name: 'Rice Farming',
      description: 'Techniques and knowledge about rice cultivation.',
    },
  });

  const vegetableGardeningCategory = await prisma.category.create({
    data: {
      name: 'Vegetable Gardening',
      description: 'Tips for growing vegetables in your garden.',
    },
  });

  const farmTechnologyCategory = await prisma.category.create({
    data: {
      name: 'Farm Technology',
      description: 'Modern technology applications in agriculture.',
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
      categoryId: workshopCategory.id,
      userId: user.id,
    },
  });

  const agroguideEntries = [
    {
      title: 'Modern Rice Farming Techniques',
      description: 'Learn about the latest techniques in rice farming that can improve yield and reduce resource usage. This comprehensive guide covers water management, pest control, and harvesting methods.',
      contentType: ContentType.ARTICLE,
      url: 'https://example.com/rice-farming-techniques',
      thumbnail: 'https://via.placeholder.com/300x200.png?text=Rice+Farming',
      categoryId: riceFarmingCategory.id,
      isPublished: true,
      userId: user.id
    },
    {
      title: 'Video Guide: Rice Planting Season',
      description: 'A complete video guide showing the best practices for rice planting during the main season. Watch expert farmers demonstrate proper techniques.',
      contentType: ContentType.VIDEO,
      url: 'https://example.com/videos/rice-planting',
      thumbnail: 'https://via.placeholder.com/300x200.png?text=Rice+Planting+Video',
      categoryId: riceFarmingCategory.id,
      isPublished: true,
      userId: user.id
    },
    {
      title: 'Organic Vegetable Growing for Beginners',
      description: 'Start your organic vegetable garden with these beginner-friendly tips. This article covers soil preparation, organic pest control, and seasonal planting guides.',
      contentType: ContentType.ARTICLE,
      url: 'https://example.com/organic-vegetables',
      thumbnail: 'https://via.placeholder.com/300x200.png?text=Organic+Veggies',
      categoryId: vegetableGardeningCategory.id,
      isPublished: true,
      userId: user.id
    },
    {
      title: 'Urban Farming Solutions',
      description: 'Explore innovative ways to grow vegetables in limited urban spaces. Learn about vertical gardening, container gardening, and hydroponic systems.',
      contentType: ContentType.ARTICLE,
      url: 'https://example.com/urban-farming',
      thumbnail: 'https://via.placeholder.com/300x200.png?text=Urban+Farming',
      categoryId: vegetableGardeningCategory.id,
      isPublished: true,
      userId: user.id
    },
    {
      title: 'Video Tutorial: Setting Up a Drip Irrigation System',
      description: 'A step-by-step video guide on installing a drip irrigation system for your garden to save water and improve plant health.',
      contentType: ContentType.VIDEO,
      url: 'https://example.com/videos/drip-irrigation',
      thumbnail: 'https://via.placeholder.com/300x200.png?text=Drip+Irrigation',
      categoryId: farmTechnologyCategory.id,
      isPublished: true,
      userId: user.id
    },
    {
      title: 'Smart Farming Technology in 2025',
      description: 'An overview of the latest smart farming technologies including IoT sensors, drones, and AI-based crop monitoring systems.',
      contentType: ContentType.ARTICLE,
      url: 'https://example.com/smart-farming-2025',
      thumbnail: 'https://via.placeholder.com/300x200.png?text=Smart+Farming',
      categoryId: farmTechnologyCategory.id,
      isPublished: true,
      userId: user.id
    },
    {
      title: 'Unpublished Draft: Sustainable Farming Methods',
      description: 'This is a draft article about sustainable farming methods that has not been published yet.',
      contentType: ContentType.ARTICLE,
      url: 'https://example.com/sustainable-farming-draft',
      thumbnail: 'https://via.placeholder.com/300x200.png?text=Sustainable+Farming',
      categoryId: farmTechnologyCategory.id,
      isPublished: false,
      userId: user.id
    }
  ];

  for (const entry of agroguideEntries) {
    await prisma.agroguideContent.create({
      data: entry
    });
  }

  console.log('✅ Dummy data created successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error('❌ Error seeding data:', err);
    prisma.$disconnect();
    process.exit(1);
  });