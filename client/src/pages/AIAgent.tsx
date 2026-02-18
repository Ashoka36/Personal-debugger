import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Zap, TrendingUp, Brain } from "lucide-react";

export default function AIAgent() {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [analyzing, setAnalyzing] = useState(false);

  const metricsQuery = trpc.agent.metrics.useQuery();
  const strategiesQuery = trpc.agent.strategies.useQuery();
  const patternsQuery = trpc.agent.patterns.useQuery();
  const learningQuery = trpc.agent.learning.useQuery();
  const analyzeMutation = trpc.agent.analyze.useMutation();

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setAnalyzing(true);
    try {
      await analyzeMutation.mutateAsync({ code, language });
      // Refetch metrics after analysis
      await metricsQuery.refetch();
      await strategiesQuery.refetch();
      await patternsQuery.refetch();
    } finally {
      setAnalyzing(false);
    }
  };

  const metrics = metricsQuery.data;
  const strategies = strategiesQuery.data;
  const patterns = patternsQuery.data || [];
  const learning = learningQuery.data || [];

  const languages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "go",
    "rust",
    "cpp",
    "csharp",
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-b from-black to-black/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-pink-500" />
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
              SELF-IMPROVING AI AGENT
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Advanced code analysis with meta-learning capabilities
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code Input */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-4">
              <h2 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                CODE ANALYZER
              </h2>

              <div className="space-y-4">
                {/* Language Selector */}
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-black border border-cyan-500/30 text-cyan-400 px-3 py-2 rounded text-sm hover:border-cyan-500/50 focus:border-cyan-500 focus:outline-none"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Code Input */}
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Code
                  </label>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here..."
                    className="w-full h-64 bg-black border border-cyan-500/30 text-cyan-400 px-3 py-2 rounded text-sm font-mono hover:border-cyan-500/50 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || !code.trim()}
                  className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ANALYZING...
                    </>
                  ) : (
                    "ANALYZE CODE"
                  )}
                </Button>
              </div>
            </Card>

            {/* Analysis Results */}
            {analyzeMutation.data && (
              <Card className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-4">
                <h3 className="text-cyan-400 font-bold mb-4">ANALYSIS RESULTS</h3>

                {analyzeMutation.data.errors.length === 0 ? (
                  <div className="text-green-400 text-sm">
                    ✓ No errors detected
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-pink-400 text-sm font-bold">
                      {analyzeMutation.data.errors.length} Error
                      {analyzeMutation.data.errors.length !== 1 ? "s" : ""} Found
                    </div>
                    {analyzeMutation.data.errors.map((error, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 border-pink-500 bg-pink-500/5 p-3 text-sm"
                      >
                        <div className="font-bold">Line {error.line}</div>
                        <div className="text-gray-400 mt-1">{error.message}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          Severity: {error.severity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {analyzeMutation.data.fixes.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-cyan-500/30">
                    <div className="text-green-400 text-sm font-bold mb-4">
                      {analyzeMutation.data.fixes.length} Fix
                      {analyzeMutation.data.fixes.length !== 1 ? "es" : ""} Suggested
                    </div>
                    {analyzeMutation.data.fixes.map((fix, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 border-green-500 bg-green-500/5 p-3 text-sm mb-3"
                      >
                        <div className="font-bold">Fix {idx + 1}</div>
                        <div className="text-gray-400 mt-2">
                          <div className="text-xs text-gray-500 mb-1">
                            Original:
                          </div>
                          <code className="block bg-black/50 p-2 rounded text-xs overflow-x-auto">
                            {fix.original}
                          </code>
                        </div>
                        <div className="text-gray-400 mt-2">
                          <div className="text-xs text-gray-500 mb-1">
                            Fixed:
                          </div>
                          <code className="block bg-black/50 p-2 rounded text-xs overflow-x-auto">
                            {fix.fixed}
                          </code>
                        </div>
                        <div className="text-gray-400 mt-2">
                          <div className="text-xs text-gray-500 mb-1">
                            Explanation:
                          </div>
                          <div className="text-xs">{fix.explanation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Confidence: {(analyzeMutation.data.confidence * 100).toFixed(1)}%
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Agent Intelligence */}
          <div className="space-y-4">
            {/* Metrics */}
            {metrics && (
              <Card className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-4">
                <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  METRICS
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Analyzed:</span>
                    <span className="text-cyan-400 font-bold">
                      {metrics.totalAnalyzed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Fix Time:</span>
                    <span className="text-cyan-400 font-bold">
                      {metrics.averageFixTime.toFixed(0)}ms
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Top Strategies */}
            {strategies && (
              <Card className="border-2 border-pink-500/30 bg-black/50 backdrop-blur p-4">
                <h3 className="text-pink-400 font-bold mb-4">TOP STRATEGIES</h3>
                <div className="space-y-2 text-xs">
                  {Object.entries(strategies)
                    .sort(
                      (a, b) =>
                        b[1].successRate - a[1].successRate
                    )
                    .slice(0, 3)
                    .map(([strategy, stats]) => (
                      <div
                        key={strategy}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-400 truncate">
                          {strategy}
                        </span>
                        <span className="text-pink-400 font-bold">
                          {(stats.successRate * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                </div>
              </Card>
            )}

            {/* Error Patterns */}
            {patterns.length > 0 && (
              <Card className="border-2 border-yellow-500/30 bg-black/50 backdrop-blur p-4">
                <h3 className="text-yellow-400 font-bold mb-4">
                  TOP ERROR PATTERNS
                </h3>
                <div className="space-y-2 text-xs">
                  {patterns.slice(0, 5).map((pattern, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-400 truncate">
                        {pattern.pattern}
                      </span>
                      <span className="text-yellow-400 font-bold">
                        {pattern.count}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Learning History */}
            {learning.length > 0 && (
              <Card className="border-2 border-green-500/30 bg-black/50 backdrop-blur p-4">
                <h3 className="text-green-400 font-bold mb-4">
                  LEARNING ITERATIONS
                </h3>
                <div className="space-y-2 text-xs max-h-48 overflow-y-auto">
                  {learning.slice(-5).map((iter, idx) => (
                    <div
                      key={idx}
                      className="border-l-2 border-green-500/50 pl-2"
                    >
                      <div className="text-green-400 font-bold">
                        Iteration {iter.iteration}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {iter.strategy}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {(iter.successRate * 100).toFixed(0)}% success
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
