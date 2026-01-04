import { NextResponse } from 'next/server';
import { getProblemList } from '@/lib/leetcode';

export async function GET(request) {
    try {
        const problems = await getProblemList();
        return NextResponse.json(problems);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
