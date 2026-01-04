
import { StreamClient } from '@stream-io/node-sdk';
import { NextResponse } from 'next/server';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    if (!apiKey || !apiSecret) return NextResponse.json({ error: 'Missing Stream keys' }, { status: 500 });

    const client = new StreamClient(apiKey, apiSecret);
    // Expiration: 1 hour
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
    const issued = Math.floor(Date.now() / 1000) - 60;

    const token = client.createToken(userId, exp, issued);

    return NextResponse.json({ token });
}
