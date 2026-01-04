
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

            {/* Competitions Banner */}
            <div className="lg:col-span-2">
                <Link href="/dashboard/competitions">
                    <div className="glass-card rounded-2xl p-6 border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Coding Competitions</h3>
                                <p className="text-sm text-base-content/60">Join live contests and compete on the leaderboard.</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
            </div>

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

            {/* Past Interviews List */}
            <div className="col-span-1 lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Past Interviews
                </h3>
                {interviews.filter(i => i.status === 'completed' || i.stage === 'finished').length === 0 ? (
                    <div className="text-center py-10 text-base-content/40 italic">
                        No completed interviews yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-base-content/50 uppercase border-b border-white/5">
                                <tr>
                                    <th className="px-4 py-3">Interviewer</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Result</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {interviews.filter(i => i.status === 'completed' || i.stage === 'finished').map((interview) => (
                                    <tr key={interview._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4 font-medium">
                                            {interview.interviewerId?.name || 'Unknown'}
                                            <div className="text-xs text-base-content/50">Technical Round</div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-base-content/60">
                                            {new Date(interview.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold 
                                                ${interview.finalResult === 'pass' ? 'bg-green-500/10 text-green-400' :
                                                    interview.finalResult === 'fail' ? 'bg-red-500/10 text-red-400' :
                                                        'bg-white/10 text-base-content/60'}`}>
                                                {interview.finalResult === 'pass' ? 'Passed' :
                                                    interview.finalResult === 'fail' ? 'Failed' : 'Pending Review'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <Link href={`/dashboard/interview/review/${interview._id}`}>
                                                <button className="text-sm text-primary hover:text-white transition-colors font-medium">
                                                    Review
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
