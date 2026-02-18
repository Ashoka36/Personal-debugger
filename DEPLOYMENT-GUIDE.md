# AI SUPERBRAIN DEBUGGER - COMPLETE DEPLOYMENT GUIDE v2.1

## 🚀 QUICK START

### Prerequisites
- Node.js 22.13.0+
- pnpm 10.4.1+
- GitHub account with personal access token
- GitLab account (optional)
- Render.com account for deployment

---

## 📦 PROJECT STRUCTURE

```
ai-debugger-plugin/
├── server/
│   ├── _core/
│   │   ├── index.ts              # Express server setup
│   │   ├── context.ts            # tRPC context
│   │   ├── trpc.ts               # tRPC router setup
│   │   ├── llm.ts                # LLM integration
│   │   ├── env.ts                # Environment variables
│   │   ├── cookies.ts            # Session management
│   │   └── systemRouter.ts       # System endpoints
│   ├── services/
│   │   ├── swarmOrchestrator.ts  # 4-agent orchestration
│   │   ├── celEngine.ts          # CEL rule engine
│   │   ├── gitWriteClient.ts     # Git write operations
│   │   ├── github.ts             # GitHub API (read)
│   │   ├── gitlab.ts             # GitLab API (read)
│   │   ├── codeReader.ts         # Code file reading
│   │   ├── analyzer.ts           # Error analysis
│   │   ├── selfImprovingAgent.ts # Meta-learning
│   │   └── repoCloner.ts         # Repo cloning
│   ├── db.ts                     # Database helpers
│   ├── routers.ts                # tRPC endpoints
│   └── storage.ts                # S3 storage
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Landing page
│   │   │   ├── Dashboard.tsx     # Main dashboard
│   │   │   ├── SwarmDashboard.tsx # Swarm UI
│   │   │   ├── AIAgent.tsx       # Agent interface
│   │   │   ├── GitHubSetup.tsx   # GitHub config
│   │   │   ├── GitLabSetup.tsx   # GitLab config
│   │   │   └── RepositorySync.tsx # Sync management
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── AIChatBox.tsx
│   │   │   └── ui/               # shadcn/ui components
│   │   ├── lib/
│   │   │   └── trpc.ts           # tRPC client
│   │   ├── App.tsx               # Router
│   │   └── main.tsx              # Entry point
│   ├── public/
│   │   ├── manifest.json         # Browser plugin manifest
│   │   ├── background.js         # Service worker
│   │   ├── content.js            # Content script
│   │   └── icons/                # Plugin icons
│   └── index.html
├── drizzle/
│   ├── schema.ts                 # Database schema
│   └── migrations/               # Database migrations
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── DEPLOYMENT-GUIDE.md           # This file
```

---

## 🔧 INSTALLATION & SETUP

### 1. Clone Repository
```bash
git clone https://github.com/user/Makky.git
cd ai-debugger-plugin
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Setup
Create `.env.local`:
```env
# Database
DATABASE_URL=mysql://user:password@host:3306/ai_debugger

# OAuth
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# LLM
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge

# Session
JWT_SECRET=your_jwt_secret_key

# Owner Info
OWNER_OPEN_ID=your_open_id
OWNER_NAME=Your Name
```

### 4. Database Setup
```bash
pnpm db:push
```

### 5. Development Server
```bash
pnpm dev
```

Visit: `http://localhost:3000`

---

## 🎯 SWARM ORCHESTRATOR USAGE

### Access SwarmDashboard
1. Navigate to `/swarm` route
2. Login with Manus account
3. Configure GitHub/GitLab tokens in settings

### Run Orchestration
1. **Paste Code:** Enter code to analyze in textarea
2. **Set Repository:** Enter GitHub owner and repo name
3. **Select Branch:** Default is `main`
4. **Choose Language:** TypeScript, JavaScript, Python, Go, Rust
5. **Select Platforms:** GitHub, GitLab, Docker, Render, Vercel, Netlify, DigitalOcean, AWS
6. **Click "START SWARM ORCHESTRATION"**

### Agent Pipeline
```
INPUT CODE
    ↓
[CODER AGENT] → Vision analysis + refactoring
    ↓
[SYNTAX FIXER] → Fix errors + optimize
    ↓
[WATCHDOG] → Quality validation + tests
    ↓
[DEPLOYER] → Multi-platform deployment
    ↓
OUTPUT: Deployed URLs + metrics
```

