# Security Notes

This repository is a public demonstration surface using **synthetic employee-communications, approval, and delivery data only**.

## Scope

- No tenant credentials, API keys, OAuth secrets, or live employee records belong in this repo.
- The repo demonstrates audience-evidence routing and send-posture patterns, not a production employee-comms control plane.
- Any hosted preview or embedded delivery should use read-only scopes, evidence-packet signing, and environment-managed secrets.

## Disclosure guidance

- Please open a private GitHub security advisory or contact the maintainer through the repository security tab if you find a vulnerability in the analyzer, CLI, Pages workflow, or sample artifacts.
- Do not submit real employee exports, message payloads, or customer tenant identifiers in public issues.
