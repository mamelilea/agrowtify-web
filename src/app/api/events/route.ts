import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth-node';
import type { EventType, Prisma } from '@prisma/client';
export const runtime = 'nodejs';

// GET - /api/events
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const type = searchParams.get('type');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const where: Prisma.EventWhereInput = { isPublished: true };

        if (category) {
            where.categoryId = category;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { organizer: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type) {
            if (type === 'ONLINE' || type === 'OFFLINE' || type === 'HYBRID') {
                where.eventType = type as EventType;
              }
        }

        const events = await prisma.event.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: {
                startDate: 'asc',
            },
            skip,
            take: limit,
        });

        const total = await prisma.event.count({ where });

        return NextResponse.json({
            events,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

// POST - /api/events
export async function POST(request: NextRequest) {
    try {
        const user = await getSessionFromRequest(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const data = await request.json();

        const requiredFields = ['title', 'description', 'eventType', 'startDate', 'endDate', 'organizer', 'categoryId'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        const event = await prisma.event.create({
            data: {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                userId: user.id,
            },
            include: {
                category: true,
            }
        });

        return NextResponse.json(
            { message: 'Event created successfully', event },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}