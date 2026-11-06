import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import type * as THREE from "three";

export type TransformMode = "translate" | "rotate" | "scale";
export type GeometryTransformValues = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

/** Keep handles outside Bounds so they never affect scene framing. */
export function GeometryTransform({
  object,
  mode,
  onTransform,
  onDragStart,
}: {
  object: THREE.Group;
  mode: TransformMode;
  onTransform: (values: GeometryTransformValues) => void;
  onDragStart: () => void;
}) {
  const canvas = useThree((state) =>
    (state.events.connected || state.gl.domElement) as HTMLElement,
  );
  const orbit = useThree((state) => state.controls);
  const dragging = useRef(false);
  const pointer = useRef<PointerEvent | null>(null);

  useEffect(() => {
    const rememberPointer = (event: PointerEvent) => { pointer.current = event; };
    // three-stdlib handles pointerup, but not pointercancel or window blur.
    // Release through the normal pointerup path, including document listeners.
    const release = () => {
      if (!dragging.current) return;
      const event = pointer.current;
      canvas.dispatchEvent(new PointerEvent("pointerup", {
        bubbles: true,
        button: 0,
        pointerId: event?.pointerId ?? 1,
        pointerType: event?.pointerType ?? "mouse",
        clientX: event?.clientX ?? 0,
        clientY: event?.clientY ?? 0,
      }));
      dragging.current = false;
      if (orbit && "enabled" in orbit) orbit.enabled = true;
    };
    canvas.addEventListener("pointerdown", rememberPointer, true);
    canvas.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    return () => {
      release();
      canvas.removeEventListener("pointerdown", rememberPointer, true);
      canvas.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
    };
  }, [canvas, orbit]);

  return (
    <TransformControls
      object={object}
      mode={mode}
      space={mode === "scale" ? "local" : "world"}
      size={1.15}
      onMouseDown={() => {
        dragging.current = true;
        onDragStart();
      }}
      onMouseUp={() => { dragging.current = false; }}
      onObjectChange={() => {
        // Match the inspector's positive minimum; never leave a mirrored or
        // collapsed mesh behind when a handle crosses the object's origin.
        object.scale.set(
          Math.max(0.1, object.scale.x),
          Math.max(0.1, object.scale.y),
          Math.max(0.1, object.scale.z),
        );
        onTransform({
          position: [object.position.x, object.position.y, object.position.z],
          rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
          scale: [object.scale.x, object.scale.y, object.scale.z],
        });
      }}
    />
  );
}
