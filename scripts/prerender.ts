// SPDX-License-Identifier: AGPL-3.0-or-later

import { mkdir, writeFile } from "node:fs/promises";

import {
  commsLane,
  messageGaps,
  payload,
  sendPosture,
  summary,
  verification
} from "../src/services/firstupEmployeeCommAuditService.js";
import {
  renderCommsLane,
  renderDocs,
  renderMessageGaps,
  renderOverview,
  renderSendPosture,
  renderValidation
} from "../src/services/render.js";

async function writePage(route: string, html: string) {
  const directory = route === "/" ? "site" : `site${route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html, "utf8");
}

async function writeJson(name: string, value: unknown) {
  await mkdir("site/api", { recursive: true });
  await writeFile(`site/api/${name}.json`, JSON.stringify(value, null, 2), "utf8");
}

await writePage("/", renderOverview());
await writePage("/comms-lane", renderCommsLane());
await writePage("/message-gaps", renderMessageGaps());
await writePage("/send-posture", renderSendPosture());
await writePage("/verification", renderValidation());
await writePage("/docs", renderDocs());

await writeJson("summary", summary());
await writeJson("comms-lane", commsLane());
await writeJson("message-gaps", messageGaps());
await writeJson("send-posture", sendPosture());
await writeJson("verification", verification());
await writeJson("sample", payload());
