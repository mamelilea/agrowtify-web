import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const result = await cloudinary.api.ping();

        return NextResponse.json({
            success: true,
            message: 'Cloudinary connection successful',
            details: result
        });
    } catch (error) {
        console.error('Cloudinary connection error:', error);

        return NextResponse.json({
            success: false,
            message: 'Cloudinary connection failed',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}