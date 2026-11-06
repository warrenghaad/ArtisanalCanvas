#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Restore exactly the merged lockfile, including the development build tools.
npm ci --include=dev --no-audit --no-fund
npm run check
npm run build
