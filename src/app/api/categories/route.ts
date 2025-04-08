import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { getSessionFromRequest } from '../../../lib/auth-node';
export const runtime = 'nodejs';

// GET - /api/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - /api/categories
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { name, description } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409 }
      );
    }
    
    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });
    
    return NextResponse.json(
      { message: 'Category created successfully', category },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}