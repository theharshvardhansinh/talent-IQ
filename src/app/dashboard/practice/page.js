'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock, Search, ArrowRight, Sparkles } from 'lucide-react';

export default function PracticePage() {
    const [problems, setProblems] = useState([]);
    const [solvedSlugs, setSolvedSlugs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/problems').then(res => res.json()),
            fetch('/api/stats/solved').then(res => res.json())
        ]).then(([problemsData, solvedData]) => {
            setProblems(problemsData);
            setSolvedSlugs(solvedData || []); // Array of strings e.g. ['two-sum']
            setLoading(false);
        });
    }, []);

    // Calculate dynamic stats
    const solvedCountByDifficulty = problems.reduce((acc, prob) => {
        if (solvedSlugs.includes(prob.titleSlug)) {
            acc[prob.difficulty] = (acc[prob.difficulty] || 0) + 1;
        }
        return acc;
    }, { Easy: 0, Medium: 0, Hard: 0 });

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-8">
                    <div>
                        <Link href="/dashboard" className="text-sm text-base-content/50 hover:text-white mb-2 inline-block transition-colors">← Back to Dashboard</Link>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Practice Problems</h1>
                        <p className="text-base-content/60 mt-2">Sharpen your skills with our curated collection of challenges.</p>
                    </div>

                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                    </div>
                </div>

                {/* Categories / Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><CheckCircle className="w-5 h-5" /></div>
                            <h3 className="font-semibold">Easy</h3>
                        </div>
                        <p className="text-2xl font-bold">{solvedCountByDifficulty.Easy} <span className="text-sm font-normal text-base-content/40">solved</span></p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><Clock className="w-5 h-5" /></div>
                            <h3 className="font-semibold">Medium</h3>
                        </div>
                        <p className="text-2xl font-bold">{solvedCountByDifficulty.Medium} <span className="text-sm font-normal text-base-content/40">solved</span></p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><Sparkles className="w-5 h-5" /></div>
                            <h3 className="font-semibold">Hard</h3>
                        </div>
                        <p className="text-2xl font-bold">{solvedCountByDifficulty.Hard} <span className="text-sm font-normal text-base-content/40">solved</span></p>
                    </div>
                </div>

                {/* List */}
                <div className="glass-card rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-base-content/50 text-sm uppercase tracking-wider">
                                <th className="p-6 font-medium">Status</th>
                                <th className="p-6 font-medium">Title</th>
                                <th className="p-6 font-medium">Difficulty</th>
                                <th className="p-6 font-medium">Acceptance</th>
                                <th className="p-6 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {problems.map((prob) => (
                                <tr key={prob.titleSlug} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        {solvedSlugs.includes(prob.titleSlug) ? (
                                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-colors"></div>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        <div className="font-medium text-white group-hover:text-primary transition-colors">{prob.title}</div>
                                        <div className="flex gap-2 mt-1">
                                            {prob.topicTags.map(tag => (
                                                <span key={tag.name} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-base-content/60 border border-white/5">{tag.name}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`
                          px-2 py-1 rounded text-xs font-medium 
                          ${prob.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                                                prob.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-red-500/10 text-red-400'}
                        `}>
                                            {prob.difficulty}
                                        </span>
                                    </td>
                                    <td className="p-6 text-base-content/60 text-sm">
                                        {prob.acRate}%
                                    </td>
                                    <td className="p-6">
                                        <Link
                                            href={`/dashboard/practice/${prob.titleSlug}`}
                                            className="inline-flex px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all items-center gap-2"
                                        >
                                            Solve
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
