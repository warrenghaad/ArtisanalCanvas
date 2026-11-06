// Run with: node script/test-scene-browser.mjs
// Requires Chromium on PATH and the development workflow running.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import WebSocket from "ws";

const profile = await mkdtemp(join(tmpdir(), "scene-test-"));
const browser = spawn("chromium", [
  "--headless", "--no-sandbox", "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader", "--remote-debugging-port=0",
  `--user-data-dir=${profile}`, "about:blank",
]);
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => reject(new Error("Chromium startup timed out")), 20000);
    browser.stderr.on("data", (data) => {
      output += data;
      const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timeout); resolve(match[1]); }
    });
    browser.on("error", reject);
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve) => socket.once("open", resolve));
  let sequence = 0;
  let sessionId;
  let acceptDialog = true;
  const pending = new Map();
  function call(method, params = {}, session = sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, ...(session ? { sessionId: session } : {}) }));
    });
  }
  socket.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.id) {
      const request = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) request.reject(new Error(JSON.stringify(data.error)));
      else request.resolve(data.result);
    } else if (data.method === "Page.javascriptDialogOpening") {
      void call("Page.handleJavaScriptDialog", { accept: acceptDialog });
    }
  });
  const { targetId } = await call("Target.createTarget", { url: "about:blank" });
  ({ sessionId } = await call("Target.attachToTarget", { targetId, flatten: true }));
  await call("Page.enable");
  await call("Runtime.enable");
  const evaluate = async (expression) => {
    const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const wait = async (expression) => {
    const deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      if (await evaluate(`Boolean(${expression})`)) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`Timed out: ${expression}`);
  };
  const key = "geometry-engine.scene";
  const scene = () => evaluate(`JSON.parse(localStorage.getItem('${key}'))`);
  const button = async (text) => {
    const expression = `[...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)})`;
    await wait(expression);
    await evaluate(`${expression}.click()`);
  };
  const reload = async () => {
    const loaded = new Promise((resolve) => {
      const onMessage = (message) => {
        const data = JSON.parse(message);
        if (data.method === "Page.loadEventFired" && data.sessionId === sessionId) {
          socket.off("message", onMessage);
          resolve();
        }
      };
      socket.on("message", onMessage);
    });
    await call("Page.reload");
    await loaded;
    await wait(`document.querySelector('h1')?.textContent.includes('Geometry Engine')`);
  };
  await call("Page.navigate", { url: process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}/` : "http://127.0.0.1:5000/" });
  await wait(`document.querySelector('canvas') && !document.body.textContent.includes('WebGL 2 is unavailable')`);
  await button("Add");
  await wait(`JSON.parse(localStorage.getItem('${key}'))?.nodes.length === 5`);
  for (const [field, value] of [["position X", "2.5"], ["rotation Y", "45"], ["scale Z", "1.7"]]) {
    await evaluate(`(() => {
      const input = document.querySelector('input[aria-label="${field}"]');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '${value}');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
  }
  await wait(`JSON.parse(localStorage.getItem('${key}')).nodes[4].scale[2] === 1.7`);
  const saved = await scene();
  assert.equal(saved.nodes[4].position[0], 2.5);
  assert.ok(Math.abs(saved.nodes[4].rotation[1] - Math.PI / 4) < 0.00001);
  await reload();
  await button(saved.nodes[4].label);
  assert.equal(await evaluate(`document.querySelector('input[aria-label="scale Z"]').value`), "1.7");
  await button("Add");
  await wait(`JSON.parse(localStorage.getItem('${key}')).nodes.length === 6`);
  const added = await scene();
  assert.equal(new Set(added.nodes.map((n) => n.id)).size, 6);
  await button("Remove object");
  await reload();
  assert.deepEqual(await scene(), saved);
  for (const node of saved.nodes) {
    await button(node.label);
    await button("Remove object");
  }
  await wait(`JSON.parse(localStorage.getItem('${key}')).nodes.length === 0`);
  await reload();
  assert.equal((await scene()).nodes.length, 0);
  acceptDialog = false;
  await button("Reset saved scene");
  assert.equal((await scene()).nodes.length, 0);
  acceptDialog = true;
  await button("Reset saved scene");
  await wait(`localStorage.getItem('${key}') === null`);
  await reload();
  await wait(`document.body.textContent.includes('4 objects')`);
  console.log("PASS: add, transform, reload, unique IDs, deletion, empty scene and confirmed reset");

  await evaluate(`window.originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = function() { throw new DOMException('Full', 'QuotaExceededError'); }`);
  await button("Add");
  await wait(`document.querySelector('[role="alert"]')?.textContent.includes('Could not save')`);
  assert.equal(await evaluate(`localStorage.getItem('${key}')`), null);
  await evaluate(`Storage.prototype.setItem = window.originalSetItem`);
  await button("Retry saving");
  await wait(`JSON.parse(localStorage.getItem('${key}'))?.nodes.length === 5`);
  await wait(`!document.querySelector('[role="alert"]')`);
  console.log("PASS: write failure is visible, edits retained, retry saves successfully");

  for (const raw of ["{broken", '{"version":99,"nodes":[]}', '{"version":1,"nodes":[{"id":"invalid"}]}']) {
    await evaluate(`localStorage.setItem('${key}', ${JSON.stringify(raw)})`);
    await reload();
    await wait(`document.querySelector('[role="alert"]')?.textContent.includes('Could not load')`);
    await button("Add");
    assert.equal(await evaluate(`localStorage.getItem('${key}')`), raw);
  }
  await evaluate(`window.originalRemoveItem = Storage.prototype.removeItem; Storage.prototype.removeItem = function() { throw new Error('Denied'); }`);
  await button("Reset saved scene");
  await wait(`document.querySelector('[role="alert"]')?.textContent.includes('Nothing was reset')`);
  await evaluate(`Storage.prototype.removeItem = window.originalRemoveItem`);
  await button("Reset saved scene");
  await wait(`localStorage.getItem('${key}') === null && !document.querySelector('[role="alert"]')`);
  console.log("PASS: invalid saves are protected, failed reset is visible, reset recovers");

  const injection = await call("Page.addScriptToEvaluateOnNewDocument", {
    source: `Storage.prototype.getItem = function() { throw new DOMException('Denied', 'SecurityError'); }`,
  });
  await reload();
  await wait(`document.querySelector('[role="alert"]')?.textContent.includes('Could not load')`);
  await call("Page.removeScriptToEvaluateOnNewDocument", { identifier: injection.identifier });
  await reload();
  await wait(`!document.querySelector('[role="alert"]')`);
  await call("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  assert.equal(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), true);
  assert.equal(await evaluate(`Math.round(document.querySelector('main').getBoundingClientRect().height) === innerHeight`), true);
  console.log("PASS: denied reads are visible; recovered scene and mobile full-window layout");
} finally {
  socket?.close();
  browser.kill("SIGTERM");
  await new Promise((resolve) => browser.once("exit", resolve));
  await rm(profile, { recursive: true, force: true });
}
