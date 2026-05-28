import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { FirstupEmployeeCommExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): FirstupEmployeeCommExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as FirstupEmployeeCommExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts campaigns and packets", () => {
    const report = analyze(fixture("firstup-employee-comms.json"), { now: NOW });
    expect(report.programs).toBe(3);
    expect(report.onTrackPrograms).toBe(1);
    expect(report.packets).toBe(5);
  });

  it("flags missing on-track programs as high", () => {
    const report = analyze({ programs: [], packets: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-on-track-programs")?.severity).toBe("high");
  });

  it("flags employee comm audit gaps", () => {
    const report = analyze(fixture("firstup-employee-comms.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "comm-audit-gap")?.scope).toBe("FirstUp + Entra");
  });

  it("flags audience, approval, delivery, and workflow gaps", () => {
    const report = analyze(fixture("firstup-employee-comms.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "missing-audience-evidence")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "missing-approval-proof")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "missing-delivery-readiness")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "workflow-gap")).toBeDefined();
  });

  it("flags stale open packets", () => {
    const report = analyze(fixture("firstup-employee-comms.json"), { now: NOW, staleDetectionAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-open-packet")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("firstup-employee-comms-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("firstup-employee-comms.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("firstup-employee-comms.json"), { now: NOW }));
    expect(summary).toMatch(/campaigns/);
    expect(summary).toMatch(/packets/);
  });
});
