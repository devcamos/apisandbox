/** Onboarding block: 80/20 training methodology (shown during new-user guide). */
export default function ParetoMethodologySection() {
  return (
    <section
      id="app-guide-pareto"
      className="container mx-auto px-6 py-8"
      data-testid="pareto-methodology-section"
    >
      <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border-2 border-yellow-500/30 rounded-2xl p-8 mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <span className="text-3xl" aria-hidden>
                📊
              </span>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Training Powered by the Pareto Principle
              </h2>
              <p className="text-gray-300">
                Every concept is selected using the 80/20 rule, then deep-dived for mastery
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 rounded-xl p-6 border border-yellow-500/20">
              <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <span aria-hidden>🎯</span> Content Selection
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We identify the <strong className="text-white">20% of concepts</strong> that solve{" "}
                <strong className="text-white">80% of real-world API integration challenges</strong>.
                No fluff, only high-impact knowledge.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Example: Callbacks appear in 80% of OAuth flows → Deep dive into callbacks
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 border border-orange-500/20">
              <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                <span aria-hidden>🚀</span> Deep Dive for Growth
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Once selected, each concept gets a <strong className="text-white">comprehensive deep dive</strong>{" "}
                with documentation, examples, and interactive demos to ensure true mastery.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Example: HTTP fundamentals → Full documentation + REST API examples + Real-world use cases
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-gray-300 text-center">
              <strong className="text-yellow-300">Result:</strong> You master the vital 20% that unlocks 80% of API
              integration scenarios, then deep dive to ensure you can apply it confidently in production.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
