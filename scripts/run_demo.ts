// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  commsLane,
  messageGaps,
  sendPosture,
  summary
} from "../src/services/firstupEmployeeCommAuditService.js";

console.log("firstup-employee-comm-audit demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`comms lanes: ${commsLane().length}`);
console.log(`message gap findings: ${messageGaps().length}`);
console.log(`send packets: ${sendPosture().length}`);
