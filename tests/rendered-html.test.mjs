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

test("server-renders the chooser and all four concepts with honest data status", async () => {
  for (const path of ["/", "/proof", "/movement", "/future", "/live"]) {
    const response = await render(path);
    assert.equal(response.status, 200, `${path} should render successfully`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, /Full data|Partial verified data|Live data unavailable/i);
    assert.match(html, /Artemis Snowflake data|Network data is temporarily unavailable/i);
    assert.doesNotMatch(html, /\$XX|metrics are placeholders|placeholder metrics/i);
  }
});

test("every design direction includes the complete original payment data model", async () => {
  for (const path of ["/proof", "/movement", "/future", "/live"]) {
    const response = await render(path);
    const html = await response.text();

    assert.match(html, /VERIFIED DATA \/ COMPLETE VIEW/i, `${path} should include the full data module`);
    assert.match(html, /Global tracked volume/i);
    assert.match(html, />B2B</i);
    assert.match(html, />B2C</i);
    assert.match(html, />C2C</i);
    assert.match(html, />C2B</i);
    assert.match(html, /Cards \+ commerce/i);
    assert.match(html, /GLOBAL \/ WORLD VOLUME/i);
    assert.match(html, /no country or continent dimension/i);
  }
});

test("prefers the full segment endpoint and keeps fallback sources semantically distinct", async () => {
  const source = await readFile(new URL("../app/data.ts", import.meta.url), "utf8");
  assert.match(source, /\/api\/payments/);
  assert.match(source, /fetchSeries\("\/api\/b2b"\)/);
  assert.match(source, /fetchSeries\("\/api\/c2b"\)/);
  assert.match(source, /clearly labeled C2B proxy/);
  assert.match(source, /fallbackSegments\.push\("C2B"\)/);
  assert.match(source, /seriesThrough\(standaloneTracked, asOf\)/);
  assert.match(source, /TRON CHAIN PROXY/);
  assert.match(source, /Cards \+ commerce/);
  assert.doesNotMatch(source, /mock|synthetic/i);
});
