import { describe, expect, test } from "vitest";

import { commsLane, messageGaps, sendPosture, summary, verification } from "./firstupEmployeeCommAuditService.js";

describe("firstupEmployeeCommAuditService", () => {
  test("summary exposes the expected operator counts", () => {
    expect(summary().programs).toBe(3);
    expect(summary().packets).toBe(5);
  });

  test("comms lane keeps four operator lanes", () => {
    expect(commsLane()).toHaveLength(4);
    expect(commsLane()[0]?.lane).toContain("Audience");
  });

  test("message gaps include send-readiness findings", () => {
    expect(messageGaps().some((finding) => finding.code === "missing-delivery-readiness")).toBe(true);
  });

  test("send posture stays packet-shaped", () => {
    expect(sendPosture().every((packet) => typeof packet.completenessScore === "number")).toBe(true);
  });

  test("verification stays explicit about synthetic data", () => {
    expect(verification().join(" ")).toContain("synthetic");
  });
});
