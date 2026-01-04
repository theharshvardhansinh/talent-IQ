
'use client';
import Link from 'next/link';
import { ArrowRight, Code2, Play, Video, CheckCircle, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function IntervieweeSection({ recentApplications, interviews = [] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const pendingRequests = interviews.filter(i => i.status === 'pending');
    const activeInterviews = interviews.filter(i => i.status === 'accepted' && i.stage !== 'finished');

    const handleResponse = async (id, status) => {
        setLoading(true);
        try {
            await fetch(`/api/interviews/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: status, stage: status === 'accepted' ? 'coding' : 'finished' }) // Start with coding stage if accepted
            });
            router.refresh(); // Refresh to update list
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* TOP ROW: Pending Requests & Active Interviews */}
            {(pendingRequests.length > 0 || activeInterviews.length > 0) && (
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-yellow-500/20 bg-yellow-500/[0.02]">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        Interview Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingRequests.map(req => (
                            <div key={req._id} className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-white">Interview Request</div>
                                    <div className="text-xs text-base-content/60">From: {req.interviewerId?.name}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleResponse(req._id, 'rejected')}
                                        disabled={loading}
                                        className="p-2 rounded-lg hover:bg-white/10 text-red-400 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleResponse(req._id, 'accepted')}
                                        disabled={loading}
                                        className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-colors shadow-lg shadow-primary/20"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))}

                        {activeInterviews.map(interview => (
                            <div key={interview._id} className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Live Interview
                                    </div>
                                    <div className="text-xs text-base-content/60">Host: {interview.interviewerId?.name}</div>
                                </div>
                                <Link href={`/dashboard/interview/${interview._id}`}>
                                    <button className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-colors shadow-lg shadow-green-500/20 flex items-center gap-2">
                                        Join Room <ArrowRight className="w-3 h-3" />
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Practice Card */}
            <div className="glass-card rounded-2xl p-1 border border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent relative col-span-1 lg:col-span-2">
                <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 h-full flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                            <Code2 className="w-3 h-3" />
                            LeetCode Practice
                        </div>
                        <h3 className="text-2xl font-bold text-white">Master Data Structures & Algorithms</h3>
                        <p className="text-base-content/60 max-w-lg">
                            Solve curated problems from Top 100 Interview Questions. Practice with our real-time editor and get instant feedback.
                        </p>
                        <Link href="/dashboard/practice" className="inline-block">
                            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group">
                                Start Solving
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                    <div className="relative w-full md:w-1/3 aspect-video rounded-lg overflow-hidden border border-white/10 bg-black shadow-2xl group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                        {/* Code snippet decoration */}
                        <div className="p-3 font-mono text-[10px] text-base-content/50 leading-relaxed opacity-60">
                            <span className="text-purple-400">class</span> <span className="text-yellow-200">Solution</span> {'{'}<br />
                            &nbsp;&nbsp;<span className="text-blue-400">public</span> <span className="text-green-400">int</span> twoSum(int[] nums) {'{'}<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-base-content/30">// Your code here</span><br />
                            &nbsp;&nbsp;{'}'}<br />
                            {'}'}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 fill-current ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Existing Applications List support can stay or be removed if user strictly implies interview focus, but good to keep */}
            {recentApplications && (
                <div className="glass-card rounded-2xl p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">My Applications</h3>
                            <p className="text-sm text-base-content/50">Track your status</p>
                        </div>
                    </div>
                    {/* ... existing mock applications list ... */}
                    <div className="space-y-4">
                        {recentApplications.map((app, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                    <div className="font-semibold text-white text-sm">{app.company}</div>
                                    <div className="text-xs text-base-content/50">{app.role}</div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${app.color}`}>{app.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
