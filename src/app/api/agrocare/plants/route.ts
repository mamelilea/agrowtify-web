// src/app/api/agrocare/plants/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth-node";
export const runtime = "nodejs";

// GET - /api/agrocare/plants
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if there are any plants in the database
    const plantCount = await prisma.plant.count();

    if (plantCount === 0) {
      // If no plants exist, create default ones
      await createDefaultPlants();
    }

    const plants = await prisma.plant.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ plants });
  } catch (error) {
    console.error("Error fetching plants:", error);
    return NextResponse.json(
      { error: "Failed to fetch plants" },
      { status: 500 },
    );
  }
}

// Function to create default plants if none exist
async function createDefaultPlants() {
  const defaultPlants = [
    {
      name: "Rice",
      description:
        "Rice is the seed of the grass species Oryza sativa or less commonly Oryza glaberrima. As a cereal grain, it is the most widely consumed staple food for a large part of the world's human population, especially in Asia.",
      careGuide:
        "Rice plants need consistent water, with fields typically flooded. They prefer full sun and temperatures between 20-30°C. Regular fertilization and pest monitoring are essential.",
    },
    {
      name: "Coffee",
      description:
        "Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain Coffea species. When coffee berries turn from green to bright red – indicating ripeness – they are picked, processed, and dried.",
      careGuide:
        "Coffee plants prefer partial shade, consistent moisture but not waterlogged soil, and temperatures between 15-24°C. They benefit from regular organic fertilizer and protection from frost.",
    },
    {
      name: "Corn (Maize)",
      description:
        "Corn is a cereal grain first domesticated by indigenous peoples in southern Mexico about 10,000 years ago. It is a staple food worldwide and also used for animal feed and many industrial applications.",
      careGuide:
        "Corn requires full sun, consistent moisture, and temperatures between 16-35°C. Plant in well-draining soil, fertilize regularly, and monitor for common pests like corn borers.",
    },
    {
      name: "Soybean",
      description:
        "Soybeans are legumes native to East Asia, widely grown for their edible bean, which has numerous uses. The plant is classed as an oil seed rather than a pulse.",
      careGuide:
        "Soybeans need full sun, moderate water, and warm temperatures between 20-30°C. As legumes, they fix nitrogen but still benefit from phosphorus and potassium fertilizers.",
    },
    {
      name: "Cassava",
      description:
        "Cassava is a root vegetable widely consumed in developing countries. It provides some carbohydrate nutrition and can be prepared similar to potatoes.",
      careGuide:
        "Cassava is drought-tolerant but performs best with regular watering. It needs full sun, well-draining soil, and temperatures above 18°C. Minimal fertilization is required.",
    },
    {
      name: "Chili Pepper",
      description:
        "Chili peppers are varieties of the berry-fruit of plants from the genus Capsicum, members of the nightshade family Solanaceae, cultivated for their pungency.",
      careGuide:
        "Chili peppers require full sun, moderate water, and warm temperatures between 20-32°C. They benefit from regular feeding with a potassium-rich fertilizer during fruiting.",
    },
  ];

  for (const plant of defaultPlants) {
    await prisma.plant.create({
      data: plant,
    });
  }

  console.log("Default plants created successfully");
}

// POST - /api/agrocare/plants
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const data = await request.json();

    const requiredFields = ["name", "description", "careGuide"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    const plant = await prisma.plant.create({
      data,
    });

    return NextResponse.json(
      { message: "Plant created successfully", plant },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating plant:", error);
    return NextResponse.json(
      { error: "Failed to create plant" },
      { status: 500 },
    );
  }
}
