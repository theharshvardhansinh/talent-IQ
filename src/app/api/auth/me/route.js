
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }
    return NextResponse.json(session.user);
}
