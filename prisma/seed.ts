import {
  PrismaClient,
  UserRole,
  EventType,
  ContentType,
  QuestionType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing old data...");
  await prisma.agroguideContent.deleteMany();
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.user.deleteMany();

  console.log("🔐 Creating admin user...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin@dummy.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@g.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("📚 Creating categories...");
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Workshop" },
      update: {},
      create: {
        name: "Workshop",
        description: "Pelatihan dan workshop komunitas",
      },
    }),
    prisma.category.upsert({
      where: { name: "Rice Farming" },
      update: {},
      create: {
        name: "Rice Farming",
        description: "Techniques and knowledge about rice cultivation.",
      },
    }),
    prisma.category.upsert({
      where: { name: "Vegetable Gardening" },
      update: {},
      create: {
        name: "Vegetable Gardening",
        description: "Tips for growing vegetables in your garden.",
      },
    }),
    prisma.category.upsert({
      where: { name: "Farm Technology" },
      update: {},
      create: {
        name: "Farm Technology",
        description: "Modern technology applications in agriculture.",
      },
    }),
  ]);

  const [
    workshopCategory,
    riceFarmingCategory,
    vegetableGardeningCategory,
    farmTechnologyCategory,
  ] = categories;

  console.log("📅 Creating sample event...");
  await prisma.event.create({
    data: {
      title: "Pelatihan Budidaya Sayur",
      description: "Pelatihan gratis budidaya sayur organik di rumah",
      location: "Kampung Tani, Bandung",
      eventType: EventType.OFFLINE,
      startDate: new Date("2025-05-01T09:00:00Z"),
      endDate: new Date("2025-05-01T15:00:00Z"),
      imageUrl: "https://via.placeholder.com/300x200.png?text=Event+Image",
      organizer: "Komunitas Tani Sejahtera",
      contactInfo: "081234567890",
      website: "https://tani-sejahtera.id",
      isPublished: true,
      categoryId: workshopCategory.id,
      userId: user.id,
    },
  });

  console.log("🌱 Creating plant entries...");
  const plants = [
    {
      name: "Rice",
      description:
        "Rice is the seed of the grass species Oryza sativa or less commonly Oryza glaberrima...",
      careGuide:
        "Rice plants need consistent water, with fields typically flooded...",
    },
    {
      name: "Coffee",
      description:
        "Coffee is a brewed drink prepared from roasted coffee beans...",
      careGuide: "Coffee plants prefer partial shade, consistent moisture...",
    },
    {
      name: "Corn (Maize)",
      description:
        "Corn is a cereal grain first domesticated by indigenous peoples...",
      careGuide: "Corn requires full sun, consistent moisture...",
    },
    {
      name: "Soybean",
      description: "Soybeans are legumes native to East Asia...",
      careGuide: "Soybeans need full sun, moderate water...",
    },
    {
      name: "Cassava",
      description:
        "Cassava is a root vegetable widely consumed in developing countries...",
      careGuide:
        "Cassava is drought-tolerant but performs best with regular watering...",
    },
    {
      name: "Chili Pepper",
      description:
        "Chili peppers are varieties of the berry-fruit of plants from the genus Capsicum...",
      careGuide: "Chili peppers require full sun, moderate water...",
    },
  ];

  for (const plant of plants) {
    await prisma.plant.create({ data: plant });
  }

  console.log("📖 Creating Agroguide content...");
  const agroguideEntries = [
    {
      title: "Modern Rice Farming Techniques",
      description: "Learn about the latest techniques in rice farming...",
      contentType: ContentType.ARTICLE,
      url: "https://example.com/rice-farming-techniques",
      thumbnail: "https://via.placeholder.com/300x200.png?text=Rice+Farming",
      categoryId: riceFarmingCategory.id,
      isPublished: true,
      userId: user.id,
    },
    {
      title: "Video Guide: Rice Planting Season",
      description:
        "A complete video guide showing the best practices for rice planting...",
      contentType: ContentType.VIDEO,
      url: "https://example.com/videos/rice-planting",
      thumbnail:
        "https://via.placeholder.com/300x200.png?text=Rice+Planting+Video",
      categoryId: riceFarmingCategory.id,
      isPublished: true,
      userId: user.id,
    },
    {
      title: "Organic Vegetable Growing for Beginners",
      description:
        "Start your organic vegetable garden with these beginner-friendly tips...",
      contentType: ContentType.ARTICLE,
      url: "https://example.com/organic-vegetables",
      thumbnail: "https://via.placeholder.com/300x200.png?text=Organic+Veggies",
      categoryId: vegetableGardeningCategory.id,
      isPublished: true,
      userId: user.id,
    },
    {
      title: "Urban Farming Solutions",
      description:
        "Explore innovative ways to grow vegetables in limited urban spaces...",
      contentType: ContentType.ARTICLE,
      url: "https://example.com/urban-farming",
      thumbnail: "https://via.placeholder.com/300x200.png?text=Urban+Farming",
      categoryId: vegetableGardeningCategory.id,
      isPublished: true,
      userId: user.id,
    },
    {
      title: "Video Tutorial: Setting Up a Drip Irrigation System",
      description:
        "A step-by-step video guide on installing a drip irrigation system...",
      contentType: ContentType.VIDEO,
      url: "https://example.com/videos/drip-irrigation",
      thumbnail: "https://via.placeholder.com/300x200.png?text=Drip+Irrigation",
      categoryId: farmTechnologyCategory.id,
      isPublished: true,
      userId: user.id,
    },
    {
      title: "Smart Farming Technology in 2025",
      description: "An overview of the latest smart farming technologies...",
      contentType: ContentType.ARTICLE,
      url: "https://example.com/smart-farming-2025",
      thumbnail: "https://via.placeholder.com/300x200.png?text=Smart+Farming",
      categoryId: farmTechnologyCategory.id,
      isPublished: true,
      userId: user.id,
    },
    {
      title: "Unpublished Draft: Sustainable Farming Methods",
      description:
        "This is a draft article about sustainable farming methods...",
      contentType: ContentType.ARTICLE,
      url: "https://example.com/sustainable-farming-draft",
      thumbnail:
        "https://via.placeholder.com/300x200.png?text=Sustainable+Farming",
      categoryId: farmTechnologyCategory.id,
      isPublished: false,
      userId: user.id,
    },
  ];

  for (const entry of agroguideEntries) {
    await prisma.agroguideContent.create({ data: entry });
  }

  console.log("📝 Creating journal questions...");
  const journalQuestions = [
    {
      question: "How are your plants doing today?",
      description: "Describe the general condition of your plants",
      orderIndex: 1,
      isRequired: true,
      type: QuestionType.TEXTAREA,
    },
    {
      question: "Did you water your plants today?",
      description: "Please select yes or no",
      orderIndex: 2,
      isRequired: true,
      options: ["Yes", "No"],
      type: QuestionType.SELECT,
    },
    {
      question: "How much water did you use? (in liters)",
      description: "Enter approximate amount",
      orderIndex: 3,
      isRequired: false,
      type: QuestionType.NUMBER,
    },
    {
      question: "Have you noticed any pests or diseases?",
      description: "Describe any issues you have observed",
      orderIndex: 4,
      isRequired: false,
      type: QuestionType.TEXTAREA,
    },
    {
      question: "What activities did you perform today?",
      description: "Select all that apply",
      orderIndex: 5,
      isRequired: false,
      options: [
        "Watering",
        "Fertilizing",
        "Weeding",
        "Harvesting",
        "Planting",
        "Pruning",
        "Pest control",
      ],
      type: QuestionType.MULTISELECT,
    },
    {
      question: "When did you last fertilize your plants?",
      description: "Enter the date",
      orderIndex: 6,
      isRequired: false,
      type: QuestionType.DATE,
    },
  ];

  for (const questionData of journalQuestions) {
    await prisma.journalQuestion.upsert({
      where: {
        id: `question_${questionData.orderIndex}`,
      },
      update: {},
      create: questionData,
    });
  }

  console.log("✅ Dummy data created successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Error seeding data:", err);
    prisma.$disconnect();
    process.exit(1);
  });
