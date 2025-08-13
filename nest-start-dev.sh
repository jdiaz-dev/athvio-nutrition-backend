#!/usr/bin/env bash
set -Eeuo pipefail

# full terminal reset sequence
CLEAR=$'\033c'

# clear once at initial start
printf "%s" "$CLEAR"

# run Nest in watch mode with line-buffered stdout/stderr,
# and clear ONLY at the start of a new rebuild/restart
stdbuf -oL -eL \
dotenvx run -f .env.development -- nest start --watch -b swc --type-check 2>&1 \
| while IFS= read -r line; do
    case "$line" in
      *"File change detected"*|*"Restarting"*|*"Successfully compiled"*|*"[TSC]"*"Initializing type checker"*)
        printf "%s" "$CLEAR"
        ;;
    esac
    printf '%s\n' "$line"
  done


# rm -rf dist
# npx swc src -d dist --config-file .swcrc
# npx swc configuration -d dist --config-file .swcrc
# dotenvx run -f .env.development -- nest start --watch -b swc --type-check

# dotenvx run -f .env.development -- node dist/src/main.js