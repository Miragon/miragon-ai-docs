#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -d node_modules ]; then
  echo "ERROR: node_modules missing, run setup first." >&2
  exit 1
fi

# Conductor hands each workspace its own port range; Vite moves to the next
# free port if this one is taken.
exec pnpm dev --port "${CONDUCTOR_PORT:-5173}" --open
