"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line } from "@react-three/drei"
import { useRef, useState, useMemo, useEffect } from "react"
import * as THREE from "three"

export type TraversalAlgorithm = "bfs" | "dfs-preorder" | "dfs-inorder" | "dfs-postorder"

type NodeTraversalStatus = "idle" | "visiting" | "visited" | "queued"

interface TreeNode {
  id: number
  value: number
  x: number
  y: number
  z: number
  children: number[]
  left: number | null
  right: number | null
  parent: number | null
  depth: number
}

function buildTree(): TreeNode[] {
  const nodes: TreeNode[] = []
  const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65]

  function addNode(value: number, depth: number, position: number, parentId: number | null, idx: number) {
    const spread = 4 / Math.pow(2, depth)
    nodes.push({ id: idx, value, x: position * spread, y: depth * -1.4, z: 0, children: [], left: null, right: null, parent: parentId, depth })
  }

  addNode(values[0], 0, 0, null, 0)
  addNode(values[1], 1, -1, 0, 1)
  addNode(values[2], 1, 1, 0, 2)
  addNode(values[3], 2, -1.5, 1, 3)
  addNode(values[4], 2, -0.5, 1, 4)
  addNode(values[5], 2, 0.5, 2, 5)
  addNode(values[6], 2, 1.5, 2, 6)
  addNode(values[7], 3, -1.75, 3, 7)
  addNode(values[8], 3, -1.25, 3, 8)
  addNode(values[9], 3, -0.75, 4, 9)
  addNode(values[10], 3, -0.25, 4, 10)
  addNode(values[11], 3, 0.25, 5, 11)
  addNode(values[12], 3, 0.75, 5, 12)

  nodes[0].children = [1, 2]; nodes[0].left = 1; nodes[0].right = 2
  nodes[1].children = [3, 4]; nodes[1].left = 3; nodes[1].right = 4
  nodes[2].children = [5, 6]; nodes[2].left = 5; nodes[2].right = 6
  nodes[3].children = [7, 8]; nodes[3].left = 7; nodes[3].right = 8
  nodes[4].children = [9, 10]; nodes[4].left = 9; nodes[4].right = 10
  nodes[5].children = [11, 12]; nodes[5].left = 11; nodes[5].right = 12

  return nodes
}

function bfsOrder(tree: TreeNode[]): number[] {
  const order: number[] = []
  const queue = [0]
  while (queue.length > 0) {
    const id = queue.shift()!
    order.push(id)
    tree[id].children.forEach((c) => queue.push(c))
  }
  return order
}

function dfsPreOrder(tree: TreeNode[]): number[] {
  const order: number[] = []
  function visit(id: number) {
    order.push(id)
    tree[id].children.forEach(visit)
  }
  visit(0)
  return order
}

function dfsInOrder(tree: TreeNode[]): number[] {
  const order: number[] = []
  function visit(id: number) {
    const node = tree[id]
    if (node.left !== null) visit(node.left)
    order.push(id)
    if (node.right !== null) visit(node.right)
  }
  visit(0)
  return order
}

function dfsPostOrder(tree: TreeNode[]): number[] {
  const order: number[] = []
  function visit(id: number) {
    const node = tree[id]
    if (node.left !== null) visit(node.left)
    if (node.right !== null) visit(node.right)
    order.push(id)
  }
  visit(0)
  return order
}

const traversalGenerators: Record<TraversalAlgorithm, (t: TreeNode[]) => number[]> = {
  bfs: bfsOrder,
  "dfs-preorder": dfsPreOrder,
  "dfs-inorder": dfsInOrder,
  "dfs-postorder": dfsPostOrder,
}

const traversalMeta: Record<TraversalAlgorithm, { label: string; description: string }> = {
  bfs: { label: "BFS (Level Order)", description: "BFS uses a queue — visits all nodes at depth d before depth d+1. Level by level." },
  "dfs-preorder": { label: "DFS Pre-Order", description: "Pre-order visits the node first, then left subtree, then right subtree. Root → Left → Right." },
  "dfs-inorder": { label: "DFS In-Order", description: "In-order visits left subtree, then the node, then right subtree. Produces sorted output for BSTs." },
  "dfs-postorder": { label: "DFS Post-Order", description: "Post-order visits left subtree, right subtree, then the node. Used for deletion and expression trees." },
}

function NodeSphere({ node, status, onHover }: Readonly<{ node: TreeNode; status: NodeTraversalStatus; onHover: (id: number | null) => void }>) {
  const meshRef = useRef<THREE.Mesh>(null)
  const baseColor = useMemo(() => {
    switch (status) {
      case "visiting": return new THREE.Color("#fbbf24")
      case "visited": return new THREE.Color("#34d399")
      case "queued": return new THREE.Color("#60a5fa")
      default: return new THREE.Color("#6366f1")
    }
  }, [status])
  const targetScale = status === "visiting" ? 1.3 : 1

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
  })

  return (
    <group position={[node.x, node.y, node.z]}>
      <mesh ref={meshRef} onPointerOver={() => onHover(node.id)} onPointerOut={() => onHover(null)}>
        <sphereGeometry args={[0.3, 16, 16]} />{/* NOSONAR - react-three-fiber intrinsic prop */}
        <meshStandardMaterial color={baseColor} roughness={0.3} metalness={0.6} />
      </mesh>
      <Text position={[0, 0, 0.35]} fontSize={0.2} color="white" anchorX="center" anchorY="middle" font={undefined}>{/* NOSONAR - react-three-fiber intrinsic prop */}
        {String(node.value)}
      </Text>
    </group>
  )
}

