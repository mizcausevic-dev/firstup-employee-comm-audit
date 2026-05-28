// SPDX-License-Identifier: AGPL-3.0-or-later

import type { FirstupEmployeeCommExport } from "../types.js";

export const sampleFirstupEmployeeCommPayload: FirstupEmployeeCommExport = {
  programs: [
    {
      id: "COM-1008",
      campaign: "AI assistant policy rollout",
      audience: "People managers and team leads",
      platform: "FirstUp + Entra",
      owner: "Internal Communications Governance",
      status: "AT_RISK",
      workflowHealthy: false,
      daysToLaunch: 4,
      packet: "manager-brief packet",
      excerpt: "Need one source of truth for audience, manager brief, and policy approval before broad employee push.",
      nextAction: "Restore manager-brief approval path and close the audience evidence packet."
    },
    {
      id: "COM-2041",
      campaign: "Open enrollment reminder series",
      audience: "US benefits-eligible employees",
      platform: "FirstUp + UKG",
      owner: "People Operations Messaging",
      status: "ON_TRACK",
      workflowHealthy: true,
      daysToLaunch: 7,
      packet: "benefits-send packet",
      excerpt: "Localization and delivery checkpoints are green, but ownership still needs one final audit packet.",
      nextAction: "Confirm final send window and archive the delivery proof."
    },
    {
      id: "COM-3112",
      campaign: "Security awareness pulse",
      audience: "Contractors and privileged vendors",
      platform: "FirstUp + Entra",
      owner: "Security Enablement",
      status: "AT_RISK",
      workflowHealthy: false,
      daysToLaunch: 2,
      packet: "vendor-notice packet",
      excerpt: "Targeting, approval, and delivery guardrails are still split across security and internal comms teams.",
      nextAction: "Repair the send posture before contractor outreach goes live."
    }
  ],
  packets: [
    {
      id: "PKT-401",
      programId: "COM-1008",
      campaign: "AI assistant policy rollout",
      audience: "People managers and team leads",
      platform: "FirstUp + Entra",
      owner: "Internal Communications Governance",
      domain: "SEGMENT",
      kind: "AudienceEvidence",
      severity: "high",
      status: "OPEN",
      scope: "Manager audience inclusion proof",
      principal: "manager-brief",
      message: "Audience proof still does not reconcile manager and frontline-lead targeting for the AI assistant policy rollout.",
      openedAt: "2026-05-24T14:00:00Z",
      dueAt: "2026-05-28T17:00:00Z"
    },
    {
      id: "PKT-402",
      programId: "COM-1008",
      campaign: "AI assistant policy rollout",
      audience: "People managers and team leads",
      platform: "FirstUp + Entra",
      owner: "Legal + Policy Review",
      domain: "POLICY",
      kind: "Approval",
      severity: "medium",
      status: "OPEN",
      scope: "Manager policy sign-off",
      principal: "ai-policy-approval",
      message: "The employee comms packet still lacks one consolidated policy approval artifact for the manager-facing version.",
      openedAt: "2026-05-26T13:00:00Z",
      dueAt: "2026-05-29T18:00:00Z"
    },
    {
      id: "PKT-510",
      programId: "COM-2041",
      campaign: "Open enrollment reminder series",
      audience: "US benefits-eligible employees",
      platform: "FirstUp + UKG",
      owner: "People Operations Messaging",
      domain: "LOCALIZATION",
      kind: "Localization",
      severity: "low",
      status: "RESOLVED",
      scope: "Spanish-language variant review",
      principal: "benefits-spanish",
      message: "Localized benefits reminder variant approved and archived.",
      openedAt: "2026-05-20T12:00:00Z",
      dueAt: "2026-05-22T12:00:00Z"
    },
    {
      id: "PKT-611",
      programId: "COM-3112",
      campaign: "Security awareness pulse",
      audience: "Contractors and privileged vendors",
      platform: "FirstUp + Entra",
      owner: "Security Enablement",
      domain: "DELIVERY",
      kind: "Delivery",
      severity: "high",
      status: "OPEN",
      scope: "Send-window readiness",
      principal: "vendor-security-send",
      message: "Delivery safeguards are incomplete for contractor outreach; the blast could ship before the latest audience exclusions load.",
      openedAt: "2026-05-23T10:30:00Z",
      dueAt: "2026-05-27T16:00:00Z"
    },
    {
      id: "PKT-612",
      programId: "COM-3112",
      campaign: "Security awareness pulse",
      audience: "Contractors and privileged vendors",
      platform: "FirstUp + Entra",
      domain: "POLICY",
      kind: "Approval",
      severity: "high",
      status: "OPEN",
      scope: "Contractor comms approval chain",
      principal: "vendor-security-approval",
      message: "The contractor campaign still lacks one owner-safe approval chain for legal, security, and internal comms.",
      openedAt: "2026-05-22T15:00:00Z",
      dueAt: "2026-05-27T15:00:00Z"
    }
  ]
};

