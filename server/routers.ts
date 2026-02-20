import { router, publicProcedure, protectedProcedure } from './_core/trpc';
import { systemRouter } from './_core/systemRouter';
import { COOKIE_NAME } from '@shared/const';
import { z } from 'zod';
import {
  getUserByOpenId,
  getRepositoriesByUserId,
  saveRepository,
  getIssuesByRepositoryId,
  getTestResultsByRepositoryId,
  getNotificationsByUserId,
  saveGithubToken,
  saveGitlabToken,
  getGithubTokenByUserId,
  getGitlabTokenByUserId,
  createRepositorySync,
  getRepositorySyncsByUserId,
  approveRepositorySync,
  rejectRepositorySync,
} from './db';
import { callGemini } from './_core/llm';

// ── repositories ──────────────────────────────────────────────────────────────
const repositoriesRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const userId = (ctx.user as any)?.id ?? 1;
    return await getRepositoriesByUserId(userId);
  }),
  add: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string(), description: z.string().optional(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.user as any)?.id ?? 1;
      await saveRepository(userId, input.owner, input.repo, input.description ?? '', input.url);
      return { success: true };
    }),
});

// ── issues ────────────────────────────────────────────────────────────────────
const issuesRouter = router({
  list: publicProcedure
    .input(z.object({ repositoryId: z.number() }))
    .query(async ({ input }) => getIssuesByRepositoryId(input.repositoryId)),
});

// ── tests ─────────────────────────────────────────────────────────────────────
const testsRouter = router({
  list: publicProcedure
    .input(z.object({ repositoryId: z.number() }))
    .query(async ({ input }) => getTestResultsByRepositoryId(input.repositoryId)),
});

// ── notifications ─────────────────────────────────────────────────────────────
const notificationsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const userId = (ctx.user as any)?.id ?? 1;
    return await getNotificationsByUserId(userId);
  }),
});

// ── github ────────────────────────────────────────────────────────────────────
const githubRouter = router({
  saveToken: publicProcedure
    .input(z.object({ token: z.string().optional(), tokenHash: z.string().optional(), username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.user as any)?.id ?? 1;
      const hash = input.tokenHash ?? input.token ?? '';
      await saveGithubToken(userId, hash, input.username);
      return { success: true };
    }),
  getToken: publicProcedure.query(async ({ ctx }) => {
    const userId = (ctx.user as any)?.id ?? 1;
    return await getGithubTokenByUserId(userId);
  }),
});

// ── gitlab ────────────────────────────────────────────────────────────────────
const gitlabRouter = router({
  saveToken: publicProcedure
    .input(z.object({ token: z.string().optional(), tokenHash: z.string().optional(), username: z.string(), gitlabUrl: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.user as any)?.id ?? 1;
      const hash = input.tokenHash ?? input.token ?? '';
      await saveGitlabToken(userId, hash, input.username, input.gitlabUrl);
      return { success: true };
    }),
  getToken: publicProcedure.query(async ({ ctx }) => {
    const userId = (ctx.user as any)?.id ?? 1;
    return await getGitlabTokenByUserId(userId);
  }),
});

// ── repositorySync ────────────────────────────────────────────────────────────
const repositorySyncRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const userId = (ctx.user as any)?.id ?? 1;
    return await getRepositorySyncsByUserId(userId);
  }),
  requestClone: publicProcedure
    .input(z.object({
      sourceRepo: z.string().optional(),
      targetRepo: z.string().optional(),
      sourceRepoName: z.string().optional(),
      targetRepoName: z.string().optional(),
      sourceRepositoryId: z.number().optional(),
      sourceType: z.string(),
      targetType: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx.user as any)?.id ?? 1;
      await createRepositorySync({ userId, ...input });
      return { success: true };
    }),
  approve: publicProcedure
    .input(z.object({ syncId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const approvedBy = (ctx.user as any)?.name ?? 'admin';
      await approveRepositorySync(input.syncId, approvedBy);
      return { success: true };
    }),
  reject: publicProcedure
    .input(z.object({ syncId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const approvedBy = (ctx.user as any)?.name ?? 'admin';
      await rejectRepositorySync(input.syncId, approvedBy);
      return { success: true };
    }),
});

// ── swarm ───────────────────────────────────────────────────────────────────────
const swarmRouter = router({
  status: publicProcedure.query(() => ({
    activeAgents: [] as string[],
    taskQueue: [] as any[],
    completedTasks: 0,
    failedTasks: 0,
    lastUpdate: new Date(),
  })),
  orchestrate: publicProcedure
    .input(z.object({
      code: z.string(),
      language: z.string(),
      owner: z.string(),
      repo: z.string(),
      branch: z.string().optional(),
      platforms: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      return { success: true, taskId: `task-${Date.now()}` };
    }),
});

// ── agent ─────────────────────────────────────────────────────────────────────
const agentRouter = router({
  metrics: publicProcedure.query(() => ({
    totalAnalyses: 0, totalAnalyzed: 0, issuesFixed: 0, testsImproved: 0, codeQuality: 0, averageFixTime: 0,
  })),
  strategies: publicProcedure.query(() => ([] as Array<{ successRate: number; name: string; strategy: string }>)),
  patterns: publicProcedure.query(() => ([] as Array<{ pattern: string; count: number }>)),
  learning: publicProcedure.query(() => ([] as Array<{ iteration: number; improvement: string; strategy: string; successRate: number }>)),
  analyze: publicProcedure
    .input(z.object({ code: z.string(), language: z.string() }))
    .mutation(async ({ input }) => {
      const prompt = `Analyze this ${input.language} code for bugs, security issues, and improvements:\n\n${input.code}`;
      const result = await callGemini(prompt);
      return {
        analysis: result,
        errors: [] as Array<{ message: string; line: number; severity: string }>,
        fixes: [] as Array<{ description: string; code: string; original: string; fixed: string; explanation: string }>,
        issues: [] as string[],
        suggestions: [] as string[],
        confidence: 0.9,
      };
    }),
});

// ── auth ──────────────────────────────────────────────────────────────────────
const authRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.user ?? null;
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie(COOKIE_NAME, {
      maxAge: -1,
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      path: '/',
    });
    return { success: true };
  }),
});

// ── root router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  swarm: swarmRouter,
  repositories: repositoriesRouter,
  issues: issuesRouter,
  tests: testsRouter,
  notifications: notificationsRouter,
  github: githubRouter,
  gitlab: gitlabRouter,
  repositorySync: repositorySyncRouter,
  agent: agentRouter,

  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => ({ greeting: `Hello ${input.name}!` })),

  getUser: publicProcedure
    .input(z.object({ openId: z.string() }))
    .query(async ({ input }) => getUserByOpenId(input.openId)),

  getRepositories: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => getRepositoriesByUserId(input.userId)),

  analyzeCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const prompt = `Analyze this code for issues and suggest improvements:\n\n${input.code}`;
      return callGemini(prompt);
    }),
});

export type AppRouter = typeof appRouter;
