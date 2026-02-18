import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { AlertTriangle, Bug, Code2, Zap, Shield, Gauge } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(6, 182, 212, 0.1) 25%, rgba(6, 182, 212, 0.1) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.1) 75%, rgba(6, 182, 212, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, 0.1) 25%, rgba(6, 182, 212, 0.1) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.1) 75%, rgba(6, 182, 212, 0.1) 76%, transparent 77%, transparent)",
          backgroundSize: "50px 50px"
        }} />
      </div>

      {/* Header */}
      <header className="relative border-b border-cyan-500/20 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-pink-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-pink-500" style={{ textShadow: "0 0 10px #ec4899" }} />
            </div>
            <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
              AI DEBUGGER
            </span>
          </div>
          {isAuthenticated && (
            <Button className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-black font-bold">
              DASHBOARD
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-6xl mx-auto px-4 py-20">
        {/* Hero section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-wider mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-500 to-pink-500" style={{
            textShadow: "0 0 30px #ec4899, 0 0 60px #06b6d4, 0 0 90px #ec4899"
          }}>
            SUPERBRAIN DEBUGGER
          </h1>
          <p className="text-xl text-cyan-400 mb-8 font-mono">
            Autonomous AI-powered code analysis • Zero code modifications • Read-only recommendations
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {!isAuthenticated ? (
              <>
                <a href={getLoginUrl()}>
                  <Button className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-black font-bold px-8 py-6 text-lg">
                    LOGIN WITH MANUS
                  </Button>
                </a>
              </>
            ) : (
              <a href="/github-setup">
                <Button className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-black font-bold px-8 py-6 text-lg">
                  SETUP GITHUB TOKEN
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Bug,
              title: "ERROR DETECTION",
              description: "Identifies syntax errors, type issues, and common bugs across JavaScript/TypeScript codebases",
              color: "pink"
            },
            {
              icon: Code2,
              title: "TEST ANALYSIS",
              description: "Analyzes Playwright, Jest, and Vitest test failures to identify root causes",
              color: "cyan"
            },
            {
              icon: AlertTriangle,
              title: "SECURITY SCAN",
              description: "Detects security vulnerabilities, SQL injection, XSS, and other threats",
              color: "yellow"
            },
            {
              icon: Gauge,
              title: "CODE QUALITY",
              description: "Measures complexity, maintainability, and identifies code smells",
              color: "green"
            },
            {
              icon: Shield,
              title: "SAFE MODE",
              description: "All operations are read-only - zero code modifications or harm",
              color: "blue"
            },
            {
              icon: Zap,
              title: "AI-POWERED",
              description: "Uses advanced LLM to generate intelligent explanations and fix suggestions",
              color: "purple"
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            const colorMap: Record<string, string> = {
              pink: "border-pink-500/30 bg-pink-500/5 text-pink-400",
              cyan: "border-cyan-500/30 bg-cyan-500/5 text-cyan-400",
              yellow: "border-yellow-500/30 bg-yellow-500/5 text-yellow-400",
              green: "border-green-500/30 bg-green-500/5 text-green-400",
              blue: "border-blue-500/30 bg-blue-500/5 text-blue-400",
              purple: "border-purple-500/30 bg-purple-500/5 text-purple-400",
            };

            return (
              <div key={idx} className={`border-2 ${colorMap[feature.color]} backdrop-blur p-6 hover:border-opacity-100 transition-all`}>
                <Icon className="w-8 h-8 mb-4" style={{
                  textShadow: `0 0 10px currentColor`
                }} />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* How it works */}
        <div className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-8 mb-20">
          <h2 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
            HOW IT WORKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "1", title: "CONNECT", desc: "Authenticate with your GitHub account" },
              { num: "2", title: "SELECT", desc: "Choose repositories to analyze" },
              { num: "3", title: "ANALYZE", desc: "AI scans code for errors and issues" },
              { num: "4", title: "REVIEW", desc: "Get detailed reports and fix suggestions" },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 border-2 border-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 font-black text-lg text-pink-500">
                  {step.num}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety guarantee */}
        <div className="border-2 border-green-500/30 bg-green-500/5 backdrop-blur p-8">
          <h2 className="text-2xl font-black mb-4 text-green-400">🛡️ SAFETY GUARANTEE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-bold text-green-400 mb-2">✓ READ-ONLY OPERATIONS</p>
              <p className="text-sm text-gray-400">Your code is never modified. All suggestions are recommendations only.</p>
            </div>
            <div>
              <p className="font-bold text-green-400 mb-2">✓ SECURE TOKENS</p>
              <p className="text-sm text-gray-400">GitHub tokens are hashed and stored securely. Never exposed or transmitted.</p>
            </div>
            <div>
              <p className="font-bold text-green-400 mb-2">✓ ZERO HARM</p>
              <p className="text-sm text-gray-400">No commits, pushes, or modifications. Completely safe for production.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cyan-500/20 mt-20 py-8 text-center text-gray-500 text-sm">
        <p>AI SUPERBRAIN DEBUGGER • Autonomous Code Analysis System</p>
        <p className="mt-2">Read-only • Safe • Intelligent</p>
      </footer>
    </div>
  );
}
