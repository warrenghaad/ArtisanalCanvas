import { useEffect, useRef, useState } from "react";
import { clearScene, loadScene, saveScene, type GeometryNode } from "./sceneStorage";

function readInitialScene(defaults: GeometryNode[]) {
  try {
    return { nodes: loadScene(window.localStorage) ?? defaults, error: null };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Browser storage is unavailable.";
    return {
      nodes: defaults,
      error: `Could not load the saved scene. ${detail} Autosave is paused to protect the saved data. Reset the saved scene to resume; current edits are not saved.`,
    };
  }
}

export function useSavedScene(defaults: GeometryNode[]) {
  const [initial] = useState(() => readInitialScene(defaults));
  const [nodes, setNodes] = useState(initial.nodes);
  const [blocked, setBlocked] = useState(Boolean(initial.error));
  const [error, setError] = useState<string | null>(initial.error);
  const [retry, setRetry] = useState(0);
  const [status, setStatus] = useState(initial.error ? "Autosave paused" : "Autosave · this browser");
  const lastSaved = useRef(initial.nodes);

  useEffect(() => {
    if (blocked || (lastSaved.current === nodes && retry === 0)) return;
    try {
      saveScene(window.localStorage, nodes);
      lastSaved.current = nodes;
      setError(null);
      setStatus("Saved on this browser");
    } catch {
      setError("Could not save this scene. Browser storage may be full or disabled. Current edits are only in memory and will be lost on refresh. Free up browser storage or allow site storage, then retry.");
      setStatus("Not saved");
    }
  }, [nodes, blocked, retry]);

  const resetScene = () => {
    if (!window.confirm("Reset the saved scene? This permanently discards all current objects and edits and restores the four starter objects. This cannot be undone.")) return;
    try {
      clearScene(window.localStorage);
    } catch {
      setError("Could not reset the saved scene because browser storage is unavailable. Nothing was reset. Allow site storage and try again.");
      return;
    }
    // Mark the starter state as clean so reset actually removes the stored entry.
    lastSaved.current = defaults;
    setRetry(0);
    setNodes(defaults);
    setBlocked(false);
    setError(null);
    setStatus("Saved scene cleared · autosave ready");
    return true;
  };

  return {
    nodes, setNodes, error, status, blocked, resetScene,
    retrySave: () => setRetry((value) => value + 1),
  };
}
