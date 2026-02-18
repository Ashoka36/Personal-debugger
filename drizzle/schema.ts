// Minimal schema - database is handled programmatically at runtime
export interface User {
  id: number;
  openId: string;
  name?: string;
  email?: string;
  loginMethod?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export interface Repository {
  id: number;
  userId: number;
  owner: string;
  repo: string;
  fullName: string;
  description?: string;
  url: string;
  lastAnalyzedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GithubToken {
  id: number;
  userId: number;
  tokenHash: string;
  username: string;
  isActive: number;
  createdAt: Date;
  expiresAt?: Date;
}

// Export types for compatibility
export type InsertUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastSignedIn'> & Partial<Pick<User, 'createdAt' | 'updatedAt' | 'lastSignedIn'>>;
export type InsertRepository = Omit<Repository, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<Repository, 'createdAt' | 'updatedAt'>>;
export type InsertGithubToken = Omit<GithubToken, 'id' | 'createdAt'> & Partial<Pick<GithubToken, 'createdAt'>>;
