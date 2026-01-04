
import { Code2, Video, Trophy } from 'lucide-react';

export default function StatsSection({ solvedCount, upcomingInterviewsCount }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="glass-card p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-base-content/70">Total Practice</h3>
                    <Code2 className="w-4 h-4 text-primary" />
                </div>
                <div className="text-3xl font-bold text-white">{solvedCount} <span className="text-sm font-normal text-base-content/40">problems</span></div>
            </div>
            <div className="glass-card p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-base-content/70">Interviews</h3>
                    <Video className="w-4 h-4 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-white">{upcomingInterviewsCount} <span className="text-sm font-normal text-base-content/40">upcoming</span></div>
            </div>
            <div className="glass-card p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-base-content/70">Rank</h3>
                    <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-white">Top 10%</div>
            </div>
        </div>
    );
}