### CEL Rules Evaluation
Automatic rule evaluation at each stage:
- **high_quality:** qualityScore >= 80 → APPROVE
- **tests_passed:** testsPassed == true → APPROVE
- **low_quality:** qualityScore < 50 → REJECT
- **production_deployment:** branch == 'main' && qualityScore >= 85 → DEPLOY
- **rollback_condition:** testsPassed == false && platform == 'production' → ROLLBACK

---

## 🔌 API ENDPOINTS

### Swarm Orchestration
```typescript
POST /api/trpc/swarm.orchestrate
Input: {
  code: string,
  language: string,
  owner: string,
  repo: string,
  branch: string,
  platforms: string[]
}
Output: {
  success: boolean,
  stages: { coder, syntaxFixer, watchdog, deployment },
  deploymentUrls: string[]
}

GET /api/trpc/swarm.status
Output: { activeAgents, taskQueue, completedTasks, failedTasks }
```

### CEL Rules
```typescript
GET /api/trpc/cel.getRules
Output: CELRule[]

POST /api/trpc/cel.registerRule
Input: { id, name, expression, action, description }

POST /api/trpc/cel.executeRules
Input: { context: object }
Output: { actions, approved, warnings }
```

### Git Operations
```typescript
POST /api/trpc/git.commit
Input: { platform, owner, repo, message, branch, files }
Output: { commitSha, url }

POST /api/trpc/git.createPR
Input: { platform, owner, repo, title, description, sourceBranch, targetBranch }
Output: { prNumber, url }

POST /api/trpc/git.mergePR
Input: { platform, owner, repo, prId, squash }
Output: { success, mergeCommitSha }
```

---

## 🚀 DEPLOYMENT TO RENDER

### Step 1: Push to GitHub
```bash
git add .
git commit -m "AI Debugger v2.1 - Swarm orchestration ready"
git push origin main
```

### Step 2: Create Render Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name:** ai-debugger-plugin
   - **Environment:** Node
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
   - **Node Version:** 22

### Step 3: Environment Variables
Add in Render dashboard:
```
DATABASE_URL=your_mysql_url
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
JWT_SECRET=your_secret
BUILT_IN_FORGE_API_KEY=your_key
... (all from .env.local)
```

### Step 4: Deploy
```bash
git push origin main
# Render auto-deploys on push
```

### Step 5: Verify
- Check Render dashboard for deployment status
- Visit your Render URL
- Test SwarmDashboard at `/swarm`

---

## 🐙 DEPLOYMENT TO GITHUB PAGES (Static)

### For Static Frontend Only
```bash
# Build frontend
pnpm build

# Deploy dist/ to GitHub Pages
# In repository settings → Pages → Deploy from branch → main/dist
```

---

## 🐳 DOCKER DEPLOYMENT

### Create Dockerfile
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

### Build & Run
```bash
docker build -t ai-debugger:latest .
docker run -p 3000:3000 \
  -e DATABASE_URL=your_url \
  -e JWT_SECRET=your_secret \
  ai-debugger:latest
```

---

## 🌐 BROWSER PLUGIN INSTALLATION

### Chrome/Edge
1. Run: `pnpm build`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `/client/dist` folder
6. Plugin appears in toolbar

### Firefox
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `manifest.json` from `/client/public`

### Plugin Features
- Analyze code on GitHub/GitLab
- Autonomous commits with write permissions
- Create/merge pull requests
- Deploy to 8 platforms
- Real-time CEL rule evaluation

---

## 📊 DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### GitHub Tokens
```sql
CREATE TABLE github_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  tokenHash VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### GitLab Tokens
```sql
CREATE TABLE gitlab_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  tokenHash VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  gitlabUrl VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Repositories
```sql
CREATE TABLE repositories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  owner VARCHAR(255),
  repo VARCHAR(255),
  description TEXT,
  url VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Repository Syncs
```sql
CREATE TABLE repository_syncs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  sourceRepositoryId INT,
  sourceType ENUM('github', 'gitlab'),
  targetType ENUM('github', 'gitlab'),
  targetRepoName VARCHAR(255),
  syncStatus ENUM('pending', 'syncing', 'completed', 'failed'),
  approvalStatus ENUM('pending', 'approved', 'rejected'),
  approvedBy VARCHAR(255),
  rejectedBy VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

---

## 🔐 SECURITY CHECKLIST

- [ ] All API keys stored in backend only
- [ ] Database credentials in environment variables
- [ ] HTTPS enabled on production
- [ ] CORS configured for allowed origins
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS protection via CSP headers
- [ ] CSRF tokens on state-changing operations
- [ ] GitHub/GitLab tokens SHA-256 hashed
- [ ] Browser plugin manifest v3 security

---

## 📈 MONITORING & LOGGING

