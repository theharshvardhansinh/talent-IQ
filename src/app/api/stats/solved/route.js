
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find all unique solved titleSlugs for this user
        const userId = session.user.id || session.user._id;
        const solved = await Submission.distinct('problemSlug', {
            userId: userId,
            status: 'Accepted'
        });

        // We can optionally fetch counts by difficulty here if we had problem difficulty stored in Submissions or by joining.
        // For now, let's just return the list of solved slugs. The frontend can map them to the full problem list to count difficulty.

        return NextResponse.json(solved);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
