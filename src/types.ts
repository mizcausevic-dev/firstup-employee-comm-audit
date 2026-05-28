// SPDX-License-Identifier: AGPL-3.0-or-later

export type ProgramStatus = "ON_TRACK" | "AT_RISK";
export type PacketStatus = "OPEN" | "RESOLVED";
export type Severity = "high" | "medium" | "low" | "info";
export type EvidenceKind = "AudienceEvidence" | "Approval" | "Localization" | "Consent" | "Delivery" | string;
export type CommDomain = "SEGMENT" | "POLICY" | "IDENTITY" | "LOCALIZATION" | "DELIVERY" | string;

export interface EmployeeCommProgram {
  id: string;
  campaign: string;
  audience: string;
  platform: string;
  owner: string;
  status: ProgramStatus;
  workflowHealthy: boolean;
  daysToLaunch: number;
  packet: string;
  excerpt: string;
  nextAction: string;
}

export interface CommPacket {
  id: string;
  programId: string;
  campaign: string;
  audience: string;
  platform: string;
  owner?: string;
  domain: CommDomain;
  kind: EvidenceKind;
  severity: Severity;
  status: PacketStatus;
  scope: string;
  principal?: string;
  message: string;
  openedAt: string;
  dueAt: string;
}

export interface FirstupEmployeeCommExport {
  programs: EmployeeCommProgram[];
  packets: CommPacket[];
}

export type FindingCode =
  | "no-on-track-programs"
  | "comm-audit-gap"
  | "missing-audience-evidence"
  | "missing-approval-proof"
  | "missing-delivery-readiness"
  | "workflow-gap"
  | "stale-open-packet"
  | "high-severity-unassigned";

export interface Finding {
  code: FindingCode;
  severity: Severity;
  subject: "program" | "packet" | "workflow";
  subjectId: string;
  subjectName?: string;
  owner?: string;
  scope?: string;
  principal?: string;
  message: string;
}

export interface AnalysisOptions {
  now?: string;
  staleDetectionAfterHours?: number;
}

export interface CoverageReport {
  ok: boolean;
  programs: number;
  onTrackPrograms: number;
  packets: number;
  highSeverityPackets: number;
  workflowGaps: number;
  stalePackets: number;
  findingsList: Finding[];
}
