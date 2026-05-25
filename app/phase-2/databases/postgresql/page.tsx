import { Metadata } from 'next'
import { Database, Shield, Zap, Users } from 'lucide-react'

import { ExpandableCodeBlock } from "@/components/HighlightedCodeBlock"
export const metadata: Metadata = {
  title: 'PostgreSQL + Prisma | API Integration Training',
  description: 'Learn PostgreSQL with Prisma ORM for type-safe database operations',
}

export default function PostgreSQLPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center">
              <Database className="w-12 h-12 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">PostgreSQL + Prisma</h1>
                <p className="text-blue-100 mt-1">Production-ready relational database with type safety</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ACID Compliant</h3>
                <p className="text-gray-600">Guaranteed data consistency and reliability</p>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">High Performance</h3>
                <p className="text-gray-600">Advanced indexing and query optimization</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Concurrent</h3>
                <p className="text-gray-600">Handles multiple users and complex transactions</p>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prisma Schema Example</h2>
                <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto">
                  <ExpandableCodeBlock code={`// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}`} />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Type-Safe Database Operations</h2>
                <div className="bg-gray-900 rounded-lg p-6 text-blue-400 font-mono text-sm overflow-x-auto">
                  <ExpandableCodeBlock code={`// Auto-generated types and methods
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Type-safe queries with IntelliSense
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    }
  }
})

// TypeScript knows: user.posts is Post[]
console.log(user.posts[0].title) // ✅ No runtime errors`} />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Migration Workflow</h2>
                <div className="bg-white border rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Update Schema</h3>
                        <code className="text-sm text-gray-600">prisma/schema.prisma</code>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Generate Migration</h3>
                        <code className="text-sm text-gray-600">npx prisma migrate dev</code>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Update Client</h3>
                        <code className="text-sm text-gray-600">npx prisma generate</code>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced PostgreSQL Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">JSON/JSONB Support</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Store and query complex nested data structures
                    </p>
                    <div className="bg-gray-800 rounded p-3 text-green-400 font-mono text-xs">
                      <ExpandableCodeBlock code={`// Store flexible metadata
{
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}`} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Full-Text Search</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Powerful text search with ranking and highlighting
                    </p>
                    <div className="bg-gray-800 rounded p-3 text-blue-400 font-mono text-xs">
                      <ExpandableCodeBlock code={`// Search posts by content
WHERE to_tsvector(content)
@@ to_tsquery('database & query')`} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Array Operations</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Store and query arrays of data efficiently
                    </p>
                    <div className="bg-gray-800 rounded p-3 text-purple-400 font-mono text-xs">
                      <ExpandableCodeBlock code={`// Check array membership
WHERE 'javascript' = ANY(tags)
WHERE tags && ARRAY['react', 'nextjs']`} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Triggers & Functions</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Automate data processing and validation
                    </p>
                    <div className="bg-gray-800 rounded p-3 text-yellow-400 font-mono text-xs">
                      <ExpandableCodeBlock code={`CREATE OR REPLACE FUNCTION
update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`} />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Production Setup</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                    🚀 Deployment Checklist
                  </h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Use connection pooling (PgBouncer or built-in)</li>
                    <li>• Set up database migrations for schema changes</li>
                    <li>• Configure proper indexes for query performance</li>
                    <li>• Enable SSL connections in production</li>
                    <li>• Set up automated backups</li>
                    <li>• Monitor query performance and slow queries</li>
                    <li>• Use environment variables for connection strings</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Key Benefit: Database Portability</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-900 mb-4 font-semibold">
                    One of the major benefits of using Prisma with standard PostgreSQL: <strong>your application code doesn't care where the database lives.</strong>
                  </p>
                  <div className="space-y-3 text-blue-800">
                    <p>✅ <strong>Local Development:</strong> Use SQLite (`file:./dev.db`) for zero-config setup</p>
                    <p>✅ <strong>Testing:</strong> Use local PostgreSQL for integration tests</p>
                    <p>✅ <strong>Production:</strong> Deploy to Vercel Postgres, AWS RDS, Supabase, or any PostgreSQL provider</p>
                    <p>✅ <strong>Same Code:</strong> Only the `DATABASE_URL` connection string changes - zero application code changes needed</p>
                    <p>✅ <strong>Same Schema:</strong> Your Prisma schema works identically across all environments</p>
                  </div>
                  <div className="mt-4 p-3 bg-blue-100 rounded border border-blue-300">
                    <p className="text-sm text-blue-900">
                      <strong>The key principle:</strong> Configure through environment variables (`DATABASE_URL`), not code changes. 
                      Your Prisma queries, migrations, and type generation work the same everywhere.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
