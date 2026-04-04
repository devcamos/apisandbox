export type PatternDifficulty = "Easy" | "Medium" | "Hard"

export interface PatternLevelMeta {
  level: number
  title: string
  range: string
  summary: string
}

export interface PatternNode {
  id: string
  label: string
  level: number
  difficulty: PatternDifficulty
  whyThisLevel: string
  readFirstExamples: string[]
  prerequisites: string[]
  unlocks: string[]
}

export interface PatternPracticeProblem {
  id: string
  title: string
  focus: string
  learn: string[]
  do: string[]
  mappedProblems?: MappedPracticeProblem[]
  strategies?: string[]
}

export interface MappedPracticeProblem {
  id: string
  title: string
  problemStatement: string
  whyItMaps: string
  learn: string[]
  do: string[]
  strategies?: string[]
}

export interface StrategyProblemLink {
  patternId: string
  problemId: string
  mappedId?: string
}

export interface LearningStrategy {
  id: string
  title: string
  summary: string
  mechanics: string[]
  linkedProblems: StrategyProblemLink[]
}

export interface ProblemProgress {
  completed: boolean
  understood: boolean
}

export interface NodeProgress {
  completed: boolean
  problems: Record<string, ProblemProgress>
}

export type PatternProgressState = Record<string, NodeProgress>

export const PATTERN_PROGRESS_STORAGE_KEY = "leetcode_pattern_graph_progress_v3"

export const learningStrategies: LearningStrategy[] = [
  {
    id: "complement-strategy",
    title: "Complement Strategy",
    summary:
      "Transform target matching into lookup matching: for each value x, ask whether complement (target - x) already exists in tracked state.",
    mechanics: [
      "Define the complement identity for the problem domain (value, prefix sum, or keyed state).",
      "Choose a lookup structure (hash map/set) that supports O(1) expected membership or count checks.",
      "Update state in the correct order to avoid self-matching and duplicate overcounting.",
      "Validate edge constraints: duplicates, negatives, and repeated queries over mutable state.",
    ],
    linkedProblems: [
      { patternId: "arrays-strings", problemId: "two-sum" },
      { patternId: "arrays-strings", problemId: "two-sum", mappedId: "two-sum-ii" },
      { patternId: "arrays-strings", problemId: "two-sum", mappedId: "3sum" },
      { patternId: "arrays-strings", problemId: "two-sum", mappedId: "4sum" },
      { patternId: "arrays-strings", problemId: "two-sum", mappedId: "subarray-sum-equals-k" },
      { patternId: "arrays-strings", problemId: "two-sum", mappedId: "two-sum-data-structure" },
    ],
  },
]

export const patternLevelMeta: PatternLevelMeta[] = [
  {
    level: 1,
    title: "Foundation",
    range: "Easy",
    summary: "Core data access and iteration patterns. Everything else reuses these primitives.",
  },
  {
    level: 2,
    title: "Core Patterns",
    range: "Easy -> Medium",
    summary: "Windowing, ordering, and local state patterns for interview-frequency problems.",
  },
  {
    level: 3,
    title: "Structural Thinking",
    range: "Medium",
    summary: "Tree/heap/greedy models where global behavior emerges from local rules.",
  },
  {
    level: 4,
    title: "State & Search",
    range: "Medium -> Hard",
    summary: "Combinatorial search and dynamic state transitions.",
  },
  {
    level: 5,
    title: "Graph Systems",
    range: "Hard",
    summary: "Dependency, connectivity, and shortest-path problems with multiple interacting constraints.",
  },
]

