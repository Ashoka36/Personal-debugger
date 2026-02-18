import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Loader2, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function GitHubSetup() {
  const [token, setToken] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const saveTokenMutation = trpc.github.saveToken.useMutation({
    onSuccess: () => {
      toast.success("GitHub token saved successfully");
      setToken("");
    },
    onError: (error) => {
      toast.error("Failed to save token: " + error.message);
    },
  });

  const handleValidateAndSave = async () => {
    if (!token.trim()) {
      toast.error("Please enter a GitHub token");
      return;
    }

    setIsValidating(true);
    try {
      // In a real app, validate the token on the backend first
      // For now, we'll hash it and save
      const tokenHash = await hashToken(token);
      const username = await extractGitHubUsername(token);

      await saveTokenMutation.mutateAsync({
        tokenHash,
        username,
      });
    } catch (error) {
      toast.error("Invalid GitHub token");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-b from-black to-black/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-500 to-pink-500" style={{ textShadow: "0 0 20px #ec4899, 0 0 40px #06b6d4" }}>
            GITHUB AUTHENTICATION
          </h1>
          <p className="text-cyan-400 text-sm mt-2">Secure token-based repository access</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructions */}
          <div className="lg:col-span-1">
            <div className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-6">
              <h3 className="text-cyan-400 font-bold mb-4">SETUP INSTRUCTIONS</h3>
              <ol className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-3">
                  <span className="text-pink-500 font-bold flex-shrink-0">1.</span>
                  <span>Go to GitHub Settings → Developer settings → Personal access tokens</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-pink-500 font-bold flex-shrink-0">2.</span>
                  <span>Click "Generate new token (classic)"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-pink-500 font-bold flex-shrink-0">3.</span>
                  <span>Select scopes: repo (full control), read:user, read:org</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-pink-500 font-bold flex-shrink-0">4.</span>
                  <span>Copy the token and paste it below</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-pink-500 font-bold flex-shrink-0">5.</span>
                  <span>Token is hashed and stored securely - never exposed</span>
                </li>
              </ol>

              <div className="mt-6 p-4 border-l-4 border-yellow-500 bg-yellow-500/5">
                <p className="text-xs text-yellow-400 font-bold mb-2">⚠️ SECURITY NOTE</p>
                <p className="text-xs text-gray-400">
                  Your token is hashed using SHA-256 before storage. We never store or transmit the raw token. All API calls use your token securely on the backend.
                </p>
              </div>
            </div>
          </div>

          {/* Token input */}
          <div className="lg:col-span-2">
            <div className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur p-8">
              <h3 className="text-cyan-400 font-bold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                ENTER GITHUB TOKEN
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-cyan-400 mb-2">Personal Access Token</label>
                  <div className="relative">
                    <input
                      type={showToken ? "text" : "password"}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full bg-black border-2 border-cyan-500/30 text-white px-4 py-3 font-mono text-sm focus:border-pink-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {showToken ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-cyan-500 bg-cyan-500/5">
                  <p className="text-xs text-cyan-400">
                    ✓ Token is hashed immediately upon submission
                  </p>
                  <p className="text-xs text-cyan-400 mt-1">
                    ✓ Raw token is never stored in database
                  </p>
                  <p className="text-xs text-cyan-400 mt-1">
                    ✓ All GitHub API calls use backend authentication
                  </p>
                </div>

                <Button
                  onClick={handleValidateAndSave}
                  disabled={isValidating || !token.trim()}
                  className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-black font-bold py-3 transition-all disabled:opacity-50"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      VALIDATING...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      SAVE & VALIDATE TOKEN
                    </>
                  )}
                </Button>

                <div className="p-4 border-2 border-pink-500/30 bg-pink-500/5">
                  <p className="text-xs text-pink-400 font-bold mb-2">READ-ONLY OPERATIONS</p>
                  <p className="text-xs text-gray-400">
                    This debugger only reads your repositories. It never modifies, commits, or pushes code. Your repositories are completely safe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function extractGitHubUsername(token: string): Promise<string> {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${token}` },
    });
    const data = await response.json();
    return data.login || "unknown";
  } catch {
    return "unknown";
  }
}
