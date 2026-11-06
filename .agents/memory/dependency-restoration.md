---
name: Dependency restoration
description: Why a normally transitive Express dependency is explicitly listed.
---

The explicit proxy-addr dependency is intentional, not an unused application import.

**Why:** Clean dependency restoration was blocked by the package security policy for the old transitive release. Updating Express alone retained that locked release; explicitly resolving the compatible secure patch allowed clean installs to succeed without a major Express upgrade.

**How to apply:** Do not remove this dependency merely because application code does not import it. Remove it only when a clean locked installation still resolves the secure transitive release and passes the package policy. Never bypass the package firewall.
