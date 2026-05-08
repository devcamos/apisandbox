/**
 * Phase 5 side quests — conceptual 101s that support the main quest (algorithm + systems lessons).
 * Main quest: master algorithms & API architecture patterns. Side quest: master vocabulary & invariants.
 */

export interface ConceptSection {
  heading: string
  body: string
}

export interface ConceptSideQuest {
  id: string
  title: string
  tagline: string
  /** Phase 6 algorithm ids that apply — optional cross-link */
  relatedAlgorithmIds?: string[]
  sections: ConceptSection[]
}

export const conceptSideQuests: ConceptSideQuest[] = [
  {
    id: "big-o",
    title: "Big O notation",
    tagline: "The usual starting point: how runtime and memory scale with input size n — and why it is “Big O,” not “Big 0.”",
    relatedAlgorithmIds: ["bubble", "merge", "binary", "linear"],
    sections: [
      {
        heading: "Letter O, not zero",
        body: "People say “Big O” for asymptotic upper bounds. The symbol is the letter O (for “order of growth” / Landau notation), not the digit 0. If you see “Big 0” in notes, read it as Big O — same idea.",
      },
      {
        heading: "What Big O is for",
        body: "Big O describes how work (time) or memory (space) grows as input size n gets large — ignoring constant factors and lower-order terms. It is a comparison language between algorithms (“this grows like n log n”), not a substitute for profiling real milliseconds on real hardware.",
      },
      {
        heading: "Common classes (intuition)",
        body: "O(1) constant · O(log n) halving each step · O(n) one full pass · O(n log n) efficient comparison sorting · O(n²) nested work or naive pairs · O(2ⁿ) brute force over subsets (usually too slow at scale). The same algorithm can have different best-, average-, and worst-case Big O (e.g. quicksort).",
      },
      {
        heading: "Main quest tie-in",
        body: "When you pick a data structure, index, or rate-limit design on a hot API path, you are implicitly picking an asymptotic class. Phase 6 shows step counts; Phase 5 asks what fails when load multiplies.",
      },
    ],
  },
  {
    id: "stability-invariants",
    title: "Stability & sort invariants",
    tagline: "When equal keys stay in original order — and why APIs sometimes depend on it.",
    relatedAlgorithmIds: ["merge", "insertion", "quick"],
    sections: [
      {
        heading: "Stable sort",
        body: "A stable sort preserves the relative order of records with equal keys. Merge sort and insertion sort are stable; standard quicksort is usually not. Useful when sorting by one field while preserving tie-break order from a prior sort.",
      },
      {
        heading: "Invariant",
        body: "An invariant is a condition that stays true before and after each step (e.g. “prefix is sorted”). Proving correctness = defining invariants + showing they are maintained. Interview explanations should name the invariant.",
      },
      {
        heading: "Main quest tie-in",
        body: "Distributed pipelines often sort or group by multiple dimensions; stability affects deduplication and user-visible ordering. Wrong invariant → subtle production bugs.",
      },
    ],
  },
  {
    id: "random-vs-sequential-access",
    title: "Random access vs sequential access",
    tagline: "Why binary search and jump search assume different things than streaming grep.",
    relatedAlgorithmIds: ["binary", "linear", "jump"],
    sections: [
      {
        heading: "Random access",
        body: "O(1) indexed access to the i-th element (typical array). Binary search and many partition algorithms need it to jump to the middle in constant time.",
      },
      {
        heading: "Sequential access",
        body: "You can only advance one element at a time (linked list iterator, byte stream, Kafka consumer). Linear search is natural; binary search is not unless you materialize an index.",
      },
      {
        heading: "Main quest tie-in",
        body: "API gateways and log pipelines are often sequential; databases and caches expose random access via indexes. Constraint choice drives algorithm choice.",
      },
    ],
  },
  {
    id: "monotonicity-predicates",
    title: "Monotonicity & predicates",
    tagline: "Binary search is not only for arrays — it is for any “false … false, true … true” pattern.",
    relatedAlgorithmIds: ["binary"],
    sections: [
      {
        heading: "Sorted array",
        body: "Values increase (or decrease) along indices, so comparing mid to target tells you which half to discard.",
      },
      {
        heading: "Search space on answers",
        body: "If predicate P(k) is false for small k and true for large k (monotonic), you can binary search on k for the boundary (minimum feasible capacity, earliest day, etc.). The “array” is implicit.",
      },
      {
        heading: "Common mistake",
        body: "Applying binary search when the predicate is not monotonic — you will discard the answer half. Always prove monotonicity or use a different search.",
      },
    ],
  },
  {
    id: "divide-and-conquer",
    title: "Divide and conquer",
    tagline: "Split, recurse, combine — the family that holds merge sort and binary search.",
    relatedAlgorithmIds: ["merge", "quick", "binary"],
    sections: [
      {
        heading: "Pattern",
        body: "Divide the problem into smaller subproblems of the same form, solve recursively (or iteratively with a stack), combine results. Merge sort divides and merges; quicksort divides by partitioning.",
      },
      {
        heading: "Master theorem (intuition)",
        body: "Recurrence shape T(n) = a T(n/b) + f(n) leads to different classes. You do not need to memorize the theorem — recognize “three of four subproblems half size” → often n log n.",
      },
      {
        heading: "Main quest tie-in",
        body: "Sharding and hierarchical aggregation in APIs mirror divide-and-conquer — same idempotency and ordering issues at combine time.",
      },
    ],
  },
  {
    id: "space-time-tradeoffs",
    title: "Space–time trade-offs",
    tagline: "Extra memory for speed (hash tables, merge buffer) vs in-place pain (heapsort, in-place quicksort).",
    relatedAlgorithmIds: ["merge", "quick"],
    sections: [
      {
        heading: "Core idea",
        body: "You can often exchange memory for fewer operations or simpler logic: hash map for O(1) expected lookup, merge buffer for stable n log n, index structures for avoiding full scans.",
      },
      {
        heading: "When space matters",
        body: "Embedded devices, edge caches, and strict GC pressure favor in-place or streaming algorithms even if asymptotics look similar.",
      },
      {
        heading: "Main quest tie-in",
        body: "Phase 5 lessons (idempotency keys, rate limits) are space–time trades at the system level — same vocabulary, different layer.",
      },
    ],
  },
  {
    id: "graph-traversal-models",
    title: "BFS vs DFS — queue vs stack",
    tagline: "Two ways to walk a graph; different memory shapes and guarantees.",
    relatedAlgorithmIds: ["bfs", "dfs-preorder", "dfs-inorder", "dfs-postorder"],
    sections: [
      {
        heading: "BFS",
        body: "Uses a queue; explores layer by layer. Shortest path in unweighted graphs; can use a lot of memory if the frontier is wide.",
      },
      {
        heading: "DFS",
        body: "Goes deep first (recursion or explicit stack). Low memory for narrow deep trees; does not give shortest path in unweighted graphs without care.",
      },
      {
        heading: "Visited sets",
        body: "On graphs with cycles, both need a visited mark or you loop forever. Trees simplify because you have parent/child structure.",
      },
    ],
  },
  {
    id: "comparators-and-totality",
    title: "Comparators & total order",
    tagline: "Sorting and binary search require consistent comparison — break ties predictably.",
    relatedAlgorithmIds: ["bubble", "quick", "binary"],
    sections: [
      {
        heading: "What sorting assumes",
        body: "A total order: for any a, b, exactly one of a < b, a = b, a > b holds, and the relation is transitive. Floating-point NaN breaks this; custom objects need stable tie-breakers.",
      },
      {
        heading: "Comparator contract",
        body: "compare(a,b) must be antisymmetric and transitive. Violations → undefined sort order or flaky tests.",
      },
      {
        heading: "API angle",
        body: "Pagination cursors and “sort by” query params rely on a consistent ordering contract across services.",
      },
    ],
  },
]

export function getConceptSideQuest(id: string): ConceptSideQuest | undefined {
  return conceptSideQuests.find((c) => c.id === id)
}
