import { describe, expect, test } from "vitest";

import { renderDocs, renderOverview } from "./render.js";

describe("render surfaces", () => {
  test("overview carries the new employee comm audit title", () => {
    expect(renderOverview()).toContain("FirstUp Employee Comm Audit");
    expect(renderOverview()).toContain("/comms-lane");
  });

  test("docs route exposes the CLI and API shape", () => {
    const html = renderDocs();
    expect(html).toContain("firstup-comm-audit");
    expect(html).toContain("/api/message-gaps");
  });
});
