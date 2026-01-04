import Link from "next/link";
import {
    ArrowRightIcon,
    CheckCircle2,
    Code2,
    Cpu,
    Globe2,
    Sparkles,
    Terminal,
    Trophy,
    Users2,
    Video,
    Zap,
} from "lucide-react";

function HomePage() {
    return (
        <div className="min-h-screen relative overflow-x-hidden selection:bg-primary/20 selection:text-primary">
            {/* Navbar */}
            <nav className="fixed w-full z-50 glass-nav transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
                                Talent IQ
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-base-content/50 font-semibold">
                                By Developers
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/login"
                            className="hidden md:block text-sm font-medium text-base-content/70 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link href="/login">
                            <button className="relative group px-6 py-2.5 rounded-full overflow-hidden bg-white text-black font-semibold text-sm shadow-xl shadow-white/5 hover:shadow-white/10 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
                                    Get Started
                                    <ArrowRightIcon className="w-4 h-4" />
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-8 relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium animate-fade-in-up hover:border-primary/40 transition-colors cursor-default">
                                <Zap className="w-4 h-4 fill-current" />
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Next-Gen Interview Platform
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                                Master Your <br />
                                <span className="text-gradient-primary relative inline-block">
                                    Technical Interview
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-xl text-base-content/60 leading-relaxed max-w-xl">
                                Experience the future of technical hiring. Join thousands of developers using our AI-enhanced, real-time collaboration platform to land their dream jobs.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href="/login">
                                    <button className="btn btn-primary btn-lg rounded-full px-8 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 border-none bg-gradient-to-r from-primary to-indigo-600 hover:scale-105 transition-all duration-200">
                                        Start Coding Free
                                        <Terminal className="w-5 h-5 ml-2" />
                                    </button>
                                </Link>

                                <button className="btn btn-ghost btn-lg rounded-full px-8 border border-white/10 hover:bg-white/5 hover:border-white/20 text-white group">
                                    <span className="mr-2 bg-white/10 p-1 rounded-full group-hover:bg-white/20 transition-colors">
                                        <Video className="w-4 h-4" />
                                    </span>
                                    Watch Demo
                                </button>
                            </div>

                            <div className="pt-8 flex items-center gap-8 text-base-content/40">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    <span className="text-sm">No credit card required</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    <span className="text-sm">14-day free trial</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Graphic */}
                        <div className="relative lg:h-[600px] flex items-center justify-center animate-float">
                            {/* Background Glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse-glow"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-[80px]"></div>

                            {/* Card Container */}
                            <div className="relative w-full max-w-md aspect-square rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden group">
                                {/* Simulated Editor Window */}
                                <div className="absolute inset-0 flex flex-col">
                                    {/* Window Bar */}
                                    <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                        <div className="ml-4 text-xs text-white/30 font-mono">interview_solution.ts</div>
                                    </div>
                                    {/* Editor Content */}
                                    <div className="flex-1 p-6 font-mono text-sm relative">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10"></div>
                                        <div className="text-pink-400">function <span className="text-blue-400">solveProblem</span>(input: <span className="text-yellow-400">string</span>) {'{'}</div>
                                        <div className="pl-4 text-white/80">
                                            <span className="text-purple-400">const</span> result = input.<span className="text-blue-300">split</span>('').<span className="text-blue-300">reverse</span>().<span className="text-blue-300">join</span>('');
                                        </div>
                                        <div className="pl-4 text-white/50">// Optimized solution O(n)</div>
                                        <div className="pl-4 mt-2 border-l-2 border-primary/50 pl-2 text-white/90 animate-pulse">
                                            <span className="text-green-400">return</span> result;
                                        </div>
                                        <div className="text-pink-400">{'}'}</div>

                                        {/* Floating Elements on Image */}
                                        <div className="absolute bottom-8 right-8 glass-card p-4 rounded-xl flex items-center gap-3 animate-bounce shadow-xl z-20">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-white/50">Test Status</div>
                                                <div className="text-sm font-bold text-white">All Passed</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-md opacity-50 rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-10 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Active Developers", value: "10k+", icon: Users2 },
                        { label: "Daily Interviews", value: "500+", icon: Video },
                        { label: "Lines of Code", value: "1M+", icon: Code2 },
                        { label: "Success Rate", value: "94%", icon: Trophy }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center text-center group">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-base-content/50 font-medium uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 max-w-2xl mx-auto">
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                            Everything you need to <span className="text-gradient-primary">Excel</span>
                        </h2>
                        <p className="text-base-content/60 text-lg">
                            Our platform provides the most advanced tools for checking skills, conducting interviews, and learning together.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "HD Video Calls",
                                desc: "Crystal clear low-latency video for natural communication.",
                                icon: Video,
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                title: "Real-time Editor",
                                desc: "Collaborate in real-time with multi-cursor support.",
                                icon: Code2,
                                gradient: "from-purple-500 to-pink-500"
                            },
                            {
                                title: "Global Infrastructure",
                                desc: "Edge network ensures blazing fast connection anywhere.",
                                icon: Globe2,
                                gradient: "from-amber-500 to-orange-500"
                            },
                            {
                                title: "AI Assistant",
                                desc: "Get intelligent hints and code reviews on the fly.",
                                icon: Cpu,
                                gradient: "from-green-500 to-emerald-500"
                            },
                            {
                                title: "Battle Tested",
                                desc: "Used by top tech companies for their hiring pipeline.",
                                icon: Trophy,
                                gradient: "from-red-500 to-rose-500"
                            },
                            {
                                title: "Secure & Private",
                                desc: "Enterprise grade security for all your data.",
                                icon: CheckCircle2,
                                gradient: "from-indigo-500 to-violet-500"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="glass-card rounded-3xl p-8 relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-base-content/60 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="glass-card rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
                                Ready to transform your <br />
                                hiring process?
                            </h2>
                            <p className="text-xl text-base-content/70 mb-10 max-w-2xl mx-auto">
                                Join thousands of developers and companies who trust Talent IQ for their technical interviews.
                            </p>
                            <Link href="/login">
                                <button className="btn btn-primary btn-lg h-16 px-10 rounded-full text-lg shadow-2xl hover:scale-105 transition-transform bg-white text-black border-none hover:bg-gray-100">
                                    Get Started For Free
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-xl text-white">Talent IQ</span>
                            </div>
                            <p className="text-base-content/50 text-sm leading-relaxed mb-6">
                                Making technical interviews efficient, collaborative, and enjoyable for everyone.
                            </p>
                        </div>

                        {[
                            { title: "Product", links: ["Features", "Pricing", "Integrations", "Enterprise"] },
                            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                            { title: "Legal", links: ["Privacy", "Terms", "Security", "Status"] }
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 className="font-bold text-white mb-6">{col.title}</h4>
                                <ul className="space-y-4">
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            <a href="#" className="text-sm text-base-content/60 hover:text-primary transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-base-content/50">
                            © 2024 Talent IQ Inc. All rights reserved.
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-base-content/50 hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="text-base-content/50 hover:text-white transition-colors">GitHub</a>
                            <a href="#" className="text-base-content/50 hover:text-white transition-colors">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
