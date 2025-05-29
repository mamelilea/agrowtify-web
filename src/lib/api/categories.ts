// lib/api/categories.ts
import prisma from "@/lib/db";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}