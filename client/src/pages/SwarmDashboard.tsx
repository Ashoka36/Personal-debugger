import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Code2, CheckCircle, Rocket, GitBranch } from "lucide-react";

interface SwarmState {
  activeAgents: string[];
  taskQueue: any[];
  completedTasks: number;
  failedTasks: number;
  lastUpdate: Date;
}

export default function SwarmDashboard() {
  const [swarmState, setSwarmState] = useState<SwarmState | null>(null);
  const [selectedCode, setSelectedCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [platforms, setPlatforms] = useState<string[]>(["github"]);
  const [isRunning, setIsRunning] = useState(false);

  const swarmStatus = trpc.swarm.status.useQuery();
  const orchestrateMutation = trpc.swarm.orchestrate.useMutation();

  useEffect(() => {
    if (swarmStatus.data) {
      setSwarmState(swarmStatus.data as any);
    }
  }, [swarmStatus.data]);

  const handleOrchestrate = async () => {
    if (!selectedCode || !owner || !repo) {
      alert("Please fill in all required fields");
      return;
    }

    setIsRunning(true);
    try {
      const result = await orchestrateMutation.mutateAsync({
        code: selectedCode,
        language,
        owner,
        repo,
        branch,
        platforms,
      });

      console.log("Orchestration result:", result);
      alert("Swarm orchestration completed!");
    } catch (error) {
      console.error("Orchestration error:", error);
      alert("Orchestration failed: " + String(error));
    } finally {
      setIsRunning(false);
    }
  };

  const agents = [
    {
      name: "Coder Agent",
      icon: Code2,
      description: "Vision-based code analysis & refactoring",
      color: "from-pink-500 to-pink-600",
      status: swarmState?.activeAgents.includes("coder") ? "active" : "idle",
    },
    {
      name: "Syntax Fixer",
      icon: CheckCircle,
      description: "Syntax correction & optimization",
      color: "from-cyan-500 to-cyan-600",
      status: swarmState?.activeAgents.includes("syntaxFixer") ? "active" : "idle",
    },
    {
      name: "Watchdog Agent",
      icon: Zap,
      description: "Quality validation & CI/CD checks",
      color: "from-yellow-500 to-yellow-600",
      status: swarmState?.activeAgents.includes("watchdog") ? "active" : "idle",
    },
    {
      name: "Deployer Agent",
      icon: Rocket,
      description: "Multi-platform autonomous deployment",
      color: "from-green-500 to-green-600",
      status: swarmState?.activeAgents.includes("deployer") ? "active" : "idle",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-500 to-pink-500">
          🤖 SWARM ORCHESTRATOR
        </h1>
        <p className="text-cyan-400">4-Agent Autonomous Code Refactoring & Deployment</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900 border-cyan-500/30 p-4">
          <div className="text-cyan-400 text-sm mb-2">Active Agents</div>
          <div className="text-3xl font-bold text-cyan-400">{swarmState?.activeAgents.length || 0}</div>
        </Card>
        <Card className="bg-gray-900 border-pink-500/30 p-4">
          <div className="text-pink-400 text-sm mb-2">Completed Tasks</div>
          <div className="text-3xl font-bold text-pink-400">{swarmState?.completedTasks || 0}</div>
        </Card>
        <Card className="bg-gray-900 border-yellow-500/30 p-4">
          <div className="text-yellow-400 text-sm mb-2">Failed Tasks</div>
          <div className="text-3xl font-bold text-yellow-400">{swarmState?.failedTasks || 0}</div>
        </Card>
        <Card className="bg-gray-900 border-green-500/30 p-4">
          <div className="text-green-400 text-sm mb-2">Queue Depth</div>
          <div className="text-3xl font-bold text-green-400">{swarmState?.taskQueue.length || 0}</div>
        </Card>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card key={agent.name} className="bg-gray-900 border-gray-700 p-6 hover:border-pink-500/50 transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                  <p className="text-gray-400 text-sm">{agent.description}</p>
                </div>
                <Icon className={`w-8 h-8 text-${agent.color.split("-")[1]}-500`} />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    agent.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-600"
                  }`}
                />
                <span className="text-sm text-gray-400 capitalize">{agent.status}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Input Section */}
      <Card className="bg-gray-900 border-cyan-500/30 p-6 mb-8">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Orchestrate Refactoring</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">GitHub Owner</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g., facebook"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Repository</label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="e.g., react"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            >
              <option>typescript</option>
              <option>javascript</option>
              <option>python</option>
              <option>go</option>
              <option>rust</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Code to Analyze</label>
          <textarea
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            placeholder="Paste your code here..."
            rows={6}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 font-mono text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Deployment Platforms</label>
          <div className="flex flex-wrap gap-2">
            {["github", "gitlab", "docker", "render", "vercel", "netlify", "digitalocean", "aws"].map((platform) => (
              <button
                key={platform}
                onClick={() =>
                  setPlatforms((prev) =>
                    prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
                  )
                }
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  platforms.includes(platform)
                    ? "bg-pink-500 text-white"
                    : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-pink-500"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleOrchestrate}
          disabled={isRunning || !selectedCode || !owner || !repo}
          className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white font-bold py-3 rounded transition disabled:opacity-50"
        >
          {isRunning ? "🔄 Orchestrating..." : "🚀 START SWARM ORCHESTRATION"}
        </Button>
      </Card>

      {/* CEL Rules */}
      <Card className="bg-gray-900 border-green-500/30 p-6">
        <h2 className="text-xl font-bold text-green-400 mb-4">CEL Rules Engine</h2>
        <p className="text-gray-400 text-sm mb-4">
          Dynamic rule evaluation for approval, deployment gates, and rollback triggers. Rules are evaluated in real-time
          during the orchestration pipeline.
        </p>
        <div className="space-y-2 text-sm text-gray-400">
          <div>✓ High Quality: qualityScore &gt;= 80</div>
          <div>✓ Tests Passed: testsPassed == true</div>
          <div>✓ Production Deploy: branch == 'main' && qualityScore &gt;= 85</div>
          <div>✓ Rollback: testsPassed == false && platform == 'production'</div>
        </div>
      </Card>
    </div>
  );
}
