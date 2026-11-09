// node scripts/memcheck.mjs [pid]: what the running Next server holds in memory, measured
// from inside it through the inspector (SIGUSR1 opens it on 127.0.0.1:9229; closed at the
// end). For the Render shell: paste it to /tmp and run it there. Read-only: forces one GC
// (a pause of a second or two), counts objects, changes nothing. Prints the process's RSS,
// the JS heap and Buffers, each in-memory cache (its own count of its size against what
// it really holds, and its biggest entries), and the objects that should not pile up.
// The container's memory is more than the process's: see /sys/fs/cgroup/memory.stat
// (kernel/slab, file) and `ps` (2026-11-09: the files under .next/server, not Next).
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const pid =
  process.argv[2] ??
  execSync("ps -eo pid=,rss=,args= | grep -E 'next|node' | grep -v -E 'grep|memcheck' | sort -k2 -n -r | head -1")
    .toString().trim().split(/\s+/)[0];
const mb = (kb) => Math.round(kb / 1024);
try {
  const smaps = readFileSync(`/proc/${pid}/smaps_rollup`, "utf8");
  const field = (name) => mb(Number(smaps.match(new RegExp(`^${name}:\\s+(\\d+)`, "m"))?.[1] ?? 0));
  console.log(`pid ${pid}: RSS ${field("Rss")} MB (anon ${field("Anonymous")} MB, files ${field("Rss") - field("Anonymous")} MB)`);
} catch { console.log(`pid ${pid}`); }

process.kill(Number(pid), "SIGUSR1");
await new Promise((r) => setTimeout(r, 1000));
const [target] = await (await fetch("http://127.0.0.1:9229/json/list")).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let id = 0;
const waiting = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && waiting.has(msg.id)) { waiting.get(msg.id)(msg); waiting.delete(msg.id); }
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const n = ++id;
    waiting.set(n, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
    ws.send(JSON.stringify({ id: n, method, params }));
  });
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: false });
  if (r.exceptionDetails) throw new Error(`${expression}: ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}`);
  return r.result;
};
const all = async (protoExpression) => {
  const proto = await evaluate(protoExpression);
  return (await send("Runtime.queryObjects", { prototypeObjectId: proto.objectId })).objects;
};
const call = async (objects, fn) =>
  (await send("Runtime.callFunctionOn", { objectId: objects.objectId, functionDeclaration: fn.toString(), returnByValue: true })).result.value;

const REQ = "(process.mainModule ?? { require })";

