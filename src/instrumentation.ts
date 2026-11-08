// Runs once when the server starts, before the first request.
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // Node 24 carves every Buffer under 32 KiB out of a shared 64 KiB block (Buffer.poolSize
  // went from 8 KiB to 64 KiB), and a block lives as long as any Buffer in it. The "use
  // cache" entries of lib/api.ts (~20 KB each, kept for days) and the cached pages' RSC
  // data are such Buffers: each kept a 64 KiB block alive that short-lived Buffers had
  // shared, so the two in-memory caches took three times the memory they counted
  // (2026-11-08, under crawler load: 27 MB counted, 81 MB held) and Render's 512 MB
  // instance was OOM-killed after a few hours. Node 22's size: a Buffer over 4 KiB gets
  // its own, exact-size allocation.
  Buffer.poolSize = 8 * 1024;
}
