
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Calendar, Clock, Trophy, Users, ArrowRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function CompetitionsPage() {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); // best to fetch from session API usually, or page props

    useEffect(() => {
        // Fetch competitions
        fetch('/api/competitions', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                setCompetitions(data);
                setLoading(false);
            });

        // Quick check for role - in real app, use useSession or similar
        // For UI toggle only
        fetch('/api/auth/me').catch(() => { });
    }, []);

    // Helper to calculate status
    const getStatus = (comp) => {
        const now = new Date();
        const start = new Date(comp.startTime);
        const end = new Date(comp.endTime);

        if (now < start) return 'Scheduled';
        if (now >= start && now <= end) return 'Active';
        return 'Ended';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
                    <div>
                        <Link href="/dashboard" className="text-sm text-base-content/50 hover:text-white mb-2 inline-block transition-colors">← Back to Dashboard</Link>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Coding Competitions</h1>
                        <p className="text-base-content/60 mt-2">Compete with peers in real-time challenges.</p>
                    </div>
                    {/* Only show if interviewer, but button doesn't hurt to be generic, API will reject */}
                    <Link href="/dashboard/competitions/create">
                        <button className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Host Competition
                        </button>
                    </Link>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {competitions.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-base-content/40">
                            No competitions scheduled yet. Be the first to host one!
                        </div>
                    ) : (
                        competitions.map((comp) => {
                            const status = getStatus(comp);
                            return (
                                <div key={comp._id} className="glass-card rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                                    {status === 'Active' && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-ping m-4"></div>}

                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                                            ${status === 'Active' ? 'bg-red-500/10 text-red-500' :
                                                status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                            {status}
                                        </div>
                                        <Trophy className={`w-5 h-5 ${status === 'Ended' ? 'text-yellow-500' : 'text-base-content/30'}`} />
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{comp.title}</h3>

                                    <div className="space-y-3 text-sm text-base-content/60 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(comp.startTime), 'PPT')}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {comp.durationMinutes} mins
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            {comp.participants?.length || 0} participants
                                        </div>
                                    </div>

                                    <Link href={`/dashboard/competitions/${comp._id}`}>
                                        <button className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 font-medium transition-colors flex items-center justify-center gap-2">
                                            {status === 'Ended' ? 'View Ladderboard' : 'Enter Arena'}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
