import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { GitBranch, Copy, CheckCircle, AlertCircle, Loader2, Zap } from "lucide-react";

export default function RepositorySync() {
  const [sourceRepo, setSourceRepo] = useState("");
  const [targetRepo, setTargetRepo] = useState("");
  const [sourceType, setSourceType] = useState<"github" | "gitlab">("github");
  const [targetType, setTargetType] = useState<"github" | "gitlab">("gitlab");
  const [isRequesting, setIsRequesting] = useState(false);

  const repositoriesQuery = trpc.repositories.list.useQuery();
  const syncsQuery = trpc.repositorySync.list.useQuery();
  const requestCloneMutation = trpc.repositorySync.requestClone.useMutation();
  const approveMutation = trpc.repositorySync.approve.useMutation();
  const rejectMutation = trpc.repositorySync.reject.useMutation();

  const repositories = repositoriesQuery.data || [];
  const syncs = syncsQuery.data || [];

  const handleRequestClone = async () => {
    if (!sourceRepo || !targetRepo) {
      toast.error("Please select source and target repositories");
      return;
    }

    setIsRequesting(true);
    try {
      const sourceRepoId = repositories.find((r) => r.fullName === sourceRepo)?.id;
      if (!sourceRepoId) {
        toast.error("Source repository not found");
        return;
      }

      await requestCloneMutation.mutateAsync({
        sourceType,
        targetType,
        sourceRepoName: sourceRepo,
        targetRepoName: targetRepo,
        sourceRepositoryId: sourceRepoId,
      });

      toast.success("Clone request submitted for approval");
      setSourceRepo("");
      setTargetRepo("");
      syncsQuery.refetch();
    } catch (error: any) {
      toast.error("Failed to request clone: " + error.message);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleApprove = async (syncId: number) => {
    try {
      await approveMutation.mutateAsync({ syncId });
      toast.success("Clone request approved - autonomous cloning started");
      syncsQuery.refetch();
    } catch (error: any) {
      toast.error("Failed to approve: " + error.message);
    }
  };

  const handleReject = async (syncId: number) => {
    try {
      await rejectMutation.mutateAsync({ syncId });
      toast.success("Clone request rejected");
      syncsQuery.refetch();
    } catch (error: any) {
      toast.error("Failed to reject: " + error.message);
    }
  };

  const getSyncStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case "completed":
        return "border-green-500/30 bg-green-500/5 text-green-400";
      case "syncing":
        return "border-cyan-500/30 bg-cyan-500/5 text-cyan-400";
      case "approved":
        return "border-yellow-500/30 bg-yellow-500/5 text-yellow-400";
      case "pending":
        return "border-gray-500/30 bg-gray-500/5 text-gray-400";
      case "failed":
        return "border-red-500/30 bg-red-500/5 text-red-400";
      default:
        return "border-cyan-500/30 bg-cyan-500/5 text-cyan-400";
    }
  };

  const getApprovalStatusBadge = (status: string | null | undefined) => {
    switch (status) {
      case "approved":
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold">APPROVED</span>;
      case "rejected":
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold">REJECTED</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold">PENDING APPROVAL</span>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-b from-black to-black/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-500 to-pink-500" style={{ textShadow: "0 0 20px #ec4899, 0 0 40px #06b6d4" }}>
            REPOSITORY SYNC
          </h1>
          <p className="text-cyan-400 text-sm mt-2">Autonomous cloning between GitHub and GitLab with approval workflow</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Clone request form */}
        <div className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-8 mb-8">
          <h2 className="text-cyan-400 font-bold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            REQUEST AUTONOMOUS CLONE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Source */}
            <div>
              <label className="block text-sm text-cyan-400 mb-2">Source Platform</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as "github" | "gitlab")}
                className="w-full bg-black border-2 border-cyan-500/30 text-white px-4 py-2 font-mono text-sm focus:border-pink-500 focus:outline-none transition-colors"
              >
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
              </select>
            </div>

            {/* Target */}
            <div>
              <label className="block text-sm text-cyan-400 mb-2">Target Platform</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as "github" | "gitlab")}
                className="w-full bg-black border-2 border-cyan-500/30 text-white px-4 py-2 font-mono text-sm focus:border-pink-500 focus:outline-none transition-colors"
              >
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Source repo */}
            <div>
              <label className="block text-sm text-cyan-400 mb-2">Source Repository</label>
              <select
                value={sourceRepo}
                onChange={(e) => setSourceRepo(e.target.value)}
                className="w-full bg-black border-2 border-cyan-500/30 text-white px-4 py-2 font-mono text-sm focus:border-pink-500 focus:outline-none transition-colors"
              >
                <option value="">Select a repository...</option>
                {repositories.map((repo) => (
                  <option key={repo.id} value={repo.fullName}>
                    {repo.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Target repo */}
            <div>
              <label className="block text-sm text-cyan-400 mb-2">Target Repository Name</label>
              <input
                type="text"
                value={targetRepo}
                onChange={(e) => setTargetRepo(e.target.value)}
                placeholder="owner/repo-name"
                className="w-full bg-black border-2 border-cyan-500/30 text-white px-4 py-2 font-mono text-sm focus:border-pink-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Same name as source or custom name</p>
            </div>
          </div>

          <Button
            onClick={handleRequestClone}
            disabled={isRequesting || !sourceRepo || !targetRepo}
            className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-black font-bold py-3 transition-all disabled:opacity-50"
          >
            {isRequesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                REQUESTING...
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                REQUEST CLONE
              </>
            )}
          </Button>

          <div className="mt-4 p-4 border-l-4 border-cyan-500 bg-cyan-500/5">
            <p className="text-xs text-cyan-400">
              ✓ Clone requests require your approval before autonomous cloning begins
            </p>
            <p className="text-xs text-cyan-400 mt-1">
              ✓ All code is cloned with full history and tags
            </p>
            <p className="text-xs text-cyan-400 mt-1">
              ✓ No modifications are made to the source repository
            </p>
          </div>
        </div>

        {/* Active syncs */}
        <div className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-8">
          <h2 className="text-cyan-400 font-bold mb-6 flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            SYNC REQUESTS ({syncs.length})
          </h2>

          {syncs.length === 0 ? (
            <p className="text-gray-500 text-sm">No sync requests yet</p>
          ) : (
            <div className="space-y-4">
              {syncs.map((sync) => (
                <div key={sync.id} className={`border-2 p-4 ${getSyncStatusColor(sync.syncStatus)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-sm">
                        {(sync.sourceType || "unknown").toUpperCase()} → {(sync.targetType || "unknown").toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Target: {sync.targetRepoName || "Unknown"}
                      </div>
                    </div>
                    <div className="flex gap-2">{getApprovalStatusBadge(sync.approvalStatus || "pending")}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-400">
                    <div>Status: {sync.syncStatus || "pending"}</div>
                    <div>Created: {new Date(sync.createdAt || new Date()).toLocaleDateString()}</div>
                  </div>

                  {sync.errorMessage && (
                    <div className="p-2 mb-3 bg-red-500/10 border-l-2 border-red-500 text-red-400 text-xs">
                      {sync.errorMessage || "Unknown error"}
                    </div>
                  )}

                  {(sync.approvalStatus === "pending" || !sync.approvalStatus) && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(sync.id)}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 py-2 text-xs font-bold"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        APPROVE
                      </Button>
                      <Button
                        onClick={() => handleReject(sync.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 py-2 text-xs font-bold"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        REJECT
                      </Button>
                    </div>
                  )}

                  {sync.approvalStatus === "approved" && sync.syncStatus === "syncing" && (
                    <div className="flex items-center gap-2 text-xs text-cyan-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Cloning in progress...
                    </div>
                  )}

                  {sync.syncStatus === "completed" && (
                    <div className="flex items-center gap-2 text-xs text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      Clone completed successfully
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
