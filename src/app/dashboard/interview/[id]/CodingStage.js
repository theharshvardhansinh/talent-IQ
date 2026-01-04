
'use client';
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Clock, BookOpen, Play, CheckCircle, AlertCircle } from 'lucide-react';

export default function CodingStage({ interview, currentUser, isInterviewer }) {
    const [problem, setProblem] = useState(null);
    const [problemsList, setProblemsList] = useState([]);
    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(1800);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [language, setLanguage] = useState('cpp'); // Default to C++

    // Fetch problem if assigned
    useEffect(() => {
        if (interview.problemId) {
            // Fetch problem details
            fetch(`/api/problems/${interview.problemId}`)
                .then(res => res.json())
                .then(data => {
                    setProblem(data);
                    // Default to C++ starter code
                    if (!code) setCode(data.starterCodes?.cpp || data.starterCodes?.javascript || '');
                });

            // Calculate time left
            if (interview.codingStartTime) {
                const start = new Date(interview.codingStartTime).getTime();
                const now = new Date().getTime();
                const elapsed = Math.floor((now - start) / 1000);
                setTimeLeft(Math.max(0, 1800 - elapsed));
            }
        } else if (isInterviewer) {
            // Fetch list to choose from
            fetch('/api/problems')
                .then(res => res.json())
                .then(setProblemsList);
        }
    }, [interview.problemId, interview.codingStartTime]);

    // Timer Tick
    useEffect(() => {
        if (!interview.problemId) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [interview.problemId]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleAssignProblem = async (slug) => {
        await fetch(`/api/interviews/${interview._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                problemId: slug,
                codingStartTime: new Date()
            })
        });
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(null);

        try {
            const res = await fetch('/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: language, // Changed to use language state
                    sourceCode: code,
                    // We don't save submission history for live interviews to keep 'practice' clean,
                    // or we could save it with a special flag. For now, no slug = no save.
                    // Actually, let's allow saving if problem matches.
                    slug: problem?.titleSlug
                })
            });

            const data = await res.json();
            setIsRunning(false);
            setOutput(data);

            // If Accepted, maybe notify server? (Polling will catch it if we updated DB, but here we just show output)
            if (data.status === 'Accepted') {
                // Update interview status to mark coding as passed
                await fetch(`/api/interviews/${interview._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ codingResult: 'pass' })
                });
            }

        } catch (err) {
            setIsRunning(false);
            setOutput({ status: 'Error', logs: [err.message] });
        }
    };

    // Selection View for Interviewer
    if (!interview.problemId) {
        if (isInterviewer) {
            return (
                <div className="p-8 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Select a Problem</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {problemsList.map(p => (
                            <div key={p.titleSlug} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                <div>
                                    <div className="font-bold">{p.title}</div>
                                    <div className={`text-xs px-2 py-0.5 rounded inline-block mt-1 ${p.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                                        p.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                                        }`}>{p.difficulty}</div>
                                </div>
                                <button
                                    onClick={() => handleAssignProblem(p.titleSlug)}
                                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-sm"
                                >
                                    Assign
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center animate-pulse">
                        <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h2 className="text-xl font-bold">Waiting for Interviewer...</h2>
                        <p className="text-base-content/50">The problem selection is in progress.</p>
                    </div>
                </div>
            )
        }
    }

    if (!problem) return <div className="p-10">Loading problem...</div>;

    // Active Coding View
    return (
        <div className="flex h-full">
            {/* Left: Problem & Timer */}
            <div className="w-[40%] bg-white/[0.01] border-r border-white/10 flex flex-col">
                <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-white/5">
                    <div className="flex items-center gap-2 font-bold text-sm">
                        <BookOpen className="w-4 h-4 text-primary" />
                        {problem.title}
                    </div>
                    <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: problem.content }} />
                </div>
            </div>

            {/* Right: Editor & Console */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Editor Header */}
                <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-white/5">
                    <span className="text-xs font-bold uppercase text-base-content/50">Code Editor</span>
                    <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isRunning ? 'Running...' : <><Play className="w-3 h-3 fill-current" /> Run Code</>}
                    </button>
                </div>

                {/* Editor */}
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        language="javascript" // Currently fixed to JS for MVP, or dynamic from problem
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            readOnly: isInterviewer,
                            minimap: { enabled: false },
                            fontSize: 14,
                            padding: { top: 20 },
                        }}
                    />
                </div>

                {/* Output Console */}
                <div className="h-[30%] border-t border-white/10 bg-[#1e1e1e] flex flex-col">
                    <div className="h-9 border-b border-white/5 flex items-center px-4">
                        <span className="text-xs font-bold uppercase text-base-content/50">Output Console</span>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
                        {isRunning ? (
                            <div className="text-base-content/50 animate-pulse flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                                Executing code...
                            </div>
                        ) : output ? (
                            <div className="space-y-2">
                                <div className={`flex items-center gap-2 font-bold mb-2 ${output.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
                                    {output.status === 'Accepted' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {output.status}
                                </div>
                                <div className="grid grid-cols-2 gap-4 max-w-sm mb-4">
                                    <div className="bg-white/5 p-2 rounded border border-white/5">
                                        <div className="text-xs text-base-content/50">Runtime</div>
                                        <div className="font-bold">{output.runtime}</div>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded border border-white/5">
                                        <div className="text-xs text-base-content/50">Memory</div>
                                        <div className="font-bold">{output.memory}</div>
                                    </div>
                                </div>
                                <div className="space-y-1 p-2 bg-black/30 rounded border border-white/5">
                                    {output.logs && output.logs.map((log, i) => (
                                        <div key={i} className="text-base-content/70">{log}</div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-base-content/30 italic">Run code to see output here...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
