import { PrismaClient, ContentType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ── User ──
  const hashedPassword = await hash('12345678', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@devstash.io' },
    update: {},
    create: {
      email: 'demo@devstash.io',
      name: 'Demo User',
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ User: ${demoUser.email}`);

  // ── System Item Types ──
  const systemItemTypes = [
    { name: 'snippet', icon: 'Code', color: '#3b82f6' },
    { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6' },
    { name: 'command', icon: 'Terminal', color: '#f97316' },
    { name: 'note', icon: 'StickyNote', color: '#fde047' },
    { name: 'file', icon: 'File', color: '#6b7280' },
    { name: 'image', icon: 'Image', color: '#ec4899' },
    { name: 'link', icon: 'Link', color: '#10b981' },
  ];

  const createdItemTypes: Record<string, { id: string }> = {};
  for (const itemType of systemItemTypes) {
    const created = await prisma.itemType.upsert({
      where: { name: itemType.name },
      update: {},
      create: {
        ...itemType,
        isSystem: true,
      },
    });
    createdItemTypes[itemType.name] = created;
    console.log(`✅ ItemType: ${itemType.name}`);
  }

  // ── Collections & Items ──

  // React Patterns
  const reactPatterns = await prisma.collection.create({
    data: {
      name: 'React Patterns',
      description: 'Reusable React patterns and hooks',
      userId: demoUser.id,
    },
  });
  console.log(`✅ Collection: ${reactPatterns.name}`);

  const reactItems = await Promise.all([
    prisma.item.create({
      data: {
        title: 'Custom Hooks',
        content: `export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}`,
        contentType: ContentType.TEXT,
        language: 'typescript',
        userId: demoUser.id,
        itemTypeId: createdItemTypes.snippet.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Component Patterns',
        content: `// Context Provider Pattern
import { createContext, useContext, useState, type ReactNode } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

// Compound Components Pattern
function Select({ children }: { children: ReactNode }) {
  return <select>{children}</select>;
}

function Option({ value, children }: { value: string; children: ReactNode }) {
  return <option value={value}>{children}</option>;
}

Select.Option = Option;
export { Select };`,
        contentType: ContentType.TEXT,
        language: 'typescript',
        userId: demoUser.id,
        itemTypeId: createdItemTypes.snippet.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Utility Functions',
        content: `// Safe JSON parse
export function safeJSONParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Class name utility
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// Generate unique ID
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}`,
        contentType: ContentType.TEXT,
        language: 'typescript',
        userId: demoUser.id,
        itemTypeId: createdItemTypes.snippet.id,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: reactItems.map((item) => ({
      itemId: item.id,
      collectionId: reactPatterns.id,
    })),
  });
  console.log('✅ 3 items added to React Patterns');

  // AI Workflows
  const aiWorkflows = await prisma.collection.create({
    data: {
      name: 'AI Workflows',
      description: 'AI prompts and workflow automations',
      userId: demoUser.id,
    },
  });
  console.log(`✅ Collection: ${aiWorkflows.name}`);

  const aiItems = await Promise.all([
    prisma.item.create({
      data: {
        title: 'Code Review Prompt',
        content: `You are an expert code reviewer. Review the following code for:

1. **Correctness**: Does the code work as intended? Are there edge cases?
2. **Security**: Are there any vulnerabilities (SQL injection, XSS, etc.)?
3. **Performance**: Can the code be optimized? Are there unnecessary operations?
4. **Readability**: Is the code clear and well-structured?
5. **Best Practices**: Does it follow language/framework conventions?

Provide specific suggestions with code examples where applicable. Prioritize critical issues over stylistic preferences.

Code to review:
\`\`\`
[PASTE CODE HERE]
\`\`\``,
        contentType: ContentType.TEXT,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.prompt.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Documentation Generation',
        content: `Generate comprehensive documentation for the following code. Include:

1. **Overview**: What this code does and its purpose
2. **Parameters/Props**: Description of each input with types
3. **Return Value/Output**: What the code produces
4. **Usage Examples**: 2-3 practical examples
5. **Edge Cases**: Known limitations or special handling

Format as JSDoc/TSDoc for TypeScript, or as markdown for general documentation.

Code:
\`\`\`
[PASTE CODE HERE]
\`\`\``,
        contentType: ContentType.TEXT,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.prompt.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Refactoring Assistance',
        content: `Help refactor the following code to improve:

1. **Separation of Concerns**: Break into smaller, focused functions
2. **DRY Principle**: Eliminate duplication
3. **Readability**: Better naming, clearer structure
4. **Modern Patterns**: Use latest language features where appropriate
5. **Maintainability**: Make it easier to test and extend

Keep the same external behavior. Explain what you changed and why.

Code to refactor:
\`\`\`
[PASTE CODE HERE]
\`\`\``,
        contentType: ContentType.TEXT,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.prompt.id,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: aiItems.map((item) => ({
      itemId: item.id,
      collectionId: aiWorkflows.id,
    })),
  });
  console.log('✅ 3 items added to AI Workflows');

  // DevOps
  const devOps = await prisma.collection.create({
    data: {
      name: 'DevOps',
      description: 'Infrastructure and deployment resources',
      userId: demoUser.id,
    },
  });
  console.log(`✅ Collection: ${devOps.name}`);

  const devOpsItems = await Promise.all([
    prisma.item.create({
      data: {
        title: 'Docker & CI/CD Config',
        content: `# Dockerfile for Next.js
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]`,
        contentType: ContentType.TEXT,
        language: 'dockerfile',
        userId: demoUser.id,
        itemTypeId: createdItemTypes.snippet.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Deployment Commands',
        content: `# Build and push Docker image
docker build -t myapp:latest .
docker tag myapp:latest registry.example.com/myapp:latest
docker push registry.example.com/myapp:latest

# Deploy with Docker Compose
docker compose -f docker-compose.prod.yml up -d

# Check deployment status
docker compose ps
docker compose logs -f app`,
        contentType: ContentType.TEXT,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.command.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Docker Documentation',
        content: 'https://docs.docker.com/',
        contentType: ContentType.URL,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.link.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'GitHub Actions Documentation',
        content: 'https://docs.github.com/en/actions',
        contentType: ContentType.URL,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.link.id,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: devOpsItems.map((item) => ({
      itemId: item.id,
      collectionId: devOps.id,
    })),
  });
  console.log('✅ 4 items added to DevOps');

  // Terminal Commands
  const terminalCommands = await prisma.collection.create({
    data: {
      name: 'Terminal Commands',
      description: 'Useful shell commands for everyday development',
      userId: demoUser.id,
    },
  });
  console.log(`✅ Collection: ${terminalCommands.name}`);

  const terminalItems = await Promise.all([
    prisma.item.create({
      data: {
        title: 'Git Operations',
        content: `# Create and switch to new branch
git checkout -b feature/my-feature

# Stash changes
git stash push -m "WIP: my changes"
git stash pop

# Squash last 3 commits
git rebase -i HEAD~3

# Clean up merged branches
git branch --merged | grep -v '\\*' | xargs git branch -d`,
        contentType: ContentType.TEXT,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.command.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Docker Commands',
        content: `# Remove all stopped containers
docker container prune -f

# Remove unused images
docker image prune -a

# View container logs
docker logs -f --tail 100 <container_id>

# Execute command in running container
docker exec -it <container_id> sh`,
        contentType: ContentType.TEXT,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.command.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Process Management',
        content: `# Find process using a port
lsof -i :3000

# Kill process by port
kill -9 $(lsof -t -i:3000)

# Monitor system resources
htop

# Clean npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install`,
        contentType: ContentType.TEXT,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.command.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Package Manager Utilities',
        content: `# List outdated packages
npm outdated

# Update all packages
npm update

# Check for security vulnerabilities
npm audit
npm audit fix

# Find why a package is installed
npm why <package-name>`,
        contentType: ContentType.TEXT,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.command.id,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: terminalItems.map((item) => ({
      itemId: item.id,
      collectionId: terminalCommands.id,
    })),
  });
  console.log('✅ 4 items added to Terminal Commands');

  // Design Resources
  const designResources = await prisma.collection.create({
    data: {
      name: 'Design Resources',
      description: 'UI/UX resources and references',
      userId: demoUser.id,
    },
  });
  console.log(`✅ Collection: ${designResources.name}`);

  const designItems = await Promise.all([
    prisma.item.create({
      data: {
        title: 'Tailwind CSS',
        content: 'https://tailwindcss.com/',
        contentType: ContentType.URL,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.link.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'ShadCN UI',
        content: 'https://ui.shadcn.com/',
        contentType: ContentType.URL,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.link.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Material Design',
        content: 'https://m3.material.io/',
        contentType: ContentType.URL,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.link.id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Lucide Icons',
        content: 'https://lucide.dev/',
        contentType: ContentType.URL,
        userId: demoUser.id,
        itemTypeId: createdItemTypes.link.id,
      },
    }),
  ]);

  await prisma.itemCollection.createMany({
    data: designItems.map((item) => ({
      itemId: item.id,
      collectionId: designResources.id,
    })),
  });
  console.log('✅ 4 items added to Design Resources');

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
