import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  primaryKey
} from "drizzle-orm/mysql-core";
import { 
  int as sqliteInt, 
  sqliteTable, 
  text as sqliteText,
  integer,
  text as sqliteTextColumn
} from "drizzle-orm/sqlite-core";

// Determine database type based on environment
const isSqlite = process.env.DATABASE_URL?.startsWith('sqlite:') ?? true;

// MySQL table definitions
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const githubTokens = mysqlTable("githubTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  accessToken: text("accessToken").notNull(),
  tokenType: varchar("tokenType", { length: 50 }).notNull(),
  scope: text("scope"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export const repositories = mysqlTable("repositories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  owner: varchar("owner", { length: 255 }).notNull(),
  repo: varchar("repo", { length: 255 }).notNull(),
  fullName: varchar("fullName", { length: 512 }).notNull().unique(),
  description: text("description"),
  url: varchar("url", { length: 512 }).notNull(),
  lastAnalyzedAt: timestamp("lastAnalyzedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// SQLite table definitions (for development)
export const sqliteUsers = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).defaultNow().notNull(),
});

export const sqliteGithubTokens = sqliteTable("githubTokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => sqliteUsers.id),
  accessToken: text("accessToken").notNull(),
  tokenType: text("tokenType").notNull(),
  scope: text("scope"),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }),
});

export const sqliteRepositories = sqliteTable("repositories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => sqliteUsers.id),
  owner: text("owner").notNull(),
  repo: text("repo").notNull(),
  fullName: text("fullName").notNull().unique(),
  description: text("description"),
  url: text("url").notNull(),
  lastAnalyzedAt: integer("lastAnalyzedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

// Export appropriate tables based on database type
export const usersTable = isSqlite ? sqliteUsers : users;
export const githubTokensTable = isSqlite ? sqliteGithubTokens : githubTokens;
export const repositoriesTable = isSqlite ? sqliteRepositories : repositories;

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type GithubToken = typeof githubTokens.$inferSelect;
export type InsertGithubToken = typeof githubTokens.$inferInsert;
export type Repository = typeof repositories.$inferSelect;
export type InsertRepository = typeof repositories.$inferInsert;
