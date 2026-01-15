import { Metadata } from 'next'
import Link from 'next/link'
import { Database, Zap, Server, Code } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Database Technologies | API Integration Training',
  description: 'Learn about different database technologies and when to use them',
}

const databases = [
  {
    name: 'PostgreSQL',
    slug: 'postgresql',
    description: 'Advanced open-source relational database with JSON support',
    icon: Database,
    features: ['ACID compliant', 'JSON/JSONB', 'Advanced indexing', 'Triggers'],
    useCases: ['Financial data', 'Complex relationships', 'Analytics'],
    color: 'bg-blue-500'
  },
  {
    name: 'SQLite',
    slug: 'sqlite',
    description: 'Self-contained, serverless SQL database engine',
    icon: Server,
    features: ['Zero configuration', 'Single file', 'ACID compliant', 'Fast'],
    useCases: ['Mobile apps', 'Embedded systems', 'Development'],
    color: 'bg-green-500'
  },
  {
    name: 'MongoDB',
    slug: 'mongodb',
    description: 'Document-oriented NoSQL database for modern applications',
    icon: Code,
    features: ['Document model', 'Flexible schema', 'Horizontal scaling', 'Aggregation'],
    useCases: ['Content management', 'Real-time analytics', 'IoT data'],
    color: 'bg-green-600'
  },
  {
    name: 'Redis',
    slug: 'redis',
    description: 'In-memory data structure store for caching and messaging',
    icon: Zap,
    features: ['In-memory', 'Data structures', 'Pub/Sub', 'Persistence'],
    useCases: ['Caching', 'Session storage', 'Real-time messaging', 'Rate limiting'],
    color: 'bg-red-500'
  }
]

export default function DatabasesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Database Technologies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the right database for your application. Each technology has unique strengths
            and use cases. Understanding when to use each one is crucial for building scalable systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {databases.map((db) => (
            <Link
              key={db.slug}
              href={`/phase-2/databases/${db.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${db.color} rounded-lg flex items-center justify-center mr-4`}>
                  <db.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{db.name}</h3>
                  <p className="text-gray-600">{db.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {db.features.map((feature) => (
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
                    {db.useCases.map((useCase) => (
                      <span
                        key={useCase}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Database Decision Framework
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose SQL (Relational)</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Complex relationships between data</li>
                <li>• Data integrity is critical</li>
                <li>• Need ACID transactions</li>
                <li>• Structured, predictable data</li>
                <li>• Advanced querying needed</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose NoSQL (Document)</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Flexible, evolving schemas</li>
                <li>• Hierarchical data structures</li>
                <li>• High write throughput</li>
                <li>• Real-time analytics</li>
                <li>• Content management systems</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">
              💡 Pro Tip: Start with SQLite
            </h4>
            <p className="text-yellow-700">
              For development and small applications, SQLite provides zero-configuration setup
              with full SQL compliance. It's perfect for prototyping and can handle production
              workloads for many applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
