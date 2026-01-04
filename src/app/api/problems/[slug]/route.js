import { NextResponse } from 'next/server';
import { getProblemDetail } from '@/lib/leetcode';

export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const problem = await getProblemDetail(slug);
        return NextResponse.json(problem);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
