
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Interview from '@/models/Interview';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        await dbConnect();
        const interview = await Interview.findById(id)
            .populate('interviewerId', 'name')
            .populate('intervieweeId', 'name');

        if (!interview) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json(interview);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
