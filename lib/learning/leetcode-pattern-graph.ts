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

export interface PatternFundamentalsContent {
  coreIdea: string
  whyItMatters: string
  mentalModel: string[]
  workflow: string[]
  commonPitfalls: string[]
  studyChecklist: string[]
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

type PatternNodeRow = readonly [
  id: string,
  label: string,
  level: number,
  difficulty: PatternDifficulty,
  whyThisLevel: string,
  readFirstExamples: string[],
  prerequisites: string[],
  unlocks: string[],
]

const PATTERN_NODE_ROWS: PatternNodeRow[] = [
  [
    "arrays-strings",
    "Arrays & Strings",
    1,
    "Easy",
    "Baseline representation and traversal; every later pattern operates on this substrate.",
    [
      "API log processing: iterate through request events, group status-code buckets, and compute error percentages.",
      "CSV/JSON ingestion pipelines: normalize and clean records field-by-field before writing to storage.",
      "Search query sanitization: trim, lowercase, and tokenize user text before indexing or matching.",
    ],
    [],
    ["hashmap-set", "two-pointers"],
  ],
  [
    "hashmap-set",
    "Hash Map / Set",
    1,
    "Easy",
    "Introduces O(1) lookup intuition used by sliding windows, graphs, and DP memoization.",
    [
      "Idempotency key lookup for payment or webhook retries.",
      "Session/token blacklist membership check in auth middleware.",
    ],
    ["arrays-strings"],
    ["sliding-window", "linked-list"],
  ],
  [
    "two-pointers",
    "Two Pointers",
    1,
    "Easy",
    "Teaches invariant movement and boundary shrinking before more complex window logic.",
    [
      "Comparing two sorted feeds (e.g., internal users vs CRM users) to find mismatches.",
      "Deduplicating sorted event streams without extra memory.",
    ],
    ["arrays-strings"],
    ["sliding-window", "binary-search", "stack-monotonic"],
  ],
  [
    "sliding-window",
    "Sliding Window",
    2,
    "Medium",
    "Builds on two-pointer invariants with mutable constraints and frequency state.",
    [
      "Rate limiting requests over rolling 60-second windows.",
      "Real-time fraud detection over recent N transactions.",
    ],
    ["two-pointers", "hashmap-set"],
    ["trees-dfs-bfs", "dynamic-programming"],
  ],
  [
    "prefix-sum",
    "Prefix Sum / Difference",
    2,
    "Medium",
    "Introduces cumulative transforms that reduce repeated range work to O(1) queries.",
    [
      "Analytics dashboards: quick range totals (hour/day/week) from cumulative counters.",
      "Feature-flag rollout impact by time ranges.",
    ],
    ["arrays-strings"],
    ["intervals-sweep", "binary-search"],
  ],
  [
    "binary-search",
    "Binary Search",
    2,
    "Medium",
    "Requires monotonicity reasoning and bound maintenance, useful for answer-space search.",
    [
      "Tuning concurrency limits to the max safe value under an SLO threshold.",
      "Finding minimum cache TTL that keeps miss rate under target.",
    ],
    ["two-pointers", "prefix-sum"],
    ["heap-priority", "dynamic-programming"],
  ],
  [
    "stack-monotonic",
    "Stack / Monotonic Stack",
    2,
    "Medium",
    "Adds deferred decisions and ordering constraints after basic traversal patterns are solid.",
    [
      "Detecting next-greater latency spike windows in observability series.",
      "Parsing nested API payload structures.",
    ],
    ["two-pointers"],
    ["queue-monotonic", "trees-dfs-bfs"],
  ],
  [
    "queue-monotonic",
    "Queue / Monotonic Queue",
    2,
    "Medium",
    "Extends monotonic ordering to streaming windows and max/min-in-window problems.",
    [
      "Rolling max queue lag alerting in background workers.",
      "Streaming max response time per moving interval.",
    ],
    ["stack-monotonic", "sliding-window"],
    ["heap-priority"],
  ],
  [
    "intervals-sweep",
    "Intervals / Sweep Line",
    2,
    "Medium",
    "Combines sorting with event boundaries, preparing for greedy and scheduling decisions.",
    [
      "Calendar slot conflict detection for booking systems.",
      "Traffic surge overlap analysis during deployment windows.",
    ],
    ["prefix-sum"],
    ["greedy"],
  ],
  [
    "linked-list",
    "Linked List",
    2,
    "Medium",
    "Pointer mutation and cycle reasoning bridge foundational traversal to tree/graph pointer logic.",
    [
      "LRU cache internals (hash map + doubly linked list).",
      "Event replay chains with predecessor/successor pointers.",
    ],
    ["hashmap-set"],
    ["trees-dfs-bfs"],
  ],
  [
    "trees-dfs-bfs",
    "Tree DFS / BFS",
    3,
    "Medium",
    "Introduces hierarchical recursion and frontier traversal, foundational for graph exploration.",
    [
      "Organization hierarchy permission propagation.",
      "Category tree traversal for ecommerce filters.",
    ],
    ["linked-list", "sliding-window", "stack-monotonic"],
    ["bst-patterns", "backtracking", "graph-traversal"],
  ],
  [
    "bst-patterns",
    "BST Patterns",
    3,
    "Medium",
    "Applies ordering properties on top of generic tree traversal skills.",
    [
      "Ordered index lookups and nearest-threshold queries.",
      "Range queries over sorted keys in in-memory services.",
    ],
    ["trees-dfs-bfs"],
    ["binary-search"],
  ],
  [
    "heap-priority",
    "Heap / Priority Queue",
    3,
    "Medium",
    "Priority-based extraction supports scheduling and shortest-path style expansions.",
    [
      "Job scheduler prioritizing urgent workflows.",
      "Top-K API hotspots by latency or cost contribution.",
    ],
    ["binary-search", "queue-monotonic"],
    ["greedy", "dijkstra"],
  ],
  [
    "greedy",
    "Greedy",
    3,
    "Medium",
    "Requires evidence-based local-choice correctness; easier once interval and heap intuition exists.",
    [
      "Earliest-deadline-first worker assignment.",
      "Bandwidth budget allocation across requests.",
    ],
    ["intervals-sweep", "heap-priority"],
    ["backtracking"],
  ],
  [
    "backtracking",
    "Backtracking",
    4,
    "Hard",
    "Systematic search over decision trees needs strong recursion/invariant discipline.",
    [
      "Generating candidate routing combinations under constraints.",
      "Policy-rule exploration engines.",
    ],
    ["trees-dfs-bfs", "greedy"],
    ["dynamic-programming"],
  ],
  [
    "dynamic-programming",
    "Dynamic Programming",
    4,
    "Hard",
    "State design and transition correctness are high-cognitive-load and build on recursion/search.",
    [
      "Cost minimization across staged cloud migration decisions.",
      "Optimal retry strategy cost/latency planning.",
    ],
    ["backtracking", "binary-search", "sliding-window"],
    ["graph-traversal"],
  ],
  [
    "graph-traversal",
    "Graph Traversal (BFS/DFS)",
    5,
    "Hard",
    "Generalizes tree traversal to cyclic/disconnected systems with visited-state management.",
    [
      "Service dependency impact analysis during incidents.",
      "Permission graph expansion for access checks.",
    ],
    ["trees-dfs-bfs", "dynamic-programming"],
    ["topological-sort", "union-find", "dijkstra"],
  ],
  [
    "topological-sort",
    "Topological Sort",
    5,
    "Hard",
    "Dependency ordering in DAGs requires queue/indegree modeling and graph familiarity.",
    [
      "Build/deploy pipeline ordering from dependency graph.",
      "Data pipeline stage execution planning.",
    ],
    ["graph-traversal"],
    ["advanced-graphs"],
  ],
  [
    "union-find",
    "Union Find (DSU)",
    5,
    "Hard",
    "Connectivity tracking under merges is easiest once graph components and invariants are clear.",
    [
      "Cluster membership resolution across merged accounts.",
      "Network partition grouping and reconciliation.",
    ],
    ["graph-traversal"],
    ["advanced-graphs"],
  ],
  [
    "dijkstra",
    "Shortest Path (Dijkstra)",
    5,
    "Hard",
    "Combines graph expansion with heap prioritization and path relaxation invariants.",
    [
      "Fastest path through service mesh with weighted latency edges.",
      "Cost-aware route selection in multi-region traffic.",
    ],
    ["graph-traversal", "heap-priority"],
    ["advanced-graphs"],
  ],
  [
    "advanced-graphs",
    "Advanced Graphs / Flow",
    5,
    "Hard",
    "Capstone patterns that require mastery of traversal, ordering, connectivity, and weighted paths.",
    [
      "Throughput planning in constrained network flows.",
      "Multi-constraint routing for high-scale infrastructure.",
    ],
    ["topological-sort", "union-find", "dijkstra"],
    [],
  ],
]

export const leetcodePatternNodes: PatternNode[] = PATTERN_NODE_ROWS.map((row) => {
  const [id, label, level, difficulty, whyThisLevel, readFirstExamples, prerequisites, unlocks] = row
  return { id, label, level, difficulty, whyThisLevel, readFirstExamples, prerequisites, unlocks }
})

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

export const patternFundamentalsById: Record<string, PatternFundamentalsContent> = {
  "arrays-strings": {
    coreIdea: "Arrays and strings are linear containers, so most problems are really about scanning, comparing, grouping, or transforming data while preserving a clear invariant about what each index means.",
    whyItMatters: "This is the base layer for nearly every later pattern. Before you can reason about maps, windows, heaps, or graphs, you need to be comfortable reading input left-to-right, choosing the right representation, and expressing simple transformations cleanly.",
    mentalModel: [
      "Think of an array as a row of boxes you can visit in order, and a string as that same row where each box holds a character.",
      "Ask what each position represents: current value, running result, left boundary, right boundary, or part of a transformed output.",
      "Look for whether the job is read-only traversal, in-place mutation, or building a new result structure.",
    ],
    workflow: [
      "State the input and output shape in plain language before coding.",
      "Decide whether one pass, two passes, or sorting first will make the logic simpler.",
      "Write the invariant for your loop: what is guaranteed to be true before and after each step?",
      "Test edge cases: empty input, one element, duplicates, negative values, punctuation, or casing.",
    ],
    commonPitfalls: [
      "Mixing up indexes and values.",
      "Forgetting off-by-one boundaries when slicing or scanning neighbors.",
      "Mutating the same array you still need to read from without being explicit about it.",
      "Ignoring normalization rules for strings such as lowercase conversion or non-alphanumeric filtering.",
    ],
    studyChecklist: [
      "I can explain when a simple linear scan is enough.",
      "I can use `map`, `filter`, `find`, and frequency counting confidently.",
      "I can trace a loop by hand and explain what each pointer or index means.",
      "I can spot when the problem is about representation before optimization.",
    ],
  },
  "hashmap-set": {
    coreIdea: "Hash maps and sets trade extra memory for fast lookup, so they are the default tool when you need membership checks, counts, or grouping in near-constant time.",
    whyItMatters: "A huge share of interview and production problems become manageable once you stop rescanning arrays and start storing what you have already seen.",
    mentalModel: [
      "A set answers 'have I seen this before?'",
      "A map answers 'what do I know about this key right now?'",
      "The key design is often the real problem: raw value, normalized value, composite key, or frequency bucket.",
    ],
    workflow: [
      "Decide whether you need existence, counts, grouping, or latest position.",
      "Define the key clearly before writing the loop.",
      "Update the map in the right order so you do not accidentally match an item with itself.",
      "Check whether duplicates, collisions of meaning, or normalization rules affect the key.",
    ],
    commonPitfalls: [
      "Choosing a weak key that does not uniquely represent the state you care about.",
      "Updating the map before checking the current condition when the order matters.",
      "Assuming insertion order is the same as sorted order.",
      "Using a set when you actually need counts.",
    ],
    studyChecklist: [
      "I know when to use a set versus a map.",
      "I can design a canonical key for grouping problems.",
      "I can explain why this reduces repeated scans.",
      "I can reason about memory trade-offs and duplicate handling.",
    ],
  },
  "two-pointers": {
    coreIdea: "Two pointers let you coordinate two positions in a sequence so the movement itself encodes the logic, usually shrinking search space or comparing mirrored elements.",
    whyItMatters: "It teaches invariant-driven movement, which becomes the foundation for sliding windows and many sorted-array techniques.",
    mentalModel: [
      "Each pointer has a job: left, right, fast, slow, read, or write.",
      "Pointer moves are not random; every move should preserve a proof about what can be ignored safely.",
      "When input is sorted, moving one side can often eliminate a whole range of impossible answers.",
    ],
    workflow: [
      "Name the role of each pointer before coding.",
      "Define the condition that makes you move left, move right, or both.",
      "Write the invariant that explains why discarded elements can never be part of the answer.",
      "Test tiny inputs, duplicate values, and boundary crossing.",
    ],
    commonPitfalls: [
      "Moving the wrong pointer and breaking correctness.",
      "Forgetting to normalize input before comparing characters.",
      "Using two pointers on unsorted data when the logic depends on order.",
      "Missing termination conditions when pointers cross.",
    ],
    studyChecklist: [
      "I can explain why each pointer move is safe.",
      "I can distinguish mirror comparison from shrinking-range search.",
      "I can trace pointer motion without getting lost.",
      "I know when sorting first unlocks a two-pointer solution.",
    ],
  },
  "sliding-window": {
    coreIdea: "A sliding window keeps a contiguous region valid while you expand and shrink it, so you can track running constraints without recomputing everything from scratch.",
    whyItMatters: "This is the standard pattern for substring, subarray, and rolling-constraint problems in both interviews and streaming systems.",
    mentalModel: [
      "The window is a living segment with a validity rule.",
      "The right pointer usually expands to gather information; the left pointer shrinks to restore validity.",
      "Your real state is not the pointers, but the counts or metrics maintained alongside them.",
    ],
    workflow: [
      "Define exactly what 'valid window' means.",
      "Choose the state needed to test validity quickly, such as counts or distinct size.",
      "Expand right, update state, and shrink left while invalid.",
      "Record the answer only when the window meaning matches the question.",
    ],
    commonPitfalls: [
      "Not defining validity precisely enough.",
      "Forgetting to update state when the left pointer moves.",
      "Confusing fixed-size windows with variable-size windows.",
      "Updating the answer at the wrong moment.",
    ],
    studyChecklist: [
      "I can state the window invariant in one sentence.",
      "I know what state must be updated on both expand and shrink.",
      "I can tell whether the problem wants longest, shortest, count, or existence.",
      "I can handle duplicates inside the window correctly.",
    ],
  },
  "prefix-sum": {
    coreIdea: "Prefix sums turn repeated range work into quick subtraction by precomputing cumulative totals up to each index.",
    whyItMatters: "They show how preprocessing can convert expensive repeated work into constant-time queries and also power many hash-map complement problems.",
    mentalModel: [
      "Prefix[i] stores everything from the start through index i - 1.",
      "A range sum is just the difference between two accumulated checkpoints.",
      "The same idea generalizes beyond sums to counts, balances, and signed transforms.",
    ],
    workflow: [
      "Define exactly what the prefix value represents.",
      "Choose whether you need an array of prefixes or a running prefix plus a map.",
      "Derive the subtraction identity before coding.",
      "Test leading ranges and empty-prefix boundaries.",
    ],
    commonPitfalls: [
      "Off-by-one mistakes in prefix indexing.",
      "Forgetting to seed the zero-prefix state when using a map.",
      "Assuming prefix methods only work for positive numbers.",
      "Using prefix sums when the query is not actually about contiguous ranges.",
    ],
    studyChecklist: [
      "I can derive a range formula from the prefix definition.",
      "I know when a hash map of prefix values is needed.",
      "I can handle ranges that start at index zero.",
      "I can explain the preprocess versus query-time trade-off.",
    ],
  },
  "binary-search": {
    coreIdea: "Binary search works whenever the search space has a monotonic property, letting you cut the remaining possibilities in half each step.",
    whyItMatters: "It is not just for sorted arrays; it is a general way to search over ordered possibilities, thresholds, and feasible answers.",
    mentalModel: [
      "At every step, one half is impossible by proof, not by guess.",
      "You are really maintaining a shrinking interval of candidates.",
      "In answer-space search, the key is the monotonic yes/no feasibility function.",
    ],
    workflow: [
      "Identify the monotonic property first.",
      "Choose inclusive or half-open bounds and stay consistent.",
      "Decide whether you need exact match, first true, last true, lower bound, or upper bound.",
      "Test small ranges, endpoints, and duplicate-heavy inputs.",
    ],
    commonPitfalls: [
      "Using binary search without a monotonic condition.",
      "Mixing bound conventions mid-implementation.",
      "Infinite loops from not moving past mid correctly.",
      "Returning the wrong boundary variant for the problem.",
    ],
    studyChecklist: [
      "I can name the monotonic property before coding.",
      "I know what my final return value represents.",
      "I can distinguish exact-match from boundary-finding versions.",
      "I can search answer space, not just arrays.",
    ],
  },
  "stack-monotonic": {
    coreIdea: "A monotonic stack keeps elements in a deliberate order so you can answer next-greater, previous-smaller, and boundary questions as soon as the order is broken.",
    whyItMatters: "It teaches deferred decision-making: you do not solve a position immediately, you keep it pending until later evidence arrives.",
    mentalModel: [
      "The stack stores unresolved candidates.",
      "The monotonic order encodes the exact condition under which an old item gets resolved.",
      "Indexes are usually more useful than values because boundaries matter.",
    ],
    workflow: [
      "Decide whether you need increasing or decreasing order.",
      "Define what event causes a stack pop.",
      "Store indexes when distance or width matters.",
      "Consider sentinels or a cleanup pass for remaining items.",
    ],
    commonPitfalls: [
      "Choosing the wrong monotonic direction.",
      "Pushing values when indexes are needed.",
      "Forgetting final cleanup logic.",
      "Not understanding what each pop actually resolves.",
    ],
    studyChecklist: [
      "I can explain why unresolved items belong on the stack.",
      "I know whether the stack should be increasing or decreasing.",
      "I can map pops to resolved answers.",
      "I can use indexes to compute distance or width correctly.",
    ],
  },
  "queue-monotonic": {
    coreIdea: "A monotonic queue maintains ordered candidates over a moving window so you can answer rolling max or min queries efficiently.",
    whyItMatters: "It combines window logic with ordered candidate pruning, which is useful in streaming and analytics-style problems.",
    mentalModel: [
      "The front is the current best candidate.",
      "The back is where weaker new candidates get pruned.",
      "Candidates also expire when they leave the current window.",
    ],
    workflow: [
      "Define the window boundaries first.",
      "Remove expired indexes from the front.",
      "Prune dominated candidates from the back before pushing the new index.",
      "Read the answer from the front once the window is formed.",
    ],
    commonPitfalls: [
      "Forgetting expiration before reading the result.",
      "Using values instead of indexes when expiry matters.",
      "Confusing queue order with sorted order of all items.",
      "Applying it when a simpler heap or window is enough.",
    ],
    studyChecklist: [
      "I can explain why the front is always optimal.",
      "I know how expiry and pruning differ.",
      "I can manage fixed-size windows with indexes.",
      "I can tell when monotonic queue is worth the complexity.",
    ],
  },
  "intervals-sweep": {
    coreIdea: "Intervals and sweep-line problems become easier once you sort boundary events and reason about what changes when a segment starts or ends.",
    whyItMatters: "These problems show up anywhere time ranges, reservations, overlaps, or capacity planning matter.",
    mentalModel: [
      "Each interval contributes start and end events.",
      "Sorting events turns many pairwise-overlap problems into one scan.",
      "The current active count or current merged range is the key state.",
    ],
    workflow: [
      "Choose whether you are merging ranges, counting overlaps, or tracking active load.",
      "Normalize interval boundaries and event ordering.",
      "Sort once, then scan while maintaining active state.",
      "Be explicit about inclusive versus exclusive endpoints.",
    ],
    commonPitfalls: [
      "Mishandling touching intervals like [1,3] and [3,5].",
      "Using the wrong event tie-break order.",
      "Forgetting to flush the final merged interval.",
      "Confusing overlap counting with merging behavior.",
    ],
    studyChecklist: [
      "I can define what happens at a start event and an end event.",
      "I know the boundary rules for touching intervals.",
      "I can choose between merge, overlap count, and sweep.",
      "I can explain why sorting is the unlock here.",
    ],
  },
  "linked-list": {
    coreIdea: "Linked lists are about pointer relationships, so the skill is not indexing but carefully preserving and rewiring next/prev references.",
    whyItMatters: "They sharpen pointer reasoning that later helps with trees, graphs, caches, and mutation-heavy data structures.",
    mentalModel: [
      "Each node knows its neighbors, not its position.",
      "Most bugs come from losing a reference you still need.",
      "Slow/fast pointers are really relationship trackers, not just movement speeds.",
    ],
    workflow: [
      "Draw the nodes and arrows before coding a mutation.",
      "Store temporary pointers before rewiring.",
      "Use dummy nodes when head changes would otherwise create special cases.",
      "Test empty, one-node, and two-node cases explicitly.",
    ],
    commonPitfalls: [
      "Losing the rest of the list during rewiring.",
      "Skipping dummy nodes and creating brittle head logic.",
      "Off-by-one mistakes when advancing pointers.",
      "Confusing node identity with node value.",
    ],
    studyChecklist: [
      "I can reverse or splice a list without losing nodes.",
      "I know when a dummy head simplifies the code.",
      "I can explain slow/fast pointer invariants.",
      "I can trace pointer changes step by step.",
    ],
  },
  "trees-dfs-bfs": {
    coreIdea: "Tree traversal is about choosing the right visit order to gather or propagate information through a hierarchy.",
    whyItMatters: "It is the bridge from linear structures to branching structures and prepares you for graph traversal and recursive state design.",
    mentalModel: [
      "DFS explores depth first and is great for recursive state passing.",
      "BFS explores level by level and is great for shortest unweighted paths or level grouping.",
      "Every recursive call should have a clear contract: what it returns or what state it updates.",
    ],
    workflow: [
      "Decide whether the question is about depth, breadth, path state, or subtree aggregation.",
      "Choose recursive DFS, iterative DFS, or BFS with a queue.",
      "Define the return value or side effect of each visit.",
      "Test leaf nodes, null nodes, and skewed trees.",
    ],
    commonPitfalls: [
      "Writing recursion without a clear return contract.",
      "Mixing preorder, inorder, and postorder unintentionally.",
      "Forgetting null-base cases.",
      "Using BFS when path-local recursion is simpler, or vice versa.",
    ],
    studyChecklist: [
      "I can choose DFS or BFS based on the problem shape.",
      "I can state what each recursive call means.",
      "I can manage path state without leaking it across branches.",
      "I can reason about time and space from tree height and width.",
    ],
  },
  "bst-patterns": {
    coreIdea: "BST problems leverage ordering inside the tree, so the tree structure itself acts like a sorted search space.",
    whyItMatters: "They connect tree traversal to binary-search thinking and make nearest, kth, and range queries far more efficient.",
    mentalModel: [
      "Left subtree values are smaller; right subtree values are larger.",
      "Inorder traversal reveals sorted order.",
      "You can often prune whole subtrees using value comparisons.",
    ],
    workflow: [
      "Ask whether you need exact lookup, range filtering, nearest value, or ordered traversal.",
      "Use BST ordering to prune branches aggressively.",
      "Switch to inorder when the problem is really about sorted order.",
      "Test skewed trees and missing-target scenarios.",
    ],
    commonPitfalls: [
      "Ignoring the BST property and traversing everything.",
      "Confusing generic tree logic with BST-specific pruning.",
      "Forgetting duplicates policy if the problem includes them.",
      "Overcomplicating kth-smallest style problems.",
    ],
    studyChecklist: [
      "I can use ordering to skip irrelevant branches.",
      "I know when inorder traversal gives the answer directly.",
      "I can connect BST search to binary-search intuition.",
      "I can explain how pruning improves efficiency.",
    ],
  },
  "heap-priority": {
    coreIdea: "A heap keeps the best next candidate accessible at all times without fully sorting everything.",
    whyItMatters: "It is the standard tool for top-k, scheduling, repeated best-choice extraction, and many graph algorithms.",
    mentalModel: [
      "A heap is not a sorted list; it only guarantees the top item.",
      "Use it when you repeatedly need the smallest or largest next item.",
      "The priority rule is the heart of the solution.",
    ],
    workflow: [
      "Define what 'best next candidate' means.",
      "Choose min-heap or max-heap.",
      "Push candidates as they become available and pop when you need the next result.",
      "Track whether stale entries are possible and how to ignore them.",
    ],
    commonPitfalls: [
      "Assuming the whole heap is sorted.",
      "Using a heap when one final sort would be simpler.",
      "Forgetting stale entries in multi-update scenarios.",
      "Defining the wrong priority key.",
    ],
    studyChecklist: [
      "I know when repeated extraction justifies a heap.",
      "I can define the priority clearly.",
      "I understand why heap order is partial, not total.",
      "I can compare heap use versus sorting once.",
    ],
  },
  "greedy": {
    coreIdea: "Greedy algorithms make the best local choice at each step, but they only work when you can justify that local choice leads to a global optimum.",
    whyItMatters: "They force you to think in proofs and exchange arguments instead of just coding an intuitive shortcut.",
    mentalModel: [
      "A greedy choice must be safe, not just appealing.",
      "Sorting often exposes the right local decision order.",
      "If you cannot explain why a local choice is always safe, the problem may need DP or search instead.",
    ],
    workflow: [
      "State the local rule in one sentence.",
      "Look for a proof idea: exchange argument, earliest finish, smallest cost first, and so on.",
      "Sort or structure the data to make that rule executable.",
      "Test counterexamples aggressively.",
    ],
    commonPitfalls: [
      "Confusing a heuristic with a proof-backed greedy rule.",
      "Skipping counterexample testing.",
      "Using greedy when future dependencies matter too much.",
      "Not noticing that sorting order defines the algorithm.",
    ],
    studyChecklist: [
      "I can defend the greedy choice, not just describe it.",
      "I know what sorted order the algorithm relies on.",
      "I can find counterexamples to weak greedy ideas.",
      "I can tell when DP is safer than greedy.",
    ],
  },
  "backtracking": {
    coreIdea: "Backtracking explores a decision tree systematically, building partial solutions and undoing choices when they cannot lead to a valid answer.",
    whyItMatters: "It is the core pattern for combinatorial search, constraint generation, and recursive exploration problems.",
    mentalModel: [
      "Each recursive call represents a partial decision state.",
      "Choose, recurse, undo is the heartbeat of the pattern.",
      "Pruning is what makes brute force intelligent instead of naive.",
    ],
    workflow: [
      "Define the state of a partial solution.",
      "List the next available choices from that state.",
      "Recurse after making a choice, then undo the mutation cleanly.",
      "Add pruning rules as soon as a branch becomes impossible or dominated.",
    ],
    commonPitfalls: [
      "Mutating shared state without undoing it correctly.",
      "Missing a base case or completion condition.",
      "Generating duplicates because the choice ordering is not controlled.",
      "Ignoring pruning opportunities and timing out.",
    ],
    studyChecklist: [
      "I can explain what one recursive level means.",
      "I can implement choose, recurse, undo cleanly.",
      "I know how to avoid duplicate combinations or permutations.",
      "I can add pruning conditions intentionally.",
    ],
  },
  "dynamic-programming": {
    coreIdea: "Dynamic programming solves overlapping subproblems by storing results for states so the same work is not recomputed.",
    whyItMatters: "It is the main upgrade from brute-force recursion to efficient state-based reasoning.",
    mentalModel: [
      "A DP state is a compressed summary of everything the future needs to know.",
      "Transitions describe how one state leads to the next.",
      "Memoization and tabulation are two ways to evaluate the same state graph.",
    ],
    workflow: [
      "Start from the brute-force recurrence if possible.",
      "Define the minimal state that makes the recurrence valid.",
      "Write the transition and base cases clearly.",
      "Choose top-down memoization or bottom-up tabulation based on clarity.",
    ],
    commonPitfalls: [
      "Choosing a state that is too large or missing required information.",
      "Writing transitions before the state is well defined.",
      "Mixing up answer extraction with table filling.",
      "Skipping base cases or invalid-state handling.",
    ],
    studyChecklist: [
      "I can define the state in one sentence.",
      "I can derive the transition from a smaller subproblem.",
      "I know the base cases and final answer location.",
      "I can compare memoization and tabulation for the same problem.",
    ],
  },
  "graph-traversal": {
    coreIdea: "Graph traversal is about exploring connectivity while preventing repeated work in cyclic or disconnected structures.",
    whyItMatters: "Real systems are often graphs: dependencies, permissions, routes, services, and networks all use traversal thinking.",
    mentalModel: [
      "Nodes are entities; edges are allowed moves or relationships.",
      "Visited state is what prevents infinite loops and redundant work.",
      "BFS is good for shortest unweighted reachability; DFS is good for deep structural exploration.",
    ],
    workflow: [
      "Pick a representation such as adjacency list.",
      "Define what visiting a node means and when it should be marked visited.",
      "Run BFS or DFS over one component, then loop over all nodes if the graph may be disconnected.",
      "Test cycles, isolated nodes, and multiple components.",
    ],
    commonPitfalls: [
      "Forgetting visited tracking in cyclic graphs.",
      "Using tree intuition in a graph with back-edges.",
      "Assuming the graph is connected.",
      "Marking visited at the wrong time and duplicating work.",
    ],
    studyChecklist: [
      "I can model a problem as nodes and edges.",
      "I know when BFS or DFS is the better traversal.",
      "I can handle disconnected graphs.",
      "I can explain where visited state is updated and why.",
    ],
  },
  "topological-sort": {
    coreIdea: "Topological sort finds a valid order for tasks with dependencies, but only when the dependency graph is a DAG.",
    whyItMatters: "It maps directly to build pipelines, job orchestration, prerequisite planning, and dependency resolution.",
    mentalModel: [
      "An edge means one task must happen before another.",
      "Indegree counts unresolved prerequisites.",
      "If you cannot process all nodes, a cycle blocked the ordering.",
    ],
    workflow: [
      "Build the graph and indegree counts.",
      "Start with all zero-indegree nodes.",
      "Process nodes, decrement indegrees of dependents, and enqueue newly unlocked nodes.",
      "Compare processed count to total node count to detect cycles.",
    ],
    commonPitfalls: [
      "Forgetting cycle detection.",
      "Reversing the edge direction.",
      "Not updating indegree correctly.",
      "Assuming there is only one valid topological order.",
    ],
    studyChecklist: [
      "I can explain what indegree means.",
      "I know why zero-indegree nodes are safe to process.",
      "I can detect cycles from incomplete processing.",
      "I can model prerequisite systems as DAGs.",
    ],
  },
  "union-find": {
    coreIdea: "Union-Find tracks which items belong to the same connected component as relationships are added over time.",
    whyItMatters: "It is one of the fastest ways to answer repeated connectivity questions in merge-heavy scenarios.",
    mentalModel: [
      "Each component has a representative root.",
      "Find asks who your root is; union merges two roots.",
      "Path compression and union by rank keep the trees shallow.",
    ],
    workflow: [
      "Initialize each item as its own parent.",
      "Use find to get representatives before deciding connectivity or merging.",
      "Union roots, not raw nodes.",
      "Add path compression to make repeated operations fast.",
    ],
    commonPitfalls: [
      "Unioning non-root nodes incorrectly.",
      "Forgetting path compression or rank heuristics in larger cases.",
      "Using DSU when you actually need full path output, not just connectivity.",
      "Not mapping arbitrary labels to indexes first when needed.",
    ],
    studyChecklist: [
      "I can explain what a representative root means.",
      "I know why path compression helps.",
      "I can detect cycles or connected groups with DSU.",
      "I can tell when DSU is better than repeated graph traversals.",
    ],
  },
  dijkstra: {
    coreIdea: "Dijkstra repeatedly expands the currently cheapest known path, using a priority queue to grow shortest distances outward.",
    whyItMatters: "It is the standard shortest-path tool for weighted graphs with non-negative edges.",
    mentalModel: [
      "The heap always offers the next most promising frontier state.",
      "Relaxing an edge means checking whether going through the current node improves a neighbor's best known distance.",
      "Once the minimum-distance node is finalized, its shortest distance is settled under non-negative weights.",
    ],
    workflow: [
      "Model the graph and initialize distances to infinity except the start node.",
      "Pop the smallest-distance frontier from the heap.",
      "Relax outgoing edges and push improved distances.",
      "Ignore stale heap entries whose distance is no longer current.",
    ],
    commonPitfalls: [
      "Using Dijkstra with negative edges.",
      "Forgetting stale-entry checks in the heap.",
      "Not defining the graph representation clearly.",
      "Confusing BFS shortest path with weighted shortest path.",
    ],
    studyChecklist: [
      "I can explain why the heap order matters.",
      "I know what edge relaxation means.",
      "I can distinguish weighted from unweighted shortest path problems.",
      "I can manage stale heap entries safely.",
    ],
  },
  "advanced-graphs": {
    coreIdea: "Advanced graph and flow problems combine multiple graph ideas at once, such as capacity, ordering, connectivity, and optimization under constraints.",
    whyItMatters: "These are capstone-style topics that train you to model systems precisely before choosing an algorithm.",
    mentalModel: [
      "The hard part is usually the model, not the code.",
      "Edges may carry weights, capacities, directions, and constraints simultaneously.",
      "You often solve them by reducing to a known subpattern such as traversal, shortest path, matching, or flow.",
    ],
    workflow: [
      "Write down what nodes and edges represent in the real problem.",
      "List all constraints explicitly: capacity, direction, cost, cycles, or ordering.",
      "Reduce the problem to the closest known graph primitive first.",
      "Validate the model on a tiny hand-drawn example before implementing.",
    ],
    commonPitfalls: [
      "Jumping into code without a graph model.",
      "Combining constraints mentally instead of writing them down.",
      "Using an advanced algorithm when a simpler reduction would work.",
      "Not checking the assumptions required by the chosen algorithm.",
    ],
    studyChecklist: [
      "I can model a real system as a graph before coding.",
      "I know which simpler subpattern my solution depends on.",
      "I can state the assumptions behind the algorithm I choose.",
      "I can test the model on a very small example first.",
    ],
  },
}

export function getPatternFundamentals(patternId: string) {
  return patternFundamentalsById[patternId] ?? null
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
