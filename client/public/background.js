/**
 * AI Superbrain Debugger - Browser Plugin Background Service Worker
 * Handles LLM bridge, GitHub/GitLab API calls, and agent orchestration
 */

const API_BASE_URL = "https://3000-izx96eazhwl5uhzk3wtm4-d4308555.sg1.manus.computer/api/trpc";

// Initialize plugin
chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Superbrain Debugger plugin installed");
  chrome.storage.local.set({
    pluginActive: true,
    agentStatus: "idle",
    lastSync: new Date().toISOString(),
  });
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case "analyzeCode":
          await handleCodeAnalysis(request, sendResponse);
          break;
        case "commitChanges":
          await handleCommit(request, sendResponse);
          break;
        case "createPullRequest":
          await handlePullRequest(request, sendResponse);
          break;
        case "mergePullRequest":
          await handleMerge(request, sendResponse);
          break;
        case "deployCode":
          await handleDeployment(request, sendResponse);
          break;
        case "getAgentStatus":
          await handleAgentStatus(request, sendResponse);
          break;
        case "getCELRules":
          await handleGetCELRules(request, sendResponse);
          break;
        default:
          sendResponse({ error: "Unknown action" });
      }
    } catch (error) {
      console.error("Error handling message:", error);
      sendResponse({ error: error.message });
    }
  })();

  return true; // Keep channel open for async response
});

async function handleCodeAnalysis(request, sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/agent.analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: request.code,
        language: request.language,
      }),
    });

    const result = await response.json();
    sendResponse({ success: true, data: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleCommit(request, sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/repositories.commit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: request.platform,
        owner: request.owner,
        repo: request.repo,
        message: request.message,
        files: request.files,
        branch: request.branch,
      }),
    });

    const result = await response.json();
    chrome.storage.local.set({ lastCommit: new Date().toISOString() });
    sendResponse({ success: true, data: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handlePullRequest(request, sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/repositories.createPR`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: request.platform,
        owner: request.owner,
        repo: request.repo,
        title: request.title,
        description: request.description,
        sourceBranch: request.sourceBranch,
        targetBranch: request.targetBranch,
      }),
    });

    const result = await response.json();
    sendResponse({ success: true, data: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleMerge(request, sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/repositories.mergePR`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: request.platform,
        owner: request.owner,
        repo: request.repo,
        prId: request.prId,
        squash: request.squash,
      }),
    });

    const result = await response.json();
    sendResponse({ success: true, data: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleDeployment(request, sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/deployer.deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: request.deployPlatform,
        code: request.code,
        config: request.config,
      }),
    });

    const result = await response.json();
    chrome.storage.local.set({ lastDeployment: new Date().toISOString() });
    sendResponse({ success: true, data: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleAgentStatus(request, sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/agent.metrics`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    chrome.storage.local.set({ agentMetrics: result });
    sendResponse({ success: true, data: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleGetCELRules(request, sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/cel.getRules`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    sendResponse({ success: true, data: result });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Periodic sync for agent status
chrome.alarms.create("syncAgentStatus", { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "syncAgentStatus") {
    chrome.runtime.sendMessage({
      action: "getAgentStatus",
    });
  }
});
