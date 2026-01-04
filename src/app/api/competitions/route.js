
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Competition from '@/models/Competition';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        // Fetch upcoming and active competitions
        // Sort by startTime
        const competitions = await Competition.find({})
            .populate('hostId', 'name')
            .sort({ startTime: 1 })
            .lean();

        return NextResponse.json(competitions, {
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'interviewer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, problems, startTime, durationMinutes } = body;

        await dbConnect();

        const start = new Date(startTime);
        const end = new Date(start.getTime() + durationMinutes * 60000);

        const competition = await Competition.create({
            title,
            hostId: session.user.id || session.user._id,
            problems, // Array of slugs e.g. ['two-sum']
            startTime: start,
            endTime: end,
            durationMinutes: parseInt(durationMinutes),
            status: 'scheduled'
        });

        return NextResponse.json(competition, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
