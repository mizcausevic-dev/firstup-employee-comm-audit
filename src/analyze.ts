// SPDX-License-Identifier: AGPL-3.0-or-later

import type {
  AnalysisOptions,
  CommPacket,
  CoverageReport,
  Finding,
  FirstupEmployeeCommExport,
} from "./types.js";

function hoursBetween(startIso: string, endIso: string) {
  return Math.max(0, (Date.parse(endIso) - Date.parse(startIso)) / 36e5);
}

function hasOpenPacket(packets: CommPacket[], kind: string) {
  return packets.some((packet) => packet.kind === kind && packet.status === "OPEN");
}

export function analyze(
  payload: FirstupEmployeeCommExport,
  options: AnalysisOptions = {}
): CoverageReport {
  const now = options.now ?? new Date().toISOString();
  const staleAfterHours = options.staleDetectionAfterHours ?? 72;
  const findingsList: Finding[] = [];

  const onTrackPrograms = payload.programs.filter((program) => program.status === "ON_TRACK").length;
  const highSeverityPackets = payload.packets.filter(
    (packet) => packet.status === "OPEN" && packet.severity === "high"
  ).length;
  const workflowGaps = payload.programs.filter((program) => !program.workflowHealthy).length;

  if (onTrackPrograms === 0) {
    findingsList.push({
      code: "no-on-track-programs",
      severity: "high",
      subject: "workflow",
      subjectId: "programs",
      subjectName: "Employee communications workflow",
      message: "No employee comms programs are currently on track; audience evidence and send posture are operating entirely in exception mode."
    });
  }

  for (const program of payload.programs) {
    const programPackets = payload.packets.filter((packet) => packet.programId === program.id && packet.status === "OPEN");

    if (program.status === "AT_RISK" || programPackets.length > 0) {
      findingsList.push({
        code: "comm-audit-gap",
        severity: program.status === "AT_RISK" ? "high" : "medium",
        subject: "program",
        subjectId: program.id,
        subjectName: `${program.campaign} ${program.id}`,
        owner: program.owner,
        scope: program.platform,
        message: `${program.campaign} still has open evidence debt against the ${program.packet} packet.`
      });
    }

    if (programPackets.length > 0 && !hasOpenPacket(programPackets, "AudienceEvidence")) {
      findingsList.push({
        code: "missing-audience-evidence",
        severity: "medium",
        subject: "program",
        subjectId: program.id,
        subjectName: `${program.campaign} ${program.id}`,
        owner: program.owner,
        scope: program.platform,
        message: "The campaign is in exception flow but does not currently show a clean audience evidence packet in the review queue."
      });
    }

    if (!program.workflowHealthy) {
      findingsList.push({
        code: "workflow-gap",
        severity: "medium",
        subject: "workflow",
        subjectId: program.id,
        subjectName: `${program.campaign} ${program.id}`,
        owner: program.owner,
        scope: program.platform,
        message: "Owner-safe routing is degraded; audience, approval, localization, and delivery review are still split across teams."
      });
    }
  }

  for (const packet of payload.packets) {
    if (packet.status !== "OPEN") continue;

    if (packet.domain === "SEGMENT" || packet.kind === "AudienceEvidence") {
      findingsList.push({
        code: "missing-audience-evidence",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.campaign} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.domain === "POLICY" || packet.kind === "Approval") {
      findingsList.push({
        code: "missing-approval-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.campaign} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.domain === "DELIVERY" || packet.kind === "Delivery") {
      findingsList.push({
        code: "missing-delivery-readiness",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.campaign} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (!packet.owner && packet.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "high",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        scope: packet.scope,
        message: "A high-severity employee comms packet is still unassigned."
      });
    }

    if (hoursBetween(packet.openedAt, now) >= staleAfterHours) {
      findingsList.push({
        code: "stale-open-packet",
        severity: packet.severity === "high" ? "high" : "medium",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: `${packet.kind} evidence has been open longer than the employee-communications review SLA.`
      });
    }
  }

  return {
    ok: findingsList.every((finding) => finding.severity !== "high"),
    programs: payload.programs.length,
    onTrackPrograms,
    packets: payload.packets.length,
    highSeverityPackets,
    workflowGaps,
    stalePackets: findingsList.filter((finding) => finding.code === "stale-open-packet").length,
    findingsList
  };
}