export const commsLanePackets = [
  {
    id: "audience-lane",
    lane: "Audience evidence lane",
    owner: "Internal Communications Governance",
    focus: "Targeting, segment scope, and employee reach evidence",
    status: "RED",
    note: "Missing audience proof is the fastest way to send the wrong message to the wrong workforce slice.",
    nextAction: "Reconcile target segments and close the missing audience packet."
  },
  {
    id: "approval-lane",
    lane: "Approval lane",
    owner: "Legal + Policy Review",
    focus: "Policy sign-off, executive review, and owner-safe approvals",
    status: "YELLOW",
    note: "Approval posture is partially healthy, but one packet is still open against a sensitive employee policy push.",
    nextAction: "Collapse duplicate approvals into one send-safe evidence packet."
  },
  {
    id: "delivery-lane",
    lane: "Delivery lane",
    owner: "People Operations Messaging",
    focus: "Send-window readiness, exclusion sync, and delivery safety",
    status: "RED",
    note: "Delivery posture is degraded for contractor-facing comms because exclusions and timing are not fully locked.",
    nextAction: "Restore the send-window guardrail before release."
  },
  {
    id: "fallback-lane",
    lane: "Fallback lane",
    owner: "Security Enablement",
    focus: "Escalation, exceptions, and fallback message routing",
    status: "YELLOW",
    note: "Escalation logic exists, but some exception packets still depend on manual coordination.",
    nextAction: "Assign the remaining high-severity packet and validate the fallback path."
  }
];

export const sendPackets = [
  {
    packetId: "SEND-07",
    lane: "Manager policy rollout",
    completenessScore: 58,
    owner: "Internal Comms",
    status: "RED",
    blocker: "Audience proof and approval packet are still split across teams.",
    launchWindowHours: 18,
    decisionNote: "Do not send until the manager-targeting and policy sign-off packets are reconciled."
  },
  {
    packetId: "SEND-14",
    lane: "Benefits reminder",
    completenessScore: 88,
    owner: "People Ops",
    status: "GREEN",
    blocker: "No active blocker. Final archival proof still recommended.",
    launchWindowHours: 42,
    decisionNote: "Safe to schedule once archival proof is attached."
  },
  {
    packetId: "SEND-22",
    lane: "Security contractor pulse",
    completenessScore: 63,
    owner: "Security Enablement",
    status: "RED",
    blocker: "Delivery safeguards and approval chain are incomplete for contractor outreach.",
    launchWindowHours: 10,
    decisionNote: "Hold until exclusion sync and approval path are validated."
  },
  {
    packetId: "SEND-31",
    lane: "Executive follow-up note",
    completenessScore: 79,
    owner: "Executive Comms",
    status: "YELLOW",
    blocker: "Fallback escalation is still manual for one audience slice.",
    launchWindowHours: 26,
    decisionNote: "Can clear if the fallback owner and packet archive are locked in the next cycle."
  }
];
