import type { ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import { Bounds } from "@react-three/drei";

export function GeometrySceneBounds({ children }: { children: ReactNode }) {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const controls = useThree((state) => state.controls);

  // Canvas can emit a new size object on a parent render even if its dimensions
  // haven't changed. Bounds observe would then re-fit during each handle drag.
  // Fit only on mount/reset or a genuine viewport resize, after orbit is ready.
  if (!controls) return null;
  return (
    <Bounds key={`${width}:${height}`} fit clip margin={1.3}>
      {children}
    </Bounds>
  );
}
