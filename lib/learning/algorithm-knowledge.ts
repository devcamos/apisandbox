/**
 * Algorithm as a knowledge object — not a code dump.
 * Each entry answers: what, family, problem, constraints, trade-offs, complexity, when to use, mistakes.
 */

export type HaloDifficulty = "Easy" | "Normal" | "Heroic" | "Legendary"

export type Phase6CategoryId = "sorting" | "searching" | "graph-tree"

export interface TimeComplexity {
  best: string
  average: string
  worst: string
}

export interface ConstraintBadge {
  label: string
  met: boolean
}

export interface RealWorldMapping {
  system: string
  explanation: string
}

export interface Variation {
  name: string
  description: string
  difficulty: HaloDifficulty
}

export interface CommonMistake {
  mistake: string
  instead: string
}

/**
 * Full knowledge record for one algorithm (Phase 6 visualizer).
 */
export interface AlgorithmKnowledge {
  id: string
  categoryId: Phase6CategoryId
  name: string
  /** Short line for cards and headers */
  summary: string
  /** Algorithm family / pattern bucket */
  family: string
  /** What is this algorithm? (definition) */
  definition: string
  /** What problem does it solve? */
  problem: string
  /** Preconditions that must hold for correctness */
  constraintsMustHold: string[]
  /** Trade-offs this design makes vs alternatives */
  tradeoffs: string[]
  complexity: TimeComplexity
  difficulty: HaloDifficulty
  /** When should I use it? */
  whenToUse: string[]
  /** Common mistakes and what to do instead */
  commonMistakes: CommonMistake[]
  /** Optional badge row (e.g. searching module) */
  constraintBadges?: ConstraintBadge[]
  realWorld?: RealWorldMapping[]
  variations?: Variation[]
}

