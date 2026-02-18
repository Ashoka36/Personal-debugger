import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && ENV.databaseUrl && !ENV.databaseUrl.startsWith('sqlite:')) {
    try {
      _db = drizzle(ENV.databaseUrl);
      console.log("[Database] Connected to MySQL:", ENV.databaseUrl);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: any): Promise<void> {
  console.log("Upsert user:", user.openId);
}

export async function getUserByOpenId(openId: string) {
  console.log("Get user by OpenID:", openId);
  return { id: 1, openId, name: "Demo User", role: "user" };
}

export async function getGithubTokenByUserId(userId: number) {
  console.log("Get GitHub token for user:", userId);
  return undefined;
}

export async function saveGithubToken(userId: number, tokenHash: string, username: string) {
  console.log("Save GitHub token for user:", userId);
}

export async function getRepositoriesByUserId(userId: number) {
  console.log("Get repositories for user:", userId);
  return [];
}

export async function saveRepository(userId: number, owner: string, repo: string, description: string, url: string) {
  console.log("Save repository:", `${owner}/${repo}`);
}

export async function getIssuesByRepositoryId(repositoryId: number) { return []; }
export async function saveIssue(data: any) { return; }
export async function getTestResultsByRepositoryId(repositoryId: number) { return []; }
export async function saveTestResult(data: any) { return; }
export async function createNotification(userId: number, repositoryId: number, type: string, title: string, message: string, issueId?: number) { return; }
export async function getNotificationsByUserId(userId: number) { return []; }
export async function getGitlabTokenByUserId(userId: number) { return undefined; }
export async function saveGitlabToken(userId: number, tokenHash: string, username: string, gitlabUrl: string = "https://gitlab.com") { return; }
export async function createRepositorySync(data: any) { return; }
export async function getRepositorySyncsByUserId(userId: number) { return []; }
export async function getRepositorySyncById(syncId: number) { return undefined; }
export async function updateRepositorySyncStatus(syncId: number, status: string, approvalStatus?: string) { return; }
export async function approveRepositorySync(syncId: number, approvedBy: string) { return; }
export async function rejectRepositorySync(syncId: number, approvedBy: string) { return; }
