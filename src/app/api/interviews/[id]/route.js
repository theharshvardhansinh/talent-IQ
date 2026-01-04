
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Interview from '@/models/Interview';

export async function PATCH(request, { params }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const updates = await request.json(); // e.g. { status: 'accepted', stage: 'coding', problemId: '...' }

        await dbConnect();

        const interview = await Interview.findByIdAndUpdate(id, updates, { new: true });

        return NextResponse.json(interview);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
