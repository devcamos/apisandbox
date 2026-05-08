import type { ShinobiAttributeId } from "./shinobi-progress"

export interface ShinobiQuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  /** Primary attribute this question trains / rewards */
  attribute: ShinobiAttributeId
  explanation: string
}

export const shinobiQuizQuestions: ShinobiQuizQuestion[] = [
  {
    id: "q1",
    prompt: "You must find a value in an unsorted array. Which constraint makes binary search unsafe without preprocessing?",
    options: [
      "The array must be sorted for binary search to discard half the range correctly",
      "The array must use 0-based indexing",
      "The array length must be a power of two",
    ],
    correctIndex: 0,
    attribute: "accuracy",
    explanation: "Binary search relies on order. Unsorted data can hide the target in the discarded half.",
  },
  {
    id: "q2",
    prompt: "Merge sort’s typical time complexity in the worst case is:",
    options: ["O(n²)", "O(n log n)", "O(log n)"],
    correctIndex: 1,
    attribute: "thinking",
    explanation: "Divide, recurse, merge — each level is O(n) work over O(log n) levels.",
  },
  {
    id: "q3",
    prompt: "When comparisons are expensive (e.g. disk seeks), which search minimizes comparison count on sorted data?",
    options: ["Linear search", "Jump search with tiny blocks", "Binary search"],
    correctIndex: 2,
    attribute: "speed",
    explanation: "Binary search is O(log n) comparisons — critical when each comparison costs I/O.",
  },
  {
    id: "q4",
    prompt: "DFS post-order is often used when:",
    options: [
      "You need the shortest path in an unweighted graph",
      "You must process children before the parent (e.g. subtree sums, deletion)",
      "You want level-by-level order",
    ],
    correctIndex: 1,
    attribute: "transfer",
    explanation: "Post-order visits subtrees before the node — natural for bottom-up aggregation.",
  },
  {
    id: "q5",
    prompt: "Under interview pressure, the safest first step when the problem is vague is:",
    options: [
      "Code the first idea that comes to mind",
      "Restate inputs, outputs, and an example — clarify constraints",
      "Memorize a template and force-fit it",
    ],
    correctIndex: 1,
    attribute: "confidence",
    explanation: "Structured restatement reduces panic and surfaces edge cases before coding.",
  },
  {
    id: "q6",
    prompt: "Quick sort’s worst case O(n²) often comes from:",
    options: [
      "Using too much extra memory",
      "Bad pivot choices on structured/already sorted input",
      "Using recursion instead of iteration",
    ],
    correctIndex: 1,
    attribute: "accuracy",
    explanation: "Skewed partitions (e.g. always picking min/max as pivot) yield linear depth.",
  },
  {
    id: "q7",
    prompt: "Which pattern transfers from ‘binary search on array’ to ‘search space on answer’ (e.g. minimum capacity)?",
    options: [
      "Greedy packing only",
      "Monotonic predicate — false then true — binary search on the answer",
      "Breadth-first search on a graph",
    ],
    correctIndex: 1,
    attribute: "transfer",
    explanation: "Same halving logic; the ‘array’ is an implicit range of candidate answers.",
  },
  {
    id: "q8",
    prompt: "Insertion sort is especially attractive when:",
    options: [
      "n is huge and data is random",
      "n is small or data is nearly sorted",
      "You must sort a linked list with O(1) extra space only",
    ],
    correctIndex: 1,
    attribute: "thinking",
    explanation: "Nearly sorted → few shifts; small n → low constant overhead beats fancy sorts.",
  },
  {
    id: "q9",
    prompt: "BFS (not DFS) gives shortest path in:",
    options: [
      "Any weighted graph",
      "Unweighted graphs (unit edge cost)",
      "Only trees",
    ],
    correctIndex: 1,
    attribute: "speed",
    explanation: "Layer-by-layer explores increasing distance; weighted graphs need Dijkstra etc.",
  },
  {
    id: "q10",
    prompt: "A stable sort preserves:",
    options: [
      "O(n log n) worst-case time",
      "Relative order of equal keys",
      "Minimum memory usage",
    ],
    correctIndex: 1,
    attribute: "accuracy",
    explanation: "Stability matters for multi-key sorts and deterministic pipelines.",
  },
  {
    id: "q11",
    prompt: "Jump search’s block size √n balances:",
    options: [
      "Jump phase vs linear scan inside a block",
      "Left vs right child in a tree",
      "Best vs worst case of hash tables",
    ],
    correctIndex: 0,
    attribute: "thinking",
    explanation: "Too small → many jumps; too large → long linear tail — √n is the classic trade-off.",
  },
  {
    id: "q12",
    prompt: "When you freeze because the problem feels new, the best move is:",
    options: [
      "Silently guess the algorithm class",
      "Name what you know: input size, order, access pattern — then pick a family",
      "Skip to implementation to save time",
    ],
    correctIndex: 1,
    attribute: "confidence",
    explanation: "Naming constraints turns panic into a checklist — same skill as the decision checklist.",
  },
]

export const XP_PER_CORRECT_QUIZ = 12
