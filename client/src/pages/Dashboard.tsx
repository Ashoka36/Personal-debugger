import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Bug, Code2, GitBranch, Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedRepo, setSelectedRepo] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const repositoriesQuery = trpc.repositories.list.useQuery();
  const issuesQuery = trpc.issues.list.useQuery(
    { repositoryId: selectedRepo || 0 },
    { enabled: !!selectedRepo }
  );
  const testsQuery = trpc.tests.list.useQuery(
    { repositoryId: selectedRepo || 0 },
    { enabled: !!selectedRepo }
  );
  const notificationsQuery = trpc.notifications.list.useQuery();

  const repositories = repositoriesQuery.data || [];
  const issues = issuesQuery.data || [];
  const tests = testsQuery.data || [];
  const notifications = notificationsQuery.data || [];

  const criticalIssues = issues.filter((i) => i.severity === "critical");
  const highIssues = issues.filter((i) => i.severity === "high");
  const failedTests = tests.filter((t) => t.status === "failed");

  const navItems = [
    { label: "GitHub", href: "/github-setup" },
    { label: "GitLab", href: "/gitlab-setup" },
    { label: "Sync", href: "/repository-sync" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Responsive Header */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-b from-black to-black/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-pink-500 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 md:w-6 md:h-6 text-pink-500 drop-shadow-lg" style={{ textShadow: "0 0 10px #ec4899" }} />
              </div>
              <h1 className="text-lg md:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-500 to-pink-500 line-clamp-1" style={{ textShadow: "0 0 20px #ec4899, 0 0 40px #06b6d4" }}>
                AI DEBUGGER
              </h1>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-cyan-500/10 rounded"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Time */}
            <div className="hidden md:block text-cyan-400 text-xs md:text-sm">
              SYSTEM ONLINE • {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Status bar - Responsive */}
          <div className="flex flex-wrap gap-2 md:gap-4 text-xs mb-4 md:mb-0">
            <div className="flex items-center gap-2 px-2 md:px-3 py-1 border border-cyan-500/50 bg-cyan-500/5">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-cyan-400">ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 px-2 md:px-3 py-1 border border-pink-500/50 bg-pink-500/5">
              <span className="text-pink-400">{repositories.length} REPOS</span>
            </div>
            <div className="flex items-center gap-2 px-2 md:px-3 py-1 border border-yellow-500/50 bg-yellow-500/5">
              <span className="text-yellow-400">{criticalIssues.length} CRITICAL</span>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-cyan-500/30 flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  onClick={() => {
                    setLocation(item.href);
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="text-cyan-400 hover:text-pink-400 hover:bg-cyan-500/10 justify-start w-full"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Repository selector - Full width on mobile */}
          <div className="md:col-span-1">
            <div className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-3 md:p-4">
              <h2 className="text-cyan-400 font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                <GitBranch className="w-4 h-4" />
                REPOSITORIES
              </h2>
              <div className="space-y-2 max-h-64 md:max-h-96 overflow-y-auto">
                {repositories.length === 0 ? (
                  <p className="text-gray-500 text-xs md:text-sm">No repositories connected</p>
                ) : (
                  repositories.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => setSelectedRepo(repo.id)}
                      className={`w-full text-left px-2 md:px-3 py-2 text-xs md:text-sm border transition-all truncate ${
                        selectedRepo === repo.id
                          ? "border-pink-500 bg-pink-500/10 text-pink-400"
                          : "border-cyan-500/20 bg-black/50 text-cyan-300 hover:border-cyan-500/50"
                      }`}
                    >
                      <div className="font-mono text-xs truncate">{repo.fullName}</div>
                      {repo.description && <div className="text-gray-500 text-xs mt-1 line-clamp-1">{repo.description}</div>}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Metrics panel - Responsive grid */}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
            <div className="border-2 border-pink-500/30 bg-black/50 backdrop-blur p-3 md:p-4">
              <div className="text-pink-400 text-xs font-bold mb-2">CRITICAL</div>
              <div className="text-3xl md:text-4xl font-black text-pink-500" style={{ textShadow: "0 0 20px #ec4899" }}>
                {criticalIssues.length}
              </div>
            </div>
            <div className="border-2 border-yellow-500/30 bg-black/50 backdrop-blur p-3 md:p-4">
              <div className="text-yellow-400 text-xs font-bold mb-2">HIGH</div>
              <div className="text-3xl md:text-4xl font-black text-yellow-500" style={{ textShadow: "0 0 20px #eab308" }}>
                {highIssues.length}
              </div>
            </div>
            <div className="border-2 border-red-500/30 bg-black/50 backdrop-blur p-3 md:p-4">
              <div className="text-red-400 text-xs font-bold mb-2">FAILED</div>
              <div className="text-3xl md:text-4xl font-black text-red-500" style={{ textShadow: "0 0 20px #ef4444" }}>
                {failedTests.length}
              </div>
            </div>
            <div className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-3 md:p-4">
              <div className="text-cyan-400 text-xs font-bold mb-2">TOTAL</div>
              <div className="text-3xl md:text-4xl font-black text-cyan-500" style={{ textShadow: "0 0 20px #06b6d4" }}>
                {issues.length}
              </div>
            </div>
          </div>
        </div>

        {selectedRepo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Issues panel */}
            <div className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-3 md:p-4">
              <h3 className="text-cyan-400 font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                <Bug className="w-4 h-4" />
                DETECTED ISSUES
              </h3>
              <div className="space-y-2 md:space-y-3 max-h-64 md:max-h-96 overflow-y-auto">
                {issues.length === 0 ? (
                  <p className="text-gray-500 text-xs md:text-sm">No issues detected</p>
                ) : (
                  issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-2 md:p-3 border-l-4 bg-black/50 text-xs md:text-sm ${
                        issue.severity === "critical"
                          ? "border-l-pink-500 bg-pink-500/5"
                          : issue.severity === "high"
                            ? "border-l-yellow-500 bg-yellow-500/5"
                            : issue.severity === "medium"
                              ? "border-l-cyan-500 bg-cyan-500/5"
                              : "border-l-green-500 bg-green-500/5"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold">{issue.title}</div>
                          <div className="text-gray-400 mt-1 line-clamp-2">{issue.description}</div>
                          {issue.lineNumber && (
                            <div className="text-gray-500 mt-2">
                              Line {issue.lineNumber} • {issue.issueType}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tests panel */}
            <div className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-3 md:p-4">
              <h3 className="text-cyan-400 font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                <Code2 className="w-4 h-4" />
                TEST RESULTS
              </h3>
              <div className="space-y-2 md:space-y-3 max-h-64 md:max-h-96 overflow-y-auto">
                {tests.length === 0 ? (
                  <p className="text-gray-500 text-xs md:text-sm">No test results</p>
                ) : (
                  tests.map((test) => (
                    <div
                      key={test.id}
                      className={`p-2 md:p-3 border-l-4 bg-black/50 text-xs md:text-sm ${
                        test.status === "failed"
                          ? "border-l-red-500 bg-red-500/5"
                          : test.status === "passed"
                            ? "border-l-green-500 bg-green-500/5"
                            : "border-l-gray-500 bg-gray-500/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold">{test.testName}</div>
                          <div className="text-gray-400 mt-1 truncate">{test.testFile}</div>
                          {test.duration && (
                            <div className="text-gray-500 mt-2">{test.duration}ms</div>
                          )}
                        </div>
                        <div
                          className={`px-2 py-1 text-xs font-bold whitespace-nowrap ${
                            test.status === "failed"
                              ? "text-red-400 bg-red-500/10"
                              : test.status === "passed"
                                ? "text-green-400 bg-green-500/10"
                                : "text-gray-400 bg-gray-500/10"
                          }`}
                        >
                          {test.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications - Responsive */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 max-w-xs md:max-w-sm">
          {notifications.slice(0, 3).map((notif) => (
            <div
              key={notif.id}
              className="border-2 border-pink-500/50 bg-pink-500/10 backdrop-blur p-2 md:p-3 text-xs md:text-sm"
            >
              <div className="font-bold text-pink-400">{notif.title}</div>
              <div className="text-gray-300 text-xs mt-1 line-clamp-2">{notif.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
