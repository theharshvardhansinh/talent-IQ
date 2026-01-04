
'use client';
import { useState } from 'react';
import { Users, Plus, Calendar, Clock, CheckCircle, Video, Play, Search, AlertCircle, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InterviewerSection({ candidates, interviews }) {
    const router = useRouter();
    const [requesting, setRequesting] = useState(false);

    // Derived state
    const pendingRequests = interviews.filter(i => i.status === 'pending');
    const activeInterviews = interviews.filter(i => i.status === 'accepted' && i.stage !== 'finished');
    const pastInterviews = interviews.filter(i => i.stage === 'finished');

    const handleSendRequest = async (candidateId) => {
        setRequesting(true);
        try {
            await fetch('/api/interviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intervieweeId: candidateId })
            });
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setRequesting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Host Competition Banner */}
            <div
                onClick={() => router.push('/dashboard/competitions/create')}
                className="w-full relative overflow-hidden rounded-2xl p-6 border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-transparent hover:border-purple-500/50 transition-all cursor-pointer group"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy className="w-24 h-24 text-purple-500" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">Host a Coding Competition</h3>
                            <p className="text-sm text-base-content/60">Schedule a contest, set problems, and challenge multiple candidates at once.</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-colors shadow-lg shadow-purple-600/20 flex items-center gap-2">
                        Create Now <Plus className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Pending & Active Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Request Setup (Candidates) */}
                <div className="glass-card rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Make a Request</h3>
                            <p className="text-sm text-base-content/50">Invite candidates for a round</p>
                        </div>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Plus className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {candidates.length === 0 ? (
                            <div className="text-sm text-base-content/40 italic">No candidates available.</div>
                        ) : (
                            candidates.map(candidate => (
                                <div key={candidate._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                                            {candidate.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{candidate.name}</div>
                                            <div className="text-xs text-base-content/50">{candidate.email}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSendRequest(candidate._id)}
                                        disabled={requesting}
                                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors disabled:opacity-50"
                                    >
                                        Invite
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 2. Active Interviews */}
                <div className="glass-card rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Active Rounds</h3>
                            <p className="text-sm text-base-content/50">Coding & Video sessions</p>
                        </div>
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                            <Video className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {activeInterviews.length === 0 ? (
                            <div className="text-sm text-base-content/40 italic">No active interviews.</div>
                        ) : (
                            activeInterviews.map(interview => (
                                <div key={interview._id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-sm font-bold text-white">vs. {interview.intervieweeId.name}</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 uppercase tracking-wider text-base-content/60">
                                            {interview.stage.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/dashboard/interview/${interview._id}`)}
                                        className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        Enter Interview Room <Play className="w-3 h-3" />
                                    </button>
                                </div>
                            ))
                        )}

                        {/* Pending Indicator */}
                        {pendingRequests.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <h4 className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-2">Pending Requests</h4>
                                {pendingRequests.map(req => (
                                    <div key={req._id} className="flex items-center justify-between text-sm py-1">
                                        <span className="text-base-content/70">{req.intervieweeId.name}</span>
                                        <span className="text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded">Waiting</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