export const leetcodePatternNodes: PatternNode[] = [
  {
    id: "arrays-strings",
    label: "Arrays & Strings",
    level: 1,
    difficulty: "Easy",
    whyThisLevel: "Baseline representation and traversal; every later pattern operates on this substrate.",
    readFirstExamples: [
      "API log processing: iterate through request events, group status-code buckets, and compute error percentages.",
      "CSV/JSON ingestion pipelines: normalize and clean records field-by-field before writing to storage.",
      "Search query sanitization: trim, lowercase, and tokenize user text before indexing or matching.",
    ],
    prerequisites: [],
    unlocks: ["hashmap-set", "two-pointers"],
  },
  {
    id: "hashmap-set",
    label: "Hash Map / Set",
    level: 1,
    difficulty: "Easy",
    whyThisLevel: "Introduces O(1) lookup intuition used by sliding windows, graphs, and DP memoization.",
    readFirstExamples: [
      "Idempotency key lookup for payment or webhook retries.",
      "Session/token blacklist membership check in auth middleware.",
    ],
    prerequisites: ["arrays-strings"],
    unlocks: ["sliding-window", "linked-list"],
  },
  {
    id: "two-pointers",
    label: "Two Pointers",
    level: 1,
    difficulty: "Easy",
    whyThisLevel: "Teaches invariant movement and boundary shrinking before more complex window logic.",
    readFirstExamples: [
      "Comparing two sorted feeds (e.g., internal users vs CRM users) to find mismatches.",
      "Deduplicating sorted event streams without extra memory.",
    ],
    prerequisites: ["arrays-strings"],
    unlocks: ["sliding-window", "binary-search", "stack-monotonic"],
  },
  {
    id: "sliding-window",
    label: "Sliding Window",
    level: 2,
    difficulty: "Medium",
    whyThisLevel: "Builds on two-pointer invariants with mutable constraints and frequency state.",
    readFirstExamples: [
      "Rate limiting requests over rolling 60-second windows.",
      "Real-time fraud detection over recent N transactions.",
    ],
    prerequisites: ["two-pointers", "hashmap-set"],
    unlocks: ["trees-dfs-bfs", "dynamic-programming"],
  },
  {
    id: "prefix-sum",
    label: "Prefix Sum / Difference",
    level: 2,
    difficulty: "Medium",
    whyThisLevel: "Introduces cumulative transforms that reduce repeated range work to O(1) queries.",
    readFirstExamples: [
      "Analytics dashboards: quick range totals (hour/day/week) from cumulative counters.",
      "Feature-flag rollout impact by time ranges.",
    ],
    prerequisites: ["arrays-strings"],
    unlocks: ["intervals-sweep", "binary-search"],
  },
  {
    id: "binary-search",
    label: "Binary Search",
    level: 2,
    difficulty: "Medium",
    whyThisLevel: "Requires monotonicity reasoning and bound maintenance, useful for answer-space search.",
    readFirstExamples: [
      "Tuning concurrency limits to the max safe value under an SLO threshold.",
      "Finding minimum cache TTL that keeps miss rate under target.",
    ],
    prerequisites: ["two-pointers", "prefix-sum"],
    unlocks: ["heap-priority", "dynamic-programming"],
  },
  {
    id: "stack-monotonic",
    label: "Stack / Monotonic Stack",
    level: 2,
    difficulty: "Medium",
    whyThisLevel: "Adds deferred decisions and ordering constraints after basic traversal patterns are solid.",
    readFirstExamples: [
      "Detecting next-greater latency spike windows in observability series.",
      "Parsing nested API payload structures.",
    ],
    prerequisites: ["two-pointers"],
    unlocks: ["queue-monotonic", "trees-dfs-bfs"],
  },
  {
    id: "queue-monotonic",
    label: "Queue / Monotonic Queue",
    level: 2,
    difficulty: "Medium",
    whyThisLevel: "Extends monotonic ordering to streaming windows and max/min-in-window problems.",
    readFirstExamples: [
      "Rolling max queue lag alerting in background workers.",
      "Streaming max response time per moving interval.",
    ],
    prerequisites: ["stack-monotonic", "sliding-window"],
    unlocks: ["heap-priority"],
  },
  {
    id: "intervals-sweep",
    label: "Intervals / Sweep Line",
    level: 2,
    difficulty: "Medium",
    whyThisLevel: "Combines sorting with event boundaries, preparing for greedy and scheduling decisions.",
    readFirstExamples: [
      "Calendar slot conflict detection for booking systems.",
      "Traffic surge overlap analysis during deployment windows.",
    ],
    prerequisites: ["prefix-sum"],
    unlocks: ["greedy"],
  },
  {
    id: "linked-list",
    label: "Linked List",
    level: 2,
    difficulty: "Medium",
    whyThisLevel: "Pointer mutation and cycle reasoning bridge foundational traversal to tree/graph pointer logic.",
    readFirstExamples: [
      "LRU cache internals (hash map + doubly linked list).",
      "Event replay chains with predecessor/successor pointers.",
    ],
    prerequisites: ["hashmap-set"],
    unlocks: ["trees-dfs-bfs"],
  },
  {
    id: "trees-dfs-bfs",
    label: "Tree DFS / BFS",
    level: 3,
    difficulty: "Medium",
    whyThisLevel: "Introduces hierarchical recursion and frontier traversal, foundational for graph exploration.",
    readFirstExamples: [
      "Organization hierarchy permission propagation.",
      "Category tree traversal for ecommerce filters.",
    ],
    prerequisites: ["linked-list", "sliding-window", "stack-monotonic"],
    unlocks: ["bst-patterns", "backtracking", "graph-traversal"],
  },
  {
    id: "bst-patterns",
    label: "BST Patterns",
    level: 3,
    difficulty: "Medium",
    whyThisLevel: "Applies ordering properties on top of generic tree traversal skills.",
    readFirstExamples: [
      "Ordered index lookups and nearest-threshold queries.",
      "Range queries over sorted keys in in-memory services.",
    ],
    prerequisites: ["trees-dfs-bfs"],
    unlocks: ["binary-search"],
  },
  {
    id: "heap-priority",
    label: "Heap / Priority Queue",
    level: 3,
    difficulty: "Medium",
    whyThisLevel: "Priority-based extraction supports scheduling and shortest-path style expansions.",
    readFirstExamples: [
      "Job scheduler prioritizing urgent workflows.",
      "Top-K API hotspots by latency or cost contribution.",
    ],
    prerequisites: ["binary-search", "queue-monotonic"],
    unlocks: ["greedy", "dijkstra"],
  },
  {
    id: "greedy",
    label: "Greedy",
    level: 3,
    difficulty: "Medium",
    whyThisLevel: "Requires evidence-based local-choice correctness; easier once interval and heap intuition exists.",
    readFirstExamples: [
      "Earliest-deadline-first worker assignment.",
      "Bandwidth budget allocation across requests.",
    ],
    prerequisites: ["intervals-sweep", "heap-priority"],
    unlocks: ["backtracking"],
  },
  {
    id: "backtracking",
    label: "Backtracking",
    level: 4,
    difficulty: "Hard",
    whyThisLevel: "Systematic search over decision trees needs strong recursion/invariant discipline.",
    readFirstExamples: [
      "Generating candidate routing combinations under constraints.",
      "Policy-rule exploration engines.",
    ],
    prerequisites: ["trees-dfs-bfs", "greedy"],
    unlocks: ["dynamic-programming"],
  },
  {
    id: "dynamic-programming",
    label: "Dynamic Programming",
    level: 4,
    difficulty: "Hard",
    whyThisLevel: "State design and transition correctness are high-cognitive-load and build on recursion/search.",
    readFirstExamples: [
      "Cost minimization across staged cloud migration decisions.",
      "Optimal retry strategy cost/latency planning.",
    ],
    prerequisites: ["backtracking", "binary-search", "sliding-window"],
    unlocks: ["graph-traversal"],
  },
  {
    id: "graph-traversal",
    label: "Graph Traversal (BFS/DFS)",
    level: 5,
    difficulty: "Hard",
    whyThisLevel: "Generalizes tree traversal to cyclic/disconnected systems with visited-state management.",
    readFirstExamples: [
      "Service dependency impact analysis during incidents.",
      "Permission graph expansion for access checks.",
    ],
    prerequisites: ["trees-dfs-bfs", "dynamic-programming"],
    unlocks: ["topological-sort", "union-find", "dijkstra"],
  },
  {
    id: "topological-sort",
    label: "Topological Sort",
    level: 5,
    difficulty: "Hard",
    whyThisLevel: "Dependency ordering in DAGs requires queue/indegree modeling and graph familiarity.",
    readFirstExamples: [
      "Build/deploy pipeline ordering from dependency graph.",
      "Data pipeline stage execution planning.",
    ],
    prerequisites: ["graph-traversal"],
    unlocks: ["advanced-graphs"],
  },
  {
    id: "union-find",
    label: "Union Find (DSU)",
    level: 5,
    difficulty: "Hard",
    whyThisLevel: "Connectivity tracking under merges is easiest once graph components and invariants are clear.",
    readFirstExamples: [
      "Cluster membership resolution across merged accounts.",
      "Network partition grouping and reconciliation.",
    ],
    prerequisites: ["graph-traversal"],
    unlocks: ["advanced-graphs"],
  },
  {
    id: "dijkstra",
    label: "Shortest Path (Dijkstra)",
    level: 5,
    difficulty: "Hard",
    whyThisLevel: "Combines graph expansion with heap prioritization and path relaxation invariants.",
    readFirstExamples: [
      "Fastest path through service mesh with weighted latency edges.",
      "Cost-aware route selection in multi-region traffic.",
    ],
    prerequisites: ["graph-traversal", "heap-priority"],
    unlocks: ["advanced-graphs"],
  },
  {
    id: "advanced-graphs",
    label: "Advanced Graphs / Flow",
    level: 5,
    difficulty: "Hard",
    whyThisLevel: "Capstone patterns that require mastery of traversal, ordering, connectivity, and weighted paths.",
    readFirstExamples: [
      "Throughput planning in constrained network flows.",
      "Multi-constraint routing for high-scale infrastructure.",
    ],
    prerequisites: ["topological-sort", "union-find", "dijkstra"],
    unlocks: [],
  },
]

