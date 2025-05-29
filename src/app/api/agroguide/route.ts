// app/api/agroguide/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth-node";
import { ContentType, Prisma } from "@prisma/client";
export const runtime = "nodejs";

// GET - /api/agroguide
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50); // Max 50 items
    const skip = (page - 1) * limit;

    const where: Prisma.AgroguideContentWhereInput = { 
      isPublished: true 
    };

    // Category filter
    if (category && category.trim()) {
      where.categoryId = category.trim();
    }

    // Enhanced search functionality - search by title and description
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    // Content type filter
    if (type && (type === "ARTICLE" || type === "VIDEO")) {
      where.contentType = type as ContentType;
    }

    // Execute query with optimized includes
    const [content, total] = await Promise.all([
      prisma.agroguideContent.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        orderBy: [
          { createdAt: "desc" },
          { title: "asc" }
        ],
        skip,
        take: limit,
      }),
      prisma.agroguideContent.count({ where }),
    ]);

    return NextResponse.json({
      content,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
      filters: {
        category,
        search,
        type,
      },
    });
  } catch (error) {
    console.error("Error fetching agroguide content:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch agroguide content",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 },
    );
  }
}

// POST - /api/agroguide
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

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "contentType",
      "url",
      "categoryId",
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Required fields missing: ${missingFields.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate content type
    if (!["ARTICLE", "VIDEO"].includes(data.contentType)) {
      return NextResponse.json(
        { error: "contentType must be either 'ARTICLE' or 'VIDEO'" },
        { status: 400 },
      );
    }

    // Validate category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: "Invalid categoryId. Category does not exist." },
        { status: 400 },
      );
    }

    // Create content
    const content = await prisma.agroguideContent.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        contentType: data.contentType,
        url: data.url.trim(),
        thumbnail: data.thumbnail?.trim() || null,
        categoryId: data.categoryId,
        isPublished: data.isPublished || false,
        userId: session.id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(
      { 
        message: "Agroguide content created successfully", 
        content 
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating agroguide content:", error);
    return NextResponse.json(
      { 
        error: "Failed to create agroguide content",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 },
    );
  }
}