### Server Logs
```bash
# View recent logs
tail -f .manus-logs/devserver.log

# Browser console logs
tail -f .manus-logs/browserConsole.log

# Network requests
tail -f .manus-logs/networkRequests.log
```

### Metrics Dashboard
- Active agents count
- Completed/failed tasks
- Task queue depth
- Agent performance scores
- Deployment success rates

---

## 🐛 TROUBLESHOOTING

### Issue: "Database connection failed"
**Solution:** Verify DATABASE_URL is correct and MySQL is running
```bash
mysql -u user -p -h host
```

### Issue: "OAuth callback error"
**Solution:** Check VITE_APP_ID and OAUTH_SERVER_URL match Manus settings

### Issue: "Swarm orchestration timeout"
**Solution:** Increase timeout in swarmOrchestrator.ts or check LLM API status

### Issue: "Git commit failed"
**Solution:** Verify GitHub/GitLab tokens have write permissions

### Issue: "Plugin not loading in Chrome"
**Solution:** Ensure manifest.json is in `/client/public`, rebuild with `pnpm build`

---

## 📝 TESTING

### Run Tests
```bash
pnpm test
```

### Test Coverage
- Swarm orchestrator: 4 agents orchestration
- CEL engine: Rule evaluation
- Git write client: Commit/merge operations
- Self-improving agent: Meta-learning
- Repository cloner: GitHub↔GitLab sync

---

## 🚀 PRODUCTION CHECKLIST

- [ ] Environment variables configured
- [ ] Database migrated and tested
- [ ] API endpoints tested
- [ ] Browser plugin tested on Chrome/Firefox
- [ ] Swarm orchestration tested end-to-end
- [ ] CEL rules validated
- [ ] GitHub/GitLab tokens configured
- [ ] Deployment platforms configured
- [ ] SSL certificate installed
- [ ] Monitoring and logging enabled
- [ ] Backup strategy in place
- [ ] Documentation updated

---

## 📞 SUPPORT

**GitHub Issues:** [Makky/issues](https://github.com/user/Makky/issues)
**Email:** support@ai-debugger.dev
**Documentation:** [Full System Map](./FINAL-SYSTEM-MAP.md)

---

## 🎓 LEARNING RESOURCES

- **Manus Skills:** Pre-loaded 1.6 MAX Pro skills for code analysis
- **CEL Documentation:** Dynamic rule evaluation guide
- **tRPC Guide:** End-to-end type safety
- **Swarm Architecture:** 4-agent orchestration patterns

---

## 📊 PERFORMANCE OPTIMIZATION

### Caching
- Code analysis results cached for 1 hour
- CEL rules cached in memory
- Agent metrics cached for 5 minutes

### Concurrency
- Parallel agent execution (4 agents simultaneously)
- Async git operations
- Non-blocking LLM calls

### Scalability
- Horizontal scaling via Render
- Database connection pooling
- Load balancing ready

---

## 🔄 CONTINUOUS IMPROVEMENT

### Meta-Learning Loop
1. Analyze code with current strategy
2. Record performance metrics
3. Every 10 analyses: trigger learning
4. LLM evaluates performance
5. Suggest strategy improvements
6. Add new skills to library
7. Update success rates
8. Optimize strategy selection

### Skill Evolution
- **Day 1:** Base Manus 1.6 MAX Pro skills
- **Week 1:** 5-10 new skills learned
- **Month 1:** 50+ custom skills
- **Continuous:** Adaptive improvement

---

## 📦 BUILD & DEPLOYMENT COMMANDS

```bash
# Development
pnpm dev              # Start dev server

# Production Build
pnpm build            # Build frontend + backend
pnpm start            # Start production server

# Testing
pnpm test             # Run vitest suite
pnpm check            # TypeScript check

# Database
pnpm db:push          # Migrate database schema

# Formatting
pnpm format           # Format code with prettier

# Browser Plugin
pnpm build            # Creates /client/dist for plugin
```

---

## 🎯 NEXT STEPS

1. **Webhook Integration:** Add GitHub/GitLab webhooks for real-time analysis
2. **Skill Marketplace:** Build skill sharing and import/export
3. **Visual Diff Dashboard:** Side-by-side code comparison UI
4. **Performance Analytics:** Track agent improvements over time
5. **Team Collaboration:** Multi-user skill sharing and feedback

---

**Version:** 2.1  
**Status:** Production Ready  
**Last Updated:** February 5, 2026  
**Build:** Swarm Orchestrated + CEL + Manus 1.6 MAX Pro + Multi-Platform Deployment