export function getPatternNode(id: string) {
  return leetcodePatternNodes.find((n) => n.id === id) ?? null
}

export function emptyNodeProgress(): NodeProgress {
  return {
    completed: false,
    problems: {},
  }
}

export function isProblemChecklistComplete(patternId: string, progress: NodeProgress) {
  const problems = practiceProblemsByPattern[patternId] || []
  if (problems.length === 0) return false
  return problems.every((problem) => {
    const item = progress.problems[problem.id]
    return Boolean(item?.completed && item?.understood)
  })
}

export const dsaFoundationsByPattern: Record<string, string> = {
  "arrays-strings": "Array, String",
  "hashmap-set": "Hash Table, Set",
  "two-pointers": "Array, String",
  "sliding-window": "Array, Hash Map",
  "prefix-sum": "Array",
  "binary-search": "Sorted Array / Monotonic Function",
  "stack-monotonic": "Stack, Array",
  "queue-monotonic": "Deque, Array",
  "intervals-sweep": "Array, Sorting",
  "linked-list": "Singly/Doubly Linked List",
  "trees-dfs-bfs": "Binary Tree, Queue, Recursion Stack",
  "bst-patterns": "Binary Search Tree",
  "heap-priority": "Heap / Priority Queue",
  "greedy": "Array, Sorting, Heap",
  "backtracking": "Recursion Tree, Set/Map for state",
  "dynamic-programming": "Array/Matrix, Memo Table",
  "graph-traversal": "Adjacency List, Queue/Stack, Set",
  "topological-sort": "Graph, Queue",
  "union-find": "Disjoint Set Union",
  "dijkstra": "Weighted Graph, Priority Queue",
  "advanced-graphs": "Graph, Flow Network",
}

