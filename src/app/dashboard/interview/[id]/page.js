
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Interview from '@/models/Interview';
import InterviewRoomClient from './InterviewRoomClient';

export default async function InterviewPage({ params }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { id } = await params;
    await dbConnect();

    // Fetch interview details
    const interview = await Interview.findById(id)
        .populate('interviewerId', 'name email')
        .populate('intervieweeId', 'name email');

    if (!interview) {
        return <div className="p-10 text-white">Interview not found.</div>;
    }

    const userRole = session.user.role; // 'interviewer' or 'interviewee'
    const currentUser = session.user;

    // Serialize
    const serializedInterview = JSON.parse(JSON.stringify(interview));
    const serializedUser = { ...currentUser, id: currentUser.id || currentUser._id };

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <InterviewRoomClient
                interview={serializedInterview}
                currentUser={serializedUser}
            />
        </div>
    );
}
