
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Interview from '@/models/Interview';
import User from '@/models/User';

export async function GET(request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const userId = session.user.id || session.user._id;

        // Find interviews where user is either interviewer or interviewee
        // Populate names
        const interviews = await Interview.find({
            $or: [{ interviewerId: userId }, { intervieweeId: userId }]
        })
            .populate('interviewerId', 'name')
            .populate('intervieweeId', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json(interviews);
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

        const { intervieweeId } = await request.json();
        const interviewerId = session.user.id || session.user._id;

        await dbConnect();

        // Create new interview request
        const interview = await Interview.create({
            interviewerId,
            intervieweeId,
            status: 'pending',
            stage: 'request'
        });

        return NextResponse.json(interview);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