function TreeEdges({ tree }: Readonly<{ tree: TreeNode[] }>) {
  const edges = useMemo(() => {
    const result: [THREE.Vector3, THREE.Vector3][] = []
    tree.forEach((node) => {
      node.children.forEach((childId) => {
        const child = tree[childId]
        result.push([new THREE.Vector3(node.x, node.y, node.z), new THREE.Vector3(child.x, child.y, child.z)])
      })
    })
    return result
  }, [tree])

  return (
    <>
      {edges.map((points, i) => (
        <Line key={i} points={points} color="#475569" lineWidth={1.5} opacity={0.6} transparent />
      ))}
    </>
  )
}

type SceneProps = Readonly<{
  tree: TreeNode[]
  nodeStatuses: Map<number, NodeTraversalStatus>
  onHover: (id: number | null) => void
}>

function Scene({ tree, nodeStatuses, onHover }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />{/* NOSONAR - react-three-fiber intrinsic props */}
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#818cf8" />{/* NOSONAR - react-three-fiber intrinsic props */}
      <TreeEdges tree={tree} />
      {tree.map((node) => (
        <NodeSphere key={node.id} node={node} status={nodeStatuses.get(node.id) || "idle"} onHover={onHover} />
      ))}
      <OrbitControls enableZoom minDistance={3} maxDistance={12} autoRotate autoRotateSpeed={0.3} />
    </>
  )
}

export default function ThreeDemo({ algorithm = "bfs" }: Readonly<{ algorithm?: TraversalAlgorithm }>) {
  const tree = useMemo(() => buildTree(), [])
  const meta = traversalMeta[algorithm]
  const [visitIndex, setVisitIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const order = useMemo(() => traversalGenerators[algorithm](tree), [algorithm, tree])

  useEffect(() => {
    setIsPlaying(false)
    setVisitIndex(-1)
  }, [algorithm])

  const nodeStatuses = useMemo(() => {
    const map = new Map<number, NodeTraversalStatus>()
    tree.forEach((n) => map.set(n.id, "idle"))
    if (visitIndex >= 0) {
      for (let i = 0; i <= visitIndex && i < order.length; i++) {
        map.set(order[i], i === visitIndex ? "visiting" : "visited")
      }
      if (algorithm === "bfs" && visitIndex < order.length) {
        const currentId = order[visitIndex]
        tree[currentId].children.forEach((c) => {
          if (map.get(c) === "idle") map.set(c, "queued")
        })
      }
    }
    return map
  }, [visitIndex, order, tree, algorithm])

  useEffect(() => {
    if (!isPlaying) return
    if (visitIndex >= order.length - 1) { setIsPlaying(false); return }
    timerRef.current = setTimeout(() => setVisitIndex((prev) => prev + 1), 700)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isPlaying, visitIndex, order.length])

  function reset() { setIsPlaying(false); setVisitIndex(-1) }
  function stepForward() { if (visitIndex < order.length - 1) setVisitIndex((prev) => prev + 1) }

  const currentNode = visitIndex >= 0 ? tree[order[visitIndex]] : null
  const isDone = visitIndex >= order.length - 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{meta.label} Visualizer</h3>
          <p className="text-xs text-blue-300/70 mt-0.5">Watch the visit order on the tree</p>
        </div>
      </div>

      <div className="h-[300px] rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
        <Canvas camera={{ position: [0, -1.5, 7], fov: 50 }}>
          <Scene tree={tree} nodeStatuses={nodeStatuses} onHover={setHoveredNode} />
        </Canvas>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button onClick={reset} className="px-3 py-1.5 text-xs font-medium bg-slate-700 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-600 transition-colors">Reset</button>
        <button onClick={stepForward} disabled={isPlaying || isDone} className="px-3 py-1.5 text-xs font-medium bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors disabled:opacity-40">Step</button>
        <button onClick={() => {
          if (visitIndex < 0) {
            setVisitIndex(0)
          }
          setIsPlaying((p) => !p)
        }} disabled={isDone} className="px-4 py-1.5 text-xs font-medium bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors disabled:opacity-40">
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className="flex gap-3 text-[10px] justify-center">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Idle</span>
        {algorithm === "bfs" && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Queued</span>}
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Visiting</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Visited</span>
      </div>

      <div className="min-h-[56px] bg-slate-800/60 border border-slate-700 rounded-xl p-3">
        {currentNode ? (
          <div className="flex items-start gap-3">
            <span className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-amber-400" />
            <div>
              <p className="text-sm text-gray-200">
                {isDone ? `Traversal complete! Visited all ${order.length} nodes.` : `Visiting node ${currentNode.value} (depth ${currentNode.depth})`}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                {meta.label} order: {order.slice(0, visitIndex + 1).map((id) => tree[id].value).join(" → ")}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">{meta.description}</p>
        )}
      </div>
    </div>
  )
}
