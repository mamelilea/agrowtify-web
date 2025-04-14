import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth-node';
import { ContentType, Prisma } from '@prisma/client';
export const runtime = 'nodejs';

// GET - /api/agroguide
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const type = searchParams.get('type'); 
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        

        const where: Prisma.AgroguideContentWhereInput = { isPublished: true };

        if (category) {
            where.categoryId = category;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type) {
            if (type === 'ARTICLE' || type === 'VIDEO') {
                where.contentType = type as ContentType;
              }
        }

        const content = await prisma.agroguideContent.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limit,
        });

        const total = await prisma.agroguideContent.count({ where });

        return NextResponse.json({
            content,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error('Error fetching agroguide content:', error);
        return NextResponse.json(
            { error: 'Failed to fetch agroguide content' },
            { status: 500 }
        );
    }
}

// POST - /api/agroguide
export async function POST(request: NextRequest) {
    try {
        const session = await getSessionFromRequest(request);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.id }
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 403 }
            );
        }

        const data = await request.json();

        const requiredFields = ['title', 'description', 'contentType', 'url', 'categoryId'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        const content = await prisma.agroguideContent.create({
            data: {
                ...data,
                userId: session.id,
            },
            include: {
                category: true,
            }
        });

        return NextResponse.json(
            { message: 'Agroguide content created successfully', content },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating agroguide content:', error);
        return NextResponse.json(
            { error: 'Failed to create agroguide content' },
            { status: 500 }
        );
    }
}