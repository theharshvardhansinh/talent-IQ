
'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Video, Code2, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import CodingStage from './CodingStage';
import VideoStage from './VideoStage';
import { useRouter } from 'next/navigation';

export default function InterviewRoomClient({ interview, currentUser }) {
    const router = useRouter();
    const [activeStage, setActiveStage] = useState(interview.stage || 'coding');
    const [interviewData, setInterviewData] = useState(interview);

    // Poll for updates (simple sync mechanism)
    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await fetch(`/api/interviews/${interview._id}/poll`);
            if (res.ok) {
                const data = await res.json();
                setInterviewData(data);
                if (data.stage !== activeStage) {
                    setActiveStage(data.stage);
                }
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [interview._id, activeStage]);

    const handleStageChange = async (newStage) => {
        // Optimistic update
        setActiveStage(newStage);
        await fetch(`/api/interviews/${interview._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stage: newStage })
        });
    };

    const handleEndInterview = async (result) => {
        await fetch(`/api/interviews/${interview._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'completed',
                stage: 'finished',
                finalResult: result
            })
        });
        router.push('/dashboard');
    };

    if (activeStage === 'finished') {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Interview Completed</h2>
                    <p className="text-base-content/60">Final Result: <span className="font-bold uppercase">{interviewData.finalResult}</span></p>
                    <Link href="/dashboard" className="text-primary hover:underline">Return to Dashboard</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-base-content/60" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Interview Room</h1>
                        <div className="text-xs text-base-content/50 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            {currentUser.role === 'interviewer' ? `Candidate: ${interviewData.intervieweeId.name}` : `Host: ${interviewData.interviewerId.name}`}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Status Indicators */}
                    {interviewData.codingResult === 'pass' && (
                        <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 animate-pulse flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Coding Passed
                        </div>
                    )}

                    {/* Stage Indicators */}
                    <div className="flex items-center bg-white/5 rounded-lg p-1">
                        <button
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeStage === 'coding' ? 'bg-primary text-white shadow-lg' : 'text-base-content/50 hover:text-white'}`}
                        >
                            <Code2 className="w-4 h-4" /> Coding
                        </button>
                        <button
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeStage === 'video' ? 'bg-purple-500 text-white shadow-lg' : 'text-base-content/50 hover:text-white'}`}
                        >
                            <Video className="w-4 h-4" /> Video Call
                        </button>
                    </div>

                    {/* Controls (Interviewer Only) */}
                    {currentUser.role === 'interviewer' && (
                        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                            {activeStage === 'coding' && (
                                <button
                                    onClick={() => handleStageChange('video')}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${interviewData.codingResult === 'pass'
                                            ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20 animate-pulse'
                                            : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white'
                                        }`}
                                >
                                    Start Video Round
                                </button>
                            )}
                            <button
                                onClick={() => handleEndInterview('pass')}
                                className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                                title="Pass Candidate"
                            >
                                <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleEndInterview('fail')}
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                title="Fail Candidate"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Stage Content */}
            <div className="flex-1 overflow-hidden relative">
                {activeStage === 'coding' ? (
                    <CodingStage
                        interview={interviewData}
                        currentUser={currentUser}
                        isInterviewer={currentUser.role === 'interviewer'}
                    />
                ) : (
                    <VideoStage
                        interview={interviewData}
                        currentUser={currentUser}
                        apiKey={process.env.NEXT_PUBLIC_STREAM_API_KEY}
                    />
                )}
            </div>
        </div>
    );
}
