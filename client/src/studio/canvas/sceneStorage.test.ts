import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clearScene, deserializeScene, loadScene, saveScene, serializeScene,
  SCENE_STORAGE_KEY, type GeometryNode, type SceneStorage,
} from "./sceneStorage";

const node: GeometryNode = {
  id: "node-test", label: "Cube", primitive: "cube",
  position: [-2.5, 0, 4], rotation: [0, Math.PI / 4, -1], scale: [0.1, 1, 2.7],
};

function memoryStorage(): SceneStorage {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => { data.set(key, value); },
    removeItem: (key) => { data.delete(key); },
  };
}

test("versioned round-trip preserves IDs, primitive and all transforms", () => {
  const encoded = serializeScene([node]);
  assert.equal(JSON.parse(encoded).version, 1);
  assert.deepEqual(deserializeScene(encoded), [node]);
});

test("missing save differs from an intentionally empty scene", () => {
  const storage = memoryStorage();
  assert.equal(loadScene(storage), null);
  saveScene(storage, []);
  assert.deepEqual(loadScene(storage), []);
});

test("additions, transforms and deletions replace the saved snapshot", () => {
  const storage = memoryStorage();
  saveScene(storage, [node, { ...node, id: "second" }]);
  assert.equal(loadScene(storage)?.length, 2);
  const edited: GeometryNode = { ...node, position: [9, 8, 7] };
  saveScene(storage, [edited]);
  assert.deepEqual(loadScene(storage), [edited]);
  saveScene(storage, []);
  assert.deepEqual(loadScene(storage), []);
});

test("reset removes only the scene entry", () => {
  const storage = memoryStorage();
  storage.setItem("unrelated", "keep");
  saveScene(storage, [node]);
  clearScene(storage);
  assert.equal(loadScene(storage), null);
  assert.equal(storage.getItem("unrelated"), "keep");
});

test("malformed and unsupported data is rejected without changing storage", () => {
  const storage = memoryStorage();
  for (const raw of ["{", "null", "[]", "{}", '{"version":2,"nodes":[]}']) {
    storage.setItem(SCENE_STORAGE_KEY, raw);
    assert.throws(() => loadScene(storage));
    assert.equal(storage.getItem(SCENE_STORAGE_KEY), raw);
  }
});

test("invalid object data and duplicate IDs are rejected", () => {
  const invalid = [
    { ...node, primitive: "unknown" },
    { ...node, id: "" },
    { ...node, label: null },
    { ...node, position: [1, 2] },
    { ...node, rotation: ["0", 0, 0] },
    { ...node, scale: [0, 1, 1] },
    { ...node, scale: [-1, 1, 1] },
    { ...node, position: [null, 0, 0] },
  ];
  for (const bad of invalid) {
    assert.throws(() => deserializeScene(JSON.stringify({ version: 1, nodes: [bad] })));
  }
  assert.throws(() => serializeScene([node, node]));
  assert.throws(() => serializeScene([{ ...node, position: [Infinity, 0, 0] }]));
  assert.throws(() => serializeScene([{ ...node, rotation: [NaN, 0, 0] }]));
});

test("invalid in-memory state cannot overwrite a valid save", () => {
  const storage = memoryStorage();
  saveScene(storage, [node]);
  assert.throws(() => saveScene(storage, [{ ...node, scale: [0, 0, 0] }]));
  assert.deepEqual(loadScene(storage), [node]);
});

test("read, write and reset storage errors propagate to the caller", () => {
  const unavailable: SceneStorage = {
    getItem() { throw new Error("denied"); },
    setItem() { throw new Error("quota exceeded"); },
    removeItem() { throw new Error("denied"); },
  };
  assert.throws(() => loadScene(unavailable), /denied/);
  assert.throws(() => saveScene(unavailable, [node]), /quota exceeded/);
  assert.throws(() => clearScene(unavailable), /denied/);
});
