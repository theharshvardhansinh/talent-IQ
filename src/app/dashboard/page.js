import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Submission from '@/models/Submission'; // Import new model
import Interview from '@/models/Interview';
import { Zap } from 'lucide-react';
import StatsSection from './components/StatsSection';
import InterviewerSection from './components/InterviewerSection';
import IntervieweeSection from './components/IntervieweeSection';

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const { user: sessionUser } = session;

    const userId = sessionUser.id || sessionUser._id;

    await dbConnect();

    // 1. Stats
    const solvedProblems = await Submission.distinct('problemSlug', { userId, status: 'Accepted' });
    const solvedCount = solvedProblems.length;

    // 2. Fetch Interviews (for both roles)
    const interviews = await Interview.find({
        $or: [{ interviewerId: userId }, { intervieweeId: userId }]
    })
        .populate('interviewerId', 'name')
        .populate('intervieweeId', 'name')
        .sort({ createdAt: -1 })
        .lean();

    // 3. Fetch Candidates (only for Interviewer)
    let candidates = [];
    if (sessionUser.role === 'interviewer') {
        candidates = await User.find({ role: 'interviewee' }).select('name email _id').lean();
    }

    // Serialize for props (mongoose IDs to strings)
    const serializedInterviews = JSON.parse(JSON.stringify(interviews));
    const serializedCandidates = JSON.parse(JSON.stringify(candidates));

    const upcomingInterviewsCount = interviews.filter(i => i.status !== 'completed' && i.stage !== 'finished').length;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/20 selection:text-primary">
            {/* Background glow effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <nav className="relative z-10 border-b border-white/10 bg-white/[0.02] backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Talent IQ</h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 bg-white/5 py-1.5 px-3 rounded-full border border-white/5">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold">
                                    {sessionUser.name.charAt(0)}
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium text-white">{sessionUser.name}</span>
                                    <span className="ml-2 text-xs text-base-content/50 uppercase tracking-wider font-semibold">
                                        {sessionUser.role}
                                    </span>
                                </div>
                            </div>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, {sessionUser.name.split(' ')[0]}</h2>
                    <p className="text-base-content/60">Here is what is happening with your interviews today.</p>
                </div>

                <StatsSection solvedCount={solvedCount} upcomingInterviewsCount={upcomingInterviewsCount} />

                {sessionUser.role === 'interviewer' ? (
                    <InterviewerSection candidates={serializedCandidates} interviews={serializedInterviews} />
                ) : (
                    <IntervieweeSection interviews={serializedInterviews} />
                )}
            </main>
        </div>
    );
}
