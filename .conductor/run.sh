#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -d node_modules ]; then
  echo "ERROR: node_modules missing, run setup first." >&2
  exit 1
fi

# Conductor hands each workspace its own port range; Astro moves to the next
# free port if this one is taken.
# Astro 7 backgrounds `astro dev` when it detects an AI agent (CLAUDECODE=1
# and the like): the command returns after the server is up, and
# `pnpm astro dev stop` ends it. A Conductor run started by a human stays in
# the foreground.
exec pnpm dev --port "${CONDUCTOR_PORT:-4321}" --open
