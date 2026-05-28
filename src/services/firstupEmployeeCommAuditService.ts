// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { commsLanePackets, sampleFirstupEmployeeCommPayload, sendPackets } from "../data/sampleFirstupEmployeeComms.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-31T00:00:00Z";
const report = analyze(sampleFirstupEmployeeCommPayload, {
  now: NOW,
  staleDetectionAfterHours: 72
});

function severityRank(finding: Finding): number {
  return finding.severity === "high" ? 0 : finding.severity === "medium" ? 1 : finding.severity === "low" ? 2 : 3;
}

export function summary() {
  return {
    programs: report.programs,
    onTrackPrograms: report.onTrackPrograms,
    packets: report.packets,
    highSeverityPackets: report.highSeverityPackets,
    workflowGaps: report.workflowGaps,
    stalePackets: report.stalePackets,
    recommendation:
      "Restore missing audience evidence, close the approval and delivery packet gaps, repair stale send windows, and stabilize employee-communications ownership before the next launch window."
  };
}

export function commsLane() {
  return commsLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "audience-lane") return finding.code === "comm-audit-gap" || finding.code === "missing-audience-evidence";
      if (lane.id === "approval-lane") return finding.code === "missing-approval-proof" || finding.code === "stale-open-packet";
      if (lane.id === "delivery-lane") return finding.code === "missing-delivery-readiness" || finding.code === "workflow-gap";
      if (lane.id === "fallback-lane") return finding.code === "high-severity-unassigned" || finding.code === "stale-open-packet";
      return false;
    }).length
  }));
}

export function messageGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "missing-audience-evidence"
          ? "Internal Communications Governance"
          : finding.code === "missing-approval-proof"
            ? "Legal + Policy Review"
            : finding.code === "missing-delivery-readiness"
              ? "People Operations Messaging"
              : "Security Enablement")
    }));
}

export function sendPosture() {
  return sendPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline employee-comms analyzer and CLI, not static copy alone.",
    "Campaign, packet, and review snapshots are synthetic sample data only; no live employee, tenant, or identity records are published.",
    "The control plane keeps audience proof, approval evidence, localization drift, and send readiness visible for internal comms and audit stakeholders.",
    "This surface demonstrates employee communications governance and send-safe sequencing, not a generic HR keyword page.",
    "It complements workforce, security, and growth-ops surfaces with a reusable audience-evidence routing primitive."
  ];
}

export const validation = verification;

export function payload() {
  return {
    summary: summary(),
    commsLane: commsLane(),
    messageGaps: messageGaps(),
    sendPosture: sendPosture(),
    verification: verification(),
    sample: sampleFirstupEmployeeCommPayload
  };
}
