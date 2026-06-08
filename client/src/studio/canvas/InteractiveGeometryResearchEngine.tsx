import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStudioStore } from '../state/useStudioStore';

// Basic Primitives for the canvas
const Primitives = {
  circle: (props: any) => (
    <mesh {...props}>
      <circleGeometry args={[1, 32]} />
      <meshStandardMaterial color="#88aaff" side={THREE.DoubleSide} wireframe />
    </mesh>
  ),
  triangle: (props: any) => (
    <mesh {...props}>
      <coneGeometry args={[1, 1, 3]} />
      <meshStandardMaterial color="#ff88aa" wireframe />
    </mesh>
  ),
  square: (props: any) => (
    <mesh {...props}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshStandardMaterial color="#aa88ff" side={THREE.DoubleSide} wireframe />
    </mesh>
  ),
};

const FloatingNode = ({ node, onClick, active }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime + node.position[0]) * 0.1;
    }
  });

  const Primitive = Primitives[node.type as keyof typeof Primitives] || Primitives.circle;

  return (
    <group position={node.position}>
      <Primitive
        ref={meshRef}
        onClick={(e: any) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        scale={active ? 1.5 : hovered ? 1.2 : 1}
      />
      
      {/* Node Label */}
      <Html position={[0, -1.2, 0]} center className="pointer-events-none">
        <div className={`
          px-2 py-1 bg-background/80 backdrop-blur-sm border 
          font-mono text-[10px] uppercase tracking-wider whitespace-nowrap transition-colors
          ${active ? 'border-primary text-primary' : 'border-border/50 text-muted-foreground'}
          ${hovered && !active ? 'border-primary/50 text-primary/80' : ''}
        `}>
          {node.label}
        </div>
      </Html>

      {/* Active Selection Indicator */}
      {active && (
        <mesh position={[0, 0, -0.1]}>
          <ringGeometry args={[1.6, 1.65, 32]} />
          <meshBasicMaterial color="var(--primary)" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

// Procedural relationship lines
const RelationshipLines = ({ nodes, activeNodeId }: { nodes: any[], activeNodeId: string | null }) => {
  const lines = useMemo(() => {
    if (!activeNodeId) return [];
    
    const activeNode = nodes.find(n => n.id === activeNodeId);
    if (!activeNode) return [];

    return nodes
      .filter(n => n.id !== activeNodeId)
      .map(n => {
        const points = [
          new THREE.Vector3(...activeNode.position),
          new THREE.Vector3(...n.position)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return { id: `${activeNode.id}-${n.id}`, geometry };
      });
  }, [nodes, activeNodeId]);

  return (
    <group>
      {lines.map(line => (
        <line key={line.id} geometry={line.geometry}>
          <lineBasicMaterial color="var(--primary)" transparent opacity={0.2} dashed dashSize={0.1} gapSize={0.1} />
        </line>
      ))}
    </group>
  );
};

export default function InteractiveGeometryResearchEngine({ context }: { context: any }) {
  const { selectedCanvasNode, setSelectedCanvasNode, setPrismContext } = useStudioStore();

  // Sample dendritic graph data
  const nodes = [
    { id: '1', type: 'circle', label: 'Circle Primitive', position: [0, 0, 0], data: { scope: 'Core Geometry', properties: ['radius', 'circumference', 'area'] } },
    { id: '2', type: 'circle', label: 'Radial Operator', position: [3, 1, -2], data: { scope: 'Transformation', properties: ['angle', 'distance', 'origin'] } },
    { id: '3', type: 'square', label: 'Enclosure Operator', position: [-3, 2, -1], data: { scope: 'Bounding', properties: ['minX', 'maxX', 'minY', 'maxY'] } },
    { id: '4', type: 'triangle', label: 'Partition Skill', position: [2, -2, 2], data: { scope: 'Subdivision', properties: ['splits', 'ratio', 'axis'] } },
    { id: '5', type: 'circle', label: 'Sun Disk Artifact', position: [5, 0, -3], data: { scope: 'Historical Reference', properties: ['culture', 'period', 'symbolism'] } },
  ];

  const handleNodeClick = (node: any) => {
    if (selectedCanvasNode?.id === node.id) {
      setSelectedCanvasNode(null);
    } else {
      setSelectedCanvasNode(node);
      // Auto-open dock when an item is selected
      useStudioStore.setState({ isDockVisible: true });
    }
  };

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }} onPointerMissed={() => setSelectedCanvasNode(null)}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Background Grid */}
        <gridHelper args={[50, 50, '#333333', '#111111']} position={[0, -5, 0]} />
        <fog attach="fog" args={['#000', 10, 30]} />

        {/* Nodes */}
        {nodes.map(node => (
          <FloatingNode
            key={node.id}
            node={node}
            active={selectedCanvasNode?.id === node.id}
            onClick={() => handleNodeClick(node)}
          />
        ))}

        {/* Edges */}
        <RelationshipLines nodes={nodes} activeNodeId={selectedCanvasNode?.id || null} />

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
