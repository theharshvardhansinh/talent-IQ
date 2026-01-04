
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Competition from '@/models/Competition';

export async function POST(request, { params }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const userId = session.user.id || session.user._id;

        await dbConnect();

        const competition = await Competition.findById(id);

        if (!competition) {
            return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
        }

        // Check if already joined
        const isParticipant = competition.participants.some(p => p.userId.toString() === userId);
        if (!isParticipant) {
            competition.participants.push({ userId, joinedAt: new Date() });
            await competition.save();
        }

        return NextResponse.json({ message: 'Joined successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
