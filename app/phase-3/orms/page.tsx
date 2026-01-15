import { Metadata } from 'next'
import Link from 'next/link'
import { Database, Shield, Zap, Code, Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Object-Relational Mapping (ORMs) | API Integration Training',
  description: 'Learn about different ORM frameworks and database abstraction layers',
}

const orms = [
  {
    name: 'Prisma',
    slug: 'prisma',
    description: 'Next-generation ORM with type safety and schema-first approach',
    icon: Shield,
    features: ['Type Safety', 'Schema-first', 'Auto-generated', 'Migration tools'],
    bestFor: ['TypeScript projects', 'Modern applications', 'Complex schemas'],
    color: 'bg-blue-500',
    pros: ['Full type safety', 'Excellent DX', 'Built-in migrations'],
    cons: ['Newer technology', 'Less flexible for raw SQL']
  },
  {
    name: 'TypeORM',
    slug: 'typeorm',
    description: 'Feature-rich ORM with decorator-based entity definitions',
    icon: Layers,
    features: ['Decorators', 'Active Record', 'Data Mapper', 'Multiple DB support'],
    bestFor: ['Enterprise apps', 'Complex relationships', 'Migration-heavy projects'],
    color: 'bg-green-500',
    pros: ['Flexible patterns', 'Rich feature set', 'Good documentation'],
    cons: ['Verbose decorators', 'Learning curve for advanced features']
  },
  {
    name: 'Sequelize',
    slug: 'sequelize',
    description: 'Traditional ORM with promise-based API and migration support',
    icon: Database,
    features: ['Promises', 'Migrations', 'Associations', 'Hooks'],
    bestFor: ['Node.js legacy apps', 'Simple to medium complexity', 'SQL experts'],
    color: 'bg-orange-500',
    pros: ['Mature ecosystem', 'Good performance', 'Flexible queries'],
    cons: ['Callback hell potential', 'Less type safety', 'Verbose code']
  },
  {
    name: 'Raw SQL',
    slug: 'raw-sql',
    description: 'Direct SQL queries without ORM abstraction',
    icon: Code,
    features: ['Full Control', 'Performance', 'Flexibility', 'Raw Power'],
    bestFor: ['Performance-critical', 'Complex queries', 'Database experts'],
    color: 'bg-gray-500',
    pros: ['Maximum performance', 'Full SQL features', 'No abstraction overhead'],
    cons: ['SQL injection risks', 'Manual type handling', 'Maintenance burden']
  }
]

export default function ORMsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Object-Relational Mapping (ORMs)
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ORMs bridge the gap between object-oriented code and relational databases.
            Choose the right tool for your project based on complexity, team expertise, and performance requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {orms.map((orm) => (
            <Link
              key={orm.slug}
              href={`/phase-3/orms/${orm.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${orm.color} rounded-lg flex items-center justify-center mr-4`}>
                  <orm.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{orm.name}</h3>
                  <p className="text-gray-600 text-sm">{orm.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {orm.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Best For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {orm.bestFor.map((useCase) => (
                      <span
                        key={useCase}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h5 className="text-xs font-medium text-green-700 mb-1">Pros</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {orm.pros.map((pro) => (
                        <li key={pro}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-red-700 mb-1">Cons</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {orm.cons.map((con) => (
                        <li key={con}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ORM Decision Framework
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Prisma When:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✅ You want full TypeScript type safety</li>
                  <li>✅ Your team prefers schema-first development</li>
                  <li>✅ You need excellent developer experience</li>
                  <li>✅ You're building modern applications</li>
                  <li>✅ You want built-in migration tools</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose TypeORM When:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✅ You need maximum flexibility</li>
                  <li>✅ You're migrating from other ORMs</li>
                  <li>✅ You have complex inheritance patterns</li>
                  <li>✅ You want both Active Record and Data Mapper</li>
                  <li>✅ You have an enterprise Java background</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Raw SQL When:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✅ Performance is critical</li>
                  <li>✅ You need complex analytical queries</li>
                  <li>✅ Your team has strong SQL expertise</li>
                  <li>✅ You're building data-heavy applications</li>
                  <li>✅ You need full control over queries</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ORM vs Raw SQL Performance
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-green-800">Simple CRUD</h4>
                    <p className="text-sm text-green-600">ORM overhead: ~5-10%</p>
                  </div>
                  <span className="text-2xl">⚡</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-yellow-800">Complex Queries</h4>
                    <p className="text-sm text-yellow-600">ORM overhead: ~20-50%</p>
                  </div>
                  <span className="text-2xl">🐌</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-800">Developer Productivity</h4>
                    <p className="text-sm text-blue-600">ORM boost: ~200-300%</p>
                  </div>
                  <span className="text-2xl">🚀</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                <strong>Rule of thumb:</strong> Use ORMs for 80% of operations, raw SQL for the performance-critical 20%.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                🏆 Modern Recommendation
              </h2>
              <p className="mb-4">
                For new TypeScript projects, start with <strong>Prisma</strong>.
                It provides the best developer experience and type safety.
              </p>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Migration Strategy:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Start with Prisma for new features</li>
                  <li>Use raw SQL for complex legacy queries</li>
                  <li>Consider TypeORM for enterprise complexity</li>
                  <li>Profile performance bottlenecks</li>
                </ol>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💡 Key Benefit: Database Portability
              </h2>
              <p className="text-blue-900 mb-4 font-semibold">
                One of the major benefits of using Prisma with standard PostgreSQL: <strong>your application code doesn't care where the database lives.</strong>
              </p>
              <div className="space-y-2 text-blue-800">
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
          </div>
        </div>
      </div>
    </div>
  )
}
