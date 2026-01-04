
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Competition from '@/models/Competition';
import User from '@/models/User'; // Ensure User is registered model
import Submission from '@/models/Submission';

export async function GET(request, { params }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        await dbConnect();

        // Populate participants user info
        const competition = await Competition.findById(id)
            .populate('hostId', 'name')
            .populate('participants.userId', 'name _id')
            .lean();

        if (!competition) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // Calculate scores dynamically (optional, but robust)
        // Or assume scores are updated on submission (better for performance).
        // Let's rely on stored scores for now.

        return NextResponse.json(competition, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
