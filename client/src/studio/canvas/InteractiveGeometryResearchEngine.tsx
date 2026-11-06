import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Move, Plus, Rotate3D, RotateCcw, Scaling, Trash2, X } from "lucide-react";
import { GeometryTransform, type TransformMode } from "./GeometryTransform";
import { GeometrySceneBounds } from "./GeometrySceneBounds";
import type { GeometryNode, Position3, Primitive } from "./sceneStorage";
import { useSavedScene } from "./useSavedScene";

const initialNodes: GeometryNode[] = [
  {
    id: "sphere",
    label: "Sphere",
    primitive: "sphere",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  {
    id: "circle",
    label: "Ring",
    primitive: "ring",
    position: [-3.4, 0.8, 0.5],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  {
    id: "radial",
    label: "Cone",
    primitive: "cone",
    position: [3.2, 1.1, -1.2],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  {
    id: "enclosure",
    label: "Cube",
    primitive: "cube",
    position: [-2.6, -1.5, -2.2],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
];

const primitiveNames: Record<Primitive, string> = {
  ring: "Ring",
  sphere: "Sphere",
  cone: "Cone",
  cube: "Cube",
};

const primitiveColors: Record<Primitive, string> = {
  sphere: "#c4b5fd",
  ring: "#67e8f9",
  cone: "#fbbf24",
  cube: "#86efac",
};

function supportsWebGL2() {
  try {
    const context = document.createElement("canvas").getContext("webgl2");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function GeometryMesh({
  node,
  selected,
  onSelect,
  onSelectedObject,
}: {
  node: GeometryNode;
  selected: boolean;
  onSelect: () => void;
  onSelectedObject: (object: THREE.Group | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const color = primitiveColors[node.primitive];

  return (
    <group
      ref={selected ? onSelectedObject : undefined}
      position={node.position}
      rotation={node.rotation}
      scale={node.scale}
    >
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        {node.primitive === "ring" && <torusGeometry args={[0.72, 0.035, 12, 64]} />}
        {node.primitive === "sphere" && <icosahedronGeometry args={[0.74, 1]} />}
        {node.primitive === "cone" && <coneGeometry args={[0.78, 1.35, 3]} />}
        {node.primitive === "cube" && <boxGeometry args={[1.15, 1.15, 1.15]} />}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected || hovered ? 0.4 : 0.16}
          metalness={0.25}
          roughness={0.35}
          wireframe
        />
      </mesh>
      <mesh scale={0.08}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {selected && (
        <mesh>
          <sphereGeometry args={[1.02, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.07} side={THREE.BackSide} />
        </mesh>
      )}
      <Html position={[0, -1.15, 0]} center distanceFactor={10} zIndexRange={[20, 0]}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          className={`flex max-w-48 items-center gap-2 whitespace-nowrap border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur-md transition ${
            selected
              ? "border-white/50 bg-slate-950/95 text-white"
              : "border-white/10 bg-slate-950/75 text-slate-300 hover:border-white/35 hover:text-white"
          }`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          <span className="truncate">{node.label}</span>
        </button>
      </Html>
    </group>
  );
}

export default function InteractiveGeometryResearchEngine() {
  const [webGLAvailable] = useState(supportsWebGL2);
  const { nodes, setNodes, error: storageError, status: saveStatus, blocked, resetScene, retrySave } = useSavedScene(initialNodes);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [primitive, setPrimitive] = useState<Primitive>("ring");
  const [viewKey, setViewKey] = useState(0);
  const [transformMode, setTransformMode] = useState<TransformMode>("translate");
  const [selectedObject, setSelectedObject] = useState<THREE.Group | null>(null);
  const [inspectorExpanded, setInspectorExpanded] = useState(false);
  // A handle drag may end over empty canvas or another mesh. Its trailing
  // click must not deselect/switch objects. Reset before the next gesture.
  const handleGesture = useRef(false);
  const selectedNode = nodes.find((node) => node.id === selectedId) ?? null;

  const addNode = () => {
    const count = nodes.length;
    const id = `node-${crypto.randomUUID()}`;
    const angle = count * 2.399963;
    const radius = 3 + Math.sqrt(count) * 0.8;
    const node: GeometryNode = {
      id,
      label: `${primitiveNames[primitive]} ${count}`,
      primitive,
      position: [
        Math.cos(angle) * radius,
        ((count % 3) - 1) * 0.7,
        Math.sin(angle) * radius,
      ],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    };
    setNodes((current) => [...current, node]);
    setSelectedId(id);
  };

  const updateTransform = (field: "position" | "rotation" | "scale", axis: number, value: number) => {
    if (!selectedId || !Number.isFinite(value)) return;
    setNodes((current) => current.map((node) => {
      if (node.id !== selectedId) return node;
      const values: Position3 = [...node[field]];
      values[axis] = field === "scale" ? Math.max(0.1, value) : value;
      return { ...node, [field]: values };
    }));
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setNodes((current) => current.filter((node) => node.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <main className="fixed inset-0 h-dvh w-screen overflow-hidden bg-[#050913] text-slate-100">
      {webGLAvailable ? <Canvas
        key={viewKey}
        dpr={[1, 1.5]}
        camera={{ position: [0, 3, 12], fov: 46 }}
        gl={{ antialias: true, alpha: false }}
        className="touch-none!"
        onPointerDownCapture={() => { handleGesture.current = false; }}
        onPointerMissed={(event) => {
          if (event.type === "click" && !handleGesture.current) setSelectedId(null);
        }}
      >
        <color attach="background" args={["#050913"]} />
        <fog attach="fog" args={["#050913", 24, 65]} />
        <ambientLight intensity={0.75} />
        <pointLight position={[5, 8, 7]} intensity={32} color="#a5d8ff" />
        <pointLight position={[-7, -2, -5]} intensity={18} color="#a78bfa" />
        <gridHelper args={[80, 80, "#26364a", "#142033"]} position={[0, -3.5, 0]} />
        <Stars radius={70} depth={45} count={900} factor={2} saturation={0.15} fade speed={0.15} />
        <GeometrySceneBounds>
          {nodes.map((node) => (
            <GeometryMesh
              key={node.id}
              node={node}
              selected={selectedId === node.id}
              onSelectedObject={setSelectedObject}
              onSelect={() => {
                if (!handleGesture.current) setSelectedId(node.id);
              }}
            />
          ))}
        </GeometrySceneBounds>
        {selectedNode && selectedObject && (
          <GeometryTransform
            key={selectedNode.id}
            object={selectedObject}
            mode={transformMode}
            onDragStart={() => { handleGesture.current = true; }}
            onTransform={(values) => {
              setNodes((current) => current.map((node) =>
                node.id === selectedNode.id ? { ...node, ...values } : node,
              ));
            }}
          />
        )}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={45}
        />
      </Canvas> : (
        <div role="alert" className="absolute inset-0 grid place-items-center px-6">
          <div className="max-w-sm border border-white/15 bg-slate-950/80 p-5 text-center">
            <h2 className="mb-2 font-mono text-sm text-white">WebGL 2 is unavailable</h2>
            <p className="text-sm leading-relaxed text-slate-400">
              The 3D engine needs WebGL 2. Open this page in a browser with hardware acceleration and WebGL enabled.
            </p>
          </div>
        </div>
      )}

      <header className="absolute inset-x-0 top-0 z-20 flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#050913]/80 px-3 py-2 backdrop-blur-md sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center border border-cyan-200/30 text-cyan-100">
            <span className="font-mono text-xs">3D</span>
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-mono text-xs font-medium uppercase tracking-[0.18em] text-slate-100 sm:text-sm">
              Geometry Engine
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
              {nodes.length} objects · perspective
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="primitive-type">Primitive type</label>
          <select
            id="primitive-type"
            value={primitive}
            disabled={!webGLAvailable}
            onChange={(event) => setPrimitive(event.target.value as Primitive)}
            className="h-9 max-w-28 border border-white/15 bg-slate-950 px-2 font-mono text-[10px] uppercase tracking-wide text-slate-200 outline-none focus:border-cyan-200/60 sm:max-w-none sm:px-3"
          >
            {Object.entries(primitiveNames).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addNode}
            disabled={!webGLAvailable}
            className="inline-flex h-9 items-center gap-1.5 border border-cyan-200/35 bg-cyan-200/10 px-2.5 font-mono text-[10px] uppercase tracking-wide text-cyan-100 transition hover:bg-cyan-200/20 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              if (resetScene()) {
                setSelectedId(null);
                setViewKey((key) => key + 1);
              }
            }}
            className="h-9 border border-white/15 px-2 font-mono text-[10px] uppercase tracking-wide text-slate-300 transition hover:border-rose-300/50 hover:text-rose-100"
          >
            Reset saved scene
          </button>
          <button
            type="button"
            onClick={() => setViewKey((key) => key + 1)}
            disabled={!webGLAvailable}
            aria-label="Reset 3D view"
            title="Reset 3D view"
            className="grid h-9 w-9 place-items-center border border-white/15 text-slate-300 transition hover:border-white/40 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {storageError && (
        <div role="alert" className="absolute bottom-16 left-3 right-3 z-30 max-w-lg border border-amber-300/40 bg-slate-950/95 p-3 text-xs leading-relaxed text-amber-100 sm:left-5">
          <p>{storageError}</p>
          {!blocked && (
            <button type="button" onClick={retrySave} className="mt-2 border border-amber-200/40 px-3 py-1 font-mono text-[10px] uppercase hover:bg-amber-200/10">
              Retry saving
            </button>
          )}
        </div>
      )}

      {selectedNode && (
        <aside className="absolute bottom-12 right-3 z-20 max-h-[60dvh] w-[min(19rem,calc(100vw-1.5rem))] overflow-auto border border-white/15 bg-[#08111f]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:bottom-auto sm:right-5 sm:top-[4.75rem]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">
                {primitiveNames[selectedNode.primitive]} · {selectedNode.id}
              </p>
              <h2 className="font-mono text-sm font-medium text-white">{selectedNode.label}</h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Close object details"
              className="grid h-11 w-11 shrink-0 place-items-center text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div role="group" aria-label="Transform mode" className="grid grid-cols-3 gap-1">
            {([
              { mode: "translate", label: "Move", Icon: Move },
              { mode: "rotate", label: "Rotate", Icon: Rotate3D },
              { mode: "scale", label: "Scale", Icon: Scaling },
            ] as const).map(({ mode, label, Icon }) => (
              <button
                key={mode}
                type="button"
                aria-pressed={transformMode === mode}
                onClick={() => setTransformMode(mode)}
                className={`flex min-h-11 items-center justify-center gap-1.5 border font-mono text-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200 ${
                  transformMode === mode
                    ? "border-cyan-200/50 bg-cyan-200/10 text-cyan-100"
                    : "border-white/10 text-slate-400 hover:border-white/40 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 font-mono text-[9px] leading-relaxed text-slate-400">
            {transformMode === "translate" && "Drag arrows or planes to move."}
            {transformMode === "rotate" && "Drag a colored ring to rotate."}
            {transformMode === "scale" && "Drag colored boxes to resize; white boxes scale all axes."}
            {" "}X red · Y green · Z blue
          </p>
          <button
            type="button"
            aria-expanded={inspectorExpanded}
            aria-controls="transform-values"
            onClick={() => setInspectorExpanded((expanded) => !expanded)}
            className="mt-2 min-h-11 w-full border border-white/10 font-mono text-[10px] text-slate-300 sm:hidden"
          >
            {inspectorExpanded ? "Hide values" : "Show values"}
          </button>
          <div id="transform-values" className={`${inspectorExpanded ? "block" : "hidden"} sm:block`}>
          <div className="mt-3 space-y-4 border-y border-white/10 py-3">
            {(["position", "rotation", "scale"] as const).map((field) => (
              <fieldset key={field}>
                <legend className="mb-2 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                  {field}{field === "rotation" ? " (degrees)" : ""}
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {(["X", "Y", "Z"] as const).map((axis, index) => (
                    <label key={axis} className="flex items-center gap-1.5 border border-white/10 bg-slate-950/60 px-2 py-1.5">
                      <span className="font-mono text-[9px] text-slate-500">{axis}</span>
                      <input
                        type="number"
                        aria-label={`${field} ${axis}`}
                        step={field === "rotation" ? 5 : 0.1}
                        min={field === "scale" ? 0.1 : undefined}
                        value={Number((field === "rotation" ? THREE.MathUtils.radToDeg(selectedNode[field][index]) : selectedNode[field][index]).toFixed(2))}
                        onChange={(event) => {
                          if (event.target.value === "") return;
                          const value = event.target.valueAsNumber;
                          updateTransform(field, index, field === "rotation" ? THREE.MathUtils.degToRad(value) : value);
                        }}
                        className="min-h-8 min-w-0 w-full bg-transparent font-mono text-base text-slate-200 outline-none sm:min-h-0 sm:text-[10px]"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <button
            type="button"
            onClick={removeSelected}
            className="mt-4 inline-flex items-center gap-1.5 border border-rose-300/20 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wide text-rose-200/80 transition hover:border-rose-300/50 hover:text-rose-100"
          >
            <Trash2 className="h-3 w-3" />
            Remove object
          </button>
          </div>
        </aside>
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 z-10 font-mono text-[9px] uppercase tracking-wider text-slate-500 sm:bottom-4 sm:left-5">
        <p role="status" className={storageError ? "mb-1 text-amber-200" : "mb-1"}>{saveStatus}</p>
        <span className="hidden sm:inline">Drag empty space to orbit · scroll to zoom · right-drag to pan</span>
        <span className="sm:hidden">Drag to orbit · pinch to zoom · two fingers to pan</span>
      </div>
    </main>
  );
}
