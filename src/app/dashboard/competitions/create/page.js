
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash, Clock, Search } from 'lucide-react';

const MOCK_PROBLEMS_SELECTION = [
    { slug: 'two-sum', title: 'Two Sum', diff: 'Easy' },
    { slug: 'add-two-numbers', title: 'Add Two Numbers', diff: 'Medium' },
    { slug: 'climbing-stairs', title: 'Climbing Stairs', diff: 'Easy' },
    { slug: 'number-of-islands', title: 'Number of Islands', diff: 'Medium' },
    { slug: 'coin-change', title: 'Coin Change', diff: 'Medium' },
    { slug: 'course-schedule', title: 'Course Schedule', diff: 'Medium' },
    { slug: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', diff: 'Hard' },
];

export default function CreateCompetitionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        startTime: '',
        durationMinutes: 60,
        problems: [] // Array of slugs
    });
    const [submitting, setSubmitting] = useState(false);

    const toggleProblem = (slug) => {
        if (formData.problems.includes(slug)) {
            setFormData({ ...formData, problems: formData.problems.filter(p => p !== slug) });
        } else {
            setFormData({ ...formData, problems: [...formData.problems, slug] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/competitions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/dashboard/competitions');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create competition');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 flex flex-col items-center">
            <div className="max-w-3xl w-full">
                <Link href="/dashboard/competitions" className="text-sm text-base-content/50 hover:text-white mb-6 inline-flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Competitions
                </Link>

                <div className="glass-card rounded-2xl p-8 border border-white/5 bg-white/[0.02]">
                    <h1 className="text-2xl font-bold mb-6">Host a New Competition</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-base-content/80">Competition Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="e.g. Weekly Code Sprint #45"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-base-content/80">Start Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 [color-scheme:dark]"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-base-content/80">Duration (Minutes)</label>
                                <input
                                    type="number"
                                    required
                                    min="15"
                                    max="300"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={formData.durationMinutes}
                                    onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || '' })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-base-content/80">Select Problems ({formData.problems.length})</label>
                            <div className="bg-black/40 rounded-xl border border-white/10 p-4 h-64 overflow-y-auto space-y-2">
                                {MOCK_PROBLEMS_SELECTION.map(prob => (
                                    <div
                                        key={prob.slug}
                                        onClick={() => toggleProblem(prob.slug)}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${formData.problems.includes(prob.slug) ? 'bg-primary/20 border-primary' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                    >
                                        <div>
                                            <div className="font-medium text-sm">{prob.title}</div>
                                            <div className={`text-xs ${prob.diff === 'Easy' ? 'text-green-400' : prob.diff === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>{prob.diff}</div>
                                        </div>
                                        {formData.problems.includes(prob.slug) && <div className="text-primary text-xs font-bold">SELECTED</div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {submitting ? 'Scheduling Competition...' : 'Create Competition'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