export const practiceProblemsByPattern: Record<string, PatternPracticeProblem[]> = {
  "arrays-strings": [
    {
      id: "two-sum",
      title: "Two Sum",
      focus: "Index scan + lookup boundary.",
      learn: ["How pair-search complexity changes from O(n²) to O(n)", "Why complement lookup works as an invariant"],
      do: ["Write brute force first", "Define target complexity", "Implement and test edge cases (duplicates, negatives)"],
      strategies: ["complement-strategy"],
      mappedProblems: [
        {
          id: "two-sum-ii",
          title: "Two Sum II - Input Array Is Sorted",
          problemStatement: "Given a sorted array, return 1-based indexes of two numbers that add to target.",
          whyItMaps: "Same pair-sum objective as Two Sum, but sorted input changes the best pattern to two pointers.",
          learn: ["How input constraints change pattern choice", "Why two pointers can replace hash lookup on sorted arrays"],
          do: ["State pointer invariant", "Implement left/right movement logic", "Test no-solution and duplicate cases"],
          strategies: ["complement-strategy"],
        },
        {
          id: "3sum",
          title: "3Sum",
          problemStatement: "Find all unique triplets in an array that sum to zero.",
          whyItMaps: "Extends Two Sum by fixing one element and solving reduced pair search repeatedly.",
          learn: ["Reduction from 3-sum to repeated 2-sum", "Duplicate control for unique outputs"],
          do: ["Sort and fix one index", "Run two-sum style scan on suffix", "Guard against duplicate triplets"],
          strategies: ["complement-strategy"],
        },
        {
          id: "4sum",
          title: "4Sum",
          problemStatement: "Find all unique quadruplets that sum to target.",
          whyItMaps: "Generalizes pair matching further, reinforcing decomposition into smaller sum problems.",
          learn: ["Layered reduction strategy", "Explosion risk and pruning"],
          do: ["Set loop boundaries carefully", "Apply reduced two-pointer inner search", "Verify uniqueness behavior"],
          strategies: ["complement-strategy"],
        },
        {
          id: "subarray-sum-equals-k",
          title: "Subarray Sum Equals K",
          problemStatement: "Count continuous subarrays whose sum equals k.",
          whyItMaps: "Still complement-matching, but complements are matched against prefix sums over indices.",
          learn: ["Complement logic in cumulative space", "Count aggregation instead of existence check"],
          do: ["Derive prefix complement equation", "Implement map frequency counting", "Test negatives and zeros"],
          strategies: ["complement-strategy"],
        },
        {
          id: "two-sum-data-structure",
          title: "Two Sum III - Data Structure Design",
          problemStatement: "Design a structure supporting add(number) and find(value) for pair sums.",
          whyItMaps: "Uses the same complement idea in a stateful, multi-query context.",
          learn: ["Trade-offs between write-heavy and read-heavy strategies", "State management for repeated queries"],
          do: ["Choose internal storage strategy", "Define complexity targets for add/find", "Test repeated values and updates"],
          strategies: ["complement-strategy"],
        },
      ],
    },
    {
      id: "valid-anagram",
      title: "Valid Anagram",
      focus: "Frequency normalization and comparison.",
      learn: ["Character frequency modeling", "When map vs fixed-array counting is appropriate"],
      do: ["Define normalization assumptions", "Implement count-based check", "Test unicode/length mismatch cases"],
    },
  ],
  "hashmap-set": [
    {
      id: "contains-duplicate",
      title: "Contains Duplicate",
      focus: "Membership checks in O(1).",
      learn: ["Set membership semantics", "Trade-off between memory and time"],
      do: ["State worst-case input", "Implement set-based approach", "Validate complexity claim"],
    },
    {
      id: "group-anagrams",
      title: "Group Anagrams",
      focus: "Canonical key construction.",
      learn: ["Canonical representation design", "Hash grouping strategy"],
      do: ["Choose key strategy", "Group inputs by key", "Test collision/ordering assumptions"],
    },
  ],
  "two-pointers": [
    {
      id: "valid-palindrome",
      title: "Valid Palindrome",
      focus: "Bidirectional invariant movement.",
      learn: ["Pointer movement invariants", "Input sanitation constraints"],
      do: ["Define normalization rules", "Implement two-pointer walk", "Test punctuation/case edge cases"],
    },
    {
      id: "container-most-water",
      title: "Container With Most Water",
      focus: "Pointer decision correctness.",
      learn: ["Greedy pointer move proof intuition", "Area bound behavior"],
      do: ["Write brute force baseline", "Define move rule", "Validate on adversarial cases"],
    },
  ],
  "sliding-window": [
    {
      id: "longest-substring",
      title: "Longest Substring Without Repeating Characters",
      focus: "Window expansion/shrink rules.",
      learn: ["Window invariant maintenance", "Fast duplicate eviction"],
      do: ["Define invariant in one sentence", "Implement expand/shrink loop", "Track max safely"],
    },
    {
      id: "permutation-in-string",
      title: "Permutation in String",
      focus: "Frequency map window matching.",
      learn: ["Fixed-length window counting", "Map/array diff matching"],
      do: ["Define match condition", "Implement rolling updates", "Test repeated chars"],
    },
  ],
  "prefix-sum": [
    {
      id: "subarray-sum-k",
      title: "Subarray Sum Equals K",
      focus: "Prefix sum + hashmap counts.",
      learn: ["Prefix-sum difference identity", "Count aggregation via map"],
      do: ["Derive equation", "Implement map counting", "Test negatives/zeros"],
    },
    {
      id: "range-sum-query",
      title: "Range Sum Query - Immutable",
      focus: "O(1) range queries after preprocess.",
      learn: ["Precompute vs query-time tradeoff", "Boundary handling"],
      do: ["Build prefix array", "Implement query function", "Test edges"],
    },
  ],
  "binary-search": [
    {
      id: "search-rotated",
      title: "Search in Rotated Sorted Array",
      focus: "Partition monotonicity reasoning.",
      learn: ["Half-sorted partition detection", "Branch correctness under rotation"],
      do: ["State invariant per loop", "Implement branch logic", "Test pivot extremes"],
    },
    {
      id: "koko-bananas",
      title: "Koko Eating Bananas",
      focus: "Binary search on answer space.",
      learn: ["Monotonic feasibility checks", "Answer-space bounds"],
      do: ["Define feasible(speed)", "Set bounds", "Implement lower-bound search"],
    },
  ],
  "stack-monotonic": [
    {
      id: "daily-temperatures",
      title: "Daily Temperatures",
      focus: "Next greater element pattern.",
      learn: ["Monotonic decreasing stack behavior", "Deferred resolution pattern"],
      do: ["Define stack invariant", "Implement pop/update loop", "Verify index math"],
    },
    {
      id: "largest-rectangle",
      title: "Largest Rectangle in Histogram",
      focus: "Monotonic boundary extraction.",
      learn: ["Left/right boundary interpretation", "Sentinel usage"],
      do: ["Implement monotonic stack pass", "Compute areas", "Test flat/descending inputs"],
    },
  ],
  "queue-monotonic": [
    {
      id: "sliding-window-max",
      title: "Sliding Window Maximum",
      focus: "Deque ordering invariant.",
      learn: ["Deque candidate pruning", "Window-expiry handling"],
      do: ["Define deque invariant", "Implement add/evict logic", "Validate max retrieval"],
    },
    {
      id: "shortest-subarray-k",
      title: "Shortest Subarray with Sum at Least K",
      focus: "Monotonic queue with prefix sums.",
      learn: ["Prefix monotonicity coupling", "Best-length update condition"],
      do: ["Derive while-loop conditions", "Implement deque logic", "Test negative numbers"],
    },
  ],
  "intervals-sweep": [
    {
      id: "merge-intervals",
      title: "Merge Intervals",
      focus: "Sort + merge boundaries.",
      learn: ["Boundary overlap logic", "Sort as prerequisite transform"],
      do: ["Sort intervals", "Implement merge pass", "Test touching boundaries"],
    },
    {
      id: "meeting-rooms-ii",
      title: "Meeting Rooms II",
      focus: "Concurrent interval counting.",
      learn: ["Concurrent overlap measurement", "Sweep line / heap comparison"],
      do: ["Choose counting strategy", "Implement and compare", "Test identical start times"],
    },
  ],
  "linked-list": [
    {
      id: "reverse-linked-list",
      title: "Reverse Linked List",
      focus: "Pointer mutation safety.",
      learn: ["State handoff in pointer mutation", "Null-boundary safety"],
      do: ["Track prev/curr/next explicitly", "Implement iterative reverse", "Test 0/1 node"],
    },
    {
      id: "linked-list-cycle",
      title: "Linked List Cycle",
      focus: "Fast/slow pointer cycle detect.",
      learn: ["Floyd cycle intuition", "Pointer-step differential"],
      do: ["Define slow/fast transitions", "Implement detection", "Test short/long cycles"],
    },
  ],
  "trees-dfs-bfs": [
    {
      id: "max-depth-tree",
      title: "Maximum Depth of Binary Tree",
      focus: "Recursive vs iterative traversal.",
      learn: ["Depth definition via recursion", "Traversal tradeoffs"],
      do: ["Implement DFS", "Implement BFS alternative", "Compare complexity"],
    },
    {
      id: "binary-tree-level-order",
      title: "Binary Tree Level Order Traversal",
      focus: "Queue frontier processing.",
      learn: ["Frontier expansion", "Level boundary handling"],
      do: ["Implement queue loop", "Capture per-level groups", "Test skewed trees"],
    },
  ],
  "bst-patterns": [
    {
      id: "validate-bst",
      title: "Validate Binary Search Tree",
      focus: "Range invariant propagation.",
      learn: ["Global range propagation vs local checks", "Boundary exclusivity"],
      do: ["Define valid range recursion", "Implement guard logic", "Test duplicate boundary case"],
    },
    {
      id: "kth-smallest-bst",
      title: "Kth Smallest Element in a BST",
      focus: "In-order ordering property.",
      learn: ["In-order sorted output invariant", "Early stop optimization"],
      do: ["Implement traversal with counter", "Add early termination", "Test k edges"],
    },
  ],
  "heap-priority": [
    {
      id: "top-k-frequent",
      title: "Top K Frequent Elements",
      focus: "Heap size management.",
      learn: ["Frequency aggregation then top-k extraction", "Min-heap of fixed size"],
      do: ["Build frequency map", "Maintain size-k heap", "Verify tie handling"],
    },
    {
      id: "k-closest-points",
      title: "K Closest Points to Origin",
      focus: "Priority ordering by metric.",
      learn: ["Distance metric ranking", "Heap pruning strategy"],
      do: ["Define comparison metric", "Implement heap selection", "Test duplicate distances"],
    },
  ],
  "greedy": [
    {
      id: "jump-game",
      title: "Jump Game",
      focus: "Local decision proving global reachability.",
      learn: ["Farthest-reach invariant", "Greedy correctness intuition"],
      do: ["Define reach invariant", "Implement linear scan", "Test trap positions"],
    },
    {
      id: "non-overlapping-intervals",
      title: "Non-overlapping Intervals",
      focus: "Optimal removal strategy.",
      learn: ["Endpoint-based greedy proof idea", "Overlap resolution strategy"],
      do: ["Sort by endpoint", "Implement keep/remove logic", "Test nested intervals"],
    },
  ],
  "backtracking": [
    {
      id: "subsets",
      title: "Subsets",
      focus: "Decision tree branching.",
      learn: ["Include/exclude branching model", "Backtracking state restoration"],
      do: ["Draw recursion tree", "Implement include/exclude", "Verify full coverage"],
    },
    {
      id: "combination-sum",
      title: "Combination Sum",
      focus: "State pruning and recursion control.",
      learn: ["Target-reduction state", "Pruning invalid branches"],
      do: ["Define stop conditions", "Implement recursive search", "Test repeated candidates"],
    },
  ],
  "dynamic-programming": [
    {
      id: "house-robber",
      title: "House Robber",
      focus: "State transition recurrence.",
      learn: ["Take/skip recurrence design", "State compression"],
      do: ["Write recurrence", "Implement DP iteratively", "Test small/edge arrays"],
    },
    {
      id: "coin-change",
      title: "Coin Change",
      focus: "Min-state optimization across choices.",
      learn: ["Min-over-choices DP pattern", "Unreachable state handling"],
      do: ["Define dp meaning", "Implement transitions", "Validate impossible target case"],
    },
  ],
  "graph-traversal": [
    {
      id: "num-islands",
      title: "Number of Islands",
      focus: "Component discovery with visited state.",
      learn: ["Connected component counting", "Visited-state management"],
      do: ["Choose BFS/DFS", "Implement traversal marking", "Test fragmented grids"],
    },
    {
      id: "clone-graph",
      title: "Clone Graph",
      focus: "Traversal with mapping old->new nodes.",
      learn: ["Node identity mapping invariant", "Cycle-safe traversal"],
      do: ["Define clone map strategy", "Implement traversal clone", "Test cycle graph"],
    },
  ],
  "topological-sort": [
    {
      id: "course-schedule",
      title: "Course Schedule",
      focus: "Cycle detection / indegree flow.",
      learn: ["Indegree interpretation", "Acyclic completion condition"],
      do: ["Build graph + indegree", "Run Kahn/DFS cycle check", "Validate disconnected graph"],
    },
    {
      id: "course-schedule-ii",
      title: "Course Schedule II",
      focus: "Topological ordering output.",
      learn: ["Order construction in DAG", "Failure when cycle remains"],
      do: ["Generate topological order", "Check length==n", "Test multiple valid orders"],
    },
  ],
  "union-find": [
    {
      id: "number-of-provinces",
      title: "Number of Provinces",
      focus: "Connectivity merge operations.",
      learn: ["Union-by-rank intuition", "Component counting from DSU roots"],
      do: ["Implement DSU operations", "Union matrix edges", "Count unique roots"],
    },
    {
      id: "redundant-connection",
      title: "Redundant Connection",
      focus: "Detecting cycle edge by union.",
      learn: ["Union failure as cycle signal", "Incremental graph building"],
      do: ["Process edges in order", "Detect first failed union", "Validate simple cycle case"],
    },
  ],
  dijkstra: [
    {
      id: "network-delay-time",
      title: "Network Delay Time",
      focus: "Shortest path with min-heap.",
      learn: ["Distance relaxation invariant", "Min-heap frontier expansion"],
      do: ["Initialize distances", "Implement Dijkstra loop", "Check reachability of all nodes"],
    },
    {
      id: "path-with-min-effort",
      title: "Path With Minimum Effort",
      focus: "Priority expansion by path cost.",
      learn: ["Path cost definition by max-edge", "Priority updates under custom metric"],
      do: ["Define effort transition", "Run heap-based traversal", "Test uneven terrain case"],
    },
  ],
  "advanced-graphs": [
    {
      id: "cheapest-flights-k-stops",
      title: "Cheapest Flights Within K Stops",
      focus: "Constraint-aware path strategy.",
      learn: ["Path optimization under hop constraints", "State includes node+stops"],
      do: ["Choose algorithm variant", "Track constrained state", "Test stop-limit edge cases"],
    },
    {
      id: "max-flow-intro",
      title: "Intro Max Flow Variant",
      focus: "Capacity reasoning and augmentation.",
      learn: ["Residual capacity intuition", "Augmenting path concept"],
      do: ["Model residual graph", "Find augmenting paths", "Track max-flow increments"],
    },
  ],
}

export function getPatternPracticeProblem(patternId: string, problemId: string) {
  const list = practiceProblemsByPattern[patternId] || []
  return list.find((p) => p.id === problemId) || null
}

export function getMappedPracticeProblem(patternId: string, problemId: string, mappedId: string) {
  const parent = getPatternPracticeProblem(patternId, problemId)
  if (!parent?.mappedProblems) return null
  return parent.mappedProblems.find((p) => p.id === mappedId) || null
}

export function getLearningStrategy(strategyId: string) {
  return learningStrategies.find((s) => s.id === strategyId) || null
}
