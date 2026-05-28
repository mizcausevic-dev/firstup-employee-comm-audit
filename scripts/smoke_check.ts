// SPDX-License-Identifier: AGPL-3.0-or-later

import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import "../scripts/prerender.js";

const required = [
  "site/index.html",
  "site/comms-lane/index.html",
  "site/message-gaps/index.html",
  "site/send-posture/index.html",
  "site/verification/index.html",
  "site/docs/index.html",
];

for (const file of required) {
  await readFile(file, "utf8");
}

const temp = await mkdtemp(path.join(tmpdir(), "firstup-employee-comms-"));
await rm(temp, { recursive: true, force: true });
console.log("smoke check passed");
