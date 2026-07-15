import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders all four design concepts with verified data labels", async () => {
  for (const path of ["/", "/proof", "/movement", "/future", "/live"]) {
    const response = await render(path);
    assert.equal(response.status, 200, `${path} should render successfully`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, /Verified data/i);
    assert.match(html, /Artemis Snowflake data/i);
    assert.doesNotMatch(html, /\$XX|metrics are placeholders|placeholder metrics/i);
  }
});

test("keeps the two live sources semantically distinct", async () => {
  const source = await readFile(new URL("../app/data.ts", import.meta.url), "utf8");
  assert.match(source, /fetchSeries\("\/api\/b2b"\)/);
  assert.match(source, /fetchSeries\("\/api\/c2b"\)/);
  assert.match(source, /monthly B2B volume/);
  assert.match(source, /tracked payments/);
  assert.doesNotMatch(source, /mock|synthetic/i);
});
