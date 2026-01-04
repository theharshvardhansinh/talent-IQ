
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Trophy, Play, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function CompetitionArenaPage({ params }) {
    const { id } = use(params);
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joined, setJoined] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Mock refreshing for leaderboard updates
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [id]);

    const fetchData = async () => {
        try {
            const [resComp, resUser] = await Promise.all([
                fetch(`/api/competitions/${id}`).then(r => r.json()),
                fetch('/api/auth/me').then(r => r.json()).catch(() => ({}))
            ]);

            setCompetition(resComp);
            setCurrentUser(resUser);
            if (resComp.participants && (resUser._id || resUser.id)) {
                const currentUserId = resUser._id || resUser.id;
                // p.userId is populated, so it has ._id (object or string)
                setJoined(resComp.participants.some(p => p.userId._id.toString() === currentUserId.toString()));
            }
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            await fetch(`/api/competitions/${id}/join`, { method: 'POST' });
            fetchData();
        } catch (e) {
            alert('Failed to join');
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    if (!competition || competition.error) return <div className="min-h-screen bg-black text-white p-10">Competition not found</div>;

    const { title, startTime, endTime, problems, participants, status } = competition;
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Status logic
    let compStatus = 'Scheduled';
    if (now >= start && now <= end) compStatus = 'Active';
    if (now > end) compStatus = 'Ended';

    // Sort participants by score desc
    const sortedParticipants = [...(participants || [])].sort((a, b) => b.score - a.score);

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="border-b border-white/10 pb-6">
                    <Link href="/dashboard/competitions" className="text-sm text-base-content/50 hover:text-white mb-4 inline-flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to List
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{title}</h1>
                            <div className="flex items-center gap-6 text-sm text-base-content/60">
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {compStatus === 'Scheduled' ? `Starts: ${format(start, 'PP p')}` : `Ends: ${format(end, 'p')}`}</div>
                                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {participants.length} Contenders</div>
                            </div>
                        </div>

                        {compStatus === 'Active' && !joined && (
                            <button onClick={handleJoin} className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 animate-pulse">
                                Join Competition
                            </button>
                        )}
                        {compStatus === 'Active' && joined && (
                            <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20 font-bold">
                                You are participating
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Problems (Only visible if Active/Ended and Joined) */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Code2 className="w-5 h-5 text-primary" /> Challenge Set</h2>

                        {(compStatus === 'Scheduled') ? (
                            <div className="glass-card p-10 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
                                <Clock className="w-12 h-12 text-base-content/20 mx-auto mb-4" />
                                <h3 className="text-xl font-bold">Competition hasn't started yet</h3>
                                <p className="text-base-content/50">Problems will be revealed when the timer hits zero.</p>
                            </div>
                        ) : (!joined && compStatus === 'Active') ? (
                            <div className="glass-card p-10 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
                                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold">Join to view problems</h3>
                                <p className="text-base-content/50">You need to enter the arena to see the challenges.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {problems.map((slug, idx) => (
                                    <div key={slug} className="glass-card p-6 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg capitalize">{slug.replace(/-/g, ' ')}</div>
                                                <div className="text-xs text-base-content/50">10 Points</div>
                                            </div>
                                        </div>
                                        <Link href={`/dashboard/practice/${slug}?competitionId=${id}`}>
                                            <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-sm font-bold flex items-center gap-2">
                                                Solve <Play className="w-4 h-4 fill-current" />
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Leaderboard */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Live Leaderboard</h2>
                        <div className="glass-card rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                            <div className="overflow-y-auto max-h-[500px]">
                                {sortedParticipants.length === 0 ? (
                                    <div className="p-8 text-center text-base-content/40 text-sm">No participants yet.</div>
                                ) : (
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/5 text-base-content/50 uppercase text-xs font-semibold sticky top-0 backdrop-blur-md">
                                            <tr>
                                                <th className="p-4">Rank</th>
                                                <th className="p-4">User</th>
                                                <th className="p-4 text-right">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {sortedParticipants.map((p, i) => (
                                                <tr key={p.userId._id} className={currentUser && p.userId._id === currentUser._id ? "bg-primary/10" : ""}>
                                                    <td className="p-4 font-mono text-base-content/60">#{i + 1}</td>
                                                    <td className="p-4 font-medium flex items-center gap-2">
                                                        {i === 0 && <Trophy className="w-3 h-3 text-yellow-500" />}
                                                        {p.userId.name}
                                                    </td>
                                                    <td className="p-4 text-right font-bold">{p.score}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Code2({ className }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
}
