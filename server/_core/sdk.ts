import jwt from 'jsonwebtoken';
import type { Request } from 'express';
import { ENV } from './env';
import { COOKIE_NAME } from '@shared/const';
import { getUserByOpenId } from '../db';
import type { User } from '../../drizzle/schema';

const secret = ENV.cookieSecret || 'dev-secret';

export const sdk = {
  async exchangeCodeForToken(code: string, state: string): Promise<{ accessToken: string }> {
    // Stub: in production wire to real OAuth provider
    return { accessToken: code };
  },

  async getUserInfo(accessToken: string): Promise<{ openId: string; name?: string; email?: string; loginMethod?: string; platform?: string }> {
    // Stub: decode token or call OAuth provider
    return { openId: accessToken, name: 'Demo User', email: 'demo@example.com' };
  },

  async createSessionToken(openId: string, opts: { name: string; expiresInMs: number }): Promise<string> {
    return jwt.sign({ openId, name: opts.name }, secret, { expiresIn: Math.floor(opts.expiresInMs / 1000) });
  },

  async authenticateRequest(req: Request): Promise<User | null> {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return null;
    try {
      const payload = jwt.verify(token, secret) as { openId: string };
      const user = await getUserByOpenId(payload.openId);
      return (user as User) ?? null;
    } catch {
      return null;
    }
  },
};