export const algorithmKnowledgeCatalog: AlgorithmKnowledge[] = [
  // --- Sorting ---
  {
    id: "bubble",
    categoryId: "sorting",
    name: "Bubble Sort",
    family: "Comparison sorts · simple exchange",
    summary: "Repeatedly swap adjacent out-of-order pairs until the array is sorted.",
    definition:
      "Bubble sort performs passes over the array. In each pass it compares each adjacent pair and swaps if they are in the wrong order. Larger values “bubble” toward the end. It stops early if a full pass makes no swaps (optional optimization).",
    problem: "Put elements in non-decreasing (or non-increasing) order using only pairwise swaps of neighbors.",
    constraintsMustHold: [
      "Elements must be comparable (total order or consistent comparator).",
      "Random access or at least forward iteration with swap capability.",
    ],
    tradeoffs: [
      "Extremely simple to implement and reason about — good for teaching and tiny inputs.",
      "Time is typically Θ(n²); poor scaling even when data is nearly sorted unless optimized with early exit.",
      "Many swaps; can be costly when swap is expensive (e.g. large records).",
    ],
    complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    difficulty: "Easy",
    whenToUse: [
      "Teaching and interviews explaining invariants.",
      "Nearly sorted tiny arrays with early-exit optimization.",
      "When code size matters more than performance (rare in production).",
    ],
    commonMistakes: [
      { mistake: "Using bubble sort on large production datasets.", instead: "Prefer O(n log n) sorts or insertion sort for small/nearly-sorted slices." },
      { mistake: "Forgetting that worst case is still quadratic without early exit on random data.", instead: "Measure or pick a sort with guaranteed n log n if n grows." },
    ],
    realWorld: [
      { system: "Spring JPA @OrderBy", explanation: "When Hibernate fetches a small @OneToMany collection with @OrderBy, the in-memory sort on tiny result sets behaves like a simple exchange sort." },
      { system: "Teaching comparators", explanation: "Bubble sort illustrates how Java's Comparator<T> contract works — compare, swap, repeat — before moving to Collections.sort()." },
    ],
  },
  {
    id: "selection",
    categoryId: "sorting",
    name: "Selection Sort",
    family: "Comparison sorts · selection",
    summary: "Each pass selects the minimum in the unsorted suffix and swaps it into place.",
    definition:
      "Selection sort divides the array into a sorted prefix and unsorted suffix. It finds the minimum element in the unsorted part and swaps it with the first unsorted position, growing the sorted region by one each time.",
    problem: "Sort in place with minimal number of swaps (at most n−1 swaps for n elements).",
    constraintsMustHold: ["Comparable elements.", "Random access for finding min index."],
    tradeoffs: [
      "Writes/swaps are O(n) — fewer than bubble sort in many cases.",
      "Still Θ(n²) comparisons; does not adapt to nearly sorted input like insertion sort.",
    ],
    complexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    difficulty: "Easy",
    whenToUse: [
      "When minimizing memory writes matters (e.g. flash with costly writes).",
      "Small n where simplicity beats asymptotics.",
    ],
    commonMistakes: [
      { mistake: "Assuming fewer swaps means faster wall-clock time.", instead: "Comparisons still dominate at Θ(n²); profile the actual bottleneck." },
    ],
    realWorld: [
      { system: "Minimum-write databases", explanation: "Selection sort's O(n) swaps mirrors how some storage engines minimise disk writes by selecting and placing final values." },
    ],
  },
  {
    id: "insertion",
    categoryId: "sorting",
    name: "Insertion Sort",
    family: "Comparison sorts · incremental",
    summary: "Builds a sorted prefix by inserting each next element into its correct position.",
    definition:
      "Insertion sort maintains a sorted prefix. For each new element, it scans backward (or binary-searches in variants) and shifts elements to make room, inserting the element in order.",
    problem: "Sort incrementally or favor nearly sorted data with low overhead and good cache behavior on small ranges.",
    constraintsMustHold: ["Comparable elements.", "Ability to shift or insert in the sequence."],
    tradeoffs: [
      "Excellent for small n and nearly sorted data — can approach O(n) best case.",
      "Worst and average Θ(n²) for random order; not for large arbitrary arrays alone.",
      "Stable by default (with typical implementation).",
    ],
    complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    difficulty: "Normal",
    whenToUse: [
      "Hybrid sorts (e.g. Timsort, introsort) use insertion on small subarrays.",
      "Online/streaming small batches.",
      "Linked lists where splicing is cheap.",
    ],
    commonMistakes: [
      { mistake: "Using plain insertion sort for large random arrays.", instead: "Use a hybrid or O(n log n) algorithm for big n." },
    ],
    realWorld: [
      { system: "Java Arrays.sort() (primitives)", explanation: "Dual-pivot quicksort in OpenJDK falls back to insertion sort for subarrays ≤ 47 elements — the exact pattern described here." },
      { system: "Spring Batch chunk processing", explanation: "Small batches of records arriving in near-sorted order benefit from insertion-like incremental processing." },
    ],
  },
  {
    id: "merge",
    categoryId: "sorting",
    name: "Merge Sort",
    family: "Divide and conquer · comparison sort",
    summary: "Recursively split, sort halves, merge sorted runs — stable n log n.",
    definition:
      "Merge sort divides the array in half until base cases, then merges two sorted halves with a linear-time merge using auxiliary space (or in-place variants with more complexity).",
    problem: "Guaranteed O(n log n) time in the worst case for comparison-based sorting, with predictable performance.",
    constraintsMustHold: [
      "Comparable elements.",
      "O(n) extra space for standard merge (unless using advanced in-place merge).",
    ],
    tradeoffs: [
      "Worst-case O(n log n) and stable merges are ideal for linked lists and external sort.",
      "Extra memory for the merge buffer; not in-place by default.",
      "Recursive overhead; often combined with insertion sort on small subarrays.",
    ],
    complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    difficulty: "Heroic",
    whenToUse: [
      "Stability required with guaranteed n log n.",
      "External sorting and parallel merge pipelines.",
      "When worst-case predictability matters more than constant factors.",
    ],
    commonMistakes: [
      { mistake: "Ignoring O(n) space in memory-constrained environments.", instead: "Consider quicksort, heapsort, or in-place merge techniques if space is tight." },
    ],
    realWorld: [
      { system: "Java Collections.sort() (objects)", explanation: "TimSort (used by Arrays.sort for objects) is a merge sort variant — stable, guaranteed O(n log n), exploiting existing runs in the data." },
      { system: "Spring Data JPA Pageable", explanation: "When the database returns pre-sorted pages, merging those pages client-side to build a full sorted view mirrors the merge step." },
      { system: "Kafka Streams merge joins", explanation: "Merging two sorted changelog topics in Kafka Streams uses the same ordered-merge principle." },
    ],
  },
  {
    id: "quick",
    categoryId: "sorting",
    name: "Quick Sort",
    family: "Divide and conquer · partition",
    summary: "Partition around a pivot, recurse on subarrays — fast average, bad pivot worst case.",
    definition:
      "Quick sort picks a pivot, partitions elements into less-than, equal, and greater (or two-way partition), then recursively sorts subarrays. Randomized pivot or median-of-three reduces bad splits.",
    problem: "Sort in place with low constant factors and good cache performance on average.",
    constraintsMustHold: [
      "Comparable elements.",
      "Random access for partitioning.",
    ],
    tradeoffs: [
      "Average O(n log n) time, in-place, usually fastest general-purpose comparison sort in practice.",
      "Worst case O(n²) with bad pivots; not stable by default.",
    ],
    complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    difficulty: "Legendary",
    whenToUse: [
      "General-purpose in-memory sorting when stability is not required.",
      "Standard library sorts often use introsort (quicksort + fallback) for this reason.",
    ],
    commonMistakes: [
      { mistake: "Always picking first/last element as pivot on sorted input.", instead: "Randomize pivot or use median-of-three / introspection to avoid quadratic blowups." },
      { mistake: "Assuming quicksort is always faster than merge sort.", instead: "Merge sort wins on stability, linked lists, and guaranteed worst-case needs." },
    ],
    realWorld: [
      { system: "Java Arrays.sort() (primitives)", explanation: "OpenJDK uses dual-pivot quicksort for primitive arrays — the partition strategy that makes quicksort dominant in practice." },
      { system: "Spring Data Sort.by()", explanation: "When you pass Sort.by(\"price\") to a repository, the DB's query planner often uses a quicksort-family algorithm on non-indexed columns." },
      { system: "In-memory API response sorting", explanation: "Sorting a List<DTO> with Comparator.comparing() before returning from a @RestController — Java's sort is introsort (quicksort + fallback)." },
    ],
  },
  // --- Searching ---
  {
    id: "linear",
    categoryId: "searching",
    name: "Linear Search",
    family: "Sequential search",
    summary: "Scan from the start until a match or the end.",
    definition:
      "Linear search examines each element in order, comparing to the target until equality or exhaustion. It requires no ordering of the data.",
    problem: "Find whether a target exists (or its index) in a collection with no structural assumptions.",
    constraintsMustHold: [
      "Equality test (or predicate) definable on elements.",
      "Iterable/sequential access; random access optional.",
    ],
    tradeoffs: [
      "O(n) comparisons worst case; simplest correct approach when data is unsorted.",
      "Cannot skip regions without invariants — no logarithmic shortcut.",
    ],
    complexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    difficulty: "Easy",
    whenToUse: [
      "Unsorted or single-pass streams.",
      "Very small n where setup cost of sorting/binary search exceeds scan.",
      "Finding first match in order matters.",
    ],
    commonMistakes: [
      { mistake: "Running binary search on unsorted data.", instead: "Sort first (O(n log n) + log n) or use linear search." },
    ],
    constraintBadges: [
      { label: "Sorted data required", met: false },
      { label: "Random access required", met: false },
      { label: "Works on any data structure", met: true },
    ],
    realWorld: [
      { system: "Log scanning", explanation: "Grep-like tools scan log files line by line — unsorted, sequential, linear search." },
      { system: "Header parsing", explanation: "HTTP/email headers are scanned sequentially for a matching key." },
      { system: "Small collection filtering", explanation: "Arrays under ~100 elements where sort overhead isn't worth it." },
    ],
    variations: [
      { name: "Sentinel Linear Search", description: "Places the target at the end to eliminate the bounds check on every iteration.", difficulty: "Normal" },
      { name: "Linear Search with Early Exit", description: "On sorted data, stops as soon as the current element exceeds the target.", difficulty: "Normal" },
    ],
  },
  {
    id: "binary",
    categoryId: "searching",
    name: "Binary Search",
    family: "Divide search space · sorted / monotonic",
    summary: "Halve the valid index range each step using order.",
    definition:
      "Binary search maintains low and high bounds. It compares the middle element to the target (or evaluates a predicate) and discards half the range. Variants find boundaries, first/last occurrence, or answer on a monotonic predicate over integers.",
    problem: "Find an index or decision point in O(log n) when the search space is sorted or satisfies monotonicity.",
    constraintsMustHold: [
      "Array sorted by the comparison key, OR a monotonic predicate over a discrete range.",
      "Random access to middle elements in O(1) for classic array binary search.",
    ],
    tradeoffs: [
      "Minimal comparisons O(log n); huge win when comparisons are expensive.",
      "Easy to off-by-one bugs; duplicates need lower_bound/upper_bound patterns.",
    ],
    complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    difficulty: "Normal",
    whenToUse: [
      "Sorted static arrays, answer binary search on monotonic feasibility (minimize max, maximize min).",
      "First/last position in a sorted range with duplicates.",
    ],
    commonMistakes: [
      { mistake: "Using `mid = (low + high) / 2` in languages where overflow matters.", instead: "Use `low + (high - low) / 2`." },
      { mistake: "Stopping at first equality when you need first/last occurrence.", instead: "Continue narrowing left or right for boundary variants." },
      { mistake: "Binary search on unsorted data.", instead: "Sort first or use linear scan." },
    ],
    constraintBadges: [
      { label: "Sorted data required", met: true },
      { label: "Random access required", met: true },
      { label: "Monotonic predicate required", met: true },
    ],
    realWorld: [
      { system: "Database index lookup", explanation: "B-tree indexes use binary search at each node to locate keys in O(log n)." },
      { system: "Range scans", explanation: "Find lower/upper bounds in sorted indexes — the backbone of WHERE clauses." },
      { system: "Git bisect", explanation: "Binary search over commit history to find the commit that introduced a bug." },
    ],
    variations: [
      { name: "Lower Bound (First Occurrence)", description: "Modified binary search that continues narrowing left to find the first duplicate. Classic interview pattern.", difficulty: "Heroic" },
      { name: "Upper Bound (Last Occurrence)", description: "Continues narrowing right to find the last occurrence in a run of duplicates.", difficulty: "Heroic" },
      { name: "Search Space Binary Search", description: "Apply binary search over a monotonic condition (e.g., 'can we ship all packages in D days?'). The search space is answers, not array indices.", difficulty: "Legendary" },
    ],
  },
  {
    id: "jump",
    categoryId: "searching",
    name: "Jump Search",
    family: "Block + sequential refinement",
    summary: "Jump forward by √n steps on sorted data, then linear scan the block.",
    definition:
      "Jump search advances by fixed block steps (√n is standard) until the value at the jump position is ≥ target, then performs linear search between the previous block start and that position.",
    problem: "Find a target in sorted data with fewer comparisons than linear scan in some cost models, without full binary search machinery.",
    constraintsMustHold: [
      "Sorted array (or comparable order).",
      "Random access for jumping.",
    ],
    tradeoffs: [
      "Θ(√n) comparisons in typical analysis; simpler than binary search in some educational contexts.",
      "Worse than binary search asymptotically; block size is a tunable trade-off.",
    ],
    complexity: { best: "O(1)", average: "O(√n)", worst: "O(√n)" },
    difficulty: "Heroic",
    whenToUse: [
      "Sorted data where jump is cheaper than arbitrary midpoint access (rare in RAM; more illustrative).",
      "Understanding block-based search before more advanced structures.",
    ],
    commonMistakes: [
      { mistake: "Using √n blindly when binary search is available with O(1) random access.", instead: "Prefer binary search for asymptotic optimality on arrays." },
      { mistake: "Wrong block size destroying balance between jump and scan phases.", instead: "Tune toward √n for classic jump search analysis." },
    ],
    constraintBadges: [
      { label: "Sorted data required", met: true },
      { label: "Random access preferred", met: true },
      { label: "Tunable block size (√n optimal)", met: true },
    ],
    realWorld: [
      { system: "Filesystem page scanning", explanation: "Disk pages can be jumped over in blocks, then scanned linearly within the target page." },
      { system: "Network packet batching", explanation: "Skip N packets, check boundary, backtrack and scan the block — useful when seek is cheaper than comparison." },
      { system: "Phonebook lookup", explanation: "Flip ahead by chunks of pages, then scan backwards — the physical-world analogy." },
    ],
    variations: [
      { name: "Block Size = 2", description: "Tiny jumps — almost linear scan but with overhead. Shows why block size matters.", difficulty: "Normal" },
      { name: "Block Size = √n (Optimal)", description: "Balances jump phase and linear scan. Total comparisons ≈ 2√n.", difficulty: "Heroic" },
      { name: "Block Size = n/2", description: "Only two jumps maximum, but linear scan can be huge. Shows the trade-off in reverse.", difficulty: "Normal" },
    ],
  },
  // --- Graph & tree ---
  {
    id: "bfs",
    categoryId: "graph-tree",
    name: "BFS (Level Order)",
    family: "Graph traversal · queue",
    summary: "Explore layer by layer using a FIFO queue.",
    definition:
      "Breadth-first search starts at a source, enqueues neighbors, dequeues in order, and visits each unvisited node. On trees it visits all nodes at depth d before depth d+1.",
    problem: "Shortest path in unweighted graphs, level-order processing, or shortest steps in implicit graphs.",
    constraintsMustHold: [
      "Graph representation allowing neighbor iteration (adjacency list/matrix).",
      "Memory for the queue — O(frontier) can be large.",
    ],
    tradeoffs: [
      "Finds shortest path in unweighted graphs.",
      "More memory than DFS for wide graphs; not ideal for deep narrow search without limits.",
    ],
    complexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    difficulty: "Normal",
    whenToUse: [
      "Unweighted shortest path, social degrees of separation, crawling by hop count.",
      "Level-order tree serialization and UI layout by depth.",
    ],
    commonMistakes: [
      { mistake: "Using BFS for weighted shortest path.", instead: "Use Dijkstra or BFS on 0–1 weights with deque (0-1 BFS)." },
      { mistake: "Forgetting to mark visited — infinite loops on graphs with cycles.", instead: "Mark nodes when enqueued or dequeued consistently." },
    ],
    realWorld: [
      { system: "Spring Bean dependency resolution", explanation: "The Spring IoC container resolves bean dependencies level by level — a BFS through the dependency graph to detect circular references." },
      { system: "Microservice health propagation", explanation: "Spring Cloud health checks fan out to dependencies breadth-first: check direct deps first, then their deps, to report aggregate status." },
      { system: "Kafka consumer group rebalancing", explanation: "Partition assignment across consumers explores the assignment graph layer by layer to achieve balanced distribution." },
    ],
  },
  {
    id: "dfs-preorder",
    categoryId: "graph-tree",
    name: "DFS Pre-Order",
    family: "Graph traversal · stack / recursion",
    summary: "Visit node, then recursively traverse subtrees (typical tree order: root-left-right).",
    definition:
      "Depth-first search explores as deep as possible before backtracking. Pre-order processes the current node before its children (for binary trees: node, left, right).",
    problem: "Copy tree structure, prefix expressions, or explore paths with limited memory vs BFS frontier.",
    constraintsMustHold: [
      "Graph/tree structure with defined children/adjacency.",
      "Cycle handling via visited set on general graphs.",
    ],
    tradeoffs: [
      "O(h) auxiliary space for recursion stack on trees (h = height).",
      "Does not yield shortest path in unweighted graphs.",
    ],
    complexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    difficulty: "Normal",
    whenToUse: [
      "Tree cloning, serialization orders, path enumeration when depth matters.",
      "When memory for BFS queue is prohibitive.",
    ],
    commonMistakes: [
      { mistake: "Stack overflow on very deep trees without iterative DFS or tail-call awareness.", instead: "Use explicit stack or increase stack where appropriate." },
    ],
    realWorld: [
      { system: "Spring component scanning", explanation: "Spring's @ComponentScan walks the package tree depth-first — enter a package, scan its classes, recurse into sub-packages before backtracking." },
      { system: "Jackson JSON serialisation", explanation: "Jackson serialises a nested POJO graph using pre-order DFS: write the current object's fields, then recurse into child objects." },
      { system: "Spring Security filter chain", explanation: "The FilterChainProxy processes filters in a depth-first pre-order — invoke current filter, then delegate deeper into the chain." },
    ],
  },
  {
    id: "dfs-inorder",
    categoryId: "graph-tree",
    name: "DFS In-Order",
    family: "Binary tree traversal",
    summary: "Left subtree, node, right subtree — sorted order for BSTs.",
    definition:
      "In-order traversal visits the left subtree, then the current node, then the right subtree. On a valid BST this yields keys in sorted order.",
    problem: "Enumerate BST keys in order, validate BST property, or solve problems needing sorted sequence from a tree.",
    constraintsMustHold: [
      "Typically binary trees with distinct left/right semantics.",
      "For sorted output, BST invariant must hold.",
    ],
    tradeoffs: [
      "O(n) time; no extra structure beyond recursion/stack.",
      "Only yields sorted order when BST property holds.",
    ],
    complexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    difficulty: "Heroic",
    whenToUse: [
      "BST sorted enumeration, kth smallest patterns.",
      "Building sorted list from BST.",
    ],
    commonMistakes: [
      { mistake: "Assuming in-order is sorted on any binary tree.", instead: "Verify BST property; arbitrary binary trees are not sorted in-order." },
    ],
    realWorld: [
      { system: "TreeMap iteration in Java", explanation: "Java's TreeMap (red-black BST) iterates keys in sorted order — this is an in-order traversal of the underlying tree." },
      { system: "Spring Data JPA sorted queries", explanation: "When JPA uses a B-tree index for ORDER BY, the database engine walks the index leaves in-order to return rows sorted." },
    ],
  },
  {
    id: "dfs-postorder",
    categoryId: "graph-tree",
    name: "DFS Post-Order",
    family: "Binary tree / subtree cleanup",
    summary: "Left, right, then node — children before parent.",
    definition:
      "Post-order visits left subtree, right subtree, then the current node. Useful when parent processing depends on children results.",
    problem: "Delete tree from leaves up, evaluate expression trees, compute subtree aggregates before the root.",
    constraintsMustHold: ["Binary or n-ary tree with defined children.", "Visited tracking on graphs with cycles."],
    tradeoffs: [
      "Natural order for bottom-up dynamic programming on trees.",
      "Later root visit means you must store child results or mutate carefully.",
    ],
    complexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    difficulty: "Legendary",
    whenToUse: [
      "Tree deletion, expression evaluation from leaves to root, subtree sum/product before parent.",
    ],
    commonMistakes: [
      { mistake: "Processing the root before children when subtree values are needed.", instead: "Use post-order or pass returns up from recursion." },
    ],
    realWorld: [
      { system: "Spring context shutdown", explanation: "ApplicationContext.close() destroys beans in post-order: child beans are destroyed before the parents that depend on them." },
      { system: "Maven dependency resolution", explanation: "Maven resolves transitive dependencies bottom-up — leaf dependencies are resolved before the modules that aggregate them." },
      { system: "JPA cascade delete", explanation: "CascadeType.REMOVE deletes child entities before the parent — a post-order traversal of the entity relationship tree." },
    ],
  },
]

export function getAlgorithmKnowledge(id: string): AlgorithmKnowledge | undefined {
  return algorithmKnowledgeCatalog.find((a) => a.id === id)
}
