
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'interviewer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        // Fetch all interviewees
        const candidates = await User.find({ role: 'interviewee' }).select('name email _id');

        return NextResponse.json(candidates);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
