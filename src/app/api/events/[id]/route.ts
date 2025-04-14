import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth-node';

export const runtime = 'nodejs';

type RouteParams = {
  params: { id: string }
}

// GET
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (existingEvent.userId !== user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to update this event' },
        { status: 403 }
      );
    }

    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const updatedEvent = await prisma.event.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}