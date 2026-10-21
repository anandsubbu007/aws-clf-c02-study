// Usage: node scripts/check-links.mjs [path ...]   (default: src/content and docs)
// Extracts every https:// URL from the given files/folders and checks that it resolves (HTTP 2xx after redirects).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const targets = process.argv.slice(2);
if (targets.length === 0) targets.push('src/content', 'docs', 'README.md');

function walk(p, out = []) {
  const s = statSync(p);
  if (s.isDirectory()) for (const f of readdirSync(p)) walk(join(p, f), out);
  else if (/\.(ts|tsx|md)$/.test(p)) out.push(p);
  return out;
}

const urls = new Map();
for (const t of targets) {
  for (const f of walk(t)) {
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(/https:\/\/[^\s'"`)<>\]]+/g)) {
      const u = m[0].replace(/[.,;:]+$/, '');
      if (!urls.has(u)) urls.set(u, []);
      urls.get(u).push(f);
    }
  }
}

const list = [...urls.keys()];
let bad = 0;
let i = 0;
async function check(u) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const r = await fetch(u, { method, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (link-check)' }, signal: AbortSignal.timeout(25000) });
      if (r.ok) return { ok: true, status: r.status };
      if (method === 'GET') return { ok: false, status: r.status };
    } catch (e) {
      if (method === 'GET') return { ok: false, status: String(e.cause?.code ?? e.message) };
    }
  }
  return { ok: false, status: 'unknown' };
}
async function worker() {
  while (i < list.length) {
    const u = list[i++];
    const r = await check(u);
    if (!r.ok) {
      bad++;
      console.log(`BROKEN [${r.status}] ${u}\n   in ${[...new Set(urls.get(u))].join(', ')}`);
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(`\nChecked ${list.length} unique URLs; ${bad} broken.`);
process.exit(bad ? 1 : 0);
