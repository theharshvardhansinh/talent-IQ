'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, Settings, Share2, PanelLeft, Code2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const languages = [
    { id: 'javascript', name: 'JavaScript', ext: 'js' },
    { id: 'python', name: 'Python', ext: 'py' },
    { id: 'java', name: 'Java', ext: 'java' },
    { id: 'cpp', name: 'C++', ext: 'cpp' }
];

export default function ProblemDetail({ params }) {
    const { slug } = use(params);
    const searchParams = useSearchParams();
    const competitionId = searchParams.get('competitionId');

    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (activeTab === 'history') {
            fetch(`/api/problems/${slug}/history`)
                .then(res => res.json())
                .then(data => setHistory(data))
                .catch(err => console.error(err));
        }
    }, [activeTab, slug]);

    useEffect(() => {
        if (!slug) return;

        console.log("Fetching problem:", slug);
        fetch(`/api/problems/${slug}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch problem");
                return res.json();
            })
            .then((data) => {
                setProblem(data);
                if (data.starterCodes && data.starterCodes[language]) {
                    setCode(data.starterCodes[language]);
                } else if (data.starterCode) {
                    setCode(data.starterCode);
                }
            })
            .catch(err => {
                console.error(err);
                // Fallback for error state
                setProblem({
                    title: 'Error Loading',
                    titleSlug: slug || 'error',
                    content: `<p>Error loading problem: ${err.message}</p>`,
                    starterCodes: { javascript: '// Error' },
                    difficulty: 'Error'
                });
            });
    }, [slug, language]);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        if (problem && problem.starterCodes && problem.starterCodes[newLang]) {
            setCode(problem.starterCodes[newLang]);
        }
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(null);

        try {
            const res = await fetch('/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language,
                    sourceCode: code,
                    slug: problem.titleSlug,
                    competitionId: competitionId // Pass this!
                })
            });
            // ...

            const data = await res.json();

            setIsRunning(false);
            setOutput({
                status: data.error ? 'Error' : data.status,
                runtime: data.runtime || 'N/A',
                memory: data.memory || 'N/A',
                logs: data.logs || [data.output]
            });

        } catch (err) {
            setIsRunning(false);
            setOutput({
                status: 'Error',
                runtime: 'N/A',
                memory: 'N/A',
                logs: ['Failed to execute code.', err.message]
            });
        }
    };

    if (!problem) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            {/* Top Bar - Clean Modern Look */}
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/practice" className="p-2 hover:bg-white/10 rounded-lg text-base-content/60 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="font-medium text-sm md:text-base">{problem.title}</h1>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-base-content/70">{problem.difficulty}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Language Selector */}
                    <div className="relative">
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-1.5 px-3 [&>option]:bg-gray-900 cursor-pointer outline-none hover:bg-white/10 transition-colors"
                        >
                            {languages.map(lang => (
                                <option key={lang.id} value={lang.id}>{lang.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isRunning ? 'Running...' : <><Play className="w-4 h-4 fill-current" /> Run Code</>}
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-base-content/60 hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-base-content/60 hover:text-white transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/20">
                        You
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Description & History */}
                <div className="w-[40%] flex flex-col border-r border-white/10 bg-white/[0.01]">
                    <div className="h-10 border-b border-white/10 flex items-center px-4 gap-4 text-sm bg-white/[0.02]">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`flex items-center gap-2 font-medium h-full px-2 border-b-2 transition-colors ${activeTab === 'description' ? 'text-primary border-primary' : 'text-base-content/50 border-transparent hover:text-white'}`}
                        >
                            <BookOpen className="w-4 h-4" /> Description
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center gap-2 font-medium h-full px-2 border-b-2 transition-colors ${activeTab === 'history' ? 'text-primary border-primary' : 'text-base-content/50 border-transparent hover:text-white'}`}
                        >
                            <Clock className="w-4 h-4" /> History
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none">
                        {activeTab === 'description' ? (
                            <>
                                <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
                                <div
                                    className="text-base-content/80 text-sm leading-relaxed space-y-4"
                                    dangerouslySetInnerHTML={{ __html: problem.content }}
                                />
                            </>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold mb-4">Submission History</h3>
                                {history.length === 0 ? (
                                    <div className="text-base-content/40 italic">No submissions yet.</div>
                                ) : (
                                    history.map((sub) => (
                                        <div key={sub._id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setCode(sub.code)}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className={`flex items-center gap-2 font-bold ${sub.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {sub.status === 'Accepted' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                                    {sub.status}
                                                </div>
                                                <span className="text-xs text-base-content/40">{new Date(sub.createdAt).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-base-content/60">
                                                <div className="bg-white/5 px-2 py-1 rounded">{sub.language}</div>
                                                {sub.runtime && <div>⏱ {sub.runtime}</div>}
                                                {sub.memory && <div>💾 {sub.memory}</div>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Editor & Console */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Editor */}
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            language={language}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                padding: { top: 20 },
                                scrollBeyondLastLine: false,
                                fontFamily: 'var(--font-mono)',
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    {/* Console/Output */}
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
                                        {output.logs.map((log, i) => (
                                            <div key={i} className="text-base-content/70">{log}</div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-base-content/30 italic">Run your code to see output here...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BookOpen({ className }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
}
