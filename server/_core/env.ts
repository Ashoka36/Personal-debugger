export const ENV = {
  appId: process.env.VITE_APP_ID ?? "dev-app-id",
  cookieSecret: process.env.JWT_SECRET ?? "dev-jwt-secret-key",
  databaseUrl: process.env.DATABASE_URL ?? "sqlite://dev.db",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "dev-owner",
  isProduction: process.env.NODE_ENV === "production",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
};
