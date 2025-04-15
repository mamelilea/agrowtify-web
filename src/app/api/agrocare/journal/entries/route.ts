import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth-node';
import { uploadMedia } from '@/lib/cloudinary';

export const runtime = 'nodejs';

interface Answer {
    questionId: string;
    text: string;
  }

  interface MediaUploadResult {
    secure_url: string;
    public_id: string;
  }

// GET - /api/agrocare/journal/entries
export async function GET(request: NextRequest) {
    try {
        const session = await getSessionFromRequest(request);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');
        const plantId = searchParams.get('plantId');

        // Build the date filter
        let dateFilter = {};
        if (month && year) {
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);

            dateFilter = {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            };
        }

        // Build the plant filter
        let plantFilter = {};
        if (plantId) {
            plantFilter = {
                plantId
            };
        }

        const journals = await prisma.journal.findMany({
            where: {
                userId: session.id,
                ...dateFilter,
                ...plantFilter
            },
            include: {
                answers: {
                    include: {
                        question: true
                    }
                },
                media: true,
                plant: true
            },
            orderBy: {
                date: 'desc'
            }
        });

        return NextResponse.json({ journals });
    } catch (error) {
        console.error('Error fetching journal entries:', error);
        return NextResponse.json(
            { error: 'Failed to fetch journal entries' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSessionFromRequest(request);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // We need to handle multipart form data for files
        const formData = await request.formData();

        // Extract journal data
        const title = formData.get('title') as string || null;
        const date = formData.get('date') ? new Date(formData.get('date') as string) : new Date();
        const plantId = formData.get('plantId') as string || null;

        // Extract answers data
        const answersData: Answer[] = JSON.parse(formData.get('answers') as string || '[]');

        // Validate answers data
        const questions = await prisma.journalQuestion.findMany({
            where: {
                isRequired: true
            }
        });

        const requiredQuestionIds = questions.map(q => q.id);
        const submittedQuestionIds = answersData.map((answer: Answer) => answer.questionId);

        const missingRequiredQuestions = requiredQuestionIds.filter(
            id => !submittedQuestionIds.includes(id)
        );

        if (missingRequiredQuestions.length > 0) {
            return NextResponse.json(
                { error: 'Please answer all required questions' },
                { status: 400 }
            );
        }

        // Create the journal entry
        const journal = await prisma.journal.create({
            data: {
                title,
                date,
                plantId,
                userId: session.id
            }
        });

        // Create the answers
        const answers = await Promise.all(
            answersData.map((answer: Answer) =>
                prisma.answer.create({
                    data: {
                        text: answer.text,
                        journalId: journal.id,
                        questionId: answer.questionId
                    }
                })
            )
        );

        // Handle media uploads (images and videos)
        const mediaFiles = formData.getAll('media');
        const mediaEntries = [];

        if (mediaFiles.length > 0) {
            if (mediaFiles.length > 5) {
                return NextResponse.json(
                    { error: 'Maximum 5 media files allowed' },
                    { status: 400 }
                );
            }

            for (const file of mediaFiles) {
                if (!(file instanceof File)) continue;

                const buffer = Buffer.from(await file.arrayBuffer());
                const fileType = file.type.startsWith('image/') ? 'image' : 'video';

                if (fileType === 'video' && file.size > 100 * 1024 * 1024) { // 100MB limit for videos
                    return NextResponse.json(
                        { error: 'Video file size should be less than 100MB' },
                        { status: 400 }
                    );
                }

                if (fileType === 'image' && file.size > 10 * 1024 * 1024) { // 10MB limit for images
                    return NextResponse.json(
                        { error: 'Image file size should be less than 10MB' },
                        { status: 400 }
                    );
                }

                // Upload to Cloudinary
                const result = await uploadMedia(buffer, {
                    folder: `agrocare/journals/${journal.id}`,
                    resource_type: fileType as 'image' | 'video',
                    filename: file.name
                }) as MediaUploadResult;

                // Save the media reference in the database
                const media = await prisma.media.create({
                    data: {
                        url: result.secure_url,
                        fileKey: result.public_id,
                        type: fileType === 'image' ? 'IMAGE' : 'VIDEO',
                        journalId: journal.id
                    }
                });

                mediaEntries.push(media);
            }
        }

        return NextResponse.json(
            {
                message: 'Journal entry created successfully',
                journal: {
                    ...journal,
                    answers,
                    media: mediaEntries
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating journal entry:', error);
        return NextResponse.json(
            { error: 'Failed to create journal entry' },
            { status: 500 }
        );
    }
}