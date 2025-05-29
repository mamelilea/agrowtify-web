// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth-node";
export const runtime = "nodejs";

// GET - /api/categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get("includeCount") === "true";

    let categories;

    if (includeCount) {
      // Include count of published content for each category
      categories = await prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          _count: {
            select: {
              agroguides: {
                where: {
                  isPublished: true,
                },
              },
            },
          },
        },
      });
    } else {
      categories = await prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch categories",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 },
    );
  }
}

// POST - /api/categories
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

    const { name, description } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();

    // Check if category already exists (case-insensitive)
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name: {
          equals: trimmedName,
          mode: "insensitive"
        }
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name: trimmedName,
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(
      { message: "Category created successfully", category },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { 
        error: "Failed to create category",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 },
    );
  }
}