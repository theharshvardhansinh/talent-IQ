
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';

export async function GET(request, { params }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;
        const userId = session.user.id || session.user._id;

        await dbConnect();

        // Fetch submission history for this problem and user
        // Sort by newest first
        const submissions = await Submission.find({
            userId,
            problemSlug: slug
        }).sort({ createdAt: -1 });

        return NextResponse.json(submissions);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
