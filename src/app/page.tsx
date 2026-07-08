import Link from "next/link";
import { TrendingUp, Cpu, ShieldCheck, Award, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 flex items-center justify-center font-bold text-white tracking-widest text-md shadow-[0_0_12px_rgba(99,102,241,0.4)]">
              IQ
            </div>
            <span className="font-semibold tracking-wider text-lg bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
              InvestIQ
            </span>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-4 py-2 rounded-xl border border-neutral-800 text-neutral-300 hover:bg-neutral-900 transition-all font-mono"
          >
            LAUNCH TERMINAL
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 flex flex-col justify-center py-20">
        
        {/* Callout Badge */}
        <div className="flex justify-center md:justify-start mb-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/30 border border-indigo-900/50 text-indigo-400 text-xs font-semibold tracking-wider uppercase font-mono">
            Stateful Multi-Agent Architecture
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="max-w-4xl text-center md:text-left mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-500">
            Next-Gen Investment Research Terminal
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl font-sans">
            Stop relying on single-prompt LLM wrappers. InvestIQ runs parallel specialists, adversarial debate rounds, and self-critique audits to deliver grounded investment decisions.
          </p>
        </div>

        {/* CTA Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-20">
          <Link
            href="/dashboard"
            className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold rounded-xl text-neutral-100 transition-all shadow-[0_4px_20px_rgba(99,102,241,0.25)] flex items-center justify-center gap-2 text-md"
          >
            Enter Terminal
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://github.com/Anilllllllll/Inside-IIM"
            target="_blank"
            rel="noopener noreferrer"
            className="h-14 px-8 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 font-semibold rounded-xl text-neutral-300 transition-all flex items-center justify-center gap-2 text-md"
          >
            View Code Repository
          </a>
        </div>

        {/* Features Column Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-neutral-900 pt-16">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded bg-indigo-950/40 border border-indigo-900/50 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-200 text-lg">Parallel Specialists</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Fanning out research to parallel financial, sentiment, competitive, and risk analysts to cut latency and prevent context windows overload.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded bg-purple-950/40 border border-purple-900/50 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-200 text-lg">Adversarial Debate</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Pitting Bull and Bear case agents side-by-side to stress-test assumptions and find vulnerabilities. Reconciled by a referee node.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded bg-rose-950/40 border border-rose-900/50 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-200 text-lg">Self-Correction Audit</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              CRO validator node inspects the final memo for contradictions or overconfidence. Capped loop recursion retry protects your token costs.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-200 text-lg">100% Math Accuracy</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              All margin calculations and debt ratios computed deterministically in TypeScript, avoiding standard LLM mathematical hallucinations.
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 bg-neutral-950/60 print:hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-neutral-600 text-xs font-mono gap-4">
          <span>© 2026 InvestIQ Agent Platform. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
