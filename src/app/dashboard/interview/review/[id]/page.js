'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Calendar, CheckCircle, Code2, AlertTriangle, Video } from 'lucide-react';

export default function InterviewReviewPage({ params }) {
    const { id } = use(params);
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch specific interview details
        fetch(`/api/interviews/${id}`)
            .then(res => res.json())
            .then(data => {
                setInterview(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
                <AlertTriangle className="w-12 h-12 text-yellow-500" />
                <h2 className="text-xl font-bold">Interview Not Found</h2>
                <Link href="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="h-16 border-b border-white/10 flex items-center px-4 md:px-8 bg-white/[0.02]">
                <Link href="/dashboard" className="flex items-center gap-2 text-base-content/60 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                </Link>
                <div className="ml-auto flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${interview.finalResult === 'pass' ? 'bg-green-500/10 text-green-500' :
                        interview.finalResult === 'fail' ? 'bg-red-500/10 text-red-500' :
                            'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        {interview.finalResult === 'undecided' ? 'Pending Review' : interview.finalResult}
                    </span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column: Details */}
                    <div className="flex-1 space-y-6">
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Interview Details
                            </h2>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-base-content/60">Interviewer</span>
                                    <span className="font-semibold">{interview.interviewerId?.name || 'Unknown'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-base-content/60">Date</span>
                                    <span className="font-semibold">{new Date(interview.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-base-content/60">Status</span>
                                    <span className="capitalize">{interview.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* Problem Asked */}
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-purple-500" />
                                Problem Challenge
                            </h2>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="text-sm font-bold mb-1">
                                    {interview.problemId ? interview.problemId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'No problem selected'}
                                </div>
                                <p className="text-xs text-base-content/50">
                                    This was the technical challenge assigned during the coding round.
                                </p>
                                {interview.problemId && (
                                    <Link href={`/dashboard/practice/${interview.problemId}`} className="inline-block mt-4 text-xs text-primary hover:underline">
                                        View Problem Details &rarr;
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Feedback / Result Placeholder */}
                    <div className="flex-1 space-y-6">
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Feedback & Result
                            </h2>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                                <div className="text-sm text-base-content/70 italic leading-relaxed">
                                    {interview.feedback || "No specific written feedback was provided for this session."}
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <div className="text-xs text-base-content/50 uppercase tracking-wider mb-1">Coding Score</div>
                                    <div className={`font-bold ${interview.codingResult === 'pass' ? 'text-green-400' : 'text-white'}`}>
                                        {interview.codingResult ? interview.codingResult.toUpperCase() : 'N/A'}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <div className="text-xs text-base-content/50 uppercase tracking-wider mb-1">Final Decision</div>
                                    <div className={`font-bold ${interview.finalResult === 'pass' ? 'text-green-400' : interview.finalResult === 'fail' ? 'text-red-400' : 'text-white'}`}>
                                        {interview.finalResult ? interview.finalResult.toUpperCase() : 'PENDING'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
