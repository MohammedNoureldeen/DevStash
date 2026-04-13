-- =====================================================
-- Dummy Data Migration for Development
-- Generated: 2026-04-13
-- Purpose: Populate database with test data for UI development
-- =====================================================

-- Clear existing data (in reverse dependency order)
DELETE FROM "TagsOnItems";
DELETE FROM "ItemCollection";
DELETE FROM "Session";
DELETE FROM "Account";
DELETE FROM "VerificationToken";
DELETE FROM "Item";
DELETE FROM "Collection";
DELETE FROM "ItemType";
DELETE FROM "Tag";
DELETE FROM "User";

-- Reset sequences
ALTER SEQUENCE IF EXISTS "User_id_seq" RESTART WITH 1;
ALTER SEQUENCE IF EXISTS "Item_id_seq" RESTART WITH 1;
ALTER SEQUENCE IF EXISTS "Collection_id_seq" RESTART WITH 1;
ALTER SEQUENCE IF EXISTS "ItemType_id_seq" RESTART WITH 1;
ALTER SEQUENCE IF EXISTS "Tag_id_seq" RESTART WITH 1;

-- =====================================================
-- 1. USERS
-- =====================================================

INSERT INTO "User" ("id", "name", "email", "emailVerified", "image", "password", "isPro", "stripeCustomerId", "stripeSubscriptionId", "createdAt", "updatedAt")
VALUES
  ('user-001', 'John Doe', 'john@example.com', NOW() - INTERVAL '30 days', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', '$2b$10$dummyhashpassword123', true, 'cus_stripe_001', 'sub_stripe_001', NOW() - INTERVAL '30 days', NOW()),
  ('user-002', 'Jane Smith', 'jane@example.com', NOW() - INTERVAL '25 days', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', '$2b$10$dummyhashpassword456', false, NULL, NULL, NOW() - INTERVAL '25 days', NOW()),
  ('user-003', 'Alex Johnson', 'alex@example.com', NULL, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', '$2b$10$dummyhashpassword789', true, 'cus_stripe_002', 'sub_stripe_002', NOW() - INTERVAL '20 days', NOW());

-- =====================================================
-- 2. ITEM TYPES
-- =====================================================

INSERT INTO "ItemType" ("id", "name", "icon", "color", "isSystem", "userId")
VALUES
  -- System item types
  ('type-001', 'Code Snippet', 'Code', '#3B82F6', true, NULL),
  ('type-002', 'Note', 'FileText', '#10B981', true, NULL),
  ('type-003', 'Link', 'Link', '#8B5CF6', true, NULL),
  ('type-004', 'Command', 'Terminal', '#F59E0B', true, NULL),
  ('type-005', 'Config', 'Settings', '#EF4444', true, NULL),
  ('type-006', 'API Endpoint', 'Globe', '#06B6D4', true, NULL),
  -- User-defined item types
  ('type-007', 'Tutorial', 'BookOpen', '#EC4899', false, 'user-001'),
  ('type-008', 'Cheat Sheet', 'Clipboard', '#14B8A6', false, 'user-001');

-- =====================================================
-- 3. TAGS
-- =====================================================

INSERT INTO "Tag" ("id", "name")
VALUES
  ('tag-001', 'javascript'),
  ('tag-002', 'typescript'),
  ('tag-003', 'react'),
  ('tag-004', 'python'),
  ('tag-005', 'api'),
  ('tag-006', 'database'),
  ('tag-007', 'css'),
  ('tag-008', 'nextjs'),
  ('tag-009', 'prisma'),
  ('tag-010', 'authentication'),
  ('tag-011', 'docker'),
  ('tag-012', 'deployment'),
  ('tag-013', 'testing'),
  ('tag-014', 'performance'),
  ('tag-015', 'security');

-- =====================================================
-- 4. ITEMS
-- =====================================================

INSERT INTO "Item" ("id", "title", "description", "contentType", "content", "url", "fileUrl", "fileName", "fileSize", "language", "isFavorite", "isPinned", "lastUsedAt", "createdAt", "updatedAt", "userId", "itemTypeId")
VALUES
  -- John's Items
  ('item-001', 'React useEffect Cleanup Pattern', 'Best practice for cleaning up effects in React', 'TEXT', 'useEffect(() => {\n  const subscription = subscribe();\n  return () => subscription.unsubscribe();\n}, []);', NULL, NULL, NULL, NULL, 'typescript', true, true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 hour', 'user-001', 'type-001'),
  
  ('item-002', 'PostgreSQL Connection Pool Setup', 'How to set up connection pooling with Prisma', 'TEXT', 'const prisma = new PrismaClient({\n  datasources: {\n    db: {\n      url: process.env.DATABASE_URL,\n    },\n  },\n});', NULL, NULL, NULL, NULL, 'typescript', true, false, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '14 days', NOW() - INTERVAL '2 hours', 'user-001', 'type-001'),
  
  ('item-003', 'Next.js App Router Documentation', 'Official docs for Next.js 14 App Router', 'URL', NULL, 'https://nextjs.org/docs/app', NULL, NULL, NULL, NULL, false, true, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '13 days', NOW() - INTERVAL '3 hours', 'user-001', 'type-003'),
  
  ('item-004', 'Docker Compose for Local Dev', 'Complete docker-compose setup for local development', 'TEXT', 'version: ''3.8''\nservices:\n  postgres:\n    image: postgres:16\n    environment:\n      POSTGRES_DB: myapp\n      POSTGRES_USER: admin\n      POSTGRES_PASSWORD: secret\n    ports:\n      - "5432:5432"', NULL, NULL, NULL, NULL, 'yaml', false, false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 days', NOW() - INTERVAL '1 day', 'user-001', 'type-005'),
  
  ('item-005', 'JWT Authentication Flow', 'Complete JWT auth implementation guide', 'URL', NULL, 'https://jwt.io/introduction', NULL, NULL, NULL, NULL, true, false, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '11 days', NOW() - INTERVAL '4 hours', 'user-001', 'type-003'),
  
  ('item-006', 'CSS Grid Layout Cheatsheet', 'Quick reference for CSS Grid properties', 'TEXT', '.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}', NULL, NULL, NULL, NULL, 'css', false, false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days', 'user-001', 'type-008'),
  
  ('item-007', 'API Rate Limiting Middleware', 'Express middleware for rate limiting', 'TEXT', 'const rateLimit = require(''express-rate-limit'');\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100\n});', NULL, NULL, NULL, NULL, 'javascript', false, false, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '9 days', NOW() - INTERVAL '5 hours', 'user-001', 'type-001'),
  
  ('item-008', 'Python Data Analysis Script', 'Pandas script for data analysis', 'TEXT', 'import pandas as pd\n\ndf = pd.read_csv(''data.csv'')\nprint(df.describe())\ndf.groupby(''category'').mean()', NULL, NULL, NULL, NULL, 'python', true, false, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '8 days', NOW() - INTERVAL '6 hours', 'user-001', 'type-001'),
  
  ('item-009', 'Tailwind CSS Custom Config', 'Custom Tailwind configuration with design tokens', 'TEXT', 'module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        primary: ''#3B82F6'',\n        secondary: ''#10B981'',\n      },\n    },\n  },\n}', NULL, NULL, NULL, NULL, 'javascript', false, false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day', 'user-001', 'type-005'),
  
  ('item-010', 'Git Workflow Commands', 'Essential git commands for team workflow', 'TEXT', 'git checkout -b feature/new-feature\ngit commit -m "feat: add new feature"\ngit push origin feature/new-feature', NULL, NULL, NULL, NULL, 'bash', false, true, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '6 days', NOW() - INTERVAL '30 minutes', 'user-001', 'type-004'),
  
  -- Jane's Items
  ('item-011', 'TypeScript Utility Types', 'Common TypeScript utility types reference', 'TEXT', 'type Partial<T> = { [P in keyof T]?: T[P] };\ntype Required<T> = { [P in keyof T]-?: T[P] };\ntype Pick<T, K extends keyof T> = { [P in K]: T[P] };', NULL, NULL, NULL, NULL, 'typescript', true, true, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 hours', 'user-002', 'type-001'),
  
  ('item-012', 'REST API Best Practices', 'Guidelines for designing RESTful APIs', 'URL', NULL, 'https://restfulapi.net/', NULL, NULL, NULL, NULL, false, false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '9 days', NOW() - INTERVAL '1 day', 'user-002', 'type-003'),
  
  ('item-013', 'Database Indexing Guide', 'When and how to create database indexes', 'TEXT', '-- Create index on frequently queried columns\nCREATE INDEX idx_users_email ON users(email);\nCREATE INDEX idx_orders_status ON orders(status, created_at);', NULL, NULL, NULL, NULL, 'sql', true, false, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '8 days', NOW() - INTERVAL '4 hours', 'user-002', 'type-001'),
  
  ('item-014', 'React Testing Library Examples', 'Common testing patterns for React components', 'TEXT', 'test(''renders button with text'', () => {\n  render(<Button>Click me</Button>);\n  expect(screen.getByText(/click me/i)).toBeInTheDocument();\n});', NULL, NULL, NULL, NULL, 'typescript', false, false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days', 'user-002', 'type-001'),
  
  ('item-015', 'AWS S3 Upload Configuration', 'Configure S3 bucket for file uploads', 'TEXT', 'const s3 = new AWS.S3({\n  accessKeyId: process.env.AWS_ACCESS_KEY,\n  secretAccessKey: process.env.AWS_SECRET_KEY,\n  region: ''us-east-1''\n});', NULL, NULL, NULL, NULL, 'javascript', false, false, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 hours', 'user-002', 'type-001'),
  
  -- Alex's Items
  ('item-016', 'GraphQL Schema Design', 'Best practices for GraphQL schema design', 'URL', NULL, 'https://graphql.org/learn/schema/', NULL, NULL, NULL, NULL, true, false, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 hours', 'user-003', 'type-003'),
  
  ('item-017', 'Kubernetes Deployment YAML', 'K8s deployment configuration for web app', 'TEXT', 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web', NULL, NULL, NULL, NULL, 'yaml', false, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day', 'user-003', 'type-005'),
  
  ('item-018', 'Redis Caching Strategy', 'Implementing Redis caching in Node.js', 'TEXT', 'const redis = require(''redis'');\nconst client = redis.createClient();\n\nasync function getCached(key) {\n  return await client.get(key);\n}', NULL, NULL, NULL, NULL, 'javascript', true, false, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 hours', 'user-003', 'type-001'),
  
  ('item-019', 'CI/CD Pipeline Configuration', 'GitHub Actions workflow for automated deployment', 'TEXT', 'name: CI/CD\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3', NULL, NULL, NULL, NULL, 'yaml', false, false, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '2 days', NOW() - INTERVAL '6 hours', 'user-003', 'type-005'),
  
  ('item-020', 'OAuth2 Implementation Guide', 'Complete OAuth2 flow implementation', 'URL', NULL, 'https://oauth.net/2/', NULL, NULL, NULL, NULL, false, false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'user-003', 'type-003');

-- =====================================================
-- 5. COLLECTIONS
-- =====================================================

INSERT INTO "Collection" ("id", "name", "description", "isFavorite", "createdAt", "updatedAt", "userId", "defaultTypeId")
VALUES
  -- John's Collections
  ('col-001', 'React Patterns', 'Collection of useful React patterns and best practices', true, NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day', 'user-001', 'type-001'),
  ('col-002', 'DevOps Tools', 'Docker, Kubernetes, and CI/CD configurations', false, NOW() - INTERVAL '12 days', NOW() - INTERVAL '2 days', 'user-001', NULL),
  ('col-003', 'API Resources', 'API design guides and endpoint examples', false, NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days', 'user-001', 'type-006'),
  
  -- Jane's Collections
  ('col-004', 'TypeScript Tips', 'TypeScript utility types and advanced patterns', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '1 day', 'user-002', 'type-001'),
  ('col-005', 'Database Optimization', 'Indexing, query optimization, and performance tips', false, NOW() - INTERVAL '8 days', NOW() - INTERVAL '2 days', 'user-002', NULL),
  
  -- Alex's Collections
  ('col-006', 'Cloud Infrastructure', 'AWS, GCP, and Azure configurations', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', 'user-003', NULL),
  ('col-007', 'Authentication', 'OAuth, JWT, and auth flow implementations', false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', 'user-003', 'type-003');

-- =====================================================
-- 6. ITEM-COLLECTION RELATIONSHIPS
-- =====================================================

INSERT INTO "ItemCollection" ("itemId", "collectionId", "addedAt")
VALUES
  -- John's items in collections
  ('item-001', 'col-001', NOW() - INTERVAL '14 days'),
  ('item-002', 'col-001', NOW() - INTERVAL '13 days'),
  ('item-004', 'col-002', NOW() - INTERVAL '11 days'),
  ('item-005', 'col-003', NOW() - INTERVAL '10 days'),
  ('item-007', 'col-003', NOW() - INTERVAL '8 days'),
  
  -- Jane's items in collections
  ('item-011', 'col-004', NOW() - INTERVAL '9 days'),
  ('item-013', 'col-005', NOW() - INTERVAL '7 days'),
  ('item-014', 'col-004', NOW() - INTERVAL '6 days'),
  
  -- Alex's items in collections
  ('item-016', 'col-007', NOW() - INTERVAL '4 days'),
  ('item-017', 'col-006', NOW() - INTERVAL '3 days'),
  ('item-018', 'col-006', NOW() - INTERVAL '2 days'),
  ('item-019', 'col-006', NOW() - INTERVAL '1 day');

-- =====================================================
-- 7. TAG-ITEM RELATIONSHIPS
-- =====================================================

INSERT INTO "TagsOnItems" ("itemId", "tagId")
VALUES
  -- item-001: React useEffect Cleanup Pattern
  ('item-001', 'tag-003'), -- react
  ('item-001', 'tag-002'), -- typescript
  
  -- item-002: PostgreSQL Connection Pool Setup
  ('item-002', 'tag-006'), -- database
  ('item-002', 'tag-009'), -- prisma
  
  -- item-003: Next.js App Router Documentation
  ('item-003', 'tag-008'), -- nextjs
  ('item-003', 'tag-003'), -- react
  
  -- item-004: Docker Compose for Local Dev
  ('item-004', 'tag-011'), -- docker
  
  -- item-005: JWT Authentication Flow
  ('item-005', 'tag-010'), -- authentication
  
  -- item-006: CSS Grid Layout Cheatsheet
  ('item-006', 'tag-007'), -- css
  
  -- item-007: API Rate Limiting Middleware
  ('item-007', 'tag-005'), -- api
  ('item-007', 'tag-001'), -- javascript
  
  -- item-008: Python Data Analysis Script
  ('item-008', 'tag-004'), -- python
  
  -- item-009: Tailwind CSS Custom Config
  ('item-009', 'tag-007'), -- css
  
  -- item-011: TypeScript Utility Types
  ('item-011', 'tag-002'), -- typescript
  
  -- item-012: REST API Best Practices
  ('item-012', 'tag-005'), -- api
  
  -- item-013: Database Indexing Guide
  ('item-013', 'tag-006'), -- database
  
  -- item-014: React Testing Library Examples
  ('item-014', 'tag-003'), -- react
  ('item-014', 'tag-013'), -- testing
  
  -- item-015: AWS S3 Upload Configuration
  ('item-015', 'tag-012'), -- deployment
  
  -- item-016: GraphQL Schema Design
  ('item-016', 'tag-005'), -- api
  
  -- item-017: Kubernetes Deployment YAML
  ('item-017', 'tag-011'), -- docker
  ('item-017', 'tag-012'), -- deployment
  
  -- item-018: Redis Caching Strategy
  ('item-018', 'tag-014'), -- performance
  
  -- item-019: CI/CD Pipeline Configuration
  ('item-019', 'tag-012'), -- deployment
  
  -- item-020: OAuth2 Implementation Guide
  ('item-020', 'tag-010'), -- authentication
  ('item-020', 'tag-015'); -- security

-- =====================================================
-- 8. ACCOUNTS (NextAuth)
-- =====================================================

INSERT INTO "Account" ("id", "userId", "type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state")
VALUES
  ('acc-001', 'user-001', 'oauth', 'google', 'google-123456', 'refresh_token_001', 'access_token_001', 1744588800, 'Bearer', 'openid email profile', 'id_token_001', 'active'),
  ('acc-002', 'user-002', 'oauth', 'github', 'github-789012', NULL, 'access_token_002', 1744675200, 'Bearer', 'read:user user:email', 'id_token_002', 'active'),
  ('acc-003', 'user-003', 'oauth', 'google', 'google-345678', 'refresh_token_003', 'access_token_003', 1744761600, 'Bearer', 'openid email profile', 'id_token_003', 'active');

-- =====================================================
-- 9. SESSIONS (NextAuth)
-- =====================================================

INSERT INTO "Session" ("id", "sessionToken", "userId", "expires")
VALUES
  ('sess-001', 'session-token-001-abc123', 'user-001', NOW() + INTERVAL '30 days'),
  ('sess-002', 'session-token-002-def456', 'user-002', NOW() + INTERVAL '25 days'),
  ('sess-003', 'session-token-003-ghi789', 'user-003', NOW() + INTERVAL '20 days');

-- =====================================================
-- 10. VERIFICATION TOKENS (NextAuth)
-- =====================================================

INSERT INTO "VerificationToken" ("identifier", "token", "expires")
VALUES
  ('john@example.com', 'verification-token-001', NOW() + INTERVAL '1 day'),
  ('jane@example.com', 'verification-token-002', NOW() + INTERVAL '1 day');

-- =====================================================
-- Migration Complete
-- =====================================================
-- Summary:
-- - 3 Users (1 Pro, 1 Free, 1 Pro)
-- - 8 Item Types (6 system, 2 user-defined)
-- - 15 Tags
-- - 20 Items (10 John, 5 Jane, 5 Alex)
-- - 7 Collections (3 John, 2 Jane, 2 Alex)
-- - 12 Item-Collection relationships
-- - 26 Tag-Item relationships
-- - 3 Accounts (OAuth)
-- - 3 Sessions
-- - 2 Verification Tokens
-- =====================================================