// Runs inside the server with `this` = one LRUCache.
function summarize() {
  const backing = new Set();
  const walk = (v, depth, acc, seen) => {
    if (v == null) return;
    const t = typeof v;
    if (t === "string") { acc.strings += v.length * (/[^\u0000-\u00ff]/.test(v) ? 2 : 1); return; }
    if (t !== "object" || seen.has(v)) return;
    seen.add(v);
    if (ArrayBuffer.isView(v)) {
      acc.bytes += v.byteLength;
      if (!backing.has(v.buffer)) { backing.add(v.buffer); acc.backing += v.buffer.byteLength; }
      return;
    }
    if (v instanceof ArrayBuffer) {
      if (!backing.has(v)) { backing.add(v); acc.backing += v.byteLength; acc.bytes += v.byteLength; }
      return;
    }
    if (depth > 10) return;
    if (v instanceof Map) { for (const [k, x] of v) { walk(k, depth + 1, acc, seen); walk(x, depth + 1, acc, seen); } return; }
    if (Array.isArray(v) || v instanceof Set) { for (const x of v) walk(x, depth + 1, acc, seen); return; }
    for (const k of Object.keys(v)) if (k !== "prev" && k !== "next") walk(v[k], depth + 1, acc, seen);
  };
  const acc = { strings: 0, bytes: 0, backing: 0 };
  const seen = new Set();
  const kinds = {};
  let entries = 0;
  const sizes = [];
  for (const node of this.cache.values()) {
    entries++;
    const before = acc.strings + acc.bytes;
    walk(node.key, 0, acc, seen);
    walk(node.data, 0, acc, seen);
    sizes.push([acc.strings + acc.bytes - before, node.size, String(node.key).slice(0, 90)]);
    const d = node.data;
    const kind = d?.value?.kind ?? (d?.entry ? "data" : typeof d);
    kinds[kind] = (kinds[kind] ?? 0) + 1;
  }
  const m = (b) => Math.round(b / 104857.6) / 10;
  return {
    limit_MB: m(this.maxSize), counted_MB: m(this.totalSize), entries,
    real_strings_MB: m(acc.strings), real_buffers_MB: m(acc.bytes), buffers_backing_MB: m(acc.backing), kinds,
    biggest_KB_real_counted_key: sizes.sort((a, b) => b[0] - a[0]).slice(0, 5).map(([r, c, k]) => [Math.round(r / 1024), Math.round(c / 1024), k]),
  };
}
try {
  await send("Runtime.enable");
  await send("HeapProfiler.enable");
  await send("HeapProfiler.collectGarbage");
  const usage = (await send("Runtime.evaluate", { expression: "JSON.stringify(process.memoryUsage())", returnByValue: true })).result.value;
  const u = JSON.parse(usage);
  console.log("after GC, MB:", Object.fromEntries(Object.entries(u).map(([k, v]) => [k, Math.round(v / 1048576)])));

  // The two in-memory caches: the rendered pages (FileSystemCache.memoryCache) and the
  // "use cache" data (the built-in handler's LRU, kept in a closure: read through the
  // scopes of its get()). Each: its own count of its size against what it really holds.
  const lruIds = [];
  try {
    const page = await evaluate(`${REQ}.require("next/dist/server/lib/incremental-cache/file-system-cache.js").default.memoryCache`);
    if (page.objectId) lruIds.push(["pages", page.objectId]);
  } catch (e) { console.log("pages cache:", e.message.slice(0, 120)); }
  const same = (await send("Runtime.evaluate", { expression: 'globalThis[Symbol.for("@next/cache-handlers-map")]?.get("remote") === globalThis[Symbol.for("@next/cache-handlers-map")]?.get("default")', returnByValue: true })).result.value;
  for (const name of same ? ["remote"] : ["remote", "default"]) {
    try {
      const get = await evaluate(`globalThis[Symbol.for("@next/cache-handlers-map")].get("${name}").get`);
      const props = await send("Runtime.getProperties", { objectId: get.objectId, ownProperties: false });
      const scopes = props.internalProperties.find((p) => p.name === "[[Scopes]]").value.objectId;
      for (const scope of (await send("Runtime.getProperties", { objectId: scopes, ownProperties: true })).result) {
        if (!scope.value?.objectId) continue;
        const vars = (await send("Runtime.getProperties", { objectId: scope.value.objectId, ownProperties: true })).result;
        const lru = vars.find((v) => v.name === "memoryCache");
        if (lru?.value?.objectId && !lruIds.some(([, id]) => id === lru.value.objectId)) lruIds.push([`use cache (${name})`, lru.value.objectId]);
      }
    } catch (e) { console.log(`use cache ${name}:`, e.message.slice(0, 120)); }
  }
  const report = [];
  for (const [name, objectId] of lruIds) {
    const r = (await send("Runtime.callFunctionOn", { objectId, functionDeclaration: summarize.toString(), returnByValue: true })).result.value;
    report.push({ cache: name, ...r });
  }
  console.log("LRU caches:");
  for (const r of report) console.log(" ", JSON.stringify(r));

  // Everything holding binary data, in or out of the caches.
  const abs = await all("ArrayBuffer.prototype");
  const totalAB = await call(abs, function () {
    let n = 0, b = 0;
    for (const a of this) { n++; b += a.byteLength; }
    return { count: n, MB: Math.round(b / 104857.6) / 10 };
  });
  console.log("all ArrayBuffers:", JSON.stringify(totalAB));

  // Objects that should not pile up between requests.
  const counts = {};
  for (const [name, expr] of [
    ["ServerResponse", `${REQ}.require("http").ServerResponse.prototype`],
    ["IncomingMessage", `${REQ}.require("http").IncomingMessage.prototype`],
    ["ReadableStream", "ReadableStream.prototype"],
    ["AbortSignal", "AbortSignal.prototype"],
    ["Promise", "Promise.prototype"],
    ["Map", "Map.prototype"],
  ]) {
    try { counts[name] = await call(await all(expr), function () { return this.length; }); }
    catch (e) { counts[name] = String(e.message).slice(0, 80); }
  }
  console.log("live objects:", JSON.stringify(counts));
} finally {
  try { await evaluate(`${REQ}.require("inspector").close()`); } catch {}
  ws.close();
}
